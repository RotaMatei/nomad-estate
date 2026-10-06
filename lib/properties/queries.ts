'use client';

import { useInfiniteQuery, useQueries, useQuery, keepPreviousData, type UseQueryResult } from '@tanstack/react-query';
import * as React from 'react';
import { env } from '@/app/config/env';
import api from '@/app/lib/api';
import { toListing } from './normalize';
import { inArea, toSearchBody, DEFAULT_FILTERS, type SearchFilters, type SortKey } from './filters';
import type { InvestmentGoalTagEnum, LocationBenefitTagEnum, PropertyType } from './labels';
import { PAGE_SIZE, rustFilters, searchKey } from './search-params';
import type { ApiPropertySummary, Country, Listing, Pin } from './types';

export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const { data } = await api.get<Country[]>('/countries/retrieve/get-all');
      return Array.isArray(data) ? data : [];
    },
    staleTime: Infinity,
  });
}

export interface SearchOptions {
  enabled?: boolean;
  /** "Search this area": west, south, east, north */
  area?: number[] | null;
  /** `false` skips the result list (home page: pins only) */
  list?: boolean;
  /** `false` skips the pins (lists that have no map) */
  pins?: boolean;
}

/** What every search returns, whichever backend answers. */
export interface SearchResult {
  /** Rows loaded so far, in display order */
  listings: Listing[];
  /** Every match, with just enough to draw it on the globe */
  pins: Pin[];
  /** Number of matches, including rows not loaded yet */
  total: number;
  hasMore: boolean;
  loadMore: () => void;
  isFetchingMore: boolean;
  countries: Country[];
  isLoading: boolean;
  isPending: boolean;
  isFetching: boolean;
  /** The pins are being fetched: they come from their own request and may arrive after the list */
  isFetchingPins: boolean;
  isError: boolean;
  refetch: () => void;
}

const toPin = (l: Listing): Pin => ({ id: l.id, lat: l.lat, lng: l.lng, countryId: l.countryId, countryCode: l.countryCode, price: l.price, yieldPct: l.yieldPct });

// ───────────────────────────────────────── Nest ─────────────────────────────────────────

/** City names are fetched per id and cached forever (the Rust API returns them joined). */
function useCityNames(ids: number[]) {
  const combine = React.useCallback(
    (results: UseQueryResult<string | null>[]) => {
      const m = new Map<number, string>();
      ids.forEach((id, i) => {
        const name = results[i]?.data;
        if (name) m.set(id, name);
      });
      return m;
    },
    [ids],
  );
  return useQueries({
    queries: ids.map((id) => ({
      queryKey: ['city', id],
      queryFn: async () => {
        const { data } = await api.get<{ name?: string }>(`/cities/retrieve/${id}`);
        return data?.name ?? null;
      },
      staleTime: Infinity,
    })),
    combine,
  });
}

function sortListings(list: Listing[], sort: SortKey) {
  const out = [...list];
  switch (sort) {
    case 'yield':
      return out.sort((a, b) => b.yieldPct - a.yieldPct);
    case 'score':
      return out.sort((a, b) => b.score - a.score);
    case 'price-asc':
      return out.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return out.sort((a, b) => b.price - a.price);
    case 'newest':
      return out.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
    default:
      return out;
  }
}

