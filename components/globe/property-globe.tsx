'use client';

import maplibregl, { type GeoJSONSource, type MapGeoJSONFeature, type MapMouseEvent } from 'maplibre-gl';
import * as React from 'react';
import { LAYER, MAP_PALETTE, SOURCE, buildStyle, type MapTheme } from '@/lib/map/style';
import type { Listing } from '@/lib/properties/types';
import { cn } from '@/lib/utils';

export type Bounds = [west: number, south: number, east: number, north: number];

export interface PropertyGlobeHandle {
  flyTo: (lng: number, lat: number, zoom?: number) => void;
  zoomOut: () => void;
  getBounds: () => Bounds | null;
}

export interface PropertyGlobeProps {
  listings: Listing[];
  theme: MapTheme;
  hoveredId?: string | null;
  selectedId?: string | null;
  onHover?: (id: string | null) => void;
  onSelect?: (id: string | null) => void;
  /** Fires after the user pans or zooms (not after programmatic moves or auto-rotation). */
  onUserMove?: (bounds: Bounds, zoom: number) => void;
  /** Screen area covered by floating panels, so the globe centres in what is actually visible. */
  padding?: { top?: number; right?: number; bottom?: number; left?: number };
  /** `false` turns the globe into a backdrop: no pin interaction, no scroll zoom. */
  interactive?: boolean;
  initialView?: { center: [number, number]; zoom: number };
  className?: string;
  ref?: React.Ref<PropertyGlobeHandle>;
}

const IDLE_BEFORE_SPIN_MS = 8000;
const SPIN_DEG_PER_SEC = 2.4;
const SPIN_MAX_ZOOM = 3.2;
const SWITCH_ON_MS = 1700;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function toFeatureCollection(listings: Listing[]): GeoJSON.FeatureCollection<GeoJSON.Point> {
  return {
    type: 'FeatureCollection',
    features: listings
      .filter((l) => l.lat != null && l.lng != null)
      .map((l, i) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [l.lng as number, l.lat as number] },
        // `d` staggers the first-load "lights switching on" moment
        properties: { id: l.id, d: ((i * 7919) % 1000) / 1000 },
      })),
  };
}

/**
 * The one map engine: a spinning planet when zoomed out, a street map when zoomed in.
 * Loaded lazily through `components/globe` so maplibre-gl stays out of every other route's bundle.
 */
