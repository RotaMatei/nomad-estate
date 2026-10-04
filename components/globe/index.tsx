'use client';

import dynamic from 'next/dynamic';

export type { Bounds, PropertyGlobeHandle, PropertyGlobeProps } from './property-globe';

/** maplibre-gl (~250 kB gzipped) loads only on routes that render the globe, and only in the browser. */
export const PropertyGlobe = dynamic(() => import('./property-globe'), {
  ssr: false,
  loading: () => <div className="size-full bg-background" aria-hidden />,
});
