'use client';

import React, { useEffect, useRef, useState } from 'react';
import Globe from 'globe.gl';
import type { FeatureCollection } from 'geojson';
import type { MapProps } from './location';

const DARK_BLUE = '#0C2239';
const OUTLINE_BLUE = '#4f88c8';

let countriesGeoJsonCache: FeatureCollection | null = null;
let countriesGeoJsonPromise: Promise<FeatureCollection> | null = null;

const loadCountriesGeoJson = async (): Promise<FeatureCollection> => {
  if (countriesGeoJsonCache) return countriesGeoJsonCache;
  if (!countriesGeoJsonPromise) {
    countriesGeoJsonPromise = fetch('/earth-countries.json')
      .then((res) => res.json() as Promise<FeatureCollection>)
      .then((json) => {
        countriesGeoJsonCache = json;
        return json;
      });
  }
  return countriesGeoJsonPromise;
};

const GlobeView = ({
  locations,
  zoom,
  highlightCountryCodes: _highlightCountryCodes,
  onSelect,
}: MapProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const globeRef = useRef<any>(null);
  const countriesRef = useRef<FeatureCollection | null>(null);
  const onSelectRef = useRef<typeof onSelect>(onSelect);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const json = await loadCountriesGeoJson();
        if (cancelled) return;
        countriesRef.current = json;
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Create globe once
  useEffect(() => {
    if (!containerRef.current || globeRef.current) return;
    if (!countriesRef.current) return;

    const g = new Globe(containerRef.current, {
      waitForGlobeReady: true,
      animateIn: false,
      rendererConfig: { alpha: true, antialias: true },
    });

    globeRef.current = g;

    // Globe base styling
    g.showGlobe(false)
      .backgroundColor('rgba(0,0,0,0)')
      .showAtmosphere(false)
      .globeOffset([0, 0]);

    const w = containerRef.current.clientWidth || 400;
    const h = containerRef.current.clientHeight || 400;
    g.width(w).height(h).pointOfView({ lat: 20, lng: 0, altitude: 2.1 }, 0);

    const controls = g.controls();
    controls.enablePan = false;

    // Country polygons
    g.polygonCapColor(() => DARK_BLUE)
      // Keep side walls dark for both base and highlighted countries.
      .polygonSideColor(() => DARK_BLUE)
      // Lighter blue outlines for country borders.
      .polygonStrokeColor(() => OUTLINE_BLUE)
      .polygonAltitude(0.0012)
      // Lower curvature resolution reduces triangle count and speeds initial render.
      .polygonCapCurvatureResolution(2)
      .polygonsTransitionDuration(0);

    g.polygonsData(countriesRef.current.features)
      .polygonsTransitionDuration(0);

    // Waypoints
    const radius = Math.max(0.055, Math.min(0.16, 0.16 - zoom * 0.005));
    g.pointsMerge(false)
      .pointsData(locations)
      .pointLat('lat')
      .pointLng('lng')
      // Align visual intent with Leaflet waypoints (indigo/purple emphasis).
      .pointColor(() => '#6366f1')
      .pointAltitude(0.025)
      .pointResolution(20)
      .pointRadius(radius)
      .pointLabel('name')
      .pointsTransitionDuration(0);

    g.onPointClick((point: any) => {
      if (!onSelectRef.current) return;
      const pid = point?.id;
      if (typeof pid === 'number') onSelectRef.current(pid);
    });

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) g.width(width).height(height).globeOffset([0, 0]);
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      try {
        globeRef.current?._destructor?.();
      } catch {}
      globeRef.current = null;
    };
  }, [loading]);

  // Update points when locations/zoom changes
  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;

    g.pointsData(locations);
    // Bigger points when zoomed out, smaller points when zoomed in.
    const radius = Math.max(0.055, Math.min(0.16, 0.16 - zoom * 0.005));
    g.pointRadius(radius);
  }, [locations, zoom]);

  if (loading) return <div style={{ height: '100%', width: '100%' }}>Loading globe...</div>;

  return <div ref={containerRef} style={{ height: '100%', width: '100%' }} />;
};

export default GlobeView;