'use client';

import * as React from 'react';
import type { RunningSkyline } from './skyline-runtime';
import type { TowerInput } from './skyline-model';
import { useAfterFirstPaint } from '@/hooks/use-after-first-paint';
import { cn } from '@/lib/utils';

/**
 * The skyline in 3D, laid over the CSS skyline in the same box: it loads when the box comes near the screen and the
 * page has painted (three.js is a separate chunk nothing downloads before then), and `onReady` tells the parent to
 * fade the CSS skyline out. Without WebGL the CSS skyline simply stays. `active` is the tower to light (its row in the
 * list); `onActive` reports the tower under the mouse.
 */
export function SkylineScene({
  towers,
  active,
  onActive,
  onReady,
  className,
}: {
  towers: TowerInput[];
  active: number | null;
  onActive: (id: number | null) => void;
  onReady: (ready: boolean) => void;
  className?: string;
}) {
  const box = React.useRef<HTMLDivElement>(null);
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const running = React.useRef<RunningSkyline>(undefined);
  const painted = useAfterFirstPaint();
  const [near, setNear] = React.useState(false);
  const [live, setLive] = React.useState(false);
  // the scene is rebuilt only when the towers change, not each time the parent renders
  const key = towers.map((t) => `${t.id}:${t.count}`).join(',');
  const latest = React.useRef({ towers, onActive, onReady, active });
  // kept current after each render, before the effects below read it
  React.useEffect(() => {
    latest.current = { towers, onActive, onReady, active };
  });

  React.useEffect(() => {
    const element = box.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && (setNear(true), observer.disconnect()), { rootMargin: '300px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!near || !painted || !canvas.current || !key) return;
    let cancelled = false;
    import('./skyline-runtime')
      .then(({ mountSkyline }) => {
        if (cancelled || !canvas.current) return;
        running.current = mountSkyline(canvas.current, {
          towers: latest.current.towers,
          onHover: (id) => latest.current.onActive(id),
          onReady: () => {
            setLive(true);
            latest.current.onReady(true);
          },
        });
        running.current.setActive(latest.current.active);
      })
      .catch(() => {
        /* no WebGL, or the chunk did not load: the CSS skyline stays */
      });
    return () => {
      cancelled = true;
      running.current?.dispose();
      running.current = undefined;
      setLive(false);
      latest.current.onReady(false);
    };
  }, [near, painted, key]);

  React.useEffect(() => {
    running.current?.setActive(active);
  }, [active]);

  return (
    <div ref={box} className={cn('absolute inset-0', className)}>
      <canvas ref={canvas} className={cn('size-full transition-opacity duration-500', live ? 'opacity-100' : 'pointer-events-none opacity-0')} />
    </div>
  );
}
