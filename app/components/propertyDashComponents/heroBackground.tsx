'use client';
import { useEffect, useRef, ReactNode } from 'react';
import { WaveGradient } from 'wave-gradient';
import { Box } from '@mui/material';

interface GradientContainerProps {
  children?: ReactNode;
  borderRadius?: number | string;
  padding?: number | string;
}

const GradientContainer: React.FC<GradientContainerProps> = ({
  children,
  borderRadius = '16px',
  padding = '24px',
}) => {
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
    <Box
      sx={{
        position: 'relative',
        width: '95vw',
        mx: 'auto',
        mt: { xs: 2, sm: 3, md: 4 },
        mb: { xs: 4, md: 6 },
        minHeight: 'auto',
        borderRadius: `0 0 ${typeof borderRadius === 'string' ? borderRadius : `${borderRadius}px`} ${typeof borderRadius === 'string' ? borderRadius : `${borderRadius}px`}`,
        display: 'flex',
        flexDirection: 'column',
        p: padding,
        pb: { xs: '150px', sm: '220px', md: '300px', lg: '350px' },
        overflow: 'hidden',
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
          borderRadius: `0 0 ${typeof borderRadius === 'string' ? borderRadius : `${borderRadius}px`} ${typeof borderRadius === 'string' ? borderRadius : `${borderRadius}px`}`,
          opacity: 0.85,
        }}
      />
      {/* White to transparent gradient overlay (top to bottom) */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.2), transparent)',
          pointerEvents: 'none',
          borderRadius: `0 0 ${typeof borderRadius === 'string' ? borderRadius : `${borderRadius}px`} ${typeof borderRadius === 'string' ? borderRadius : `${borderRadius}px`}`,
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
};

export default GradientContainer;
