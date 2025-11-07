'use client';

import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { MapProps } from './location';
import { Suspense, useMemo, useRef, useEffect, useState } from 'react';
import { Waypoint } from './Waypoint';

const GlobeMesh = () => {
  const texture = useLoader(THREE.TextureLoader, '/earth-green.png');
  texture.colorSpace = THREE.SRGBColorSpace;

  const landMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: texture,
      color: new THREE.Color('#228B22'),
      transparent: true,
      side: THREE.FrontSide,
      depthWrite: true,
      toneMapped: false,
    });
  }, [texture]);

  const waterMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color('#1E90FF'),
      side: THREE.FrontSide,
      toneMapped: false,
    });
  }, []);

  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.999, 64, 64]} />
        <primitive object={waterMaterial} attach="material" />
      </mesh>
      <mesh renderOrder={1}>
        <sphereGeometry args={[1.001, 64, 64]} />
        <primitive object={landMaterial} attach="material" />
      </mesh>
    </group>
  );
};

const GlobeView = ({ locations, zoom: _zoom }: MapProps) => {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const [, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.zoomToCursor = true;
    }
  }, []);

  return (
    <Suspense fallback={<div>Loading globe...</div>}>
      <Canvas style={{ height: '100%', width: '100%' }}>
        <PerspectiveCamera makeDefault position={[0, 0, 2.5]} fov={50} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <GlobeMesh />
        {locations.map(loc => (
          <Waypoint
            key={loc.id}
            id={loc.id}
            lat={loc.lat}
            lng={loc.lng}
            onSelect={setSelectedId}
          />
        ))}
        <OrbitControls
          ref={controlsRef}
          enableZoom
          enableRotate
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={(3 * Math.PI) / 4}
          minDistance={0.5}
          maxDistance={2.5}
        />
      </Canvas>
    </Suspense>
  );
};

export default GlobeView;