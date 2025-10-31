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

// Stretch the SVG layer to fill the container
const StretchSVG: React.FC<{ geoData: FeatureCollection }> = ({ geoData }) => {
  const map = useMap();

  useEffect(() => {
    const stretch = () => {
      const overlay = map.getPane('overlayPane');
      if (!overlay) return;

      const svg = overlay.querySelector('svg') as SVGElement | null;
      if (!svg) return;

      const bounds = L.geoJSON(geoData).getBounds();
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      const p1 = map.latLngToLayerPoint(sw);
      const p2 = map.latLngToLayerPoint(ne);

      const contentWidth = Math.abs(p2.x - p1.x);
      const contentHeight = Math.abs(p2.y - p1.y);
      const containerSize = map.getSize();

      const scaleX = containerSize.x / contentWidth;
      const scaleY = containerSize.y / contentHeight;

      svg.style.transformOrigin = 'center center';
      svg.style.transform = `scale(${scaleX}, ${scaleY})`;
    };

    // Wait until map is ready and GeoJSON is rendered
    const waitAndStretch = () => {
      setTimeout(() => {
        stretch();
        map.on('resize', stretch);
      }, 100); // slight delay to ensure DOM is ready
    };

    waitAndStretch();

    return () => {
      map.off('resize', stretch);
    };
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
        maxWidth: '960px',
        aspectRatio: '16 / 9',
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
          }}
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
              <StretchSVG geoData={geoData} />
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default WorldMap;
