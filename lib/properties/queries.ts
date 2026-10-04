'use client';

import { useQueries, useQuery, keepPreviousData, type UseQueryResult } from '@tanstack/react-query';
import * as React from 'react';
import { env } from '@/app/config/env';
import api from '@/app/lib/api';
import { toListing } from './normalize';
import { toSearchBody, type SearchFilters, type SortKey } from './filters';
import type { InvestmentGoalTagEnum, LocationBenefitTagEnum, PropertyType } from './labels';
import type { ApiPropertySummary, Country, Listing } from './types';

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

/** City names are fetched per id and cached forever (replaced by a joined endpoint in the Rust API, PROGRESS B2). */
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

/** Search against the Nest API: results need per-city name lookups and are sorted in the browser. */
function useNestSearch(filters: SearchFilters, options?: { enabled?: boolean }) {
  const countries = useCountries();
  const countryById = React.useMemo(
    () => new Map((countries.data ?? []).map((c) => [c.id, c] as const)),
    [countries.data],
  );

  const { sort, ...serverFilters } = filters;
  const body = toSearchBody(filters, (id) => countryById.get(id)?.name);

  const search = useQuery({
    queryKey: ['property-search', serverFilters.q, body],
    enabled: options?.enabled ?? true,
    queryFn: async ({ signal }) => {
      if (serverFilters.q.trim()) {
        const { data } = await api.get<ApiPropertySummary[]>('/property/retrieve-search-by-name', {
          params: { q: serverFilters.q.trim() },
          signal,
        });
        return Array.isArray(data) ? data : [];
      }
      const { InvG, LocB, ...rest } = body as { InvG?: string[]; LocB?: string[] };
      const { data } = await api.post<ApiPropertySummary[]>('/property/retrieve-search', { ...rest, InvG, LocB }, {
        params: { InvG, LocB },
        signal,
      });
      return Array.isArray(data) ? data : [];
    },
    placeholderData: keepPreviousData,
  });

  const cityIds = React.useMemo(
    () =>
      Array.from(new Set((search.data ?? []).map((p) => p.cityId).filter((x): x is number => typeof x === 'number'))),
    [search.data],
  );
  const cityNames = useCityNames(cityIds);

  const listings = React.useMemo(() => {
    const list = (search.data ?? []).map((p) => toListing(p, countryById, cityNames));
    return sortListings(list, sort);
  }, [search.data, countryById, cityNames, sort]);

  return {
    listings,
    countries: countries.data ?? [],
    isLoading: search.isLoading,
    isPending: search.isPending,
    isFetching: search.isFetching,
    isError: search.isError,
    refetch: search.refetch,
  };
}

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

/** The API caps a page at 200 rows. Until the list pages on scroll and the pins come from `/property/geo`, one page is shown. */
const RUST_PAGE_SIZE = 200;

/** Search against the Rust API: one request, filtered, sorted and joined in SQL. */
function useRustSearch(filters: SearchFilters, options?: { enabled?: boolean }) {
  const countries = useCountries();
  const body = {
    q: filters.q.trim() || undefined,
    countryIds: filters.countries,
    cityNames: filters.cities,
    type: filters.type ?? undefined,
    minPrice: filters.minPrice ?? undefined,
    maxPrice: filters.maxPrice ?? undefined,
    minYield: filters.minYield ?? undefined,
    minScore: filters.minScore ?? undefined,
    minBedrooms: filters.beds ?? undefined,
    goals: filters.goals,
    benefits: filters.benefits,
    sort: filters.sort,
    pageSize: RUST_PAGE_SIZE,
  };

  const search = useQuery({
    queryKey: ['property-search', 'rust', body],
    enabled: options?.enabled ?? true,
    queryFn: async ({ signal }) => {
      const { data } = await api.post<{ items: RustSearchItem[]; total: number }>('/property/search', body, { signal });
      return Array.isArray(data?.items) ? data.items : [];
    },
    placeholderData: keepPreviousData,
  });

  const listings = React.useMemo<Listing[]>(
    () =>
      (search.data ?? []).map((p) => ({
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
      })),
    [search.data],
  );

  return {
    listings,
    countries: countries.data ?? [],
    isLoading: search.isLoading,
    isPending: search.isPending,
    isFetching: search.isFetching,
    isError: search.isError,
    refetch: search.refetch,
  };
}

/** Chosen once at build time from `NEXT_PUBLIC_API_FLAVOR`, so the hook order never changes between renders. */
export const usePropertySearch = env.apiFlavor === 'rust' ? useRustSearch : useNestSearch;
