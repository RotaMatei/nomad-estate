'use client';
import React from 'react';
import { Box, ThemeProvider, Typography } from '@mui/material';
import { lightTheme } from '@/app/theme';

export default function PropertiesDashboard() {
  return (
   <ThemeProvider theme={lightTheme}>
    <Box
        sx={{
          backgroundColor: 'text.secondary',
          height: '40vh',
          display: 'flex',
          justifyContent: 'normal',
          alignItems: 'center',
        }}
      >
      </Box>
    </ThemeProvider >
  );
}