'use client';

import { useEffect, useState } from 'react';
import { Box, Grid, Typography, Card, CardContent, Button, Chip, Stack, Avatar } from '@mui/material';
import Navbar from '@/app/components/homeComponents/navbar';
import { useRouter } from 'next/navigation';
import { alpha, useTheme } from '@mui/material/styles';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import FlashOnOutlinedIcon from '@mui/icons-material/FlashOnOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import MarkEmailUnreadOutlinedIcon from '@mui/icons-material/MarkEmailUnreadOutlined';
import TravelExploreOutlinedIcon from '@mui/icons-material/TravelExploreOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import api from '@/app/lib/api';
import { getSavedForUser } from '@/app/lib/propertyApi';

export default function UserDashboardPage() {
  const router = useRouter();
  const theme = useTheme();
  const [name, setName] = useState<string | null>(null);
  type UserProfile = {
    firstName: string | null;
    lastName: string | null;
    role: string | null;
    email: string | null;
    emailVerified: boolean | null;
    phoneNumber: string | null;
    phoneNumberVerified: boolean | null;
    birthDate: string | null;
    createdAt?: string | null;
    profilePictureData?: string | null;
  };
  type AgencyProfile = {
    email: string | null;
    emailVerified: boolean | null;
    phoneNumber: string | null;
    phoneNumberVerified: boolean | null;
    companyName: string | null;
    companyType: string | null;
    licenseNumber: string | null;
    companyWebsite: string | null;
    profilePictureData?: string | null;
    id?: string;
  };
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [agency, setAgency] = useState<AgencyProfile | null>(null);
  const [savedCount, setSavedCount] = useState<number>(0);
  const [savedLoading, setSavedLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/login');
      return;
    }
    const fetchData = async () => {
      const storedName = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      let userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
      // Fallback: decode JWT to extract sub if userId not persisted yet
      if (!userId && token) {
        try {
          const [, payload] = token.split('.');
          const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
          if (json?.sub) {
            userId = String(json.sub);
            localStorage.setItem('userId', userId);
          }
        } catch {}
      }
      if (!userId) {
        setName(storedName);
        return;
      }
      // Fetch saved count independently after ensuring userId exists
      (async () => {
        try {
          setSavedLoading(true);
          const list = await getSavedForUser(userId!);
          setSavedCount(Array.isArray(list) ? list.length : 0);
        } catch {
          setSavedCount(0);
        } finally {
          setSavedLoading(false);
        }
      })();

      const fetchUser = async () => {
        const userRes = await api.get<UserProfile>(`/user/retrieve/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Check if data is empty string or empty object
        if (!userRes.data || (typeof userRes.data === 'string' && userRes.data === '') || Object.keys(userRes.data || {}).length === 0) {
          throw new Error('Empty user data received');
        }
        
        const u = userRes.data as Partial<UserProfile>;
        const normalized: UserProfile = {
          firstName: u.firstName ?? null,
          lastName: u.lastName ?? null,
          role: (u.role as string) ?? null,
          email: u.email ?? null,
          emailVerified: typeof u.emailVerified === 'boolean' ? u.emailVerified : null,
          phoneNumber: u.phoneNumber ?? null,
          phoneNumberVerified:
            typeof u.phoneNumberVerified === 'boolean' ? u.phoneNumberVerified : null,
          birthDate: u.birthDate ?? null,
          createdAt: u.createdAt ?? null,
          profilePictureData: u.profilePictureData ?? null,
        };
        setProfile(normalized);
        setName(normalized.firstName || storedName);
        if (normalized.firstName && !storedName) localStorage.setItem('user', normalized.firstName);
      };

      const fetchAgency = async () => {
        const agRes = await api.get<AgencyProfile>(`/agency/retrieve/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const a = agRes.data as Partial<AgencyProfile>;
        const normalizedAgency: AgencyProfile = {
          id: userId,
          email: a.email ?? null,
          emailVerified: typeof a.emailVerified === 'boolean' ? a.emailVerified : null,
          phoneNumber: a.phoneNumber ?? null,
          phoneNumberVerified:
            typeof a.phoneNumberVerified === 'boolean' ? a.phoneNumberVerified : null,
          companyName: a.companyName ?? null,
          companyType: a.companyType ?? null,
          licenseNumber: a.licenseNumber ?? null,
          companyWebsite: a.companyWebsite ?? null,
          profilePictureData: a.profilePictureData ?? null,
        };
        setAgency(normalizedAgency);
        setName(normalizedAgency.companyName || storedName);
        if (normalizedAgency.companyName && !storedName) localStorage.setItem('user', normalizedAgency.companyName);
      };

      // Try user first (covers both regular users and agent users)
      try {
        await fetchUser();
      } catch (userErr) {
        // If user fetch fails or returns empty, try agency (for direct agency login)
        try {
          await fetchAgency();
        } catch (agErr) {
          console.warn('Both user and agency endpoints failed');
          setName(storedName);
        }
      }
    };
    fetchData();
  }, [router]);

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('jti');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
    } catch {}
    router.push('/login');
  };

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', overflow: 'hidden'}}>
      <Navbar navColor="primary.main" />

      {/* Content container */}
      <Box
        sx={{
          px: { xs: 2, md: 6 },
          py: { xs: 4, md: 6 },
          maxWidth: '1200px',
          mx: 'auto',
          
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              {profile?.profilePictureData ? (
                <Avatar
                  src={`data:image/jpeg;base64,${profile.profilePictureData}`}
                  alt={name ?? 'Profile'}
                  sx={{ width: 32, height: 32 }}
                />
              ) : (
                <AccountCircleOutlinedIcon sx={{ color: 'primary.main' }} />
              )}
              <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                {`Hello${name ? `, ${name}` : ''}`}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Typography sx={{ color: 'text.secondary' }}>
                {name ? `Welcome back, ${name}!` : 'Manage your profile, preferences, and activity.'}
              </Typography>
              <Chip label="Free Plan" size="small" color="default" sx={{ ml: 0.5 }} />
            </Stack>
          </Box>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleLogout}
            sx={{ textTransform: 'none', borderRadius: 3, fontWeight: 600 }}
          >
            Log out
          </Button>
        </Box>

        {/* Quick metrics row */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                borderColor: alpha(theme.palette.primary.main, 0.18),
                backgroundColor: 'background.default',
              }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <FavoriteBorderOutlinedIcon color="primary" />
                <Box>
                  <Typography sx={{ fontWeight: 700, lineHeight: 1 }}>
                    {savedLoading ? '—' : savedCount}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>Saved</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                borderColor: alpha(theme.palette.primary.main, 0.18),
                backgroundColor: 'background.default',
              }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <MarkEmailUnreadOutlinedIcon color="primary" />
                <Box>
                  <Typography sx={{ fontWeight: 700, lineHeight: 1 }}>0</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>Notifications</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                borderColor: alpha(theme.palette.primary.main, 0.18),
                backgroundColor: 'background.default',
              }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <FlashOnOutlinedIcon color="primary" />
                <Box>
                  <Typography sx={{ fontWeight: 700, lineHeight: 1 }}>Free</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>Plan</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main content cards - neutral design (no red accents) */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                borderColor: 'divider',
                backgroundColor: 'background.default',
                transition: 'box-shadow 200ms ease',
                '&:hover': { boxShadow: '0 6px 18px rgba(0,0,0,0.06)' },
                height: '200px',
              }}
            >
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                  <AccountCircleOutlinedIcon sx={{ color: 'text.secondary' }} />
                    <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>
                    Account Overview
                  </Typography>
                </Stack>
                <Stack spacing={1}>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Email: <Box component="span" sx={{ fontWeight: 600 }}>{profile?.email ?? '—'}</Box>
                    {typeof profile?.emailVerified === 'boolean' && (
                      <Chip
                        component="span"
                        size="small"
                        label={profile.emailVerified ? 'Verified' : 'Unverified'}
                        color={profile.emailVerified ? 'success' : 'default'}
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Phone: <Box component="span" sx={{ fontWeight: 600 }}>{profile?.phoneNumber ?? '—'}</Box>
                    {typeof profile?.phoneNumberVerified === 'boolean' && (
                      <Chip
                        component="span"
                        size="small"
                        label={profile.phoneNumberVerified ? 'Verified' : 'Unverified'}
                        color={profile.phoneNumberVerified ? 'success' : 'default'}
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Role: <Box component="span" sx={{ fontWeight: 600 }}>{profile?.role ?? '—'}</Box>
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Member since: <Box component="span" sx={{ fontWeight: 600 }}>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '—'}</Box>
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                borderColor: 'divider',
                backgroundColor: 'background.default',
                transition: 'box-shadow 200ms ease',
                '&:hover': { boxShadow: '0 6px 18px rgba(0,0,0,0.06)' },
                height:'200px'
              }}
            >
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                  <FlashOnOutlinedIcon sx={{ color: 'text.secondary' }} />
                    <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>
                    Quick Actions
                  </Typography>
                </Stack>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<TravelExploreOutlinedIcon />}
                    onClick={() => router.push('/properties')}
                    sx={{ textTransform: 'none', borderRadius: 2, mt: 1 }}
                  >
                    Browse Properties
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<WorkspacePremiumOutlinedIcon />}
                    onClick={() => router.push('/sorry')}
                    sx={{ textTransform: 'none', borderRadius: 2, mt:1 }}
                  >
                    Plans
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>          
        </Grid>

        {/* Agency Profile (if applicable) */}
        {agency ? (
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  borderColor: 'divider',
                  backgroundColor: 'background.default',
                  transition: 'box-shadow 200ms ease',
                  '&:hover': { boxShadow: '0 6px 18px rgba(0,0,0,0.06)' },
                }}
              >
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                    <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>
                      Agency Profile
                    </Typography>
                  </Stack>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Stack spacing={1}>
                        <Typography sx={{ color: 'text.secondary' }}>
                          Company Name: <Box component="span" sx={{ fontWeight: 600 }}>{agency.companyName ?? '—'}</Box>
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}>
                          Company Type: <Box component="span" sx={{ fontWeight: 600 }}>{agency.companyType ?? '—'}</Box>
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}>
                          License Number: <Box component="span" sx={{ fontWeight: 600 }}>{agency.licenseNumber ?? '—'}</Box>
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Stack spacing={1}>
                        {agency.profilePictureData ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar
                              src={`data:image/jpeg;base64,${agency.profilePictureData}`}
                              alt={agency.companyName ?? 'Agency'}
                              sx={{ width: 32, height: 32 }}
                            />
                            <Typography sx={{ color: 'text.secondary' }}>Logo</Typography>
                          </Box>
                        ) : null}
                        <Typography sx={{ color: 'text.secondary' }}>
                          Website: <Box component="span" sx={{ fontWeight: 600 }}>{agency.companyWebsite ?? '—'}</Box>
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}>
                          Email: <Box component="span" sx={{ fontWeight: 600 }}>{agency.email ?? '—'}</Box>
                          {typeof agency.emailVerified === 'boolean' && (
                            <Chip
                              component="span"
                              size="small"
                              label={agency.emailVerified ? 'Verified' : 'Unverified'}
                              color={agency.emailVerified ? 'success' : 'default'}
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}>
                          Phone: <Box component="span" sx={{ fontWeight: 600 }}>{agency.phoneNumber ?? '—'}</Box>
                          {typeof agency.phoneNumberVerified === 'boolean' && (
                            <Chip
                              component="span"
                              size="small"
                              label={agency.phoneNumberVerified ? 'Verified' : 'Unverified'}
                              color={agency.phoneNumberVerified ? 'success' : 'default'}
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : null}
      </Box>

      {/* Footer placeholder matching site spacing */}
      <Box sx={{ height: { xs: '20vh', md: '30vh' } }} />
    </Box>
  );
}
