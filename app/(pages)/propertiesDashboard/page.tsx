'use client';
import React from 'react';
import { Box, ThemeProvider, Typography } from '@mui/material';
import { lightTheme } from '@/app/theme';
import GradientContainer from '@/app/components/propertyDashComponents/heroBackground';
import Navbar from '@/app/components/propertyDashComponents/navbarDasboard';
import HeroText from '@/app/components/propertyDashComponents/heroText';
import Filters from '@/app/components/propertyDashComponents/filters';
import Properties from '@/app/components/propertyDashComponents/properties';

export default function PropertiesDashboard() {
  return (
    <ThemeProvider theme={lightTheme}>
      <Box sx={{ backgroundColor: 'background.default', minHeight: '190vh', position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
        <Navbar />
        <GradientContainer>
          <HeroText />
        </GradientContainer>
        <Filters />

      </Box>
      <Box sx={{ backgroundColor: 'background.default', minHeight: '70vh', justifyContent: 'center', alignItems: 'center'}}>
        <Properties />

      </Box  >
      <Box
        sx={{
          backgroundColor: 'text.secondary',
          height: '40vh',
          display: 'flex',
          justifyContent: 'normal',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
          px: 4,
        }}
      ></Box>
    </ThemeProvider>
  );
}
