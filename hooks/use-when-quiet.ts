'use client';

import * as React from 'react';

/** The page counts as quiet when this long has passed since it loaded and since the main thread was last busy. */
const QUIET_MS = 5000;
const INPUTS = ['pointerdown', 'pointermove', 'touchstart', 'keydown', 'wheel', 'scroll'] as const;

let quiet = false;
const listeners = new Set<() => void>();
let started = false;

function start() {
  if (started || typeof window === 'undefined') return;
  started = true;

  let timer = 0;
  let observer: PerformanceObserver | undefined;
  const done = () => {
    if (quiet) return;
    quiet = true;
    window.clearTimeout(timer);
    observer?.disconnect();
    INPUTS.forEach((type) => window.removeEventListener(type, done));
    listeners.forEach((l) => l());
    listeners.clear();
  };
  // Someone is using the page: they get the real thing straight away.
  INPUTS.forEach((type) => window.addEventListener(type, done, { passive: true, once: true }));

  const restart = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(done, QUIET_MS);
  };
  const watch = () => {
    restart();
    // every task over 50ms (hydration, a late script) pushes the moment back
    try {
      observer = new PerformanceObserver(restart);
      observer.observe({ type: 'longtask' });
    } catch {
      // no long-task reporting in this browser: the timer alone decides
    }
  };
  if (document.readyState === 'complete') watch();
  else window.addEventListener('load', watch, { once: true });
}

/**
 * False while a page is loading and settling, true once the visitor interacts with it, or once it has loaded and
 * the main thread has been idle for five seconds (and on every later client navigation).
 *
 * For decoration that is costly to start. Starting WebGL compiles a dozen shader programs on the main thread, which
 * blocks input for several hundred milliseconds on a phone; doing that while the page is still loading delays the
 * text and the first tap. A still image stands in until then.
 */
export function useWhenQuiet() {
  return React.useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      start();
      return () => void listeners.delete(cb);
    },
    () => quiet,
    () => false,
  );
}