/** Search against the Nest API: everything arrives in one response, names need per-city lookups, sorting and the map-area filter happen here. */
function useNestSearch(filters: SearchFilters, options?: SearchOptions): SearchResult {
  const countries = useCountries();
  const countryById = React.useMemo(() => new Map((countries.data ?? []).map((c) => [c.id, c] as const)), [countries.data]);

  const { sort, ...serverFilters } = filters;
  const body = toSearchBody(filters, (id) => countryById.get(id)?.name);

  const search = useQuery({
    queryKey: ['property-search', serverFilters.q, body],
    enabled: options?.enabled ?? true,
    queryFn: async ({ signal }) => {
      if (serverFilters.q.trim()) {
        const { data } = await api.get<ApiPropertySummary[]>('/property/retrieve-search-by-name', { params: { q: serverFilters.q.trim() }, signal });
        return Array.isArray(data) ? data : [];
      }
      const { InvG, LocB, ...rest } = body as { InvG?: string[]; LocB?: string[] };
      const { data } = await api.post<ApiPropertySummary[]>('/property/retrieve-search', { ...rest, InvG, LocB }, { params: { InvG, LocB }, signal });
      return Array.isArray(data) ? data : [];
    },
    placeholderData: keepPreviousData,
  });

  const cityIds = React.useMemo(
    () => Array.from(new Set((search.data ?? []).map((p) => p.cityId).filter((x): x is number => typeof x === 'number'))),
    [search.data],
  );
  const cityNames = useCityNames(cityIds);

  const area = options?.area ?? null;
  const listings = React.useMemo(() => {
    const list = sortListings((search.data ?? []).map((p) => toListing(p, countryById, cityNames)), sort);
    return area ? list.filter((l) => inArea(l.lat, l.lng, area)) : list;
  }, [search.data, countryById, cityNames, sort, area]);
  const pins = React.useMemo(() => listings.map(toPin), [listings]);

  return {
    listings,
    pins,
    total: listings.length,
    hasMore: false,
    loadMore: noop,
    isFetchingMore: false,
    countries: countries.data ?? [],
    isLoading: search.isLoading,
    isPending: search.isPending,
    isFetching: search.isFetching,
    isFetchingPins: search.isFetching,
    isError: search.isError,
    refetch: search.refetch,
  };
}

const noop = () => {};

// ───────────────────────────────────────── Rust ─────────────────────────────────────────

/** One row of the Rust API's `/property/search`: place names, coordinates, cover photo and tags arrive joined. */
interface RustSearchItem {
  id: string;
  title: string;
  type: PropertyType;
  price: number;
  yield: number;
  score: number;
  bedrooms: number;
  bathrooms: number;
  totalArea: number;
  lat: number;
  lng: number;
  cityId: number;
  cityName: string | null;
  countryId: number;
  countryName: string | null;
  countryCode: string | null;
  picture: string | null;
  goals: InvestmentGoalTagEnum[];
  benefits: LocationBenefitTagEnum[];
  createdAt: string;
}

interface GeoFeature {
  geometry: { coordinates: [number, number] };
  properties: { id: string; price: number; yield: number; score: number; countryCode: string | null; countryId: number | null };
}

const fromRust = (p: RustSearchItem): Listing => ({
  id: p.id,
  title: p.title,
  type: p.type ?? null,
  price: p.price,
  yieldPct: p.yield,
  score: p.score,
  bedrooms: p.bedrooms,
  bathrooms: p.bathrooms,
  area: p.totalArea,
  lat: Math.abs(p.lat) <= 90 ? p.lat : null,
  lng: Math.abs(p.lng) <= 180 ? p.lng : null,
  cityId: p.cityId,
  countryId: p.countryId,
  cityName: p.cityName,
  countryName: p.countryName,
  countryCode: p.countryCode,
  image: p.picture,
  goals: p.goals,
  benefits: p.benefits,
  createdAt: p.createdAt,
});

