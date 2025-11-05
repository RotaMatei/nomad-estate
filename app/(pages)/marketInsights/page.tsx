'use client';

import { Grid, Box, useTheme, IconButton } from '@mui/material';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { useRouter } from 'next/navigation';
import TopMetrics from '../../components/marketInsightComponents/TopMetrics';
import YieldGraph from '../../components/marketInsightComponents/YieldGraph';
import VolumeGraph from '../../components/marketInsightComponents/VolumeGraph';
import PropertyListings from '../../components/marketInsightComponents/PropertyListings';
import { StaggeredMenu, StaggeredMenuItem, StaggeredMenuSection } from '@/app/reactDevBits/StaggeredMenu/staggeredMenu';
import React from 'react';

// Sidebar sections content
const generalItems: StaggeredMenuItem[] = [
  { label: 'About Us', ariaLabel: 'About Us', link: '/about' },
  { label: 'Property Search', ariaLabel: 'Property Search', link: '/properties' },
  { label: 'Dashboard', ariaLabel: 'Dashboard', link: '/dashboard' },
  { label: 'Plans', ariaLabel: 'Plans', link: '/plans' },
];

const dashboardItems: StaggeredMenuItem[] = [
  { label: 'Market Insights', ariaLabel: 'Market Insights', link: '#' },
  { label: 'Properties & Listings', ariaLabel: 'Properties & Listings', link: '#' },
];

export default function InvestmentDashboard() {
  const theme = useTheme();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState<boolean>(true);
  const [sidebarVisible, setSidebarVisible] = React.useState<boolean>(true);
  const sections: StaggeredMenuSection[] = [
    { title: 'GENERAL', items: generalItems },
    { title: 'DASHBOARD', items: dashboardItems },
  ];

  // Selected content within the DASHBOARD section (no full page reload)
  const [dashboardTab, setDashboardTab] = React.useState<string>('Market Insights');

  // Open menu button: white rounded rectangle with Menu icon in secondary color
  const headerMenuButton = (
    <Box sx={{ bgcolor: 'common.white', borderRadius: 1, boxShadow: '0 2px 6px rgba(0,0,0,0.15)', p: 0.5 }}>
      <IconButton aria-label="Open menu" onClick={() => {
        setIsSidebarOpen((v) => {
          const next = !v;
          if (next) setSidebarVisible(true);
          return next;
        });
      }} size="small">
        <MenuOutlinedIcon sx={{ color: theme.palette.secondary.main }} fontSize="small" />
      </IconButton>
    </Box>
  );

  return (
    <Box sx={{ fontFamily: 'Montserrat, sans-serif' }}>
      {/* Open button fixed on page to open the sidebar */}
      <Box sx={{ position: 'fixed', left: 12, top: 12, zIndex: 1400 }}>
        {!sidebarVisible && headerMenuButton}
      </Box>

  <Grid container sx={{ width: '100vw' }} columns={{ xs: 12, md: 12, lg: 20 }}>
        {/* Sidebar area */}
        <Grid
          size={{ xs: 12, md: sidebarVisible ? 4 : 0 , lg: sidebarVisible ? 5 : 0 }}
          sx={{
            display: { xs: sidebarVisible ? 'block' : 'none', md: sidebarVisible ? 'block' : 'none' },
          }}
        >
          <Box sx={{ position: 'relative', height: '100vh' }}>
            <StaggeredMenu
              position="left"
              colors={[theme.palette.secondary.main, theme.palette.secondary.dark]}
              sections={sections}
              activeItem={{ sectionTitle: 'DASHBOARD', label: dashboardTab }}
              onItemSelect={(item, meta) => {
                if (meta.sectionTitle === 'DASHBOARD') {
                  setDashboardTab(item.label);
                } else if (item.link && item.link.startsWith('/')) {
                  router.push(item.link);
                }
              }}
              displayItemNumbering={false}
              displaySocials={false}
              isFixed={false}
              showHeader={true}
              headerTitle="Nomad Estate"
              headerOnClick={() => router.push('/')}
              headerCtaLabel="New Chat"
              headerCtaOnClick={() => { /* TODO: hook this up to your handler */ }}
              fitContainer
              // Ensure panel fills available height/width inside this column
              panelStyle={{ width: '100%', height: '100vh' }}
              prelayersStyle={{ width: '100%', height: '100vh' }}
              // Keep text font and size as before
              itemStyle={{
                color: theme.palette.common.white,
                letterSpacing: 0,
                textTransform: 'none',
                fontWeight: 500,
              }}
              // The accent and colors
              accentColor={theme.palette.secondary.main}
              menuButtonColor={theme.palette.text.primary}
              openMenuButtonColor={theme.palette.primary.main}
              open={isSidebarOpen}
              onOpenChange={(open) => {
                setIsSidebarOpen(open);
                if (open) setSidebarVisible(true);
              }}
              onAfterClose={() => setSidebarVisible(false)}
            />
          </Box>
        </Grid>
        {/* Main content area */}
        <Grid size={{ xs: 12, md: sidebarVisible ? 8 : 12, lg: sidebarVisible ? 15 : 20 }}>
          <Box sx={{ py: 8, px: sidebarVisible ? 8 : 32, mx: 0 }}>
            {dashboardTab === 'Market Insights' ? (
              <>
                <TopMetrics />
                <Grid container spacing={3} sx={{ mt: 2 }}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <YieldGraph />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <VolumeGraph />
                  </Grid>
                </Grid>
                <PropertyListings />
              </>
            ) : (
              <Box sx={{ color: theme.palette.text.primary, fontSize: 16, opacity: 0.9 }}>
                Placeholder content for: {dashboardTab}
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}