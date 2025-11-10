'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import api from '../../lib/api';
import axios from 'axios';
import '@/app/GradientText/GradientText.css';
import { Box, Typography, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import CustomInput from '@/app/components/utils/input';
import GradientText from '@/app/GradientText/GradientText';
import GradientButton from '@/app/GradientText/GradientButton';
import GradientIcon from '@/app/GradientText/GradientIcon';
import Glare from '@/app/reactDevBits/Glare/Glare';
import dynamic from 'next/dynamic';

const WorldMap = dynamic(() => import('@/app/components/loginComponents/WorldMap'), {
  ssr: false,
});

export default function LoginPage() {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [glareRun, setGlareRun] = useState(false);
  const router = useRouter();

  const emailSanitized = email.trim().toLowerCase();
  const isEmail = (val: string) => /.+@.+\..+/.test(val);
  const isValid = isEmail(emailSanitized) && password.length > 0;

  // Play glare when the button transitions from disabled -> enabled
  const prevValidRef = useRef(isValid);
  useEffect(() => {
    const prev = prevValidRef.current;
    if (!prev && isValid) {
      // rising edge: trigger one-shot glare
      setGlareRun(false);
      requestAnimationFrame(() => setGlareRun(true));
    }
    if (!isValid) {
      // reset when invalid
      setGlareRun(false);
    }
    prevValidRef.current = isValid;
  }, [isValid]);

  type LoginResponse = {
    accessToken: string;
    refreshToken: string;
    RefreshJTI?: string;
    sub?: string;
    firstName?: string;
    lastName?: string;
  };

  const handleUserLogin = async () => {
    if (!isValid) return;
    if (loading) return;
    // trigger glare sweep on valid attempt
    setGlareRun(false);
    requestAnimationFrame(() => setGlareRun(true));

    // helper to persist tokens and optional name
    const persistAndRedirect = (data: LoginResponse) => {
      if (!data) return;
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      if (data.RefreshJTI) localStorage.setItem('jti', data.RefreshJTI);
      if (data.sub) localStorage.setItem('userId', data.sub);
      router.push('/');
    };

    try {
      setLoading(true);
      // Attempt user login first
      const resUser = await api.post<LoginResponse>('/auth/user/login', { email: emailSanitized, password });
      persistAndRedirect(resUser.data);
      return;
    } catch (err: unknown) {
      const status = axios.isAxiosError(err) ? err.response?.status : undefined;
      // Only fallback to agency on HTTP error codes
      if (status && status >= 400) {
        try {
          const resAgency = await api.post<LoginResponse>('/auth/agency/login', { email: emailSanitized, password });
          persistAndRedirect(resAgency.data);
          return;
        } catch (err2: unknown) {
          const status2 = axios.isAxiosError(err2) ? err2.response?.status : undefined;
          if (status2 && status2 >= 400) {
            setError('Invalid credentials');
          } else if (err2 instanceof Error) {
            setError(err2.message);
          } else {
            setError('Login failed');
          }
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  type CountryStats = Record<string, { users: number; agencies: number }>;
  const [countryStats, setCountryStats] = useState<CountryStats>({});

  useEffect(() => {
    const fetchCountryStats = async () => {
      try {
        const [userRes, agencyRes] = await Promise.all([
          api.get('/countries/retrieve/get-user'),
          api.get('/countries/retrieve/get-agency'),
        ]);

        const userData = userRes.data;
        const agencyData = agencyRes.data;

        const stats: CountryStats = {};

        for (const country of userData) {
          stats[country.code] = {
            users: country.userCount || 0,
            agencies: 0,
          };
        }

        for (const country of agencyData) {
          if (stats[country.code]) {
            stats[country.code].agencies = country.agencyCount || 0;
          } else {
            stats[country.code] = {
              users: 0,
              agencies: country.agencyCount || 0,
            };
          }
        }

        setCountryStats(stats);
      } catch (error) {
        console.error('Failed to fetch country stats:', error);
      }
    };

    fetchCountryStats();
  }, []);

  return (
    <Box
      sx={{
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        bgcolor: '#fff',
        p: { xs: 2, md: 6, lg: 4 },
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: 4, md: 8, lg: 6 },
          alignItems: 'center',
          height: '100%',
          width: '100%',
        }}
      >
        {/* Left: Form */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            px: { xs: 4, md: 4 },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: '0.875rem', md: '1rem' },
              color: theme.palette.grey[700],
              textAlign: 'center',
              pb: { xs: 0, md: 2 },
            }}
          >
            <Box component="span" sx={{ fontStyle: 'italic' }}>
              Join{' '}
            </Box>
            <Box component="span" sx={{ fontWeight: 800, fontStyle: 'normal', color:'primary.main' }}>
              Nomad Estate
            </Box>
            <Box component="span" sx={{ fontStyle: 'italic' }}>
              {' '}
              today
            </Box>
          </Typography>
          <GradientText
            colors={['#e80000ff', '#BC2DFF', '#121de6ff', '#BC2DFF', '#E80000']}
            animationSpeed={5}
            showBorder={false}
            className="custom-class"
          >
            Log in
          </GradientText>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2.5,
              maxWidth: 540,
              width: '100%',
              alignItems: 'center',
              pt: { xs: 4, md: 6, lg: 4 },
            }}
          >
            <Box sx={{ width: '100%' }}>
              <CustomInput
                focusColor={theme.palette.grey[300]}
                icon={
                  <GradientIcon
                    icon={<MailOutlineIcon fontSize="inherit" />}
                    colors={['#e80000', '#BC2DFF', '#121de6', '#BC2DFF', '#E80000']}
                  />
                }
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleUserLogin();
                }}
                placeholder="Investor Or Agency Email"
                type="email"
                invalid={email.length > 0 && !isEmail(emailSanitized)}
              />
            </Box>
            <Box sx={{ width: '100%' }}>
              <CustomInput
                focusColor={theme.palette.grey[300]}
                icon={
                  <GradientIcon
                    icon={<LockOutlinedIcon fontSize="inherit" />}
                    colors={['#e80000', '#BC2DFF', '#121de6', '#BC2DFF', '#E80000']}
                  />
                }
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleUserLogin();
                }}
                placeholder="Password"
                type="password"
              />
            </Box>

            {isValid ? (
              <Glare
                shouldPlay={glareRun}
                glareAngle={-20}
                glareColor="#ffffff"
                glareOpacity={0.45}
              >
                <GradientButton
                  label={loading ? 'Logging in…' : 'Log in'}
                  onClick={handleUserLogin}
                  disabled={!isValid || loading}
                  width={220}
                  colors={['#e80000', '#BC2DFF', '#121de6', '#BC2DFF', '#E80000']}
                  sx={{ boxShadow: '0 6px 0 #e0e0e0' }}
                />
              </Glare>
            ) : (
              <GradientButton
                label={loading ? 'Logging in…' : 'Log in'}
                onClick={handleUserLogin}
                disabled={!isValid || loading}
                width={220}
                colors={['#e80000', '#BC2DFF', '#121de6', '#BC2DFF', '#E80000']}
                sx={{ boxShadow: '0 6px 0 #e0e0e0' }}
              />
            )}

            {error ? (
              <Typography sx={{ color: theme.palette.error.main, mt: -1 }}>{error}</Typography>
            ) : null}

            <Typography sx={{ mt: 2, color: theme.palette.grey[700] }}>
              Don’t have an account?{' '}
              <Link
                href="/register"
                style={{
                  fontWeight: 700,
                  textDecoration: 'none',
                  fontSize: '1rem',
                  color: theme.palette.primary.main
                }}
              >
                Sign up
              </Link>
            </Typography>

            <Typography sx={{ color: theme.palette.grey[700] }}>
              Connect with other apps
            </Typography>

            <Box sx={{ display: 'flex', gap: 3 }}>
              <IconButton
                size="large"
                disabled
                disableRipple
                disableFocusRipple
                sx={{
                  p: 0,
                  bgcolor: 'transparent',
                  boxShadow: 'none',
                  border: 'none',
                }}
                aria-label="Sign in with Google"
              >
                <GradientIcon
                  icon={<GoogleIcon fontSize="inherit" />}
                  size={28}
                  colors={['#e80000', '#BC2DFF', '#121de6', '#BC2DFF', '#E80000']}
                />
              </IconButton>
              <IconButton
                size="large"
                disabled
                disableRipple
                disableFocusRipple
                sx={{
                  p: 0,
                  bgcolor: 'transparent',
                  boxShadow: 'none',
                  border: 'none',
                }}
                aria-label="Sign in with Apple"
              >
                <GradientIcon
                  icon={<AppleIcon fontSize="inherit" />}
                  size={28}
                  colors={['#e80000', '#BC2DFF', '#121de6', '#BC2DFF', '#E80000']}
                />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Right: 2D map */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '52vw',
            height: '100%',
            transform: 'translateX(-3%)',
          }}
        >
          <WorldMap data={countryStats} />
        </Box>
      </Box>
    </Box>
  );
}
