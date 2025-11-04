import { MapContainer, GeoJSON, useMap } from 'react-leaflet';
import { Feature, FeatureCollection } from 'geojson';
import { useEffect, useState } from 'react';
import { interpolateRgb } from 'd3-interpolate';
import { scaleLinear } from 'd3-scale';
import L from 'leaflet';

type CountryStats = Record<string, { users: number; agencies: number }>;

interface WorldMapProps {
  data: CountryStats;
}

const getCountryColor = (users: number, agencies: number): string => {
  const total = users + agencies;
  if (total === 0) return '#EEE';

  const userRatio = users / total;
  const intensityScale = scaleLinear().domain([0, 200]).clamp(true).range([0.3, 1]);
  const baseColor = interpolateRgb('red', 'blue')(userRatio);
  const intensity = intensityScale(total);

  return interpolateRgb('#EEE', baseColor)(intensity);
};

// Fit the map view to the GeoJSON bounds without stretching
const FitToBounds: React.FC<{ geoData: FeatureCollection }> = ({ geoData }) => {
  const map = useMap();
  useEffect(() => {
    const bounds = L.geoJSON(geoData).getBounds();
    // Avoid any initial pan/zoom animation on mount
    map.fitBounds(bounds, { padding: [10, 10], animate: false });
  }, [geoData, map]);
  return null;
};

const WorldMap: React.FC<WorldMapProps> = ({ data }) => {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);

  const stats = data;

  useEffect(() => {
    fetch('/earth-countries.json')
      .then((res) => res.json())
      .then(setGeoData);
  }, []);

  // no-op

  const styleFeature = (feature: Feature): L.PathOptions => {
    const iso = feature.properties?.ISO_A2;
    const countryStats = stats[iso];
    const fillColor = countryStats
      ? getCountryColor(countryStats.users, countryStats.agencies)
      : '#8800ff5b';

    return {
      fillColor,
      weight: 1,
      color: 'transparent',
      fillOpacity: 1,
    };
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <MapContainer
          center={[20, 0]}
          zoom={0.8}
          style={{
            width: '100%',
            height: '100%',
            background: 'transparent',
            overflow: 'visible',
          }}
          // Disable Leaflet animations to prevent top-to-bottom transition on load
          zoomAnimation={false}
          fadeAnimation={false}
          dragging={false}
          zoomControl={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          touchZoom={false}
          boxZoom={false}
          keyboard={false}
          attributionControl={false}
        >
          {geoData && (
            <>
              <GeoJSON data={geoData} style={styleFeature as L.GeoJSONOptions['style']} />
              <FitToBounds geoData={geoData} />
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default WorldMap;
