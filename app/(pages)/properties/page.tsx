import { HydrationBoundary } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { PropertiesView } from '@/components/properties/properties-view';
import { prefetchSearch, type PageSearchParams } from '@/lib/properties/prefetch';

export const metadata: Metadata = {
  title: 'Explore properties on the globe',
  description: 'Every investment property on Nomad Estate, on one live globe. Filter by country, price, yield and score, then zoom from the planet down to the street.',
};

/**
 * Rendered per request: the filters are in the URL, and the first page of results for them is fetched here, so the
 * list and the result count are part of the HTML. If the API does not answer in time the page is sent without them
 * and the browser asks for them, as it does for every later search.
 *
 * No Suspense boundary around the view: with one, React sends its fallback first and reveals the real content a
 * moment later, which is exactly the late paint this page is trying to avoid.
 */
export default async function PropertiesPage({ searchParams }: { searchParams: Promise<PageSearchParams> }) {
  const results = await prefetchSearch(await searchParams);
  return (
    <HydrationBoundary state={results}>
      <PropertiesView />
    </HydrationBoundary>
  );
}
