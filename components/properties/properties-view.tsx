'use client';

import { AnimatePresence } from 'motion/react';
import { useTheme } from 'next-themes';
import * as React from 'react';
import { Drawer as Vaul } from 'vaul';
import { FilterBar } from './filter-bar';
import { PreviewCard } from './preview-card';
import { ResultsPanel } from './results-panel';
import { PropertyGlobe, type Bounds, type PropertyGlobeHandle } from '@/components/globe';
import { SiteHeader } from '@/components/site/site-header';
import { Button } from '@/components/ui/button';
import { countActiveFilters, inArea, useSearchFilters, useSelection } from '@/lib/properties/filters';
import { usePropertySearch } from '@/lib/properties/queries';

const RAIL_WIDTH = 392;
const SNAP_PEEK = '132px';
const SNAPS: (string | number)[] = [SNAP_PEEK, 0.55, 0.92];

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

export function PropertiesView() {
  const [filters, setFilters] = useSearchFilters();
  const [{ selected, area }, setSelection] = useSelection();
  const { listings: all, countries, isLoading, isFetching, isError, refetch } = usePropertySearch(filters);
  const { resolvedTheme } = useTheme();
  const isDesktop = useIsDesktop();

  const globe = React.useRef<PropertyGlobeHandle>(null);
  const [hovered, setHovered] = React.useState<string | null>(null);
  const [pendingArea, setPendingArea] = React.useState<Bounds | null>(null);
  const [snap, setSnap] = React.useState<string | number | null>(SNAP_PEEK);

  const listings = React.useMemo(() => (area ? all.filter((l) => inArea(l.lat, l.lng, area)) : all), [all, area]);
  const selectedListing = React.useMemo(() => (selected ? all.find((l) => l.id === selected) : undefined), [all, selected]);

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

  const hasFilters = countActiveFilters(filters) > 0 || !!filters.q || !!area;
  const results = (
    <ResultsPanel
      listings={listings}
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
          listings={listings}
          theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
          hoveredId={hovered}
          selectedId={selected}
          onHover={setHovered}
          onSelect={select}
          onUserMove={(bounds, zoom) => setPendingArea(zoom >= 2.5 ? bounds : null)}
          padding={isDesktop ? { left: RAIL_WIDTH + 20, top: 130 } : { top: 120, bottom: selectedListing ? 560 : 132 }}
        />

        <FilterBar
          filters={filters}
          setFilters={(patch) => void setFilters(patch)}
          countries={countries}
          hasArea={!!area}
          onClearArea={clearArea}
          className="absolute inset-x-3 top-[76px] z-30 sm:inset-x-5 sm:top-[84px] lg:max-w-[1040px]"
        />

        {pendingArea && (
          <div className="pointer-events-none absolute inset-x-0 top-[176px] z-20 flex justify-center lg:top-[192px] lg:pl-[412px]">
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

        {isDesktop ? (
          <aside className="glass shadow-float absolute top-[192px] bottom-5 left-5 z-20 overflow-hidden rounded-xl" style={{ width: RAIL_WIDTH }}>
            {results}
          </aside>
        ) : (
          <Vaul.Root open modal={false} dismissible={false} snapPoints={SNAPS} activeSnapPoint={snap} setActiveSnapPoint={setSnap}>
            <Vaul.Portal>
              <Vaul.Content
                aria-describedby={undefined}
                className="glass shadow-float fixed inset-x-0 bottom-0 z-40 flex h-full max-h-[92%] flex-col rounded-t-xl outline-none"
              >
                <Vaul.Title className="sr-only">Search results</Vaul.Title>
                <Vaul.Handle className="mt-2 !bg-foreground/25" />
                <div className="min-h-0 flex-1">{results}</div>
              </Vaul.Content>
            </Vaul.Portal>
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
