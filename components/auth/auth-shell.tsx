'use client';

import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import * as React from 'react';
import { Logo } from '@/components/site/logo';
import { ThemeToggle } from '@/components/site/theme-toggle';
import { cn } from '@/lib/utils';

// ogl + shader: only on auth routes, only in the browser
const Topography = dynamic(() => import('@/components/reactbits/topography'), { ssr: false });

const subscribe = (cb: () => void) => {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};

/** Contour lines drifting like a relief map: the quiet backdrop for every auth screen. */
function Contours() {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === 'dark';
  const reduced = React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  );
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 opacity-70">
      <Topography
        key={dark ? 'dark' : 'light'}
        lightMode={!dark}
        lowColor={dark ? '#130f26' : '#fbf9fc'}
        midColor={dark ? '#26395a' : '#b3c2d3'}
        highColor={dark ? '#dcb8ea' : '#8f55a8'}
        speed={reduced ? 0 : 0.12}
        morphSpeed={reduced ? 0 : 0.03}
        bands={3}
        thickness={0.008}
        glow={0.15}
        grain={false}
        mouseInteraction={false}
        opacity={dark ? 0.55 : 0.7}
      />
    </div>
  );
}

export function AuthShell({
  title,
  description,
  children,
  footer,
  wide,
}: {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="relative isolate flex min-h-[100svh] flex-col">
      <Contours />
      <header className="flex items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" aria-label="Nomad Estate home" className="rounded-full">
          <Logo />
        </Link>
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-start justify-center px-4 pt-6 pb-16 sm:items-center sm:pt-0">
        <div className={cn('glass shadow-float w-full rounded-xl p-6 sm:p-9', wide ? 'max-w-[640px]' : 'max-w-[440px]')}>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl">{title}</h1>
          {description && <p className="mt-2 text-muted-foreground">{description}</p>}
          <div className="mt-7">{children}</div>
          {footer && <div className="mt-7 border-t pt-5 text-sm text-muted-foreground">{footer}</div>}
        </div>
      </main>
    </div>
  );
}
