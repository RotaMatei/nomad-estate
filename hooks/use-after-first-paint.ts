'use client';

import * as React from 'react';

let painted = false;
const listeners = new Set<() => void>();

function start() {
  if (painted || typeof window === 'undefined') return;
  const done = () => {
    painted = true;
    listeners.forEach((l) => l());
    listeners.clear();
  };
  // After the load event, wait for the browser to be idle: text and layout are on screen by then.
  const whenIdle = () => ('requestIdleCallback' in window ? window.requestIdleCallback(done, { timeout: 1500 }) : setTimeout(done, 200));
  if (document.readyState === 'complete') whenIdle();
  else window.addEventListener('load', whenIdle, { once: true });
}

/**
 * False during the first render and paint of a page load, true afterwards (and on every later client navigation).
 * Heavy, non-critical work — the map library, the full catalogue — waits for it so the page's text paints first.
 */
export function useAfterFirstPaint() {
  return React.useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      start();
      return () => void listeners.delete(cb);
    },
    () => painted,
    () => false,
  );
}
