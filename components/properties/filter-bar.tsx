'use client';

import { Check, ChevronDown, MapPin, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Spinner } from '@/components/ui/spinner';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { AskSearch } from '@/lib/ai/use-ask-search';
import { MAX_CHARS } from '@/lib/ai/search';
import { countActiveFilters, flagEmoji, type SearchFilters } from '@/lib/properties/filters';
import { formatPrice } from '@/lib/properties/format';
import {
  BENEFIT_LABEL,
  GOAL_LABEL,
  INVESTMENT_GOAL_TAGS,
  LOCATION_BENEFIT_TAGS,
  PROPERTY_TYPES,
  PROPERTY_TYPE_LABEL,
  type PropertyType,
} from '@/lib/properties/labels';
import type { Country } from '@/lib/properties/types';
import { cn } from '@/lib/utils';

const PRICE_MAX = 2_000_000;
const PRICE_STEP = 25_000;

type SetFilters = (patch: Partial<SearchFilters> | null) => void;

interface FilterBarProps {
  filters: SearchFilters;
  setFilters: SetFilters;
  countries: Country[];
  hasArea: boolean;
  onClearArea: () => void;
  /** Search by description. When it is on, the box takes a sentence and the filters are set from it. */
  ask?: AskSearch;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

function FilterTrigger({ label, summary, ...props }: { label: string; summary?: string | null } & React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant="ghost"
      className={cn(
        'h-9 shrink-0 gap-1.5 rounded-full px-3.5 text-sm font-normal text-foreground/80 hover:text-foreground',
        summary && 'bg-foreground text-background hover:bg-foreground/90 hover:text-background',
      )}
      {...props}
    >
      {summary ?? label}
      <ChevronDown className="size-3.5 opacity-60" aria-hidden />
    </Button>
  );
}

function priceLabel(min: number | null, max: number | null) {
  if (min == null && max == null) return null;
  const c = (n: number) => formatPrice(n, { compact: true });
  if (min != null && max != null) return `${c(min)} to ${c(max)}`;
  return min != null ? `From ${c(min)}` : `Up to ${c(max!)}`;
}

