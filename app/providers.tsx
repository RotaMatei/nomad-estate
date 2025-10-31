'use client';

import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme } from './theme';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
