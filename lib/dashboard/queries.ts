'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { addAgentToAgency, getAgentsForAgency, removeAgentFromAgency, searchUsersByName } from '@/app/lib/agentApi';
import api from '@/app/lib/api';
import { deletePropertyById } from '@/app/lib/propertyApi';
import { toListing } from '@/lib/properties/normalize';
import { useCountries } from '@/lib/properties/queries';
import type { ApiPropertySummary, Listing } from '@/lib/properties/types';

type PortfolioRow = ApiPropertySummary & { picture?: ApiPropertySummary['propertyPictures']; city?: { name?: string } };

/** Every property of one agency, normalised to the same `Listing` shape the search uses. */
export function usePortfolio(agencyId: string | null) {
  const countries = useCountries();
  const query = useQuery({
    queryKey: ['portfolio', agencyId],
    enabled: !!agencyId,
    queryFn: async () => {
      const { data } = await api.get<PortfolioRow[]>(`/property/retrieve-portfolio/${agencyId}`);
      const rows = Array.isArray(data) ? data : [];
      // City names are not joined by the current API (PROGRESS B2): one cached lookup per distinct city.
      const cityIds = [...new Set(rows.map((r) => r.cityId).filter((x): x is number => typeof x === 'number'))];
      const names = await Promise.all(
        cityIds.map((id) => api.get<{ name?: string }>(`/cities/retrieve/${id}`).then((r) => [id, r.data?.name] as const, () => [id, undefined] as const)),
      );
      return { rows, cities: new Map(names.filter((n): n is readonly [number, string] => !!n[1])) };
    },
  });

  const listings: Listing[] = React.useMemo(() => {
    if (!query.data) return [];
    const countryById = new Map((countries.data ?? []).map((c) => [c.id, c] as const));
    return query.data.rows.map((r) => toListing({ ...r, propertyPictures: r.propertyPictures ?? r.picture }, countryById, query.data.cities));
  }, [query.data, countries.data]);

  return { listings, isLoading: query.isLoading, isError: query.isError, refetch: query.refetch };
}

export function useDeleteProperty(agencyId: string | null) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePropertyById(id),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ['portfolio', agencyId] });
      void client.invalidateQueries({ queryKey: ['property-search'] });
    },
  });
}

export function useAgents(agencyId: string | null) {
  const client = useQueryClient();
  const key = ['agents', agencyId];
  const query = useQuery({ queryKey: key, enabled: !!agencyId, queryFn: () => getAgentsForAgency(agencyId!) });
  const done = () => client.invalidateQueries({ queryKey: key });
  const add = useMutation({
    mutationFn: async (userId: string) => {
      if (!(await addAgentToAgency(userId, agencyId!))) throw new Error('add failed');
    },
    onSuccess: done,
  });
  const remove = useMutation({
    mutationFn: async (userId: string) => {
      if (!(await removeAgentFromAgency(userId, agencyId!))) throw new Error('remove failed');
    },
    onSuccess: done,
  });
  return { agents: query.data ?? [], isLoading: query.isLoading, add, remove };
}

export function useUserSearch(term: string) {
  const q = term.trim();
  return useQuery({
    queryKey: ['user-search', q],
    enabled: q.length >= 2,
    queryFn: () => searchUsersByName(q),
    staleTime: 30_000,
  });
}
