'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import { SearchX, WifiOff } from 'lucide-react';
import * as React from 'react';
import { ListingFacts, ListingImage, ListingPlace, ScoreRing } from './listing-parts';
import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { SORTS, SORT_LABEL, type SortKey } from '@/lib/properties/filters';
import { formatPrice, formatYield } from '@/lib/properties/format';
import type { Listing } from '@/lib/properties/types';
import { cn } from '@/lib/utils';

const ROW = 116;

interface ResultsPanelProps {
  listings: Listing[];
  /** Matches in total; `listings` may hold only the pages loaded so far */
  total: number;
  hasMore: boolean;
  onLoadMore: () => void;
  isFetchingMore: boolean;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  sort: SortKey;
  onSort: (sort: SortKey) => void;
  hoveredId: string | null;
  selectedId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  hasFilters: boolean;
  onClearFilters: () => void;
  onZoomOut: () => void;
  onRetry: () => void;
  /** Hovering a pin scrolls its card into view; off on touch layouts where the sheet may be collapsed. */
  followHover?: boolean;
  className?: string;
}

export function ResultsPanel({
  listings,
  total,
  hasMore,
  onLoadMore,
  isFetchingMore,
  isLoading,
  isFetching,
  isError,
  sort,
  onSort,
  hoveredId,
  selectedId,
  onHover,
  onSelect,
  hasFilters,
  onClearFilters,
  onZoomOut,
  onRetry,
  followHover = true,
  className,
}: ResultsPanelProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Virtual manages its own subscriptions
  const virtualizer = useVirtualizer({
    count: listings.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW,
    overscan: 6,
    // a size to plan with before the list is measured, so the first rows are in the server-rendered HTML
    initialRect: { width: 392, height: 720 },
    getItemKey: (i) => listings[i].id,
  });

  // Keep the card for the pin under the cursor (or the selected one) in view.
  const hoverFromList = React.useRef(false);
  const focusId = (followHover && !hoverFromList.current ? hoveredId : null) ?? selectedId;
  React.useEffect(() => {
    if (!focusId) return;
    const index = listings.findIndex((l) => l.id === focusId);
    if (index >= 0) virtualizer.scrollToIndex(index, { align: 'auto' });
    // only when the focused listing changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusId]);

  // Ask for the next page shortly before the reader reaches the end of what is loaded.
  const rows = virtualizer.getVirtualItems();
  const lastVisible = rows.length ? rows[rows.length - 1].index : -1;
  React.useEffect(() => {
    if (hasMore && lastVisible >= listings.length - 8) onLoadMore();
  }, [hasMore, lastVisible, listings.length, onLoadMore]);

  const count = total;
  return (
    <section aria-label="Search results" className={cn('flex min-h-0 flex-col', className)}>
      <header className="flex items-center justify-between gap-3 px-4 pt-3 pb-2">
        <h1 className="text-sm" aria-live="polite">
          {isLoading ? (
            <Skeleton className="h-4 w-28" />
          ) : (
            <>
              <span className="tabular font-semibold">{count.toLocaleString('en')}</span>{' '}
              <span className="text-muted-foreground">{count === 1 ? 'property' : 'properties'}</span>
            </>
          )}
        </h1>
        <Select value={sort} onValueChange={(v) => onSort(v as SortKey)}>
          <SelectTrigger size="sm" aria-label="Sort results" className="h-8 rounded-full border-transparent bg-transparent text-sm shadow-none dark:bg-transparent">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {SORTS.map((s) => (
              <SelectItem key={s} value={s}>
                {SORT_LABEL[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </header>

      <div
        ref={scrollRef}
        className={cn('min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-2 transition-opacity', isFetching && !isLoading && 'opacity-60')}
        onMouseLeave={() => {
          hoverFromList.current = false;
          onHover(null);
        }}
      >
        {isLoading ? (
          <ul aria-hidden>
            {Array.from({ length: 6 }, (_, i) => (
              <li key={i} className="flex gap-3 p-2" style={{ height: ROW }}>
                <Skeleton className="size-[100px] shrink-0 rounded-lg" />
                <div className="flex-1 space-y-2.5 py-1">
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-5 w-2/5" />
                </div>
              </li>
            ))}
          </ul>
        ) : isError ? (
          <Empty className="h-full">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <WifiOff />
              </EmptyMedia>
              <EmptyTitle>Properties did not load</EmptyTitle>
              <EmptyDescription>The server did not answer. Check your connection and load the results again.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button onClick={onRetry}>Load results again</Button>
            </EmptyContent>
          </Empty>
        ) : listings.length === 0 ? (
          <Empty className="h-full">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SearchX />
              </EmptyMedia>
              <EmptyTitle>No properties match</EmptyTitle>
              <EmptyDescription>
                {hasFilters ? 'Loosen a filter or look at a wider part of the map.' : 'Nothing is listed in this part of the map yet. Zoom out to see every market.'}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="flex-row justify-center">
              {hasFilters && <Button onClick={onClearFilters}>Clear filters</Button>}
              <Button variant="outline" onClick={onZoomOut}>
                Zoom out
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <ul className="relative" style={{ height: virtualizer.getTotalSize() }}>
            {rows.map((row) => {
              const l = listings[row.index];
              const active = l.id === selectedId || l.id === hoveredId;
              return (
                <li key={row.key} className="absolute inset-x-0 top-0" style={{ height: ROW, transform: `translateY(${row.start}px)` }}>
                  <button
                    type="button"
                    aria-current={l.id === selectedId ? 'true' : undefined}
                    onClick={() => onSelect(l.id)}
                    onMouseEnter={() => {
                      hoverFromList.current = true;
                      onHover(l.id);
                    }}
                    onFocus={() => {
                      hoverFromList.current = true;
                      onHover(l.id);
                    }}
                    className={cn(
                      'flex h-[108px] w-full gap-3 rounded-lg p-2 text-left transition-colors focus-visible:outline-offset-[-2px]',
                      active ? 'bg-accent' : 'hover:bg-accent/60',
                      l.id === selectedId && 'ring-1 ring-beacon',
                    )}
                  >
                    {/* the first rows are on screen at once: their photos should not wait to be scrolled into view */}
                    <ListingImage listing={l} sizes="92px" className="size-[92px] shrink-0 rounded-md" priority={row.index < 3} />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-medium">{l.title}</span>
                      <ListingPlace listing={l} className="text-xs" />
                      <span className="mt-auto flex items-end justify-between gap-2">
                        <span className="min-w-0">
                          <span className="tabular block text-base leading-tight font-semibold">{formatPrice(l.price)}</span>
                          <ListingFacts listing={l} className="mt-1 text-xs" />
                        </span>
                        <span className="flex shrink-0 items-center gap-2">
                          <span className="text-right leading-tight">
                            <span className="tabular block text-sm font-semibold text-positive">{formatYield(l.yieldPct)}</span>
                            <span className="block text-[11px] text-muted-foreground">yield</span>
                          </span>
                          <ScoreRing score={l.score} />
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
