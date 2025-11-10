'use client';

import { Grid, Box, useTheme, IconButton, Typography, Avatar, Button } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { useRouter } from 'next/navigation';
import TopMetrics from '../../components/investorsDahsboardComponents/TopMetrics';
import YieldGraph from '../../components/investorsDahsboardComponents/YieldGraph';
import VolumeGraph from '../../components/investorsDahsboardComponents/VolumeGraph';
import { StaggeredMenu, StaggeredMenuItem, StaggeredMenuSection } from '@/app/reactDevBits/StaggeredMenu/staggeredMenu';
import React from 'react';
// Removed unused axios import (using api client instead)
import api from '@/app/lib/api';
import TopCities from '../../components/investorsDahsboardComponents/topCities';
import ListingCard from '../../components/investorsDahsboardComponents/ListingCard';
import CreatePropertyForm from '../../components/investorsDahsboardComponents/CreatePropertyForm';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const generalItems: StaggeredMenuItem[] = [
  { label: 'Home', ariaLabel: 'Home', link: '/' },
  { label: 'About Us', ariaLabel: 'About Us', link: '/about' },
  { label: 'Property Search', ariaLabel: 'Property Search', link: '/propertiesDashboard' },
  { label: 'Plans', ariaLabel: 'Plans', link: '/plans' },
];

