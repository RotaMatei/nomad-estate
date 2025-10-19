'use client';
import { useEffect, useRef } from 'react';
import { WaveGradient } from 'wave-gradient';

export default function HeroBackground({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      new WaveGradient(canvasRef.current, {
        colors: ['#E80000', '#6ec3f4', '#7038ff', '#ffba27'],
        fps: 60,
        seed: 0,
        speed: 1.25,
        amplitude: 320,
        density: [0.06, 0.16],
      });
    } catch (e) {
      console.error('WebGL not supported', e);
    }
  }, []);

  return (
    <section
      style={{
        position: 'relative',
        height: '620px',
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0,
          width: '100vw',
          height: '100%',
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          width: '100vw',
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'center',
        }}
      >
        {children}
      </div>
    </section>
  );
}