'use client';

import { AnimatePresence } from 'motion/react';
import { useTheme } from 'next-themes';
import { Dialog } from 'radix-ui';
import * as React from 'react';
import { Drawer as Vaul } from 'vaul';
import { FilterBar } from './filter-bar';
import { PreviewCard } from './preview-card';
import { ResultsPanel } from './results-panel';
import { PropertyGlobe, type Bounds, type PropertyGlobeHandle } from '@/components/globe';
import { SiteHeader } from '@/components/site/site-header';
import { Button } from '@/components/ui/button';
import { LOW_CONFIDENCE, peekHandoff } from '@/lib/ai/search';
import { useAskSearch } from '@/lib/ai/use-ask-search';
import { countActiveFilters, useSearchFilters, useSelection } from '@/lib/properties/filters';
import { useListingsByIds, usePropertySearch } from '@/lib/properties/queries';
import { cn } from '@/lib/utils';

const RAIL_WIDTH = 392;
const SNAP_PEEK = '132px';
const SNAPS: (string | number)[] = [SNAP_PEEK, 0.55, 0.92];
const NO_IDS: string[] = [];

function useIsDesktop() {
  return React.useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia('(min-width: 1024px)');
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    () => window.matchMedia('(min-width: 1024px)').matches,
    () => true,
  );
}

const noSubscription = () => () => {};

/** Where to look to see all of these pins: their middle, and a zoom that fits their spread. */
function viewOf(pins: { lat: number | null; lng: number | null }[]) {
  const placed = pins.filter((p): p is { lat: number; lng: number } => p.lat != null && p.lng != null);
  if (placed.length === 0) return null;
  const lats = placed.map((p) => p.lat);
  const lngs = placed.map((p) => p.lng);
  const [south, north, west, east] = [Math.min(...lats), Math.max(...lats), Math.min(...lngs), Math.max(...lngs)];
  const spread = Math.max(east - west, (north - south) * 2, 0.02);
  // never closer than a city and its surroundings: a single match should still show where in the country it is
  return { lng: (west + east) / 2, lat: (south + north) / 2, zoom: Math.min(8, Math.max(1.6, Math.log2(360 / spread) - 0.4)) };
}

/** Height of an element, kept current. `fallback` is used on the server and until the element is measured. */
function useHeight(ref: React.RefObject<HTMLElement | null>, fallback: number) {
  const [height, setHeight] = React.useState<number | null>(null);
  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(() => setHeight(element.offsetHeight));
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
  return height ?? fallback;
}

/** False in the server-rendered HTML and until the page has hydrated. */
const useHydrated = () => React.useSyncExternalStore(noSubscription, () => true, () => false);

