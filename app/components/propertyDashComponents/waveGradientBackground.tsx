'use client';
import { useEffect, useRef, ReactNode } from 'react';
import { WaveGradient } from 'wave-gradient';
import { Box } from '@mui/material';

interface WaveGradientBackgroundProps {
  children?: ReactNode;
  borderRadius?: number | string;
  padding?: number | string;
  height?: number | string;
  colors?: string[];
}

export default function WaveGradientBackground({
  children,
  borderRadius = '16px',
  padding = '24px',
  height = 'auto',
  colors = ['#E80000', '#6ec3f4', '#7038ff', '#ffba27'],
}: WaveGradientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      new WaveGradient(canvasRef.current, {
        colors,
        fps: 60,
        seed: 0,
        speed: 1.25,
        amplitude: 320,
        density: [0.06, 0.16],
      });
    } catch (e) {
      console.error('WebGL not supported', e);
    }
  }, [colors]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '95vw',
        mx: 'auto',
        mt: { xs: 2, sm: 3, md: 4 },
        mb: { xs: 4, md: 6 },
        borderRadius,
        display: 'flex',
        flexDirection: 'column',
        p: padding,
        pb: { xs: '150px', sm: '220px', md: '300px', lg: '350px' },
        overflow: 'hidden',
        height: height === 'auto' ? 'auto' : height,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          borderRadius: typeof borderRadius === 'string' ? borderRadius : `${borderRadius}px`,
        }}
      />
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
