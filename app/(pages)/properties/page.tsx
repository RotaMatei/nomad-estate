import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PropertiesView } from '@/components/properties/properties-view';
import { SiteHeader } from '@/components/site/site-header';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Explore properties on the globe',
  description: 'Every investment property on Nomad Estate, on one live globe. Filter by country, price, yield and score, then zoom from the planet down to the street.',
};

/** Server-rendered shell with the same geometry as the real page, so something useful paints before any JavaScript runs. */
function Shell() {
  return (
    <div className="fixed inset-0 overflow-hidden">
      <SiteHeader variant="overlay" />
      <main className="absolute inset-0" aria-busy="true">
        <h1 className="sr-only">Find investment properties on the globe</h1>
        <div className="glass shadow-float absolute inset-x-3 top-[76px] h-12 rounded-full sm:inset-x-5 sm:top-[84px] lg:max-w-[1040px]" />
        <div className="glass shadow-float absolute top-[148px] bottom-5 left-5 hidden w-[392px] space-y-4 rounded-xl p-4 lg:block">
          <Skeleton className="h-4 w-28" />
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="size-[92px] shrink-0 rounded-md" />
              <div className="flex-1 space-y-2.5 py-1">
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-5 w-2/5" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    // Filters are read from the URL (nuqs → useSearchParams), which needs a Suspense boundary for static rendering.
    <Suspense fallback={<Shell />}>
      <PropertiesView />
    </Suspense>
  );
}
