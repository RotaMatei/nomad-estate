'use client';

import dynamic from 'next/dynamic';
import * as React from 'react';
import { useCatalogue } from './home-client';
import { Marquee } from '@/components/magicui/marquee';
import { QuietLink as Link } from '@/components/site/quiet-link';
import { Reveal } from '@/components/site/reveal';
import { Skeleton } from '@/components/ui/skeleton';
import { flagEmoji } from '@/lib/properties/filters';
import { formatYield } from '@/lib/properties/format';
import { cn } from '@/lib/utils';

const MarketCharts = dynamic(() => import('./market-charts'), {
  ssr: false,
  loading: () => (
    <div className="grid gap-5 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} className="h-[380px] rounded-2xl" />
      ))}
    </div>
  ),
});

/** True once the element has come near the viewport: heavier sections wait for it before they load anything. */
function useNear<T extends Element>() {
  const ref = React.useRef<T>(null);
  const [near, setNear] = React.useState(false);
  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && (setNear(true), observer.disconnect()), { rootMargin: '300px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return [ref, near] as const;
}

/** A moving line of the places on the platform, between the hero and the numbers. */
export function PlacesMarquee() {
  const { countries, pins } = useCatalogue();
  const listed = React.useMemo(() => {
    const withListings = new Set(pins.map((p) => p.countryId));
    return countries.filter((c) => withListings.has(c.id));
  }, [countries, pins]);
  // the band keeps its height while the list loads, so nothing below it moves
  return (
    <div className="border-y bg-foreground py-4 text-background" aria-hidden={listed.length === 0}>
      <div className="h-8">
        {listed.length > 0 && (
          <Marquee className="p-0 [--duration:45s] [--gap:3rem]" repeat={3}>
            {listed.map((c) => (
              <span key={c.id} className="font-display flex items-center gap-3 text-xl leading-8 font-medium">
                <span aria-hidden className="text-base">
                  {flagEmoji(c.code)}
                </span>
                {c.name}
                <span aria-hidden className="ml-6 size-1.5 rounded-full bg-orchid" />
              </span>
            ))}
          </Marquee>
        )}
      </div>
    </div>
  );
}

const FLOOR = 62;
const TALLEST = 230;

/**
 * Listings per country as a small city: one tower per market, as tall as its number of listings, standing on a
 * tilted floor. Built from plain elements turned in 3D (no canvas), so it costs nothing until it is on screen.
 * The ranked list beside it carries the same numbers as text and links; hovering either lights up the other.
 */
export function MarketSkyline() {
  const { pins, countries, isLoading, isPending } = useCatalogue();
  const [ref, near] = useNear<HTMLDivElement>();
  const [active, setActive] = React.useState<number | null>(null);

  const markets = React.useMemo(() => {
    const names = new Map(countries.map((c) => [c.id, c] as const));
    const by = new Map<number, { id: number; name: string; code: string | null; count: number; yieldSum: number }>();
    for (const p of pins) {
      const country = p.countryId != null ? names.get(p.countryId) : undefined;
      if (!country) continue;
      const m = by.get(country.id) ?? { id: country.id, name: country.name, code: country.code, count: 0, yieldSum: 0 };
      m.count += 1;
      m.yieldSum += p.yieldPct;
      by.set(country.id, m);
    }
    return [...by.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)).slice(0, 9);
  }, [pins, countries]);
  const most = Math.max(1, ...markets.map((m) => m.count));
  const loading = isLoading || isPending;

  return (
    <section aria-labelledby="skyline-title" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:py-28">
        <div>
          <p className="text-sm font-medium tracking-[0.18em] text-muted-foreground uppercase">01 / Where the listings are</p>
          <h2 id="skyline-title" className="font-display mt-4 text-3xl font-semibold text-balance sm:text-4xl">
            A skyline of <span className="text-liquid">every market</span> on the globe
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">Each tower is a country. The taller it stands, the more properties are listed there today.</p>

          <ol className="mt-8 divide-y border-y">
            {loading
              ? Array.from({ length: 5 }, (_, i) => (
                  <li key={i} className="py-3">
                    <Skeleton className="h-6 w-full" />
                  </li>
                ))
              : markets.map((m, i) => (
                  <li key={m.id}>
                    <Link
                      href={`/properties?countries=${m.id}`}
                      onPointerEnter={() => setActive(m.id)}
                      onPointerLeave={() => setActive(null)}
                      onFocus={() => setActive(m.id)}
                      onBlur={() => setActive(null)}
                      className={cn('grid grid-cols-[2rem_1fr_auto_auto] items-center gap-4 py-3 transition-colors', active === m.id && 'bg-accent')}
                    >
                      <span className="tabular text-sm text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                      <span className="font-medium">
                        <span aria-hidden className="mr-2">
                          {flagEmoji(m.code)}
                        </span>
                        {m.name}
                      </span>
                      <span className="tabular text-sm text-muted-foreground">{formatYield(m.yieldSum / m.count)} yield</span>
                      <span className="tabular w-24 text-right text-sm">
                        {m.count} {m.count === 1 ? 'listing' : 'listings'}
                      </span>
                    </Link>
                  </li>
                ))}
          </ol>
        </div>

        {/* the picture repeats the list, so it is hidden from assistive technology */}
        <div ref={ref} aria-hidden className="relative mx-auto h-[420px] w-full max-w-[520px] [perspective:1400px]">
          <div
            className="preserve-3d absolute top-[60%] left-1/2 grid grid-cols-3 gap-7"
            style={{ transform: 'translate(-50%, -50%) rotateX(58deg) rotateZ(-42deg)', width: FLOOR * 3 + 56, transformOrigin: 'center' }}
          >
            {markets.map((m, i) => {
              const height = Math.round(28 + (m.count / most) * (TALLEST - 28));
              const lit = active === m.id;
              return (
                <div
                  key={m.id}
                  onPointerEnter={() => setActive(m.id)}
                  onPointerLeave={() => setActive(null)}
                  className="preserve-3d relative transition-transform duration-[900ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                  style={{ width: FLOOR, height: FLOOR, transform: `scaleZ(${near ? 1 : 0.01})`, transitionDelay: `${i * 70}ms` }}
                >
                  {/* shadow on the floor */}
                  <span className="absolute inset-0 translate-x-3 translate-y-3 rounded-sm bg-foreground/10 blur-md" />
                  {/* roof */}
                  <span
                    className={cn('absolute inset-0 rounded-[3px] transition-colors duration-300', lit ? 'bg-orchid-strong' : 'bg-orchid')}
                    style={{ transform: `translateZ(${height}px)` }}
                  />
                  {/* the wall towards the viewer: periwinkle, the investors' colour */}
                  <span
                    className={cn('absolute left-0 origin-top transition-colors duration-300', lit ? 'bg-investor-strong' : 'bg-investor')}
                    style={{ top: FLOOR, width: FLOOR, height, transform: 'rotateX(90deg)', backgroundImage: 'linear-gradient(to bottom, rgb(255 255 255 / 0.25), transparent 70%)' }}
                  />
                  {/* the other wall the viewer sees: coral, the agencies' colour */}
                  <span
                    className={cn('absolute top-0 origin-left transition-colors duration-300', lit ? 'bg-agency-strong' : 'bg-agency')}
                    style={{ left: 0, width: height, height: FLOOR, transform: 'rotateY(-90deg)', backgroundImage: 'linear-gradient(to right, rgb(255 255 255 / 0.2), transparent 70%)' }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Charts of what is on the platform. The chart library is fetched only when the section comes near the screen. */
export function MarketSnapshot() {
  const { pins, countries, isLoading, isPending, isError } = useCatalogue();
  const [ref, near] = useNear<HTMLDivElement>();
  if (isError || (!isLoading && !isPending && pins.length === 0)) return null;
  return (
    <section aria-labelledby="snapshot-title" className="border-y bg-secondary/50">
      <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
        <Reveal>
          <p className="text-sm font-medium tracking-[0.18em] text-muted-foreground uppercase">02 / The numbers</p>
          <h2 id="snapshot-title" className="font-display mt-4 max-w-2xl text-3xl font-semibold text-balance sm:text-4xl">
            The market, drawn from today’s listings
          </h2>
          <p className="mt-4 max-w-xl text-muted-foreground">Nothing here is a forecast. These are the prices and yields of the properties on the globe right now.</p>
        </Reveal>
        <div ref={ref} className="mt-10 min-h-[380px]">
          {near && pins.length > 0 ? (
            <MarketCharts pins={pins} countries={countries} />
          ) : (
            <div className="grid gap-5 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-[380px] rounded-2xl" />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
