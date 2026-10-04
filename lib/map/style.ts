import type { ExpressionSpecification, LayerSpecification, StyleSpecification } from 'maplibre-gl';

export type MapTheme = 'light' | 'dark';

/** Map colours mirror the tokens in app/globals.css (MapLibre needs concrete values, not CSS variables). */
export const MAP_PALETTE = {
  light: {
    space: '#eef2f6',
    ocean: '#c9d8e6',
    land: '#f7f9fb',
    landLine: '#b3c2d3',
    park: '#dfeadf',
    road: '#ffffff',
    roadCasing: '#cfd8e3',
    building: '#e6ebf1',
    label: '#3d4b63',
    labelHalo: '#f7f9fb',
    match: '#f5a524',
    beacon: '#c97a06',
    beaconGlow: '#f5a524',
    beaconInk: '#0e1a2e',
    atmosphere: '#2e86c1',
  },
  dark: {
    space: '#050a14',
    ocean: '#070e1b',
    land: '#16243c',
    landLine: '#26395a',
    park: '#14283a',
    road: '#26395a',
    roadCasing: '#0d1728',
    building: '#1b2b47',
    label: '#8a98ae',
    labelHalo: '#0a1222',
    match: '#ffb547',
    beacon: '#ffb547',
    beaconGlow: '#ffcf7a',
    beaconInk: '#0a1222',
    atmosphere: '#5ec8e5',
  },
} as const;

export const SOURCE = { countries: 'countries', tiles: 'openmaptiles', listings: 'listings', active: 'active' } as const;
export const LAYER = {
  matchFill: 'country-match',
  cluster: 'cluster',
  clusterCount: 'cluster-count',
  pinGlow: 'pin-glow',
  pin: 'pin',
  activePulse: 'active-pulse',
  active: 'active',
} as const;

/** Below this zoom the globe draws only from the bundled GeoJSON: no tile requests at all. */
export const TILE_MIN_ZOOM = 3.5;
const FADE_END = TILE_MIN_ZOOM + 1;

const fadeOut: ExpressionSpecification = ['interpolate', ['linear'], ['zoom'], TILE_MIN_ZOOM, 1, FADE_END, 0];
const fadeIn: ExpressionSpecification = ['interpolate', ['linear'], ['zoom'], TILE_MIN_ZOOM, 0, FADE_END, 1];
const EMPTY: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] };

/** Meridians and parallels every 15°, drawn over the ocean like the grid on a navigation chart. */
const GRATICULE: GeoJSON.FeatureCollection<GeoJSON.LineString> = {
  type: 'FeatureCollection',
  features: [
    ...Array.from({ length: 24 }, (_, i) => -180 + i * 15).map((lng) => Array.from({ length: 41 }, (_, j) => [lng, -80 + j * 4])),
    ...Array.from({ length: 11 }, (_, i) => -75 + i * 15).map((lat) => Array.from({ length: 91 }, (_, j) => [-180 + j * 4, lat])),
  ].map((coordinates) => ({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates } })),
};

