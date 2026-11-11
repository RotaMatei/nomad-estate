'use client';

import * as React from 'react';
import './house-poster.css';
import { useAfterFirstPaint } from '@/hooks/use-after-first-paint';
import { cn } from '@/lib/utils';

/**
 * The 3D house. It shows a still of the model at once (`house-poster.css`, made by `scripts/model-posters.mjs`) and
 * brings the live scene in over it when the box comes near the screen and the page has painted: three.js is a separate
 * chunk that nothing downloads before then. Without WebGL, or with the chunk blocked, the still simply stays.
 *
 * The box sets the size; the model is framed to fit it (a box about 1.15 times as wide as it is tall suits it best).
 * `scroll` makes the page's scroll turn the house.
 */
export function HouseScene({ scroll = false, className }: { scroll?: boolean; className?: string }) {
  const box = React.useRef<HTMLDivElement>(null);
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const painted = useAfterFirstPaint();
  const [near, setNear] = React.useState(false);
  const [live, setLive] = React.useState(false);
  const [settled, setSettled] = React.useState(false);

  React.useEffect(() => {
    const element = box.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && (setNear(true), observer.disconnect()), { rootMargin: '300px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!near || !painted || !canvas.current) return;
    let cancelled = false;
    let running: { dispose(): void } | undefined;
    import('./house-runtime')
      .then(({ mountHouse }) => {
        if (cancelled || !canvas.current) return;
        running = mountHouse(canvas.current, { scroll, onReady: () => setLive(true) });
      })
      .catch(() => {
        /* no WebGL, or the chunk did not load: the still stays */
      });
    return () => {
      cancelled = true;
      running?.dispose();
      setLive(false);
      setSettled(false);
    };
  }, [near, painted, scroll]);

  return (
    <div ref={box} aria-hidden data-settled={settled || undefined} className={cn('house-poster relative', className)}>
      <canvas
        ref={canvas}
        onTransitionEnd={() => live && setSettled(true)}
        className={cn('absolute inset-0 size-full transition-opacity duration-500', live ? 'opacity-100' : 'opacity-0')}
      />
    </div>
  );
}
