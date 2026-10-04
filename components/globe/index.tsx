'use client';

import dynamic from 'next/dynamic';
import * as React from 'react';
import type { PropertyGlobeProps } from './property-globe';
import { useAfterFirstPaint } from '@/hooks/use-after-first-paint';

export type { Bounds, PropertyGlobeHandle, PropertyGlobeProps } from './property-globe';

const Placeholder = () => <div className="size-full" aria-hidden />;

/** maplibre-gl (~270 kB gzipped) loads only on routes that render the globe, and only in the browser. */
const LazyGlobe = dynamic(() => import('./property-globe'), { ssr: false, loading: Placeholder });

/**
 * The globe is the most expensive thing on any page, so it starts downloading after the first paint:
 * headings, filters and results are readable while the map library arrives.
 */
export function PropertyGlobe(props: PropertyGlobeProps) {
  return useAfterFirstPaint() ? <LazyGlobe {...props} /> : <Placeholder />;
}
