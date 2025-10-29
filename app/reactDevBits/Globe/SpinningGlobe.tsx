'use client';
import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import styles from './SpinningGlobe.module.css';

type Props = {
  landColor: string;
  waterColor: string;
  strokeColor?: string;
  textureUrl?: string;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  scale?: number;
  className?: string;
  style?: React.CSSProperties;
  pointerEvents?: 'auto' | 'none';
  spinTrigger?: number;
  align?: 'center' | 'right' | 'left';
};

function GlobeMesh({
  landColor,
  waterColor,
  textureUrl = '/earth.png',
  autoRotate = true,
  autoRotateSpeed = 0.3,
  scale = 1,
  spinTrigger,
}: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const shouldSpinRef = useRef(false);
  const spinTimeoutRef = useRef<number | null>(null);
  const texture = useLoader(THREE.TextureLoader, textureUrl);
  // Ensure correct color space for PNGs with transparency
  texture.colorSpace = THREE.SRGBColorSpace;

  const safeLandColor = landColor || '#004080';   // fallback dark blue
  const safeWaterColor = waterColor || '#87CEEB'; // fallback light blue

  const landMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(safeLandColor),
      map: texture, // Use PNG transparency as the map, not alphaMap
      transparent: true,
      side: THREE.FrontSide,
      depthWrite: true,
    });
  }, [texture, safeLandColor]);

  const waterMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(safeWaterColor),
      side: THREE.FrontSide,
    });
  }, [safeWaterColor]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      if (autoRotate) {
        groupRef.current.rotation.y += autoRotateSpeed * delta;
      }
      if (shouldSpinRef.current) {
        const spinSpeed = (1 / 0.75) * 2.5 * Math.sign(autoRotateSpeed);
        groupRef.current.rotation.y += spinSpeed * delta;
      }
    }
  });

  // Camera is configured via PerspectiveCamera in the Canvas

  useEffect(() => {
    if (spinTrigger == null || !groupRef.current || spinTimeoutRef.current) return;

    shouldSpinRef.current = true;

    spinTimeoutRef.current = window.setTimeout(() => {
      shouldSpinRef.current = false;
      spinTimeoutRef.current = null;
    }, 800);

    return () => {
      if (spinTimeoutRef.current) {
        window.clearTimeout(spinTimeoutRef.current);
        spinTimeoutRef.current = null;
      }
    };
  }, [spinTrigger]);

  return (
    <group scale={scale} ref={groupRef}>
      {/* Water background */}
      <mesh>
        {/* Slightly smaller radius so land renders on top without z-fighting */}
        <sphereGeometry args={[0.999, 64, 64]} />
        <primitive object={waterMaterial} attach="material" />
      </mesh>

      {/* Land mask */}
      <mesh renderOrder={1}>
        {/* Land slightly larger or equal to base sphere */}
        <sphereGeometry args={[1.001, 64, 64]} />
        <primitive object={landMaterial} attach="material" />
      </mesh>
    </group>
  );
}

export default function SpinningGlobe({
  landColor,
  waterColor,
  strokeColor,
  textureUrl = '/earth.png',
  autoRotate,
  autoRotateSpeed,
  scale = 1,
  className,
  style,
  pointerEvents = 'none',
  spinTrigger,
  align,
}: Props) {
  const size = 250 * scale;

  const alignmentStyle: React.CSSProperties =
    align === 'right'
      ? { marginLeft: 'auto', marginRight: 0 }
      : align === 'left'
      ? { marginLeft: 0, marginRight: 'auto' }
      : { margin: '0 auto' };

  return (
    <div
      className={`${styles.globeWrap} ${className ?? ''}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        pointerEvents,
        ...alignmentStyle,
        ...style,
      }}
    >
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 2.5]} fov={50} near={0.1} far={100} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <GlobeMesh
          landColor={landColor}
          waterColor={waterColor}
          strokeColor={strokeColor}
          textureUrl={textureUrl}
          autoRotate={autoRotate}
          autoRotateSpeed={autoRotateSpeed}
          scale={1}
          spinTrigger={spinTrigger}
        />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}