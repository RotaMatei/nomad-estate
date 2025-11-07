import { Sphere } from '@react-three/drei';
import { useCallback } from 'react';

function latLngToVector3(lat: number, lng: number, radius = 1.01): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return [x, y, z];
}

interface WaypointProps {
  id: number;
  lat: number;
  lng: number;
  onSelect?: (id: number) => void;
}

export const Waypoint = ({ id, lat, lng, onSelect }: WaypointProps) => {
  const [x, y, z] = latLngToVector3(lat, lng);

  const handleClick = useCallback(() => {
    if (onSelect) onSelect(id);
  }, [id, onSelect]);

  return (
    <Sphere args={[0.03, 16, 16]} position={[x, y, z]} onClick={handleClick}>
      <meshBasicMaterial color="red" />
    </Sphere>
  );
};