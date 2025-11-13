import dynamic from "next/dynamic";
import { useState, useMemo, useEffect } from "react";
import { Location, MapProps } from "./location";
import { shouldShowGlobe } from "./utils";
import styles from "./mapGlobe.module.css";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => <div>Loading map...</div>,
}) as React.ComponentType<MapProps>;

const GlobeView = dynamic(() => import("./GlobeView"), {
  ssr: false,
  loading: () => <div>Loading globe...</div>,
}) as React.ComponentType<MapProps>;

interface Props {
  locations: Location[];
  onReload?: () => void;
  onSelect?: (id: number) => void;
}

export const MapGlobeSwitcher = ({ locations, onReload, onSelect }: Props) => {
  const [zoom, setZoom] = useState(5);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Debug: log locations passed to the globe/map
  useEffect(() => {
    try {
      // Log count and a small preview
      // eslint-disable-next-line no-console
      console.log('[MapGlobeSwitcher] locations count =', locations?.length ?? 0, locations?.slice?.(0, 5));
    } catch {}
  }, [locations]);

  const showGlobe = useMemo(() => {
    return zoom < 3 || shouldShowGlobe(locations);
  }, [zoom, locations]);

  const handleZoomChange = (delta: number) => {
    setZoom(prev => Math.max(1, Math.min(20, prev + delta)));
  };

  const selectedLocation = locations.find(loc => loc.id === selectedId);

  return (
    <div className={styles.mapContainer}>
      <div className={styles.controls}>
        <button onClick={() => handleZoomChange(1)} aria-label="Zoom in">+</button>
        <button onClick={() => handleZoomChange(-1)} aria-label="Zoom out">−</button>
        <button onClick={onReload} aria-label="Reload locations">⟳</button>
      </div>

      {showGlobe ? (
        <GlobeView locations={locations} zoom={zoom} onSelect={setSelectedId} />
      ) : (
        <LeafletMap locations={locations} zoom={zoom} onSelect={setSelectedId} />
      )}

      {selectedLocation && (
        <div className={styles.selectedInfo}>
          <strong>Selected:</strong> {selectedLocation.name}
        </div>
      )}
    </div>
  );
};