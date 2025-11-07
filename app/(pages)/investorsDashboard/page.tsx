'use client';

import { Grid, Box, useTheme, IconButton } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { useRouter } from 'next/navigation';
import TopMetrics from '../../components/investorsDahsboardComponents/TopMetrics';
import YieldGraph from '../../components/investorsDahsboardComponents/YieldGraph';
import VolumeGraph from '../../components/investorsDahsboardComponents/VolumeGraph';
import PropertyListings from '../../components/investorsDahsboardComponents/PropertyListings';
import { StaggeredMenu, StaggeredMenuItem, StaggeredMenuSection } from '@/app/reactDevBits/StaggeredMenu/staggeredMenu';
import React from 'react';
import api from '@/app/lib/api';

// Sidebar sections content
const generalItems: StaggeredMenuItem[] = [
  { label: 'Home', ariaLabel: 'Home', link: '/' },
  { label: 'About Us', ariaLabel: 'About Us', link: '/about' },
  { label: 'Property Search', ariaLabel: 'Property Search', link: '/propertiesDashboard' },
  { label: 'Plans', ariaLabel: 'Plans', link: '/plans' },
];

const dashboardItems: StaggeredMenuItem[] = [
  { label: 'Market Insights', ariaLabel: 'Market Insights', link: '#' },
  { label: 'Properties & Listings', ariaLabel: 'Properties & Listings', link: '#' },
];

export default function InvestmentDashboard() {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState<boolean>(true);
  const [sidebarVisible, setSidebarVisible] = React.useState<boolean>(true);
  const [profileName, setProfileName] = React.useState<string>('');
  const [profileEmail, setProfileEmail] = React.useState<string>('');
  const sections: StaggeredMenuSection[] = [
    { title: 'DASHBOARD', items: dashboardItems },
    { title: 'GENERAL', items: generalItems },
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

  // Fetch current user profile (name/email) after mount if token exists
  React.useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        // Retrieve userId from localStorage or decode JWT as fallback
        let userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
        if (!userId) {
          try {
            const [, payload] = token.split('.');
            const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
            if (json?.sub) {
              userId = String(json.sub);
              localStorage.setItem('userId', userId);
            }
          } catch {}
        }
        if (!userId) return;
        const res = await api.get(`/user/retrieve/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const u: any = res.data || {};
        const name = (u.firstName || '') + (u.lastName ? ` ${u.lastName}` : '');
        if (!cancelled) {
          if (name.trim()) setProfileName(name.trim());
          if (u.email) setProfileEmail(u.email);
        }
      } catch (e) {
        // Silent fail; keep defaults
        console.warn('Failed to fetch user profile', e);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <Box sx={{ fontFamily: 'Montserrat, sans-serif', height: '100vh', overflow: 'hidden' }}>
      {/* Open button fixed on page to open the sidebar */}
      <Box sx={{ position: 'fixed', left: 12, top: 12, zIndex: 1400 }}>
        {!sidebarVisible && headerMenuButton}
      </Box>

  <Grid container sx={{ width: '100vw', height: '100%' }} columns={{ xs: 12, md: 12, lg: 20 }}>
        {/* Sidebar area */}
        <Grid
          size={{ xs: 12, md: sidebarVisible ? 4 : 0, lg: sidebarVisible ? 5 : 0 }}
          sx={{
            display: { xs: sidebarVisible ? 'block' : 'none', md: sidebarVisible ? 'block' : 'none' },
          }}
        >
          <Box
            sx={{
              height: '100vh',
              position: 'fixed',
              top: 0,
              left: 0,
              width: { xs: '100vw', md: '33.3333vw', lg: '22vw' },
              zIndex: 1200,
              overflow: 'hidden',
            }}
          >
            <StaggeredMenu
              position="left"
              colors={[theme.palette.secondary.main, theme.palette.secondary.dark]}
              sections={sections}
              activeItem={{ sectionTitle: 'DASHBOARD', label: dashboardTab }}
              profileName={profileName || 'User'}
              profileEmail={profileEmail || ''}
              onProfileClick={() => router.push('/user')}
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
              headerCtaLabel={isMdUp ? 'Chat with AI' : undefined}
              headerCtaOnClick={() => { /* TODO: integrate AI chat open */ }}
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
                fontSize: isXs ? 16 : 14, // Increase font size on extra-small screens for better readability
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
        <Grid
          size={{ xs: 12, md: sidebarVisible ? 8 : 12, lg: sidebarVisible ? 15 : 20 }}
          sx={{ position: 'relative', height: '100%', maxHeight: '100%', overflowY: 'auto' }}
        >
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