/** Search against the Rust API: the list is paged and sorted in SQL; the pins come from the light GeoJSON endpoint. */
function useRustSearch(filters: SearchFilters, options?: SearchOptions): SearchResult {
  const countries = useCountries();
  const enabled = options?.enabled ?? true;
  const where = rustFilters(filters, options?.area);

  const pages = useInfiniteQuery({
    // on /properties the first page is usually in the cache already: the server fetched it (`prefetch.ts`)
    queryKey: searchKey(where, filters.sort),
    enabled: enabled && options?.list !== false,
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      const { data } = await api.post<{ items: RustSearchItem[]; total: number; page: number }>(
        '/property/search',
        { ...where, sort: filters.sort, page: pageParam, pageSize: PAGE_SIZE },
        { signal },
      );
      return data;
    },
    getNextPageParam: (last, all) => (all.reduce((n, p) => n + p.items.length, 0) < last.total ? last.page + 1 : undefined),
    placeholderData: keepPreviousData,
  });

  const geo = useQuery({
    queryKey: ['property-geo', where],
    enabled: enabled && options?.pins !== false,
    queryFn: async ({ signal }) => {
      // the GET endpoint takes lists as comma-separated values
      const params = Object.fromEntries(
        Object.entries(where)
          .filter(([, v]) => v !== undefined && !(Array.isArray(v) && v.length === 0))
          .map(([k, v]) => [k, Array.isArray(v) ? v.join(',') : v]),
      );
      const { data } = await api.get<{ features: GeoFeature[] }>('/property/geo', { params, signal });
      return Array.isArray(data?.features) ? data.features : [];
    },
    placeholderData: keepPreviousData,
  });

  const listings = React.useMemo(() => (pages.data?.pages ?? []).flatMap((p) => p.items.map(fromRust)), [pages.data]);
  const pins = React.useMemo<Pin[]>(
    () =>
      (geo.data ?? []).map((f) => ({
        id: f.properties.id,
        lng: f.geometry.coordinates[0],
        lat: f.geometry.coordinates[1],
        countryId: f.properties.countryId,
        countryCode: f.properties.countryCode,
        price: f.properties.price,
        yieldPct: f.properties.yield,
      })),
    [geo.data],
  );
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = pages;
  const loadMore = React.useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // whichever of the two requests the caller asked for drives the loading state
  const main = options?.list === false ? geo : pages;
  return {
    listings,
    pins,
    total: pages.data?.pages[0]?.total ?? (options?.list === false ? pins.length : 0),
    hasMore: !!hasNextPage,
    loadMore,
    isFetchingMore: isFetchingNextPage,
    countries: countries.data ?? [],
    isLoading: main.isLoading,
    isPending: main.isPending,
    isFetching: main.isFetching && !isFetchingNextPage,
    isFetchingPins: geo.isFetching,
    isError: main.isError,
    refetch: () => {
      void pages.refetch();
      void geo.refetch();
    },
  };
}

/** Chosen once at build time from `NEXT_PUBLIC_API_FLAVOR`, so the hook order never changes between renders. */
export const usePropertySearch: (filters: SearchFilters, options?: SearchOptions) => SearchResult = env.apiFlavor === 'rust' ? useRustSearch : useNestSearch;

// ───────────────────────────────────────── listings by id ─────────────────────────────────────────

function useNestListingsByIds(ids: string[]) {
  // Nest has no "these ids" search: the catalogue is already cached by the search, so pick from it.
  const { listings, isLoading } = useNestSearch(DEFAULT_FILTERS, { enabled: ids.length > 0 });
  const wanted = React.useMemo(() => listings.filter((l) => ids.includes(l.id)), [listings, ids]);
  return { listings: wanted, isLoading: ids.length > 0 && isLoading };
}

function useRustListingsByIds(ids: string[]) {
  const key = [...ids].sort();
  const query = useQuery({
    queryKey: ['property-by-ids', key],
    enabled: ids.length > 0,
    queryFn: async ({ signal }) => {
      const { data } = await api.post<{ items: RustSearchItem[] }>('/property/search', { ids: key, pageSize: 200 }, { signal });
      return (data?.items ?? []).map(fromRust);
    },
    placeholderData: keepPreviousData,
  });
  return { listings: ids.length > 0 ? (query.data ?? []) : [], isLoading: query.isLoading };
}

/** Full rows for known ids: the saved list, or a selected listing that is not on a loaded page. */
export const useListingsByIds: (ids: string[]) => { listings: Listing[]; isLoading: boolean } = env.apiFlavor === 'rust' ? useRustListingsByIds : useNestListingsByIds;
