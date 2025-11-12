'use client';
import React from 'react';
import { Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';
import '@/app/GradientText/GradientText.css';

export type GradientTagProps = {
  label: string;
  size?: 'small' | 'medium';
  animationSpeed?: number; // seconds
  colors?: string[]; // gradient colors
  sx?: SxProps<Theme>;
};

export default function GradientTag({
  label,
  size = 'small',
  animationSpeed = 6,
  colors,
  sx,
}: GradientTagProps) {
  const theme = useTheme();
  const defaultColors = [
    theme.palette.primary.main,
    theme.palette.primary.light,
    theme.palette.primary.dark,
  ];
  const stops = (colors && colors.length > 0) ? colors : defaultColors;
  const gradientBg = `linear-gradient(to right, ${stops.join(', ')})`;

  return (
    <Chip
      label={label}
      size={size}
      sx={{
        // Match default Chip look, but with animated gradient background and white text
        color: '#fff',
        backgroundImage: gradientBg,
        backgroundSize: '300% 100%',
        animation: `gradient ${animationSpeed}s linear infinite`,
        border: 'none',
        boxShadow: '0 1px 0 rgba(0,0,0,0.10)',
        '& .MuiChip-label': {
          fontWeight: 600,
        },
        ...sx,
      }}
    />
  );
}
