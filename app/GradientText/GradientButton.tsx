'use client';
import React from 'react';
import { Button } from '@mui/material';
import '@/app/GradientText/GradientText.css';
import type { SxProps, Theme } from '@mui/material/styles';

type Props = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  width?: number | string;
  animationSpeed?: number; // seconds
  colors?: string[]; // gradient colors
  sx?: SxProps<Theme>;
};

export default function GradientButton({
  label,
  onClick,
  disabled = false,
  width = 220,
  animationSpeed = 6,
  colors = ['#40ffaa', '#4079ff', '#40ffaa', '#4079ff', '#40ffaa'],
  sx,
}: Props) {
  const gradientBg = `linear-gradient(to right, ${colors.join(', ')})`;

  // Label styles
  const labelGradientText: React.CSSProperties = {
    backgroundImage: gradientBg,
    backgroundSize: '300% 100%',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    animation: `gradient ${animationSpeed}s linear infinite`,
    fontWeight: 800,
  };
  const labelWhiteText: React.CSSProperties = {
    color: '#fff',
    fontWeight: 800,
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      sx={{
        width,
        height: { xs: 42, md: 48 },
        textTransform: 'none',
        borderRadius: { xs: '12px', lg: '16px' },
        px: 3,
        fontFamily: 'Montserrat, sans-serif',
        fontSize: { xs: '12px', md: '14px', lg: '18px' },
        fontWeight: 700,
        // Enabled: gradient background, white text
        ...(disabled
          ? {
              bgcolor: '#fff',
              boxShadow: `0 3px 0 rgba(0,0,0,0.08)`,
              border: '1px solid rgba(0,0,0,0.08)',
            }
          : {
              backgroundImage: gradientBg,
              backgroundSize: '300% 100%',
              animation: `gradient ${animationSpeed}s linear infinite`,
              color: '#fff',
              border: 'none',
              boxShadow: `0 3px 0 rgba(0,0,0,0.10)`,
            }),
        '&.Mui-disabled': {
          opacity: 0.6,
        },
        ...sx,
      }}
    >
      <span style={disabled ? labelGradientText : labelWhiteText}>{label}</span>
    </Button>
  );
}