export default function PropertyGlobe({
  listings,
  theme,
  hoveredId,
  selectedId,
  onHover,
  onSelect,
  onUserMove,
  padding,
  interactive = true,
  initialView,
  className,
  ref,
}: PropertyGlobeProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<maplibregl.Map | null>(null);
  const [ready, setReady] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  // Latest props for the long-lived map event handlers.
  const latest = React.useRef({ listings, onHover, onSelect, onUserMove, theme });
  React.useEffect(() => {
    latest.current = { listings, onHover, onSelect, onUserMove, theme };
  });
  const lastInteraction = React.useRef(0);
  const litUp = React.useRef(false);

  // ── create / destroy ────────────────────────────────────────────────────────
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let map: maplibregl.Map;
    try {
      map = new maplibregl.Map({
        container,
        style: buildStyle(latest.current.theme),
        center: initialView?.center ?? [18, 28],
        zoom: initialView?.zoom ?? (container.clientWidth < 640 ? 1 : 2),
        minZoom: 0.4,
        maxZoom: 18,
        attributionControl: false,
        dragRotate: false,
        pitchWithRotate: false,
        touchPitch: false,
        renderWorldCopies: false,
        fadeDuration: 150,
        interactive,
      });
    } catch {
      // No WebGL (old device, blocked GPU): the list still works without the map.
      queueMicrotask(() => setFailed(true));
      return;
    }
    mapRef.current = map;
    if (process.env.NODE_ENV !== 'production') (window as unknown as { __globe?: maplibregl.Map }).__globe = map;
    map.touchZoomRotate.disableRotation();
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
    if (!interactive) map.scrollZoom.disable();

    const touch = () => {
      lastInteraction.current = performance.now();
    };
    for (const ev of ['mousedown', 'touchstart', 'wheel', 'dragstart', 'zoomstart'] as const) map.on(ev, touch);
    container.addEventListener('keydown', touch);
    container.addEventListener('pointerenter', touch);

    map.on('load', () => setReady(true));
    map.on('error', (e) => {
      // Tile or glyph hiccups are not fatal: the bundled country layer keeps the globe usable.
      if (process.env.NODE_ENV !== 'production') console.warn('[globe]', e.error?.message ?? e);
    });

    map.on('moveend', (e) => {
      // `originalEvent` is only set for moves the user made with pointer, wheel or keyboard.
      if (!(e as { originalEvent?: unknown }).originalEvent) return;
      const b = map.getBounds();
      latest.current.onUserMove?.([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()], map.getZoom());
    });

    if (interactive) {
      const pinLayers = [LAYER.pin, LAYER.cluster];
      const featureAt = (e: MapMouseEvent): MapGeoJSONFeature | undefined =>
        map.queryRenderedFeatures(
          [
            [e.point.x - 6, e.point.y - 6],
            [e.point.x + 6, e.point.y + 6],
          ],
          { layers: pinLayers.filter((id) => map.getLayer(id)) },
        )[0];

      let hovered: string | null = null;
      map.on('mousemove', (e) => {
        const f = featureAt(e);
        map.getCanvas().style.cursor = f ? 'pointer' : '';
        const id = f && !f.properties.cluster ? String(f.properties.id) : null;
        if (id !== hovered) {
          hovered = id;
          latest.current.onHover?.(id);
        }
      });
      map.on('mouseout', () => {
        if (hovered) {
          hovered = null;
          latest.current.onHover?.(null);
        }
      });
      map.on('click', async (e) => {
        const f = featureAt(e);
        if (!f) return latest.current.onSelect?.(null);
        const [lng, lat] = (f.geometry as GeoJSON.Point).coordinates as [number, number];
        if (f.properties.cluster) {
          const source = map.getSource<GeoJSONSource>(SOURCE.listings);
          const zoom = await source?.getClusterExpansionZoom(f.properties.cluster_id).catch(() => null);
          map.easeTo({ center: [lng, lat], zoom: Math.min((zoom ?? map.getZoom() + 2) + 0.4, 15), duration: 700 });
          return;
        }
        latest.current.onSelect?.(String(f.properties.id));
      });
    }

    // Slow rotation while nobody is touching the globe.
    let raf = 0;
    let prev = performance.now();
    const reduced = prefersReducedMotion();
    const spin = (now: number) => {
      raf = requestAnimationFrame(spin);
      const dt = Math.min(now - prev, 100);
      prev = now;
      if (reduced || document.hidden) return;
      if (now - lastInteraction.current < IDLE_BEFORE_SPIN_MS && lastInteraction.current !== 0) return;
      if (map.getZoom() > SPIN_MAX_ZOOM || map.isMoving()) return;
      const c = map.getCenter();
      map.jumpTo({ center: [c.lng + (SPIN_DEG_PER_SEC * dt) / 1000, c.lat] });
    };
    raf = requestAnimationFrame(spin);

    const resize = new ResizeObserver(() => map.resize());
    resize.observe(container);

    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      container.removeEventListener('keydown', touch);
      container.removeEventListener('pointerenter', touch);
      mapRef.current = null;
      map.remove();
    };
    // The map is created once; later prop changes are applied by the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── data → sources ──────────────────────────────────────────────────────────
  const collection = React.useMemo(() => toFeatureCollection(listings), [listings]);
  const matchCodes = React.useMemo(
    () => Array.from(new Set(listings.map((l) => l.countryCode).filter((c): c is string => !!c))).sort(),
    [listings],
  );
  const activeListing = React.useMemo(() => {
    const id = hoveredId ?? selectedId;
    return id ? listings.find((l) => l.id === id && l.lat != null && l.lng != null) : undefined;
  }, [hoveredId, selectedId, listings]);

  const syncData = React.useCallback(() => {
    const map = mapRef.current;
    // Sources are missing only while a theme switch swaps the style; `style.load` calls this again.
    if (!map || !map.getSource(SOURCE.listings)) return;
    map.getSource<GeoJSONSource>(SOURCE.listings)?.setData(collection);
    map.getSource<GeoJSONSource>(SOURCE.active)?.setData({
      type: 'FeatureCollection',
      features: activeListing
        ? [{ type: 'Feature', geometry: { type: 'Point', coordinates: [activeListing.lng!, activeListing.lat!] }, properties: {} }]
        : [],
    });
    if (map.getLayer(LAYER.matchFill)) map.setFilter(LAYER.matchFill, ['in', ['get', 'code'], ['literal', matchCodes]]);
  }, [collection, activeListing, matchCodes]);

  React.useEffect(() => {
    if (ready) syncData();
  }, [ready, syncData]);

  // ── theme ───────────────────────────────────────────────────────────────────
  const appliedTheme = React.useRef(theme);
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || appliedTheme.current === theme) return;
    appliedTheme.current = theme;
    // setStyle diffs in place (no `style.load`) and resets the GeoJSON sources to the empty data in the style,
    // so put the pins back straight away; `styledata` covers the fallback where MapLibre reloads the whole style.
    map.setStyle(buildStyle(theme));
    syncData();
    map.once('styledata', syncData);
  }, [theme, ready, syncData]);

  // ── first load: pins switch on like city lights at dusk ─────────────────────
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || litUp.current || collection.features.length === 0) return;
    litUp.current = true;
    if (prefersReducedMotion()) return;
    const targets: [string, 'circle-opacity', number][] = [
      [LAYER.pin, 'circle-opacity', 1],
      [LAYER.pinGlow, 'circle-opacity', theme === 'dark' ? 0.55 : 0.4],
      [LAYER.cluster, 'circle-opacity', 1],
    ];
    const start = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const t = Math.min((now - start) / SWITCH_ON_MS, 1);
      for (const [layer, prop, full] of targets) {
        if (!map.getLayer(layer)) continue;
        // each point has its own delay `d` (0..1); it ramps up over the last 30% of the timeline
        map.setPaintProperty(
          layer,
          prop,
          t >= 1 ? full : ['*', full, ['max', 0, ['min', 1, ['/', ['-', t * 1.3, ['coalesce', ['get', 'd'], 0.5]], 0.3]]]],
        );
      }
      if (map.getLayer(LAYER.clusterCount)) map.setPaintProperty(LAYER.clusterCount, 'text-opacity', t >= 1 ? 1 : Math.max(0, t * 2 - 1));
      if (t < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
    // runs once, the first time there is something to light up
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, collection]);

  // ── pulse on the hovered / selected pin ─────────────────────────────────────
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || !activeListing || prefersReducedMotion()) return;
    const start = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!map.getLayer(LAYER.activePulse)) return;
      const t = ((now - start) % 1800) / 1800;
      map.setPaintProperty(LAYER.activePulse, 'circle-radius', 9 + t * 22);
      map.setPaintProperty(LAYER.activePulse, 'circle-opacity', 0.38 * (1 - t));
      map.setPaintProperty(LAYER.activePulse, 'circle-stroke-opacity', 0.85 * (1 - t));
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [ready, activeListing]);

  // ── padding from floating panels ────────────────────────────────────────────
  const { top = 0, right = 0, bottom = 0, left = 0 } = padding ?? {};
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    map.easeTo({ padding: { top, right, bottom, left }, duration: prefersReducedMotion() ? 0 : 500 });
  }, [ready, top, right, bottom, left]);

  // ── fly to the selected listing ─────────────────────────────────────────────
  const selected = React.useMemo(
    () => (selectedId ? listings.find((l) => l.id === selectedId) : undefined),
    [selectedId, listings],
  );
  const selLng = selected?.lng ?? null;
  const selLat = selected?.lat ?? null;
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || selLng == null || selLat == null) return;
    lastInteraction.current = performance.now();
    const zoom = Math.max(map.getZoom(), 9.5);
    if (prefersReducedMotion()) map.jumpTo({ center: [selLng, selLat], zoom });
    else map.flyTo({ center: [selLng, selLat], zoom, speed: 1.1, curve: 1.5, essential: true });
  }, [ready, selLng, selLat]);

  React.useImperativeHandle(
    ref,
    () => ({
      flyTo: (lng, lat, zoom = 9.5) => {
        lastInteraction.current = performance.now();
        mapRef.current?.flyTo({ center: [lng, lat], zoom, essential: true });
      },
      zoomOut: () => {
        lastInteraction.current = performance.now();
        const map = mapRef.current;
        if (!map) return;
        map.flyTo({ center: map.getCenter(), zoom: map.getContainer().clientWidth < 640 ? 1 : 2, essential: true });
      },
      getBounds: () => {
        const b = mapRef.current?.getBounds();
        return b ? [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()] : null;
      },
    }),
    [],
  );

  const space = MAP_PALETTE[theme].space;
  return (
    <div
      className={cn('relative size-full overflow-hidden', className)}
      style={{
        background:
          theme === 'dark'
            ? `radial-gradient(120% 90% at 50% 40%, #0d1830 0%, ${space} 62%)`
            : `radial-gradient(120% 90% at 50% 40%, #f9fbfd 0%, ${space} 62%)`,
      }}
    >
      <div
        ref={containerRef}
        role="region"
        aria-label={interactive ? 'Map of matching properties. Use the results list to browse them with the keyboard.' : 'Globe'}
        className={cn('size-full transition-opacity duration-700', ready ? 'opacity-100' : 'opacity-0')}
      />
      {failed && (
        <p className="absolute inset-0 flex items-center justify-center p-8 text-center text-sm text-muted-foreground">
          The map needs WebGL, which this browser has switched off. You can still browse the results list.
        </p>
      )}
    </div>
  );
}
