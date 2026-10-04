import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PropertiesView } from '@/components/properties/properties-view';

export const metadata: Metadata = {
  title: 'Explore properties on the globe',
  description: 'Every investment property on Nomad Estate, on one live globe. Filter by country, price, yield and score, then zoom from the planet down to the street.',
};

export default function PropertiesPage() {
  return (
    // Filters are read from the URL (nuqs → useSearchParams), which needs a Suspense boundary for static rendering.
    <Suspense fallback={<div className="fixed inset-0 bg-background" />}>
      <PropertiesView />
    </Suspense>
  );
}