export function PropertiesView() {
  const hydrated = useHydrated();
  const [filters, setFilters] = useSearchFilters();
  const [{ selected, area }, setSelection] = useSelection();
  const { listings, pins, total, hasMore, loadMore, isFetchingMore, countries, isLoading, isFetching, isFetchingPins, isError, refetch } = usePropertySearch(filters, { area });
  const { resolvedTheme } = useTheme();
  const isDesktop = useIsDesktop();

  const globe = React.useRef<PropertyGlobeHandle>(null);
  const [hovered, setHovered] = React.useState<string | null>(null);
  const [pendingArea, setPendingArea] = React.useState<Bounds | null>(null);
  const [snap, setSnap] = React.useState<string | number | null>(SNAP_PEEK);

  // The selected listing may sit on a page that is not loaded (opened from a shared link, or picked on the map).
  const loaded = React.useMemo(() => (selected ? listings.find((l) => l.id === selected) : undefined), [listings, selected]);
  const { listings: fetched } = useListingsByIds(selected && !loaded ? [selected] : NO_IDS);
  const selectedListing = loaded ?? fetched[0];

  const select = React.useCallback(
    (id: string | null) => {
      void setSelection({ selected: id });
      if (id) setSnap(SNAP_PEEK);
    },
    [setSelection],
  );
  const clearArea = React.useCallback(() => {
    void setSelection({ area: null });
    setPendingArea(null);
  }, [setSelection]);

  // Search by description. Once its filters have brought new results, the globe turns to them.
  // (also on arrival from the home page, when its search box has already put a description's filters in the URL)
  const turnToResults = React.useRef((peekHandoff()?.parsed.confidence ?? 0) >= LOW_CONFIDENCE);
  const applyFilters = React.useCallback((patch: Parameters<typeof setFilters>[0]) => void setFilters(patch), [setFilters]);
  const ask = useAskSearch(
    filters,
    applyFilters,
    React.useCallback(() => {
      turnToResults.current = true;
      clearArea();
    }, [clearArea]),
  );
  React.useEffect(() => {
    if (!turnToResults.current || isFetchingPins) return;
    const view = viewOf(pins);
    if (!view) {
      turnToResults.current = false;
      return;
    }
    // on arrival from the home page the map may still be loading: wait for it, for a while
    let timer: ReturnType<typeof setTimeout> | undefined;
    let tries = 0;
    const turn = () => {
      if (globe.current?.getBounds()) {
        turnToResults.current = false;
        globe.current.flyTo(view.lng, view.lat, view.zoom);
      } else if (++tries < 60) {
        timer = setTimeout(turn, 250);
      }
    };
    turn();
    return () => clearTimeout(timer);
  }, [pins, isFetchingPins]);

  const hasChips = countActiveFilters(filters) > 0 || !!area;
  // the rail starts under the filter bar, however many rows the bar has (chips, the note about a description)
  const bar = React.useRef<HTMLDivElement>(null);
  const barHeight = useHeight(bar, hasChips ? 84 : 48);
  const hasFilters = hasChips || !!filters.q;
  const results = (
    <ResultsPanel
      listings={listings}
      total={total}
      hasMore={hasMore}
      onLoadMore={loadMore}
      isFetchingMore={isFetchingMore}
      isLoading={isLoading}
      isFetching={isFetching}
      isError={isError}
      sort={filters.sort}
      onSort={(sort) => void setFilters({ sort })}
      hoveredId={hovered}
      selectedId={selected}
      onHover={setHovered}
      onSelect={select}
      hasFilters={hasFilters}
      onClearFilters={() => {
        void setFilters(null);
        clearArea();
      }}
      onZoomOut={() => {
        clearArea();
        globe.current?.zoomOut();
      }}
      onRetry={() => void refetch()}
      followHover={isDesktop}
      className="h-full"
    />
  );

  return (
    <div className="fixed inset-0 overflow-hidden">
      <SiteHeader variant="overlay" />

      <main className="absolute inset-0">
        <h1 className="sr-only">Find investment properties on the globe</h1>
        <PropertyGlobe
          ref={globe}
          listings={pins}
          theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
          hoveredId={hovered}
          selectedId={selected}
          onHover={setHovered}
          onSelect={select}
          onUserMove={(bounds, zoom) => setPendingArea(zoom >= 2.5 ? bounds : null)}
          padding={isDesktop ? { left: RAIL_WIDTH + 20, top: 130 } : { top: 120, bottom: selectedListing ? 560 : 132 }}
        />

        <FilterBar
          ref={bar}
          filters={filters}
          setFilters={applyFilters}
          countries={countries}
          hasArea={!!area}
          onClearArea={clearArea}
          ask={ask}
          className="absolute inset-x-3 top-[76px] z-30 sm:inset-x-5 sm:top-[84px] lg:max-w-[1040px]"
        />

        {pendingArea && (
          <div className="pointer-events-none absolute inset-x-0 top-[176px] z-20 flex justify-center lg:top-[148px] lg:pl-[412px]">
            <Button
              variant="secondary"
              className="glass shadow-float pointer-events-auto h-9 rounded-full px-4"
              onClick={() => {
                void setSelection({ area: pendingArea.map((n) => Math.round(n * 1000) / 1000) });
                setPendingArea(null);
              }}
            >
              Search this area
            </Button>
          </div>
        )}

        {/* The server cannot know the screen size, so its HTML carries both layouts and CSS shows the right one:
            the rail on wide screens, and on phones a fixed strip where the sheet will sit once the page hydrates. */}
        {!hydrated && (
          <div className="glass shadow-float fixed inset-x-0 bottom-0 z-40 overflow-hidden rounded-t-xl lg:hidden" style={{ height: SNAP_PEEK }}>
            <div aria-hidden className="mx-auto mt-2 h-[5px] w-12 rounded-full bg-foreground/25" />
            {/* only the top of the list shows in the strip: two rows are enough until the sheet replaces it */}
            {React.cloneElement(results, { listings: listings.slice(0, 2), hasMore: false })}
          </div>
        )}
        {isDesktop ? (
          <aside
            className={cn(
              'glass shadow-float absolute bottom-5 left-5 z-20 overflow-hidden rounded-xl transition-[top] duration-200',
              !hydrated && 'max-lg:hidden',
            )}
            style={{ width: RAIL_WIDTH, top: 100 + barHeight }}
          >
            {results}
          </aside>
        ) : (
          <Vaul.Root open modal={false} dismissible={false} snapPoints={SNAPS} activeSnapPoint={snap} setActiveSnapPoint={setSnap}>
            {/* Vaul 1.1.2 keeps `modal` to itself and never hands it to the Radix dialog it wraps, so that dialog stays modal:
                it marks the rest of the page aria-hidden and traps focus in the sheet. Vaul's content reads the nearest
                Radix dialog, so a non-modal one in between keeps the header, the filters and the map reachable. */}
            <Dialog.Root open modal={false}>
              <Vaul.Portal>
                <Vaul.Content
                  aria-describedby={undefined}
                  className="glass shadow-float fixed inset-x-0 bottom-0 z-40 flex h-full max-h-[92%] flex-col rounded-t-xl outline-none"
                >
                  <Vaul.Title className="sr-only">Search results</Vaul.Title>
                  <Vaul.Handle className="mt-2 !bg-foreground/25" />
                  {/* even a non-modal Radix dialog wraps Tab from its last control back to its first: keep Tab from
                      reaching that handler, so the keyboard walks out of the sheet like out of any other region */}
                  <div className="min-h-0 flex-1" onKeyDown={(e) => e.key === 'Tab' && e.stopPropagation()}>
                    {results}
                  </div>
                </Vaul.Content>
              </Vaul.Portal>
            </Dialog.Root>
          </Vaul.Root>
        )}

        <AnimatePresence>
          {selectedListing && (
            <PreviewCard
              key={selectedListing.id}
              listing={selectedListing}
              onClose={() => select(null)}
              className="absolute inset-x-3 bottom-[144px] z-50 lg:inset-x-auto lg:right-5 lg:bottom-9 lg:z-20 lg:w-[360px]"
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
