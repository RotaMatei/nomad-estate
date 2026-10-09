'use client';

import { useQuery } from '@tanstack/react-query';
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Check, Quote } from 'lucide-react';
import * as React from 'react';
import { useCatalogue } from './home-client';
import api from '@/app/lib/api';
import { Marquee } from '@/components/magicui/marquee';
import { ListingImage, ListingPlace, ScoreRing } from '@/components/properties/listing-parts';
import { QuietLink as Link } from '@/components/site/quiet-link';
import { Reveal } from '@/components/site/reveal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { useAfterFirstPaint } from '@/hooks/use-after-first-paint';
import { fetchAnswerCountries } from '@/lib/ai/ask';
import { useAiFeature } from '@/lib/ai/use-ask-search';
import { PARTNERS, TESTIMONIALS } from '@/lib/company';
import { DEFAULT_FILTERS, flagEmoji } from '@/lib/properties/filters';
import { formatPrice, formatYield } from '@/lib/properties/format';
import { useListingsByIds, usePropertySearch } from '@/lib/properties/queries';
import type { Listing } from '@/lib/properties/types';
import { cn } from '@/lib/utils';

const Eyebrow = ({ children }: { children: React.ReactNode }) => <p className="text-sm font-medium tracking-[0.18em] text-muted-foreground uppercase">{children}</p>;

/** A listing as a tall card: the photo zooms and the card lifts under the pointer. */
function ListingCard({ listing, badge, className }: { listing: Listing; badge?: React.ReactNode; className?: string }) {
  return (
    <Link
      href={`/details/${listing.id}`}
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-float',
        className,
      )}
    >
      <div className="relative">
        <ListingImage
          listing={listing}
          sizes="(min-width: 1024px) 380px, 80vw"
          className="aspect-[4/3] [&_img]:transition-transform [&_img]:duration-700 [&_img]:ease-out group-hover:[&_img]:scale-[1.06]"
        />
        {badge && <span className="glass absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-medium">{badge}</span>}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 leading-snug font-semibold">{listing.title}</h3>
        <ListingPlace listing={listing} className="mt-1 text-sm" />
        <div className="mt-auto flex items-end justify-between pt-5">
          <div>
            <p className="font-display tabular text-xl font-semibold">{formatPrice(listing.price)}</p>
            <p className="tabular text-sm font-medium text-positive">{formatYield(listing.yieldPct)} gross yield</p>
          </div>
          <ScoreRing score={listing.score} />
        </div>
      </div>
    </Link>
  );
}

/** Six of the best-scoring listings, in a row that scrolls sideways (drag, swipe, or the two arrows). */
export function FeaturedListings() {
  const ready = useAfterFirstPaint();
  const { listings, isLoading, isPending, isError } = usePropertySearch({ ...DEFAULT_FILTERS, sort: 'score' }, { enabled: ready, pins: false });
  const track = React.useRef<HTMLUListElement>(null);
  const top = listings.slice(0, 8);
  if (isError || (!isLoading && !isPending && top.length === 0)) return null;
  const step = (direction: 1 | -1) => track.current?.scrollBy({ left: direction * Math.min(track.current.clientWidth * 0.8, 760), behavior: 'smooth' });

  return (
    <section aria-labelledby="featured-title" className="overflow-hidden py-20 lg:py-28">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-end justify-between gap-6 px-5 sm:px-8">
        <Reveal>
          <Eyebrow>Hand-picked by the numbers</Eyebrow>
          <h2 id="featured-title" className="font-display mt-4 max-w-xl text-3xl font-semibold text-balance sm:text-4xl">
            The highest-scoring homes on the globe today
          </h2>
        </Reveal>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="size-11 rounded-full" onClick={() => step(-1)} aria-label="Earlier listings">
            <ArrowLeft className="size-4" aria-hidden />
          </Button>
          <Button variant="outline" size="icon" className="size-11 rounded-full" onClick={() => step(1)} aria-label="More listings">
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
      <ul
        ref={track}
        className="scrollbar-none mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 pb-6 sm:px-8 lg:px-[max(2rem,calc((100vw-1200px)/2+2rem))]"
      >
        {isLoading || isPending || top.length === 0
          ? Array.from({ length: 4 }, (_, i) => (
              <li key={i} className="w-[78vw] shrink-0 snap-start sm:w-[360px]">
                <Skeleton className="h-[420px] rounded-2xl" />
              </li>
            ))
          : top.map((listing, i) => (
              <Reveal as="li" key={listing.id} delay={Math.min(i, 4) * 0.07} className="w-[78vw] shrink-0 snap-start sm:w-[360px]">
                <ListingCard listing={listing} badge={i === 0 ? 'Top score' : undefined} />
              </Reveal>
            ))}
      </ul>
    </section>
  );
}