export function FilterBar({ filters, setFilters, countries, hasArea, onClearArea, ask, className, ref }: FilterBarProps) {
  // the box starts with the sentence that produced these filters (read on the home page), or the name searched for
  const [query, setQuery] = React.useState(ask?.text || filters.q);
  const describing = !!ask?.enabled;
  const [cityDraft, setCityDraft] = React.useState('');
  const active = countActiveFilters(filters);
  const countryById = React.useMemo(() => new Map(countries.map((c) => [c.id, c])), [countries]);

  const locationCount = filters.countries.length + filters.cities.length;
  const locationValue =
    locationCount === 0
      ? null
      : locationCount === 1
        ? (filters.cities[0] ?? countryById.get(filters.countries[0])?.name ?? '1 place')
        : `${locationCount} places`;
  const returnsValue = [
    filters.minYield != null ? `${filters.minYield}%+ yield` : null,
    filters.minScore != null ? `Score ${filters.minScore}+` : null,
  ]
    .filter(Boolean)
    .join(', ');
  const homeValue = [
    filters.type ? PROPERTY_TYPE_LABEL[filters.type] : null,
    filters.beds != null ? `${filters.beds}+ beds` : null,
  ]
    .filter(Boolean)
    .join(', ');
  const moreCount = filters.goals.length + filters.benefits.length;

  const toggleIn = <T,>(list: T[], item: T) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
  const addCity = () => {
    const name = cityDraft.trim();
    if (name && !filters.cities.some((c) => c.toLowerCase() === name.toLowerCase())) setFilters({ cities: [...filters.cities, name] });
    setCityDraft('');
  };

  const chips: { key: string; label: string; clear: () => void }[] = [
    ...filters.countries.map((id) => ({
      key: `country-${id}`,
      label: countryById.get(id)?.name ?? `Country ${id}`,
      clear: () => setFilters({ countries: filters.countries.filter((x) => x !== id) }),
    })),
    ...filters.cities.map((name) => ({ key: `city-${name}`, label: name, clear: () => setFilters({ cities: filters.cities.filter((x) => x !== name) }) })),
    ...(priceLabel(filters.minPrice, filters.maxPrice)
      ? [{ key: 'price', label: priceLabel(filters.minPrice, filters.maxPrice)!, clear: () => setFilters({ minPrice: null, maxPrice: null }) }]
      : []),
    ...(filters.minYield != null ? [{ key: 'yield', label: `${filters.minYield}%+ yield`, clear: () => setFilters({ minYield: null }) }] : []),
    ...(filters.minScore != null ? [{ key: 'score', label: `Score ${filters.minScore}+`, clear: () => setFilters({ minScore: null }) }] : []),
    ...(filters.type ? [{ key: 'type', label: PROPERTY_TYPE_LABEL[filters.type], clear: () => setFilters({ type: null }) }] : []),
    ...(filters.beds != null ? [{ key: 'beds', label: `${filters.beds}+ beds`, clear: () => setFilters({ beds: null }) }] : []),
    ...filters.goals.map((g) => ({ key: g, label: GOAL_LABEL[g], clear: () => setFilters({ goals: filters.goals.filter((x) => x !== g) }) })),
    ...filters.benefits.map((b) => ({ key: b, label: BENEFIT_LABEL[b], clear: () => setFilters({ benefits: filters.benefits.filter((x) => x !== b) }) })),
    ...(hasArea ? [{ key: 'area', label: 'Map area', clear: onClearArea }] : []),
  ];

  return (
    <div ref={ref} className={cn('pointer-events-none flex flex-col gap-2', className)}>
      <div className="glass shadow-float pointer-events-auto flex h-12 items-center gap-1 rounded-full pr-1.5 pl-1.5">
        <form
          role="search"
          className={cn('relative min-w-36 flex-1', describing ? 'sm:max-w-80' : 'sm:max-w-64')}
          onSubmit={(e) => {
            e.preventDefault();
            if (ask) void ask.submit(query);
            else setFilters({ q: query.trim() });
          }}
        >
          {ask?.busy ? (
            <Spinner aria-label="Reading your description" className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
          ) : describing ? (
            <Sparkles className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          ) : (
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          )}
          <Input
            type="search"
            value={query}
            maxLength={MAX_CHARS}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value === '') {
                if (filters.q) setFilters({ q: '' });
                ask?.dismiss();
              }
            }}
            placeholder={describing ? 'Describe what you’re looking for' : 'Search by name or country'}
            aria-label={describing ? 'Describe the property you are looking for, in your own words' : 'Search properties by name or country'}
            className="h-9 rounded-full border-transparent bg-transparent pl-9 shadow-none dark:bg-transparent"
          />
        </form>

        <div className="scrollbar-none flex items-center gap-1 overflow-x-auto">
          <span className="mx-1 hidden h-5 w-px shrink-0 bg-border sm:block" aria-hidden />

          <Popover>
            <PopoverTrigger asChild>
              <FilterTrigger label="Location" summary={locationValue} />
            </PopoverTrigger>
            <PopoverContent align="start" className="w-80 p-0">
              <Command>
                <CommandInput placeholder="Find a country" />
                <CommandList className="max-h-64">
                  <CommandEmpty>No country with that name.</CommandEmpty>
                  <CommandGroup>
                    {countries.map((c) => {
                      const on = filters.countries.includes(c.id);
                      return (
                        <CommandItem key={c.id} value={c.name} onSelect={() => setFilters({ countries: toggleIn(filters.countries, c.id) })}>
                          <span aria-hidden className="w-6 text-base leading-none">
                            {flagEmoji(c.code)}
                          </span>
                          {c.name}
                          <Check className={cn('ml-auto size-4', on ? 'opacity-100' : 'opacity-0')} aria-hidden />
                          {on && <span className="sr-only">selected</span>}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
              <div className="border-t p-3">
                <Label htmlFor="city-filter" className="mb-1.5 text-xs text-muted-foreground">
                  Limit to cities
                </Label>
                <form
                  className="flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    addCity();
                  }}
                >
                  <div className="relative flex-1">
                    <MapPin className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                    <Input id="city-filter" value={cityDraft} onChange={(e) => setCityDraft(e.target.value)} placeholder="Lisbon" className="h-9 pl-8" />
                  </div>
                  <Button type="submit" variant="secondary" className="h-9" disabled={!cityDraft.trim()}>
                    Add city
                  </Button>
                </form>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <FilterTrigger label="Price" summary={priceLabel(filters.minPrice, filters.maxPrice)} />
            </PopoverTrigger>
            <PopoverContent align="start" className="w-80">
              <PriceRange
                min={filters.minPrice}
                max={filters.maxPrice}
                onCommit={(min, max) => setFilters({ minPrice: min, maxPrice: max })}
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <FilterTrigger label="Returns" summary={returnsValue || null} />
            </PopoverTrigger>
            <PopoverContent align="start" className="w-80 space-y-6">
              <SingleSlider
                label="Minimum gross yield"
                value={filters.minYield ?? 0}
                max={12}
                step={0.5}
                format={(v) => (v === 0 ? 'Any' : `${v}%`)}
                onCommit={(v) => setFilters({ minYield: v === 0 ? null : v })}
              />
              <SingleSlider
                label="Minimum investment score"
                value={filters.minScore ?? 0}
                max={95}
                step={5}
                format={(v) => (v === 0 ? 'Any' : `${v} / 100`)}
                onCommit={(v) => setFilters({ minScore: v === 0 ? null : v })}
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <FilterTrigger label="Home" summary={homeValue || null} />
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[22rem] space-y-5">
              <div className="space-y-2">
                <Label id="type-label">Property type</Label>
                <ToggleGroup
                  type="single"
                  variant="outline"
                  spacing={2}
                  aria-labelledby="type-label"
                  className="flex-wrap"
                  value={filters.type ?? ''}
                  onValueChange={(v) => setFilters({ type: (v || null) as PropertyType | null })}
                >
                  {PROPERTY_TYPES.map((t) => (
                    <ToggleGroupItem key={t} value={t} className="rounded-full px-3">
                      {PROPERTY_TYPE_LABEL[t]}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
              <div className="space-y-2">
                <Label id="beds-label">Bedrooms, at least</Label>
                <ToggleGroup
                  type="single"
                  variant="outline"
                  spacing={2}
                  aria-labelledby="beds-label"
                  value={filters.beds != null ? String(filters.beds) : ''}
                  onValueChange={(v) => setFilters({ beds: v ? Number(v) : null })}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <ToggleGroupItem key={n} value={String(n)} className="tabular size-9 rounded-full">
                      {n}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            </PopoverContent>
          </Popover>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  'h-9 shrink-0 gap-1.5 rounded-full px-3.5 text-sm font-normal text-foreground/80 hover:text-foreground',
                  moreCount > 0 && 'bg-foreground text-background hover:bg-foreground/90 hover:text-background',
                )}
              >
                <SlidersHorizontal className="size-3.5" aria-hidden />
                More filters
                {moreCount > 0 && <span className="tabular">({moreCount})</span>}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full gap-0 sm:max-w-md">
              <SheetHeader>
                <SheetTitle>More filters</SheetTitle>
                <SheetDescription>Show properties that fit an investment goal or a location benefit. Any selected tag counts as a match.</SheetDescription>
              </SheetHeader>
              <div className="flex-1 space-y-7 overflow-y-auto px-4 pb-4">
                <TagGroup
                  title="Investment goal"
                  options={INVESTMENT_GOAL_TAGS}
                  labels={GOAL_LABEL}
                  selected={filters.goals}
                  onToggle={(g) => setFilters({ goals: toggleIn(filters.goals, g) })}
                />
                <TagGroup
                  title="Location benefit"
                  options={LOCATION_BENEFIT_TAGS}
                  labels={BENEFIT_LABEL}
                  selected={filters.benefits}
                  onToggle={(b) => setFilters({ benefits: toggleIn(filters.benefits, b) })}
                />
              </div>
              <SheetFooter className="border-t">
                <Button variant="outline" disabled={moreCount === 0} onClick={() => setFilters({ goals: [], benefits: [] })}>
                  Clear these tags
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {chips.length > 0 && (
        <ul aria-label="Active filters" className="scrollbar-none pointer-events-auto flex items-center gap-1.5 overflow-x-auto px-1.5">
          {chips.map((chip) => (
            <li key={chip.key} className="shrink-0">
              <Badge variant="secondary" className="glass h-7 gap-1 rounded-full pr-1 pl-2.5 text-xs font-normal">
                {chip.label}
                <button
                  type="button"
                  onClick={chip.clear}
                  aria-label={`Remove filter: ${chip.label}`}
                  className="flex size-5 items-center justify-center rounded-full hover:bg-foreground/10"
                >
                  <X className="size-3" aria-hidden />
                </button>
              </Badge>
            </li>
          ))}
          {active + (hasArea ? 1 : 0) > 1 && (
            <li className="shrink-0">
              <Button
                variant="link"
                size="sm"
                className="h-7 px-2 text-xs text-foreground"
                onClick={() => {
                  setFilters(null);
                  setQuery('');
                  onClearArea();
                }}
              >
                Clear all filters
              </Button>
            </li>
          )}
        </ul>
      )}

      {ask?.note && <AskNoteLine ask={ask} />}
    </div>
  );
}

/** What was made of the last description: said in words, because the filters were set by software, not by the person. */
function AskNoteLine({ ask }: { ask: AskSearch }) {
  const note = ask.note;
  if (!note) return null;
  const quoted = (phrases: string[]) => phrases.map((p) => `“${p}”`).join(', ');
  return (
    <div
      role="status"
      className="glass shadow-float pointer-events-auto flex max-w-full items-start gap-2 self-start rounded-2xl py-1.5 pr-1.5 pl-3 text-xs"
    >
      <Sparkles className="mt-[5px] size-3.5 shrink-0 text-muted-foreground" aria-hidden />
      <div className="flex min-h-6 min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1.5">
      {note.kind === 'applied' && (
        <p>
          Filters set automatically from your description.
          {note.unparsed.length > 0 ? <span className="text-muted-foreground"> No filter for {quoted(note.unparsed)}.</span> : ' Remove any that are wrong.'}
          {note.currency && note.currency !== 'USD' && (
            <span className="text-muted-foreground"> Prices here are in US dollars: your amount in {note.currency} was used as written, not converted.</span>
          )}
        </p>
      )}
      {note.kind === 'names' && <p>No filters found in that, so listings were searched by name.</p>}
      {note.kind === 'suggest' && (
        <>
          <p>Did you mean</p>
          <ul aria-label="Suggested filters" className="flex flex-wrap items-center gap-1">
            {note.parsed.chips.map((chip) => (
              <li key={`${chip.field}-${chip.value}`}>
                <Badge variant="outline" className="h-6 rounded-full px-2 text-xs font-normal">
                  {chip.label}
                </Badge>
              </li>
            ))}
          </ul>
          <Button size="sm" className="h-7 rounded-full px-3 text-xs" onClick={() => ask.accept(note.parsed)}>
            Use these filters
          </Button>
          <Button size="sm" variant="ghost" className="h-7 rounded-full px-3 text-xs" onClick={ask.searchNames}>
            Search names instead
          </Button>
        </>
      )}
      </div>
      <button
        type="button"
        onClick={ask.dismiss}
        aria-label="Dismiss"
        className="flex size-6 shrink-0 items-center justify-center rounded-full hover:bg-foreground/10"
      >
        <X className="size-3" aria-hidden />
      </button>
    </div>
  );
}

function PriceRange({ min, max, onCommit }: { min: number | null; max: number | null; onCommit: (min: number | null, max: number | null) => void }) {
  const [value, setValue] = React.useState<[number, number]>([min ?? 0, max ?? PRICE_MAX]);
  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <Label id="price-label">Price</Label>
        <span className="tabular text-sm text-muted-foreground">
          {formatPrice(value[0], { compact: true })} to {value[1] >= PRICE_MAX ? 'any' : formatPrice(value[1], { compact: true })}
        </span>
      </div>
      <Slider
        aria-labelledby="price-label"
        min={0}
        max={PRICE_MAX}
        step={PRICE_STEP}
        minStepsBetweenThumbs={1}
        value={value}
        onValueChange={(v) => setValue([v[0], v[1]])}
        onValueCommit={(v) => onCommit(v[0] > 0 ? v[0] : null, v[1] < PRICE_MAX ? v[1] : null)}
      />
      <p className="text-xs text-muted-foreground">Prices are shown in US dollars.</p>
    </div>
  );
}

function SingleSlider({
  label,
  value,
  max,
  step,
  format,
  onCommit,
}: {
  label: string;
  value: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onCommit: (v: number) => void;
}) {
  const [v, setV] = React.useState(value);
  const id = React.useId();
  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <Label id={id}>{label}</Label>
        <span className="tabular text-sm text-muted-foreground">{format(v)}</span>
      </div>
      <Slider aria-labelledby={id} min={0} max={max} step={step} value={[v]} onValueChange={(x) => setV(x[0])} onValueCommit={(x) => onCommit(x[0])} />
    </div>
  );
}

function TagGroup<T extends string>({
  title,
  options,
  labels,
  selected,
  onToggle,
}: {
  title: string;
  options: readonly T[];
  labels: Record<T, string>;
  selected: T[];
  onToggle: (tag: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-medium">{title}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((tag) => {
          const on = selected.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              aria-pressed={on}
              onClick={() => onToggle(tag)}
              className={cn(
                'h-8 rounded-full border px-3 text-sm transition-colors',
                on ? 'border-foreground bg-foreground text-background' : 'border-border hover:bg-accent',
              )}
            >
              {labels[tag]}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
