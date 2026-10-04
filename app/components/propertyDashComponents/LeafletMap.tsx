'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { GeoJSON, Marker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet';
import type { Feature, FeatureCollection } from 'geojson';
import L from 'leaflet';
import { MapProps } from './location';

const getFeatureIsoCandidates = (feature: Feature): string[] => {
  const props = feature.properties as Record<string, unknown> | null | undefined;
  const isoA2 = typeof props?.ISO_A2 === 'string' ? props.ISO_A2 : undefined;
  const isoA2Eh = typeof props?.ISO_A2_EH === 'string' ? props.ISO_A2_EH : undefined;
  const isoA3 = typeof props?.SOV_A3 === 'string' ? props.SOV_A3 : undefined;
  const guA3 = typeof props?.GU_A3 === 'string' ? props.GU_A3 : undefined;

  return [isoA2, isoA2Eh, isoA3, guA3].filter((v): v is string => !!v);
};

const FitToCountryBounds: React.FC<{
  geoData: FeatureCollection | null;
  focusCountryCode: string | null | undefined;
}> = ({ geoData, focusCountryCode }) => {
  const map = useMap();

  useEffect(() => {
    if (!geoData || !focusCountryCode) return;

    const matches = geoData.features.filter((f) => {
      const isos = getFeatureIsoCandidates(f);
      return isos.includes(focusCountryCode);
    });

    if (!matches.length) return;

    const fc: FeatureCollection = { type: 'FeatureCollection', features: matches };
    const bounds = L.geoJSON(fc as any).getBounds();
    if (bounds.isValid && bounds.isValid()) map.fitBounds(bounds, { padding: [20, 20] });
  }, [geoData, focusCountryCode, map]);

  return null;
};

const LeafletMap = ({
  locations,
  zoom,
  highlightCountryCodes,
  focusCountryCode,
  onSelect,
}: MapProps) => {
  const center: [number, number] = [locations[0]?.lat ?? 0, locations[0]?.lng ?? 0];
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/earth-countries.json');
        const json = (await res.json()) as FeatureCollection;
        if (!cancelled) setGeoData(json);
      } catch {
        // Keep map operational without country polygons
        if (!cancelled) setGeoData(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const highlightSet = useMemo(() => {
    return new Set((highlightCountryCodes ?? []).filter((c): c is string => typeof c === 'string' && c.trim().length > 0));
  }, [highlightCountryCodes]);

  // Match the visual scale of the marker used in `PropertyDetails` (glassmorphism pin),
  // while still allowing the +/- controls to slightly resize it.
  const markerSize = Math.max(24, Math.min(46, Math.round(28 + zoom * 1.6)));
  const customIcon = useMemo(() => {
    const svgSize = Math.max(12, Math.round(markerSize * 0.5));
    const yLift = markerSize;
    return L.divIcon({
      className: 'custom-div-icon',
      iconSize: [markerSize, markerSize],
      html: `
        <div style="
          width: ${markerSize}px;
          height: ${markerSize}px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.9), rgba(168, 85, 247, 0.9));
          border: 2px solid rgba(255, 255, 255, 0.85);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px 0 rgba(99, 102, 241, 0.35);
          backdrop-filter: blur(4px);
          cursor: pointer;
          transform: translateY(-${yLift}px);
        ">
          <svg width="${svgSize}" height="${svgSize}" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
          </svg>
        </div>
      `,
    });
  }, [markerSize]);

  const styleFeature = (feature: Feature): L.PathOptions => {
    const isos = getFeatureIsoCandidates(feature);
    const isHighlighted = isos.some((iso) => highlightSet.has(iso));
    const fillColor = isHighlighted ? '#ff0000' : '#0C2239'; // dark blue

    return {
      fillColor,
      fillOpacity: 0.85,
      weight: 0,
      color: 'transparent',
    };
  };

  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />

      {geoData && (
        <>
          <GeoJSON data={geoData} style={styleFeature as unknown as L.GeoJSONOptions['style']} />
          <FitToCountryBounds geoData={geoData} focusCountryCode={focusCountryCode} />
        </>
      )}

      {locations.map((loc) => (
        <Marker
          key={loc.id}
          position={[loc.lat, loc.lng] as [number, number]}
          icon={customIcon}
          eventHandlers={{
            click: () => onSelect?.(loc.id),
          }}
        >
          <Popup>{loc.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default LeafletMap;