export function buildStyle(theme: MapTheme): StyleSpecification {
  const c = MAP_PALETTE[theme];
  const dark = theme === 'dark';

  const detail: LayerSpecification[] = [
    {
      id: 'water',
      type: 'fill',
      source: SOURCE.tiles,
      'source-layer': 'water',
      minzoom: TILE_MIN_ZOOM,
      paint: { 'fill-color': c.ocean, 'fill-opacity': fadeIn },
    },
    {
      id: 'park',
      type: 'fill',
      source: SOURCE.tiles,
      'source-layer': 'park',
      minzoom: 8,
      paint: { 'fill-color': c.park, 'fill-opacity': 0.7 },
    },
    {
      id: 'building',
      type: 'fill',
      source: SOURCE.tiles,
      'source-layer': 'building',
      minzoom: 13,
      paint: { 'fill-color': c.building, 'fill-opacity': ['interpolate', ['linear'], ['zoom'], 13, 0, 14.5, 1] },
    },
    {
      id: 'road-casing',
      type: 'line',
      source: SOURCE.tiles,
      'source-layer': 'transportation',
      minzoom: 11,
      filter: ['in', ['get', 'class'], ['literal', ['motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'minor']]],
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: {
        'line-color': c.roadCasing,
        'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 11, 1, 16, 9, 19, 30],
      },
    },
    {
      id: 'road',
      type: 'line',
      source: SOURCE.tiles,
      'source-layer': 'transportation',
      minzoom: 6,
      filter: ['in', ['get', 'class'], ['literal', ['motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'minor']]],
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: {
        'line-color': c.road,
        'line-opacity': ['interpolate', ['linear'], ['zoom'], 6, dark ? 0.5 : 0.8, 12, 1],
        'line-width': [
          'interpolate',
          ['exponential', 1.5],
          ['zoom'],
          6,
          ['match', ['get', 'class'], ['motorway', 'trunk'], 0.7, 0],
          11,
          ['match', ['get', 'class'], ['motorway', 'trunk'], 1.6, ['primary', 'secondary'], 0.8, 0.2],
          16,
          ['match', ['get', 'class'], ['motorway', 'trunk'], 8, ['primary', 'secondary'], 6, 4],
          19,
          26,
        ],
      },
    },
    {
      id: 'boundary',
      type: 'line',
      source: SOURCE.tiles,
      'source-layer': 'boundary',
      minzoom: TILE_MIN_ZOOM,
      filter: ['all', ['==', ['get', 'admin_level'], 2], ['!=', ['get', 'maritime'], 1]],
      paint: { 'line-color': c.landLine, 'line-width': 1, 'line-opacity': fadeIn },
    },
    {
      id: 'place-label',
      type: 'symbol',
      source: SOURCE.tiles,
      'source-layer': 'place',
      minzoom: 4.5,
      filter: ['in', ['get', 'class'], ['literal', ['city', 'town', 'village', 'suburb']]],
      layout: {
        'text-field': ['coalesce', ['get', 'name:en'], ['get', 'name']],
        'text-font': ['Noto Sans Regular'],
        'text-size': ['interpolate', ['linear'], ['zoom'], 4.5, ['match', ['get', 'class'], 'city', 11, 0], 10, ['match', ['get', 'class'], 'city', 15, 'town', 12, 10], 15, 15],
        'text-max-width': 8,
        'symbol-sort-key': ['coalesce', ['get', 'rank'], 99],
      },
      paint: { 'text-color': c.label, 'text-halo-color': c.labelHalo, 'text-halo-width': 1.2 },
    },
  ];

  return {
    version: 8,
    name: `Nomad Estate ${theme}`,
    projection: { type: 'globe' },
    glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
    sky: {
      'sky-color': c.atmosphere,
      'horizon-color': c.atmosphere,
      'fog-color': c.space,
      'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0, dark ? 0.7 : 0.4, 5, dark ? 0.4 : 0.2, 7, 0],
    },
    // The sun sits behind the viewer, so the whole visible hemisphere is evenly lit: no day/night terminator washing out pins.
    light: { anchor: 'viewport', position: [1.5, 0, 0] },
    sources: {
      graticule: { type: 'geojson', data: GRATICULE },
      [SOURCE.countries]: { type: 'geojson', data: '/map/countries.json', tolerance: 0.6 },
      [SOURCE.tiles]: {
        type: 'vector',
        url: 'https://tiles.openfreemap.org/planet',
        attribution:
          '<a href="https://openfreemap.org" target="_blank" rel="noreferrer">OpenFreeMap</a> © <a href="https://www.openmaptiles.org/" target="_blank" rel="noreferrer">OpenMapTiles</a> © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>',
      },
      [SOURCE.listings]: { type: 'geojson', data: EMPTY, cluster: true, clusterRadius: 46, clusterMaxZoom: 11, promoteId: 'id' },
      [SOURCE.active]: { type: 'geojson', data: EMPTY },
    },
    layers: [
      // Ocean while zoomed out; turns into land once tile water takes over the coastlines.
      {
        id: 'background',
        type: 'background',
        paint: { 'background-color': ['interpolate', ['linear'], ['zoom'], TILE_MIN_ZOOM, c.ocean, FADE_END, c.land] },
      },
      {
        id: 'graticule',
        type: 'line',
        source: 'graticule',
        maxzoom: FADE_END,
        paint: { 'line-color': c.landLine, 'line-width': 0.75, 'line-opacity': ['interpolate', ['linear'], ['zoom'], TILE_MIN_ZOOM, dark ? 0.55 : 0.6, FADE_END, 0] },
      },
      {
        id: 'country-land',
        type: 'fill',
        source: SOURCE.countries,
        maxzoom: FADE_END,
        paint: { 'fill-color': c.land, 'fill-opacity': fadeOut },
      },
      ...detail.slice(0, 1),
      {
        id: LAYER.matchFill,
        type: 'fill',
        source: SOURCE.countries,
        maxzoom: 6,
        filter: ['in', ['get', 'code'], ['literal', []]],
        paint: {
          'fill-color': c.match,
          'fill-opacity': ['interpolate', ['linear'], ['zoom'], 0, dark ? 0.16 : 0.2, 4, dark ? 0.1 : 0.14, 6, 0],
        },
      },
      {
        id: 'country-line',
        type: 'line',
        source: SOURCE.countries,
        maxzoom: FADE_END,
        paint: { 'line-color': c.landLine, 'line-width': ['interpolate', ['linear'], ['zoom'], 0, 0.4, 4, 1], 'line-opacity': fadeOut },
      },
      ...detail.slice(1),

      // Listings: every match is a GPU-drawn point of light.
      {
        id: LAYER.pinGlow,
        type: 'circle',
        source: SOURCE.listings,
        paint: {
          'circle-color': c.beaconGlow,
          'circle-blur': 1,
          'circle-opacity': dark ? 0.55 : 0.4,
          'circle-radius': ['case', ['has', 'point_count'], ['step', ['get', 'point_count'], 26, 10, 34, 40, 44], 13],
          'circle-pitch-alignment': 'map',
        },
      },
      {
        id: LAYER.pin,
        type: 'circle',
        source: SOURCE.listings,
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': c.beacon,
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 0, 3.2, 6, 4.5, 14, 7],
          'circle-stroke-color': dark ? c.beaconInk : '#ffffff',
          'circle-stroke-width': 1.25,
        },
      },
      {
        id: LAYER.cluster,
        type: 'circle',
        source: SOURCE.listings,
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': c.beacon,
          'circle-radius': ['step', ['get', 'point_count'], 13, 10, 17, 40, 22],
          'circle-stroke-color': dark ? c.beaconInk : '#ffffff',
          'circle-stroke-width': 1.5,
        },
      },
      {
        id: LAYER.clusterCount,
        type: 'symbol',
        source: SOURCE.listings,
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-font': ['Noto Sans Bold'],
          'text-size': 12,
          'text-allow-overlap': true,
        },
        paint: { 'text-color': dark ? c.beaconInk : '#ffffff' },
      },
      {
        id: LAYER.activePulse,
        type: 'circle',
        source: SOURCE.active,
        paint: {
          'circle-color': c.beaconGlow,
          'circle-opacity': 0.35,
          'circle-radius': 18,
          'circle-stroke-color': c.beaconGlow,
          'circle-stroke-width': 1.5,
          'circle-stroke-opacity': 0.8,
        },
      },
      {
        id: LAYER.active,
        type: 'circle',
        source: SOURCE.active,
        paint: {
          'circle-color': c.beaconGlow,
          'circle-radius': 7.5,
          'circle-stroke-color': dark ? '#ffffff' : c.beaconInk,
          'circle-stroke-width': 2,
        },
      },
    ],
  };
}
