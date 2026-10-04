'use client';

import { useTheme } from 'next-themes';
import * as React from 'react';
import { AnimatedThemeToggler } from '@/components/magicui/animated-theme-toggler';
import { cn } from '@/lib/utils';

const subscribe = () => () => {};

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  // false during SSR and hydration, true afterwards, so the icon never mismatches the server markup
  const mounted = React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  return (
    <AnimatedThemeToggler
      theme={mounted && resolvedTheme === 'dark' ? 'dark' : 'light'}
      onThemeChange={(t) => setTheme(t)}
      duration={520}
      aria-label={mounted && resolvedTheme === 'dark' ? 'Switch to day chart (light theme)' : 'Switch to night view (dark theme)'}
      className={cn(
        'inline-flex size-9 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-accent hover:text-foreground [&_svg]:size-[18px]',
        className,
      )}
    />
  );
}
