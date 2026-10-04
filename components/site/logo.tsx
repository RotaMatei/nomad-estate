import { cn } from '@/lib/utils';

/** Nomad Estate mark: a globe reduced to its equator and one meridian, with a beacon on it. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn('size-7', className)} fill="none">
      <circle cx="16" cy="16" r="12.5" stroke="currentColor" strokeWidth="1.75" />
      <ellipse cx="16" cy="16" rx="5.5" ry="12.5" stroke="currentColor" strokeWidth="1.5" opacity="0.55" />
      <path d="M3.5 16h25" stroke="currentColor" strokeWidth="1.5" opacity="0.55" />
      <circle cx="20.6" cy="10.4" r="2.6" className="fill-beacon" />
      <circle cx="20.6" cy="10.4" r="4.6" className="fill-beacon/25" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark />
      <span className="font-display text-[15px] font-semibold leading-none">Nomad Estate</span>
    </span>
  );
}
