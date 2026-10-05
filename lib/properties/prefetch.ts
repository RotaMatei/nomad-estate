// Server only: fetches the first page of a property search while the page is being rendered, so the results are in
// the HTML instead of arriving after the browser has downloaded and run the app.
import { QueryClient, dehydrate, type DehydratedState } from '@tanstack/react-query';
import { createLoader } from 'nuqs/server';
import { apiConfig, env } from '@/app/config/env';
import { PAGE_SIZE, filterParsers, rustFilters, searchKey, selectionParsers } from './search-params';

const loadFilters = createLoader(filterParsers);
const loadSelection = createLoader(selectionParsers);

/** How long the page waits for the API before it is sent without results (the browser then fetches them itself). */
const TIMEOUT_MS = 1500;

export type PageSearchParams = Record<string, string | string[] | undefined>;

/**
 * The search described by the URL, already in the TanStack Query cache format. Returns `undefined` when there is
 * nothing to hand over: the Nest flavor (its search has another shape), an API that is slow or down.
 */
export async function prefetchSearch(searchParams: PageSearchParams): Promise<DehydratedState | undefined> {
  if (env.apiFlavor !== 'rust') return undefined;
  const filters = loadFilters(searchParams);
  const { area } = loadSelection(searchParams);
  const where = rustFilters(filters, area);

  const client = new QueryClient();
  await client.prefetchInfiniteQuery({
    queryKey: searchKey(where, filters.sort),
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const response = await fetch(`${apiConfig.baseURL}/property/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...where, sort: filters.sort, page: pageParam, pageSize: PAGE_SIZE }),
        cache: 'no-store',
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!response.ok) throw new Error(`search answered ${response.status}`);
      return response.json();
    },
  });
  // a failed prefetch leaves the cache empty, and `dehydrate` only passes on what succeeded
  return dehydrate(client);
}
