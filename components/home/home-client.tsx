'use client';

import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, Search } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import api from '@/app/lib/api';
import { PropertyGlobe } from '@/components/globe';
import { useAfterFirstPaint } from '@/hooks/use-after-first-paint';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { DEFAULT_FILTERS, flagEmoji } from '@/lib/properties/filters';
import { formatPrice, formatYield } from '@/lib/properties/format';
import { usePropertySearch } from '@/lib/properties/queries';

/** The catalogue is fetched once and shared (TanStack Query cache) by the hero globe, featured markets and /properties. */
const useCatalogue = () => usePropertySearch(DEFAULT_FILTERS, { enabled: useAfterFirstPaint(), list: false });

export function HomeHero() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const { pins } = useCatalogue();
  const [q, setQ] = React.useState('');

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* The one bold element: the live globe, bleeding off the right edge on desktop and the bottom on phones. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[-16%] -z-10 h-[44%] lg:inset-x-auto lg:top-[-6%] lg:right-[-14%] lg:bottom-[-6%] lg:h-auto lg:w-[72%]"
      >
        <PropertyGlobe
          listings={pins}
          theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
          interactive={false}
          transparent
          initialView={{ center: [14, 24], zoom: 2.35, zoomMobile: 0.9 }}
        />
      </div>

      <div className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col justify-start px-5 pt-28 pb-10 sm:px-8 lg:justify-center lg:pt-24">
        <div className="max-w-[34rem]">
          <h1 className="font-display text-4xl leading-[1.05] font-semibold text-balance sm:text-5xl lg:text-6xl">
            Invest in property anywhere on Earth
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">
            Every listing sits on one live globe. Compare price, rental yield and investment score across countries, then contact the agency directly.
          </p>

          <form
            role="search"
            className="glass shadow-float mt-8 flex h-14 max-w-md items-center gap-2 rounded-full pr-2 pl-5"
            onSubmit={(e) => {
              e.preventDefault();
              const term = q.trim();
              router.push(term ? `/properties?q=${encodeURIComponent(term)}` : '/properties');
            }}
          >
            <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <Input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Country or property name"
              aria-label="Search properties by country or name"
              className="h-10 flex-1 border-transparent bg-transparent px-1 text-base shadow-none focus-visible:ring-0 dark:bg-transparent"
            />
            <Button type="submit" className="h-10 rounded-full px-5">
              Search properties
            </Button>
          </form>

          <p className="mt-4 text-sm text-muted-foreground">
            Or{' '}
            <Link href="/properties" className="font-medium text-foreground underline underline-offset-4 hover:text-beacon">
              explore the whole globe
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}

interface HomeStats {
  countries: number;
  properties: number;
  partners: number;
}

export function HomeStatsBand() {
  const { data, isError } = useQuery({
    queryKey: ['stats-home'],
    queryFn: async () => (await api.get<HomeStats>('/property/stats-home')).data,
    staleTime: 5 * 60_000,
  });
  if (isError) return null;

  const stats: [keyof HomeStats, string][] = [
    ['properties', 'properties listed'],
    ['countries', 'countries'],
    ['partners', 'partner agencies'],
  ];
  return (
    <section aria-label="Nomad Estate in numbers" className="border-y bg-card">
      <dl className="mx-auto grid max-w-[1200px] grid-cols-3 divide-x px-2 sm:px-8">
        {stats.map(([key, label]) => (
          <div key={key} className="flex flex-col-reverse px-3 py-8 sm:px-8 sm:py-10">
            <dt className="mt-1 text-sm text-muted-foreground">{label}</dt>
            <dd className="font-display tabular text-3xl font-semibold sm:text-5xl">
              {data ? (
                // NumberTicker counts up once, the first time it scrolls into view
                <NumberTicker value={Number(data[key]) || 0} className="text-foreground dark:text-foreground" />
              ) : (
                <Skeleton className="h-9 w-20 sm:h-12 sm:w-28" />
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function FeaturedMarkets() {
  const { pins, countries, isLoading, isPending, isError } = useCatalogue();

  const markets = React.useMemo(() => {
    const names = new Map(countries.map((c) => [c.id, c] as const));
    const by = new Map<number, { id: number; name: string; code: string | null; count: number; yieldSum: number; from: number }>();
    for (const p of pins) {
      const country = p.countryId != null ? names.get(p.countryId) : undefined;
      if (p.countryId == null || !country) continue;
      const m = by.get(p.countryId) ?? { id: p.countryId, name: country.name, code: country.code, count: 0, yieldSum: 0, from: Infinity };
      m.count += 1;
      m.yieldSum += p.yieldPct;
      m.from = Math.min(m.from, p.price);
      by.set(p.countryId, m);
    }
    return [...by.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)).slice(0, 6);
  }, [pins, countries]);

  if (isError || (!isLoading && !isPending && markets.length === 0)) return null;

  return (
    <section aria-labelledby="markets-title" className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="markets-title" className="font-display text-3xl font-semibold sm:text-4xl">
            Markets with the most listings
          </h2>
          <p className="mt-3 max-w-lg text-muted-foreground">Ranked by the number of properties on the platform right now.</p>
        </div>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/properties">See every market</Link>
        </Button>
      </div>

      <ol className="mt-10 divide-y border-y">
        {isLoading || isPending
          ? Array.from({ length: 6 }, (_, i) => (
              <li key={i} className="py-5">
                <Skeleton className="h-7 w-full" />
              </li>
            ))
          : markets.map((m, i) => (
              <li key={m.id}>
                <Link
                  href={`/properties?countries=${m.id}`}
                  className="group grid grid-cols-[2rem_1fr_auto] items-center gap-x-4 gap-y-1 py-5 transition-colors hover:bg-accent/50 sm:grid-cols-[3rem_1.4fr_1fr_1fr_1fr_auto] sm:px-3"
                >
                  <span className="tabular text-sm text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-display text-xl font-medium sm:text-2xl">
                    <span aria-hidden className="mr-2 text-base">
                      {flagEmoji(m.code)}
                    </span>
                    {m.name}
                  </span>
                  <span className="tabular col-start-2 text-sm text-muted-foreground sm:col-start-auto sm:text-base sm:text-foreground">
                    {m.count} {m.count === 1 ? 'property' : 'properties'}
                  </span>
                  <span className="tabular hidden text-positive sm:block">{formatYield(m.yieldSum / m.count)} average yield</span>
                  <span className="tabular hidden text-muted-foreground sm:block">from {formatPrice(m.from, { compact: true })}</span>
                  <ArrowUpRight
                    className="col-start-3 row-start-1 size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground sm:col-start-auto sm:row-start-auto"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
      </ol>
    </section>
  );
}
