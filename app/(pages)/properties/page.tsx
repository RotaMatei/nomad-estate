'use client';
import React from 'react';
import { Box, ThemeProvider } from '@mui/material';
import { getTokenData } from '../../lib/auth';
import { lightTheme } from '@/app/theme';
import GradientContainer from '@/app/components/propertyDashComponents/heroBackground';
import Navbar from '@/app/components/homeComponents/navbar';
import HeroText from '@/app/components/propertyDashComponents/heroText';
import Filters from '@/app/components/propertyDashComponents/filters';
import Properties from '@/app/components/propertyDashComponents/properties';

export default function PropertiesDashboard() {
  const [navColor, setNavColor] = React.useState<string>('secondary.main');

  React.useEffect(() => {
    try {
      const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
      if (role && /agent|agency/i.test(role)) {
        setNavColor('primary.main');
        return;
      }
      if (role) {
        setNavColor('secondary.main');
        return;
      }
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        const data = getTokenData();
        const maybeRole = data && typeof data.role === 'string' ? String(data.role) : null;
        if (maybeRole && /agent|agency/i.test(maybeRole)) setNavColor('primary.main');
        else setNavColor('secondary.main');
      } else {
        setNavColor('secondary.main');
      }
    } catch {
      setNavColor('secondary.main');
    }
  }, []);
  return (
    <ThemeProvider theme={lightTheme}>
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
        <Navbar navColor={navColor} mobileNavColor={navColor} />
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
