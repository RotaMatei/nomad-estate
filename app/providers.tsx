'use client';

import * as React from 'react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import { lightTheme } from './theme';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

/**
 * App-wide providers.
 * - next-themes: light/dark via `class` on <html>, follows the OS until the user picks one.
 * - TanStack Query: server-state cache (replaces sessionStorage caches + window CustomEvents).
 * - nuqs: search filters live in the URL so searches are shareable and survive refresh.
 * - MUI ThemeProvider is kept ONLY for legacy pages until they are migrated (PROGRESS.md A3–A7).
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            gcTime: 10 * 60_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <NextThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>
          <TooltipProvider delayDuration={250}>
            <MuiThemeProvider theme={lightTheme}>{children}</MuiThemeProvider>
            <Toaster position="bottom-right" />
          </TooltipProvider>
        </NuqsAdapter>
      </QueryClientProvider>
    </NextThemeProvider>
  );
}
