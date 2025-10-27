"use client";
import { useEffect, useRef, useState } from 'react';
import styles from './SpinningGlobe.module.css';

// Minimal Globe.gl public surface we rely on
type GlobeControls = { autoRotate: boolean; autoRotateSpeed: number; enableZoom?: boolean };
type GlobeAPI = {
  globeImageUrl: (v: string | null) => GlobeAPI;
  backgroundColor: (v: string) => GlobeAPI;
  showAtmosphere: (v: boolean) => GlobeAPI;
  polygonCapColor: (fn: () => string) => GlobeAPI;
  polygonSideColor: (fn: () => string) => GlobeAPI;
  polygonStrokeColor: (fn: () => string) => GlobeAPI;
  polygonsData: (data: unknown[]) => GlobeAPI;
  globeMaterial: () => { color?: { set?: (v: string) => void } } | undefined;
  onGlobeReady?: (cb: () => void) => void;
  controls?: () => GlobeControls | undefined;
  pointOfView: (cfg: { lat: number; lng: number; altitude: number }, ms: number) => void;
  width: (w: number) => void;
  height: (h: number) => void;
};

type Props = {
  landColor: string; // initial land color
  waterColor: string; // initial water color
  strokeColor?: string; // initial stroke color
  dataUrl?: string;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  altitude?: number;
  scale?: number;
  className?: string;
  style?: React.CSSProperties;
  pointerEvents?: 'auto' | 'none';
  spinTrigger?: number;
  // New: animate palette without remounting
  shiftTrigger?: number; // increment to trigger color shift
  shiftTo?: { land: string; water: string; stroke?: string };
  shiftDurationMs?: number;
};

