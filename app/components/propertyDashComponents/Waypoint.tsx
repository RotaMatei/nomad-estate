import { Sphere } from '@react-three/drei';
import { useCallback, useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

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
  color?: string; // hex or css color
}

export const Waypoint = ({ id, lat, lng, onSelect, color = 'red' }: WaypointProps) => {
  const [x, y, z] = latLngToVector3(lat, lng);
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const baseDistanceRef = useRef<number>(2.5); // default camera distance in GlobeView

  // Capture the initial camera distance as the reference for constant on-screen size
  useEffect(() => {
    baseDistanceRef.current = camera.position.length();
  }, [camera]);

  // Keep marker size constant on screen by scaling proportionally to camera distance
  useFrame(() => {
    const m = meshRef.current;
    if (!m) return;
    const d = m.position.distanceTo(camera.position);
    const scale = d / (baseDistanceRef.current || 1);
    m.scale.setScalar(scale);
  });

  const handleClick = useCallback(() => {
    if (onSelect) onSelect(id);
  }, [id, onSelect]);

  return (
    <Sphere ref={meshRef} args={[0.03, 16, 16]} position={[x, y, z]} onClick={handleClick}>
      <meshBasicMaterial color={color} />
    </Sphere>
  );
};