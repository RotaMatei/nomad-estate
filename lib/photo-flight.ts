'use client';

import { useRouter } from 'next/navigation';
import type * as React from 'react';

// The photo a visitor clicked, as the browser already has it: the property page shows it at once, before its own
// data arrives, and the browser slides it from the card into its place (a view transition) where it can.
let handoff: { id: string; src: string } | null = null;
let arrived: (() => void) | null = null;

/** The clicked photo of this property, if the visitor came from a card. */
export const flownPhoto = (id: string) => (handoff?.id === id ? handoff.src : null);

/** The property page calls this once it is on screen. */
export function photoArrived() {
  arrived?.();
  arrived = null;
}

/** `onClick` for a link to a property: `fly(listing.id)`. The photo is looked for in the link, then in its card. */
export function usePhotoFlight() {
  const router = useRouter();
  return (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    const link = e.currentTarget;
    const img = link.querySelector('img') ?? link.closest('article')?.querySelector('img');
    if (!img?.currentSrc) return;
    handoff = { id, src: img.currentSrc };
    // a new tab, a browser without view transitions, or reduced motion: the link works as any other
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    e.preventDefault();
    img.style.viewTransitionName = 'listing-photo';
    // marks this transition as a photo flight: the pages cross-fade under the photo (see globals.css)
    const root = document.documentElement;
    root.classList.add('photo-flight');
    const transition = document.startViewTransition(
      () =>
        new Promise<void>((resolve) => {
          img.style.viewTransitionName = '';
          arrived = resolve;
          // shortcut: a page that takes longer than this to mount gets no flight, only the usual page change
          window.setTimeout(resolve, 1500);
          router.push(link.href);
        }),
    );
    void transition.finished.finally(() => root.classList.remove('photo-flight'));
  };
}