export default function SpinningGlobe({
  landColor,
  waterColor,
  strokeColor = '#111',
  dataUrl = '/earth.geojson',
  autoRotate = true,
  autoRotateSpeed = 0.3,
  altitude = 0.8,
  scale = 1,
  className,
  style,
  pointerEvents = 'none',
  spinTrigger,
  shiftTrigger,
  shiftTo,
  shiftDurationMs = 800,
}: Props) {
  const globeEl = useRef<HTMLDivElement | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const controlsRef = useRef<GlobeControls | null>(null);
  const spinTimeoutRef = useRef<number | null>(null);
  const spinIdRef = useRef(0);
  const globeApiRef = useRef<GlobeAPI | null>(null);
  const currentLandRef = useRef<string>(landColor);
  const currentWaterRef = useRef<string>(waterColor);
  const currentStrokeRef = useRef<string>(strokeColor);

  const baseSize = 250;
  const scaledSize = baseSize * scale;

  useEffect(() => {
    if (!globeEl.current) return;
    let cancelled = false;

    import('globe.gl').then((mod) => {
      if (!globeEl.current) return;
      type GlobeFactory = (el: HTMLElement) => GlobeAPI;
      const getCtorUnknown = ((mod as unknown as { default?: unknown }).default ?? (mod as unknown)) as unknown;
      const GlobeCtor = getCtorUnknown as () => GlobeFactory;
      const globe = GlobeCtor()(globeEl.current)
        .globeImageUrl(null)
        .backgroundColor('rgba(0,0,0,0)')
        .showAtmosphere(false)
        .polygonCapColor(() => currentLandRef.current)
        .polygonSideColor(() => 'rgba(0,0,0,0)')
        .polygonStrokeColor(() => currentStrokeRef.current)
        .polygonsData([] as unknown[]);

      const mat = globe.globeMaterial();
      if (mat?.color?.set) mat.color.set(currentWaterRef.current);

      globe.onGlobeReady?.(() => {
  const controls = globe.controls?.();
  controlsRef.current = controls ?? null;
        if (controls) {
          controls.autoRotate = !!autoRotate;
          controls.autoRotateSpeed = autoRotateSpeed;
          controls.enableZoom = false;
        }

        try {
          globe.pointOfView({ lat: 0, lng: 0, altitude }, 0);
        } catch {}

        // Set scaled size for rendering and layout
        globe.width(scaledSize);
        globe.height(scaledSize);

        const canvas = globeEl.current?.querySelector('canvas') as HTMLCanvasElement | null;
        if (canvas) {
          canvas.width = scaledSize;
          canvas.height = scaledSize;
          canvas.style.position = 'relative';
          canvas.style.width = `${scaledSize}px`;
          canvas.style.height = `${scaledSize}px`;
          canvas.style.pointerEvents = 'none';
          canvas.style.userSelect = 'none';
          canvas.style.transform = 'none';
          canvas.style.transformOrigin = 'center center';
        }

        // Also update the scene container if present
        const sceneContainer = globeEl.current?.querySelector('div') as HTMLDivElement | null;
        if (sceneContainer) {
          sceneContainer.style.width = `${scaledSize}px`;
          sceneContainer.style.height = `${scaledSize}px`;
        }
        globeApiRef.current = globe;
      });

      fetch(dataUrl)
        .then((res) => res.json())
        .then((data) => {
          if (!cancelled) globe.polygonsData(data.features || data);
        })
        .catch(() => {});
    });

    return () => {
      cancelled = true;
    };
  }, [dataUrl, autoRotate, autoRotateSpeed, altitude, scale]);

  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) {
        window.clearTimeout(spinTimeoutRef.current);
        spinTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (spinTrigger == null || spinTimeoutRef.current) return;
    const controls = controlsRef.current;
    setIsSpinning(false);
    const rafId = requestAnimationFrame(() => setIsSpinning(true));

    if (!controls) return () => cancelAnimationFrame(rafId);

    const mySpinId = ++spinIdRef.current;
    const dir = controls.autoRotateSpeed < 0 ? -1 : 1;
    const durationMs = 750;
    const spinSpeedMag = (1 / (durationMs / 1000)) * 55;

    controls.autoRotate = true;
    controls.autoRotateSpeed = dir * spinSpeedMag;

    spinTimeoutRef.current = window.setTimeout(() => {
      if (spinIdRef.current === mySpinId) {
        controls.autoRotate = autoRotate;
        controls.autoRotateSpeed = autoRotateSpeed;
        setIsSpinning(false);
        // Allow future spins by clearing the in-progress sentinel
        spinTimeoutRef.current = null;
      }
    }, durationMs + 50);

    return () => cancelAnimationFrame(rafId);
  }, [spinTrigger]);

  // Smoothly shift colors without recreating the globe
  useEffect(() => {
  if (!shiftTrigger || !shiftTo || !globeApiRef.current) return;
  const globe = globeApiRef.current as GlobeAPI;
    const mat = globe.globeMaterial?.();

    const parseHex = (hex: string) => {
      const h = hex.replace('#', '');
      const hasAlpha = h.length === 8;
      const r = parseInt(h.slice(0, 2), 16);
      const g = parseInt(h.slice(2, 4), 16);
      const b = parseInt(h.slice(4, 6), 16);
      const a = hasAlpha ? parseInt(h.slice(6, 8), 16) / 255 : 1;
      return { r, g, b, a };
    };
    const toRgba = (c: { r: number; g: number; b: number; a?: number }) => `rgba(${c.r|0}, ${c.g|0}, ${c.b|0}, ${c.a ?? 1})`;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const fromLand = parseHex(currentLandRef.current);
    const toLand = parseHex(shiftTo.land);
    const fromWater = parseHex(currentWaterRef.current);
    const toWater = parseHex(shiftTo.water);
    const fromStroke = parseHex(currentStrokeRef.current);
    const toStroke = parseHex(shiftTo.stroke ?? currentStrokeRef.current);

    const t0 = performance.now();
    const dur = Math.max(200, shiftDurationMs);
    let rafId = 0;
    const step = () => {
      const t = Math.min(1, (performance.now() - t0) / dur);
      const land = {
        r: lerp(fromLand.r, toLand.r, t),
        g: lerp(fromLand.g, toLand.g, t),
        b: lerp(fromLand.b, toLand.b, t),
        a: lerp(fromLand.a, toLand.a, t),
      };
      const water = {
        r: lerp(fromWater.r, toWater.r, t),
        g: lerp(fromWater.g, toWater.g, t),
        b: lerp(fromWater.b, toWater.b, t),
        a: lerp(fromWater.a, toWater.a, t),
      };
      const stroke = {
        r: lerp(fromStroke.r, toStroke.r, t),
        g: lerp(fromStroke.g, toStroke.g, t),
        b: lerp(fromStroke.b, toStroke.b, t),
        a: lerp(fromStroke.a, toStroke.a, t),
      };

      // Update colors on the fly
      globe.polygonCapColor(() => toRgba(land));
      globe.polygonStrokeColor(() => toRgba(stroke));
      if (mat?.color?.set) mat.color.set(toRgba(water));

      if (t < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        currentLandRef.current = shiftTo.land;
        currentWaterRef.current = shiftTo.water;
        currentStrokeRef.current = shiftTo.stroke ?? currentStrokeRef.current;
      }
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [shiftTrigger]);

  return (
    <div
      className={`${styles.globeWrap} ${className ?? ''}`}
      style={{
        width: `${scaledSize}px`,
        height: `${scaledSize}px`,
        pointerEvents,
        ...style,
      }}
    >
      <div
        ref={globeEl}
        className={`${styles.globeRoot}`}
        style={{
          position: 'relative',
          width: `${scaledSize}px`,
          height: `${scaledSize}px`,
        }}
      />
    </div>
  );
}