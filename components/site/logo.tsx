import * as React from 'react';
import { cn } from '@/lib/utils';

/** The orbit, as a path, so the beacon can travel along it in the animated mark. */
const ORBIT = 'M3.6 30.2C1.2 25 8.4 16.2 19.7 10.6S42 4.6 44.4 9.8 39.6 23.8 28.3 29.4 6 35.4 3.6 30.2Z';

/**
 * Nomad Estate mark: an N standing on a globe, circled by one orbit with a beacon on it.
 * The N is the brand's initial and, with its two uprights and a diagonal, a building seen between two walls; the
 * orbit is the nomad's path around the world, drawn in the three brand colours (coral for agencies, periwinkle for
 * investors, orchid where they meet); the beacon is a listing.
 *
 * `animated` draws the mark stroke by stroke and sends the beacon round the orbit: the loading screen uses it.
 */
export function LogoMark({ className, animated = false }: { className?: string; animated?: boolean }) {
  const id = React.useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 48 40" aria-hidden="true" className={cn('h-7 w-auto', animated && 'logo-animated', className)} fill="none">
      <defs>
        <linearGradient id={`${id}-o`} x1="4" y1="30" x2="44" y2="10" gradientUnits="userSpaceOnUse">
          <stop offset="0" style={{ stopColor: 'var(--agency-strong)' }} />
          <stop offset="0.5" style={{ stopColor: 'var(--orchid-strong)' }} />
          <stop offset="1" style={{ stopColor: 'var(--investor-strong)' }} />
        </linearGradient>
      </defs>
      {/* the globe, faint */}
      <circle cx="24" cy="20" r="15.5" stroke="currentColor" strokeWidth="1.25" opacity="0.22" />
      {/* the far half of the orbit passes behind the N */}
      <path className="logo-orbit" d={ORBIT} pathLength={1} stroke={`url(#${id}-o)`} strokeWidth="2.25" strokeLinecap="round" />
      <path
        className="logo-n"
        d="M16.5 30V11.8c0-1.6 1.9-2.3 2.9-1.1l9.2 18.6c1 1.2 2.9.5 2.9-1.1V10"
        pathLength={1}
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* the near half of the orbit crosses in front, so the N stands inside the ring */}
      <path d="M3.6 30.2C1.2 25 8.4 16.2 19.7 10.6" className="logo-orbit-front" pathLength={1} stroke={`url(#${id}-o)`} strokeWidth="2.25" strokeLinecap="round" />
      <g className="logo-beacon" transform={animated ? undefined : 'translate(41.6 7.4)'}>
        <circle r="5.2" style={{ fill: 'var(--beacon-glow)' }} opacity="0.35" />
        <circle r="2.9" style={{ fill: 'var(--beacon)' }} />
        {animated && <animateMotion dur="2.4s" repeatCount="indefinite" path={ORBIT} keyPoints="0;1" keyTimes="0;1" calcMode="linear" additive="replace" />}
      </g>
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark />
      <span className="font-display text-[15px] leading-none font-semibold">
        Nomad <span className="font-normal text-muted-foreground">Estate</span>
      </span>
    </span>
  );
}
