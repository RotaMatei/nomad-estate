import type * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * A small house built from plain elements turned in 3D (styles under `.house` in globals.css): no canvas, no script.
 * It hops and turns on the spot; with `scroll` it turns as the page is scrolled past it instead.
 */
export function House3D({ size = 56, scroll = false, className }: { size?: number; scroll?: boolean; className?: string }) {
  return (
    <div aria-hidden className={cn('house', scroll && 'house-scroll', className)} style={{ '--s': `${size}px` } as React.CSSProperties}>
      <div className="house-hop">
        <div className="house-body">
          <i className="house-front" />
          <i className="house-back" />
          <i className="house-left" />
          <i className="house-right" />
          <i className="house-roof-left" />
          <i className="house-roof-right" />
        </div>
      </div>
      <i className="house-shadow" />
    </div>
  );
}
