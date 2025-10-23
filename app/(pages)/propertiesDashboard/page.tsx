'use client';
import React from 'react';
import { Box, ThemeProvider, Typography } from '@mui/material';
import { lightTheme } from '@/app/theme';
import GradientContainer from '@/app/components/propertyDashComponents/heroBackground';
import Navbar from '@/app/components/homeComponents/navbar';


export default function PropertiesDashboard() {
  return (
   <ThemeProvider theme={lightTheme}>
    <Box sx={{ backgroundColor: 'background.default', height: '200vh', position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
     <GradientContainer>
      <Navbar />
    </GradientContainer>
    </Box>
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