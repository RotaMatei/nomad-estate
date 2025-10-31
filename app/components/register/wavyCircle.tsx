'use client';
import React, { useEffect, useRef } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { useTheme, lighten, darken } from '@mui/material/styles';
import { WaveGradient } from 'wave-gradient';

type WavyCircleProps = {
  size?: number; // base size in px for desktop
  intensity?: number; // amplitude control
  speed?: number; // animation speed
  baseColor?: string; // override theme primary for custom hues
  colors?: string[]; // explicit 5-color palette (two darker, base, two lighter)
};

export default function WavyCircle({
  size = 520,
  intensity = 260,
  speed = 1.15,
  baseColor,
  colors,
}: WavyCircleProps) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Derive harmonious shades strictly from the chosen base hue (avoid near-black)
  const base = baseColor ?? theme.palette.primary.main;
  const derived = [
    darken(base, 0.12),
    darken(base, 0.06),
    base,
    lighten(base, 0.12),
    lighten(base, 0.26),
  ];
  const palette = Array.isArray(colors) && colors.length >= 3 ? colors : derived;

  useEffect(() => {
    if (!canvasRef.current) return;
    try {
      new WaveGradient(canvasRef.current, {
        colors: palette,
        fps: 60,
        seed: 0,
        speed,
        amplitude: intensity,
        density: [0.08, 0.18],
      });
    } catch (e) {
      console.error('WebGL not supported for WavyCircle', e);
    }
  }, [palette, intensity, speed]);

  const dim = isSm ? Math.round(size * 0.6) : size;

  return (
    <Box
      sx={{
        position: 'relative',
        width: dim,
        height: dim,
        borderRadius: '50%',
        overflow: 'hidden',
        mx: 'auto',
        boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
        outline: `1px solid ${lighten(base, 0.5)}`,
        // Ensure any uncovered canvas background shows a mid-tone, not black
        backgroundColor: palette[2] || base,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      />
      <noscript>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            background: `radial-gradient(circle at 30% 30%, ${lighten(base, 0.4)}, ${base})`,
          }}
        />
      </noscript>
    </Box>
  );
}
