'use client';

import { useQueries, useQuery, keepPreviousData, type UseQueryResult } from '@tanstack/react-query';
import * as React from 'react';
import api from '@/app/lib/api';
import { toListing } from './normalize';
import { toSearchBody, type SearchFilters, type SortKey } from './filters';
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

export function usePropertySearch(filters: SearchFilters) {
  const countries = useCountries();
  const countryById = React.useMemo(
    () => new Map((countries.data ?? []).map((c) => [c.id, c] as const)),
    [countries.data],
  );

  const { sort, ...serverFilters } = filters;
  const body = toSearchBody(filters, (id) => countryById.get(id)?.name);

  const search = useQuery({
    queryKey: ['property-search', serverFilters.q, body],
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
    isFetching: search.isFetching,
    isError: search.isError,
    refetch: search.refetch,
  };
}
