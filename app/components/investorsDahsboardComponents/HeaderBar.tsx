'use client';

import { AppBar, Toolbar, Typography, Box, TextField, useTheme } from '@mui/material';
import React from 'react';

interface HeaderBarProps {
  renderMenuButton?: React.ReactNode;
}

export default function HeaderBar({ renderMenuButton }: HeaderBarProps) {
  const theme = useTheme();
  return (
    <AppBar position="fixed" sx={{ backgroundColor: theme.palette.background.default }} elevation={1}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{display: 'flex', justifyContent: 'space-between', width: '15vw', px:1, py: 0, my: 0, alignItems: 'center'}}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600 }} color="primary">
            Nomad Estate
          </Typography>
          {/* Menu button injected here (before title) */}
          {renderMenuButton}
        </Box>

        <Typography sx={{ fontSize: { xs: 14, md: 16}, fontWeight: 500, mx: 4, color: theme.palette.secondary.main }}>
          Market Insights Dashboard
        </Typography>
        <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
          <TextField type="date" size="small" defaultValue="2025-10-01" sx={{ mr: 1 }} />
          <TextField type="date" size="small" defaultValue="2025-10-30" />
        </Box>
      </Toolbar>
    </AppBar>
  );
}