const listingsSampleData = [
  {
    id: '1',
    title: 'Modern Downtown Apartment',
    location: 'Miami, Florida',
    price: '$550,000',
    likes: 24,
    saves: 8,
  },
  {
    id: '2',
    title: 'Beachfront Villa',
    location: 'Cancun, Mexico',
    price: '$750,000',
    likes: 42,
    saves: 15,
  },
  {
    id: '3',
    title: 'Luxury Penthouse',
    location: 'Barcelona, Spain',
    price: '$1,200,000',
    likes: 58,
    saves: 22,
  },
  {
    id: '4',
    title: 'Cozy Studio',
    location: 'Lisbon, Portugal',
    price: '$280,000',
    likes: 16,
    saves: 5,
  },
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
  const [profileRole, setProfileRole] = React.useState<string | null>(null);
  const [profileAvatarUrl, setProfileAvatarUrl] = React.useState<string | null>(null);

  // Selected content within the DASHBOARD section (no full page reload)
  const [dashboardTab, setDashboardTab] = React.useState<string>('Market Insights');
  const [showCreateProperty, setShowCreateProperty] = React.useState<boolean>(false);

  const isAgent = profileRole === 'AGENT';
  const sidebarColorMain = isAgent ? theme.palette.primary.main : theme.palette.secondary.main;
  const sidebarColorDark = isAgent ? theme.palette.primary.dark : theme.palette.secondary.dark;

  // Compute dashboard items based on role
  const dashboardItems: StaggeredMenuItem[] = React.useMemo(() => {
    const items: StaggeredMenuItem[] = [
      { label: 'Market Insights', ariaLabel: 'Market Insights', link: '#' },
    ];
    if (isAgent) {
      items.push({ label: 'Listings', ariaLabel: 'Listings', link: '#' });
    } else {
      items.push({ label: 'Liked Properties & Inquiries', ariaLabel: 'Liked Properties & Inquiries', link: '#' });
    }
    return items;
  }, [isAgent]);

  // Sections use the computed dashboard items
  const sections: StaggeredMenuSection[] = React.useMemo(() => [
    { title: 'DASHBOARD', items: dashboardItems },
    { title: 'GENERAL', items: generalItems },
  ], [dashboardItems]);

  // Ensure selected tab stays valid if role changes filters
  React.useEffect(() => {
    const allowed = new Set(dashboardItems.map(i => i.label));
    if (!allowed.has(dashboardTab)) {
      setDashboardTab('Market Insights');
    }
  }, [dashboardItems, dashboardTab]);

  // Open menu button: white rounded rectangle with Menu icon in role-based color
  const headerMenuButton = (
    <Box sx={{ bgcolor: 'common.white', borderRadius: 1, boxShadow: '0 2px 6px rgba(0,0,0,0.15)', p: 0.5 }}>
      <IconButton aria-label="Open menu" onClick={() => {
        setIsSidebarOpen((v) => {
          const next = !v;
          if (next) setSidebarVisible(true);
          return next;
        });
      }} size="small">
        <MenuOutlinedIcon sx={{ color: sidebarColorMain }} fontSize="small" />
      </IconButton>
    </Box>
  );

  // Fetch current profile (user or agency) after mount if token exists
  React.useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;
    let cancelled = false;

    (async () => {
      interface JwtPayload { sub?: string; role?: string; [k: string]: unknown }
      let payload: JwtPayload | null = null;
      try {
        const parts = token.split('.');
        if (parts.length >= 2) {
          payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        }
      } catch { /* ignore */ }

      let entityId: string | null = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
      if (!entityId && payload?.sub) {
        entityId = String(payload.sub);
        localStorage.setItem('userId', entityId);
      }
      if (!entityId) return;

      interface FetchedUser {
        firstName?: string; lastName?: string; email?: string; role?: string;
        avatarUrl?: string; avatar?: string; imageUrl?: string; image?: string;
        profilePictureUrl?: string; profilePicture?: string;
      }
      interface FetchedAgency { email?: string; companyName?: string; profilePictureData?: string }

      const fetchUser = async () => {
        // Use api client without manual Authorization header to benefit from interceptor
        const resUser = await api.get<FetchedUser>(`/user/retrieve/${entityId}`);
        
        // Check if data is empty string or empty object
        if (!resUser.data || (typeof resUser.data === 'string' && resUser.data === '') || Object.keys(resUser.data || {}).length === 0) {
          throw new Error('Empty user data received');
        }
        
        const u: FetchedUser = (resUser.data || {}) as FetchedUser;
        const name = (u.firstName || '') + (u.lastName ? ` ${u.lastName}` : '');
        if (!cancelled) {
          if (name.trim()) {
            setProfileName(name.trim());
          }
          if (u.email) {
            setProfileEmail(u.email);
          }
          if (u.role) {
            setProfileRole(String(u.role));
          }
          const avatar = u.avatarUrl || u.avatar || u.imageUrl || u.image || u.profilePictureUrl || u.profilePicture;
          if (avatar && typeof avatar === 'string') {
            setProfileAvatarUrl(avatar);
          }
        }
      };

      const fetchAgency = async () => {
        // Use api client without manual Authorization header to benefit from interceptor
        const resAgency = await api.get<FetchedAgency>(`/agency/retrieve/${entityId}`);
        const a: FetchedAgency = (resAgency.data || {}) as FetchedAgency;
        if (!cancelled) {
          if (a.companyName) setProfileName(a.companyName);
          if (a.email) setProfileEmail(a.email);
          setProfileRole('AGENT');
          if (a.profilePictureData && typeof a.profilePictureData === 'string') {
            setProfileAvatarUrl(`data:image/png;base64,${a.profilePictureData}`);
          }
        }
      };

      // Try user first (covers both regular users and agent users)
      try {
        await fetchUser();
      } catch (usrErr) {
        // User fetch failed; fall back to agency fetch
        // If user fetch fails or returns empty, try agency (for direct agency login)
        try {
          await fetchAgency();
        } catch (agErr) {
          console.warn('Both user and agency endpoints failed', { userError: usrErr, agencyError: agErr });
        }
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return (
    <Box sx={{ fontFamily: 'Montserrat, sans-serif', height: '100vh', overflow: 'hidden' }}>
      {/* Open button fixed on page to open the sidebar */}
      <Box sx={{ position: 'fixed', left: 12, top: 14, zIndex: 1400, mt:1 }}>
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
              colors={[sidebarColorMain, sidebarColorDark]}
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
              panelStyle={{ width: '100%', height: '100vh' }}
              prelayersStyle={{ width: '100%', height: '100vh' }}
              itemStyle={{
                color: theme.palette.common.white,
                letterSpacing: 0,
                textTransform: 'none',
                fontWeight: 500,
                fontSize: isXs ? 16 : 14, 
              }}
              // The accent and colors
              accentColor={sidebarColorMain}
              menuButtonColor={theme.palette.text.primary}
              openMenuButtonColor={sidebarColorMain}
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
          <Box sx={{ py: 3, pr: { xs: sidebarVisible ? 4 : 2, md: sidebarVisible ? 5 : 10 }, pl: sidebarVisible ? {xs:2, lg:0} : { xs: 2, md: 10 }, mx: 0 }}>
            {dashboardTab === 'Market Insights' ? (
              <>
                {/* Right-aligned section header with avatar/profile */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1.5, mb: 4, mt:1 }}>
                  <Typography variant="h6" sx={{ color: 'text.info' }}>
                    Market Insights
                  </Typography>
                  <IconButton aria-label="Open profile" onClick={() => router.push('/user')} sx={{ p: 0 }}>
                    <Avatar
                      src={profileAvatarUrl || undefined}
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: isAgent ? theme.palette.primary.main : '#e5e7eb',
                        color: isAgent ? theme.palette.common.white : theme.palette.text.primary,
                        fontWeight: 600,
                      }}
                    >
                      {!profileAvatarUrl ? (profileName?.trim()?.charAt(0) || 'U').toUpperCase() : null}
                    </Avatar>
                  </IconButton>
                </Box>
                
                <TopCities colorScheme={isAgent ? 'primary' : 'secondary'} />
                <Grid container spacing={3} sx={{ mt: 2 }}>
                  <Grid size={{ xs: 12, lg: 15 }}>
                    <YieldGraph colorScheme={isAgent ? 'primary' : 'secondary'} />
                  </Grid>
                </Grid>
                <TopMetrics colorScheme={isAgent ? 'primary' : 'secondary'} />
                <Grid container spacing={3} sx={{ mt: 2 }}>
                  <Grid size={{ xs: 12, lg: 15 }}>
                    <VolumeGraph colorScheme={isAgent ? 'primary' : 'secondary'} />
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline', gap: 1, mt: 4, flexWrap: 'nowrap' }}>
                  <Typography component="span" variant="subtitle1" sx={{ fontWeight: 300, color: theme.palette.grey[200], fontStyle: 'italic', fontSize:'12px', whiteSpace: 'nowrap' }}>
                    Real Time Data Provided By
                  </Typography>
                  <Typography component="span" variant="subtitle1" sx={{ fontWeight: 500, color: 'primary.main', whiteSpace: 'nowrap' }}>
                    Nomad Estate
                  </Typography>
                </Box>
                
              </>
            ) : dashboardTab === 'Listings' ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1.5, mb: 4, mt:1 }}>
                  <Typography variant="h6" sx={{ color: 'text.info' }}>
                    Listings
                  </Typography>
                  <IconButton aria-label="Open profile" onClick={() => router.push('/user')} sx={{ p: 0 }}>
                    <Avatar
                      src={profileAvatarUrl || undefined}
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor:'#e5e7eb',
                        color:theme.palette.text.primary,
                        fontWeight: 600,
                      }}
                    >
                      {!profileAvatarUrl ? (profileName?.trim()?.charAt(0) || 'U').toUpperCase() : null}
                    </Avatar>
                  </IconButton>
                </Box>
                
                {!showCreateProperty ? (
                  <>
                    <Typography variant="subtitle2" gutterBottom sx={{ color: isAgent ? theme.palette.primary.main : theme.palette.text.secondary, mb: 2 }}>
                      Portofolio
                    </Typography>
                    {/* Listings Grid */}
                    <Grid container spacing={3}>
                      {/* Add New Listing Card */}
                      <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                        <ListingCard
                          isAddCard
                          title="Add New Listing"
                          location=""
                          price=""
                          likes={0}
                          saves={0}
                          colorScheme={isAgent ? 'primary' : 'secondary'}
                          onAddClick={() => setShowCreateProperty(true)}
                        />
                      </Grid>

                      {/* Sample Listing Cards */}
                      {listingsSampleData.map((listing) => (
                        <Grid key={listing.id} size={{ xs: 12, sm: 4, md: 3 }}>
                          <ListingCard
                            id={listing.id}
                            title={listing.title}
                            location={listing.location}
                            price={listing.price}
                            likes={listing.likes}
                            saves={listing.saves}
                            colorScheme={isAgent ? 'primary' : 'secondary'}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </>
                ) : (
                  <Box sx={{ color: theme.palette.text.primary }}>
                    <Box sx={{ mb: 3 }}>
                      <Button 
                        variant="outlined" 
                        onClick={() => setShowCreateProperty(false)}
                        startIcon={<ArrowBackIcon />}
                        sx={{borderRadius: 2}}
                      >
                        Back to Listings
                      </Button>
                    </Box>
                    <CreatePropertyForm 
                      onCancel={() => setShowCreateProperty(false)}
                      onSuccess={() => {
                        setShowCreateProperty(false);
                        // Optionally refresh listings here
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline', gap: 1, mt: 4, flexWrap: 'nowrap' }}>
                  <Typography component="span" variant="subtitle1" sx={{ fontWeight: 300, color: theme.palette.grey[200], fontStyle: 'italic', fontSize:'12px', whiteSpace: 'nowrap' }}>
                    Global Investment Platform
                  </Typography>
                  <Typography component="span" variant="subtitle1" sx={{ fontWeight: 500, color: 'primary.main', whiteSpace: 'nowrap' }}>
                    Nomad Estate
                  </Typography>
                </Box>
                  </Box>
                  
                )}
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