const BUDGETS = [75_000, 100_000, 150_000, 200_000, 300_000, 400_000, 500_000, 750_000, 1_000_000, 1_500_000];

/** A number that rolls to its new value instead of jumping. */
function Rolling({ value, format }: { value: number; format: (n: number) => string }) {
  const [shown, setShown] = React.useState(value);
  const from = React.useRef(value);
  React.useEffect(() => {
    // with reduced motion the number lands on its value in the next frame instead of rolling there
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 450;
    const start = performance.now();
    const origin = from.current;
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      const current = origin + (value - origin) * eased;
      from.current = current;
      setShown(current);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <>{format(shown)}</>;
}

/**
 * "What does my budget buy?": a budget, and for each country what is listed under it. Every figure is read from
 * the listings on the platform (a count, the best yield among them, and that listing's price times its yield).
 * Nothing is predicted.
 */
export function YieldCalculator() {
  const { pins, countries, isLoading, isPending } = useCatalogue();
  const [step, setStep] = React.useState(4);
  const budget = BUDGETS[step];

  const rows = React.useMemo(() => {
    const names = new Map(countries.map((c) => [c.id, c] as const));
    const by = new Map<number, { id: number; name: string; code: string | null; count: number; best: { price: number; yieldPct: number } }>();
    for (const p of pins) {
      const country = p.countryId != null ? names.get(p.countryId) : undefined;
      if (!country || p.price > budget) continue;
      const row = by.get(country.id) ?? { id: country.id, name: country.name, code: country.code, count: 0, best: p };
      row.count += 1;
      if (p.yieldPct > row.best.yieldPct) row.best = p;
      by.set(country.id, row);
    }
    return [...by.values()].sort((a, b) => b.best.yieldPct - a.best.yieldPct).slice(0, 3);
  }, [pins, countries, budget]);
  const within = pins.filter((p) => p.price <= budget).length;

  return (
    <section aria-labelledby="calculator-title" className="border-y bg-card">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1.25fr] lg:py-28">
        <Reveal>
          <Eyebrow>What does my budget buy?</Eyebrow>
          <h2 id="calculator-title" className="font-display mt-4 text-3xl font-semibold text-balance sm:text-4xl">
            Move the budget. Watch the map <span className="text-liquid">open up</span>.
          </h2>
          <div className="mt-10">
            <div className="flex items-baseline justify-between">
              <label id="budget-label" className="text-sm text-muted-foreground">
                Your budget
              </label>
              <output className="font-display tabular text-4xl font-semibold sm:text-5xl" aria-live="polite">
                <Rolling value={budget} format={(n) => formatPrice(Math.round(n / 1000) * 1000)} />
              </output>
            </div>
            <Slider aria-labelledby="budget-label" className="mt-6" min={0} max={BUDGETS.length - 1} step={1} value={[step]} onValueChange={(v) => setStep(v[0])} />
            <div className="tabular mt-2 flex justify-between text-xs text-muted-foreground">
              <span>{formatPrice(BUDGETS[0], { compact: true })}</span>
              <span>{formatPrice(BUDGETS[BUDGETS.length - 1], { compact: true })}</span>
            </div>
          </div>
          <p className="mt-8 text-muted-foreground">
            <span className="tabular font-semibold text-foreground">
              <Rolling value={within} format={(n) => String(Math.round(n))} />
            </span>{' '}
            {within === 1 ? 'listing is' : 'listings are'} within this budget. Prices are in US dollars; yields are gross and are estimates, not advice.
          </p>
          <Button asChild className="mt-6 rounded-full">
            <Link href={`/properties?maxPrice=${budget}&sort=yield`}>
              See them on the globe <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </Reveal>

        <ol className="grid content-start gap-4">
          {isLoading || isPending ? (
            [0, 1, 2].map((i) => <Skeleton key={i} className="h-[112px] rounded-2xl" />)
          ) : rows.length === 0 ? (
            <li className="rounded-2xl border border-dashed p-8 text-muted-foreground">Nothing is listed under this budget yet. Move the slider to the right.</li>
          ) : (
            rows.map((row, i) => (
              <li key={row.id} className="animate-rise" style={{ animationDelay: `${i * 70}ms` }}>
                <Link
                  href={`/properties?countries=${row.id}&maxPrice=${budget}`}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 rounded-2xl border bg-background p-5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-float sm:p-6"
                >
                  <span className="font-display text-liquid tabular text-4xl font-semibold">0{i + 1}</span>
                  <div className="min-w-0">
                    <p className="truncate text-lg font-semibold">
                      <span aria-hidden className="mr-2 text-base">
                        {flagEmoji(row.code)}
                      </span>
                      {row.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {row.count} {row.count === 1 ? 'listing' : 'listings'} within budget, the best at {formatPrice(row.best.price, { compact: true })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="tabular text-xl font-semibold text-positive">{formatYield(row.best.yieldPct)}</p>
                    <p className="tabular text-xs text-muted-foreground">about {formatPrice(Math.round((row.best.price * row.best.yieldPct) / 100 / 100) * 100, { compact: true })} rent a year</p>
                  </div>
                </Link>
              </li>
            ))
          )}
        </ol>
      </div>
    </section>
  );
}

interface Drop {
  id: string;
  previousPrice: number;
  price: number;
}

/** Listings whose asking price has just come down, from the price history. Hidden when there are none. */
export function PriceDrops() {
  const ready = useAfterFirstPaint();
  const { data: drops } = useQuery({
    queryKey: ['price-drops'],
    queryFn: async () => (await api.get<Drop[]>('/property/price-drops')).data,
    staleTime: 5 * 60_000,
    enabled: ready,
    retry: false,
  });
  const shown = React.useMemo(() => (Array.isArray(drops) ? drops.slice(0, 3) : []), [drops]);
  const ids = React.useMemo(() => shown.map((d) => d.id), [shown]);
  const { listings } = useListingsByIds(ids);
  if (shown.length === 0 || listings.length === 0) return null;
  const byId = new Map(listings.map((l) => [l.id, l]));

  return (
    <section aria-labelledby="drops-title" className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
      <Reveal>
        <Eyebrow>Price movement</Eyebrow>
        <h2 id="drops-title" className="font-display mt-4 max-w-xl text-3xl font-semibold text-balance sm:text-4xl">
          Recently reduced
        </h2>
        <p className="mt-4 max-w-xl text-muted-foreground">Asking prices that have come down since the listing went up. Every change is recorded on the listing’s page.</p>
      </Reveal>
      <ul className="mt-10 grid gap-5 md:grid-cols-3">
        {shown.map((drop, i) => {
          const listing = byId.get(drop.id);
          if (!listing) return null;
          const cut = Math.round(((drop.previousPrice - drop.price) / drop.previousPrice) * 100);
          return (
            <Reveal as="li" key={drop.id} delay={i * 0.08}>
              <ListingCard
                listing={listing}
                badge={
                  <span className="flex items-center gap-1">
                    <ArrowDownRight className="size-3.5 text-positive" aria-hidden />
                    {cut}% lower, was {formatPrice(drop.previousPrice, { compact: true })}
                  </span>
                }
              />
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}

/** Countries whose buying rules can be asked about, with official sources. Shown only where that feature is on. */
export function CountryGuides() {
  const on = useAiFeature('rag');
  const { countries } = useCatalogue();
  const { data: codes } = useQuery({ queryKey: ['ai-answer-countries'], queryFn: fetchAnswerCountries, staleTime: 10 * 60_000, enabled: on });
  const guides = countries.filter((c) => c.code && codes?.includes(c.code.toUpperCase()));
  if (!on || guides.length === 0) return null;
  return (
    <section aria-labelledby="guides-title" className="border-y bg-secondary/50">
      <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
        <Reveal>
          <Eyebrow>Before you buy</Eyebrow>
          <h2 id="guides-title" className="font-display mt-4 max-w-2xl text-3xl font-semibold text-balance sm:text-4xl">
            Ask about the rules, get the official page
          </h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Taxes, ownership and residency, answered from each country’s own authorities and cited. Open any listing in these countries to ask.
          </p>
        </Reveal>
        <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {guides.map((c, i) => (
            <Reveal as="li" key={c.id} delay={i * 0.06}>
              <Link
                href={`/properties?countries=${c.id}`}
                className="group flex h-full flex-col rounded-2xl border bg-card p-5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-float"
              >
                <BookOpen className="size-5 text-orchid-strong transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" aria-hidden />
                <p className="mt-6 text-lg font-semibold">{c.name}</p>
                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  Listings and answers
                  <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                </p>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** A moving strip of partner agencies. The names are placeholders (see lib/company.ts). */
export function PartnerStrip() {
  return (
    <section aria-label="Partner agencies" className="border-y py-10">
      <p className="text-center text-sm text-muted-foreground">Agencies listing with Nomad Estate</p>
      {/* decorative repeat of names that are also readable once, below, for assistive technology */}
      <div aria-hidden className="mt-6 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <Marquee className="p-0 [--duration:50s] [--gap:3.5rem]" pauseOnHover repeat={3}>
          {PARTNERS.map((name) => (
            <span key={name} className="font-display text-2xl font-medium text-foreground/45 transition-colors duration-300 hover:text-foreground">
              {name}
            </span>
          ))}
        </Marquee>
      </div>
      <ul className="sr-only">
        {PARTNERS.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </section>
  );
}

const TONE = { investor: 'bg-investor', agency: 'bg-agency' } as const;

/** Quotes from both sides, one at a time; they change every few seconds unless the pointer or focus is on them. */
export function Testimonials() {
  const [index, setIndex] = React.useState(0);
  const [held, setHeld] = React.useState(false);
  React.useEffect(() => {
    if (held || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % TESTIMONIALS.length), 6500);
    return () => clearInterval(timer);
  }, [held]);
  return (
    <section aria-labelledby="voices-title" className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
      <Reveal>
        <Eyebrow>In their words</Eyebrow>
        <h2 id="voices-title" className="sr-only">
          What investors and agencies say
        </h2>
      </Reveal>
      <div
        className="mt-8 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end"
        onPointerEnter={() => setHeld(true)}
        onPointerLeave={() => setHeld(false)}
        onFocus={() => setHeld(true)}
        onBlur={() => setHeld(false)}
      >
        <div className="relative min-h-[380px] sm:min-h-[340px]">
          <Quote className="size-9 text-orchid-strong" aria-hidden />
          {TESTIMONIALS.map((t, i) => (
            <figure
              key={t.name}
              aria-hidden={i !== index}
              className={cn(
                'absolute inset-x-0 top-14 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]',
                i === index ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
              )}
            >
              <blockquote className="font-display max-w-4xl text-2xl leading-snug font-medium text-balance sm:text-4xl">“{t.quote}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 text-sm">
                <span className={cn('size-2.5 rounded-full', TONE[t.audience])} aria-hidden />
                <span className="font-semibold">{t.name}</span>
                <span className="text-muted-foreground">{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="flex gap-2" role="group" aria-label="Choose a quote">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.name}
              type="button"
              aria-label={`Quote ${i + 1} of ${TESTIMONIALS.length}`}
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
              className="group flex h-8 items-center"
            >
              <span className={cn('h-1 rounded-full transition-all duration-500', i === index ? 'w-12 bg-foreground' : 'w-6 bg-border group-hover:bg-muted-foreground')} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Newsletter sign-up. NOT CONNECTED: there is no mailing-list service behind it yet, so nothing is stored or sent.
 * The form says so instead of pretending.
 */
export function Newsletter() {
  const { countries, pins } = useCatalogue();
  const [done, setDone] = React.useState(false);
  const listed = React.useMemo(() => {
    const withListings = new Set(pins.map((p) => p.countryId));
    return countries.filter((c) => withListings.has(c.id));
  }, [countries, pins]);
  return (
    <section aria-labelledby="newsletter-title" className="border-t bg-card">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <Reveal>
          <h2 id="newsletter-title" className="font-display text-2xl font-semibold text-balance sm:text-3xl">
            New listings in the country you care about, once a week
          </h2>
          <p className="mt-2 text-muted-foreground">One email, one country, no more than that.</p>
        </Reveal>
        {done ? (
          <p role="status" className="flex items-start gap-3 rounded-2xl border bg-background p-5">
            <Check className="mt-0.5 size-5 shrink-0 text-positive" aria-hidden />
            <span>
              Thank you. The weekly email is not switched on yet, so nothing was saved; this form is a preview of how it will work.
            </span>
          </p>
        ) : (
          <form
            className="flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true);
            }}
          >
            <label className="sr-only" htmlFor="newsletter-country">
              Country
            </label>
            <select id="newsletter-country" name="country" className="h-12 rounded-full border bg-background px-4 text-sm" defaultValue="">
              <option value="">Any country</option>
              {listed.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <Input id="newsletter-email" type="email" name="email" required autoComplete="email" placeholder="you@example.com" className="h-12 flex-1 rounded-full px-5" />
            <Button type="submit" className="h-12 rounded-full px-6">
              Keep me posted
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
