'use client';

import dynamic from 'next/dynamic';
import * as React from 'react';
import type { PropertyGlobeProps } from './property-globe';
import { useAfterFirstPaint } from '@/hooks/use-after-first-paint';
import { useWhenQuiet } from '@/hooks/use-when-quiet';
import { cn } from '@/lib/utils';
import './poster.css';

export type { Bounds, PropertyGlobeHandle, PropertyGlobeProps } from './property-globe';

const Placeholder = () => <div className="size-full" aria-hidden />;

/** maplibre-gl (~270 kB gzipped) loads only on routes that render the globe, and only in the browser. */
const LazyGlobe = dynamic(() => import('./property-globe'), { ssr: false, loading: Placeholder });

interface Props extends PropertyGlobeProps {
  /**
   * Show the still frame of the home-page globe (`poster.css`, made by `scripts/globe-posters.mjs`) until the live
   * globe is running, and start the live one only when the page is quiet. For the decorative hero globe: the still
   * is on screen with the first paint, and the live globe fades in over it in the same position.
   */
  poster?: boolean;
}

/**
 * The still frame: a CSS background, centred at its natural size (`poster.css`). The theme is only known in the
 * browser, so the file is chosen in CSS; the preload hints start the download for the system theme straight away.
 *
 * It is deliberately not a `<picture>` with one `<img>` per theme: with one of the two hidden, that markup froze
 * Chromium's renderer on some loads (the image requests never completed and the page stopped responding).
 */
function Poster({ hidden }: { hidden: boolean }) {
  return (
    <>
      {(['light', 'dark'] as const).flatMap((theme) =>
        (['mobile', 'desktop'] as const).map((size) => (
          <link
            key={theme + size}
            rel="preload"
            as="image"
            type="image/webp"
            href={`/globe/${theme}-${size}.webp`}
            media={`(${size === 'mobile' ? 'max-width: 639.98px' : 'min-width: 640px'}) and (prefers-color-scheme: ${theme})`}
            fetchPriority="high"
          />
        )),
      )}
      <div aria-hidden className={cn('globe-poster pointer-events-none absolute inset-0 transition-opacity duration-700', hidden && 'opacity-0')} />
    </>
  );
}

/**
 * The globe is the most expensive thing on any page, so it starts downloading after the first paint:
 * headings, filters and results are readable while the map library arrives.
 */
export function PropertyGlobe({ poster, ...props }: Props) {
  const painted = useAfterFirstPaint();
  const quiet = useWhenQuiet();
  const [live, setLive] = React.useState(false);

  if (!poster) return painted ? <LazyGlobe {...props} /> : <Placeholder />;
  return (
    <div className="relative size-full">
      <Poster hidden={live} />
      {quiet && <LazyGlobe {...props} onReady={() => setLive(true)} />}
    </div>
  );
}
