'use client';
'use client';
import { Box, Button, Grid, InputBase, Typography, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import { useEffect, useState, useRef } from 'react';
import { IconButton, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import MobileStaggeredDrawer from './MobileStaggeredDrawer';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { getTokenData } from '../../lib/auth';

export default function Navbar(
  { navColor = 'background.default', mobileNavColor }: { navColor?: string; mobileNavColor?: string }
) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const prevPathRef = useRef(pathname);
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  
  const mColor = mobileNavColor ?? navColor;
  

  const getNavbarColor = () => {

    if (isHomePage) return theme.palette.common.white;
    if (isLoggedIn && userRole && /agent|agency/i.test(userRole)) return theme.palette.primary.main;
    if (isLoggedIn && userRole) return theme.palette.secondary.main;
    if (navColor === 'primary.main') return theme.palette.primary.main;
    if (navColor === 'secondary.main') return theme.palette.secondary.main;
    if (navColor === 'common.white') return theme.palette.common.white;
    return navColor as string;
  };

  const getTextColor = () => {
    // Keep white on home
    if (isHomePage) return theme.palette.common.white;
    return getNavbarColor();
  };

  const currentNavColor = getNavbarColor();
  const currentTextColor = getTextColor();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Submit AI search on Enter -> route to /sorry for now
  const submitSearch = () => {
    router.push('/sorry');
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitSearch();
    }
  };

  // Clear the search box when navigating back from /sorry
  useEffect(() => {
    const prev = prevPathRef.current;
    if (prev === '/sorry' && pathname !== '/sorry') {
      setSearchText('');
    }
    prevPathRef.current = pathname;
  }, [pathname]);

  // Detect auth state from localStorage token
  useEffect(() => {
    let mounted = true;
    const fetchUser = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const storedRole = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
      if (!mounted) return;
      setIsLoggedIn(!!token);
      if (storedRole) {
        setUserRole(storedRole);
      } else if (token) {
        // Try decode token to extract role if not present in localStorage
        try {
          const data = getTokenData();
          const maybeRole = data && typeof data.role === 'string' ? String(data.role) : (data && typeof (data as Record<string, unknown>)['role'] === 'string' ? String((data as Record<string, unknown>)['role']) : null);
          if (maybeRole) setUserRole(maybeRole);
        } catch {
          // ignore decode errors
        }
      }
    };

    fetchUser();

    // Listen for token/role changes across tabs/windows
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'token') {
        const tokenNow = !!e.newValue;
        setIsLoggedIn(tokenNow);
        if (tokenNow) {
          try {
            const data = getTokenData();
            const maybeRole = data && typeof data.role === 'string' ? String(data.role) : null;
            if (maybeRole) setUserRole(maybeRole);
          } catch {}
        } else {
          setUserRole(null);
        }
      }
      if (e.key === 'role') {
        setUserRole(e.newValue);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => {
      mounted = false;
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const pages: { label: string; href: string }[] = [
    { label: 'Home', href: '/' },
    { label: 'Book a call', href: '/sorry' },
    { label: 'Properties', href: '/properties' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Plans', href: '/sorry' },
  ];

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('jti');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      setIsLoggedIn(false);
    } catch { }
    router.push('/login');
  };

  return (
    <Box
      sx={{
        px: 4,
        paddingTop: { xs: 0, md: 3 },
        paddingBottom: 10,
        fontFamily: 'Montserrat, sans-serif',
        zIndex: 300,
      }}
    >
      <Grid container spacing={2} alignItems="center" display={{ xs: 'none', lg: 'flex' }}>
        {/* Logo */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 2, // spacing between Typography and Search Box
            }}
          >
            <Typography
              sx={{
                color: currentTextColor,
                fontWeight: 'bold',
                fontSize: '16px',
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'left',
              }}
            >
              Nomad Estate
            </Typography>
            <Box
              sx={{
                alignItems: 'center',
                border: '1px solid',
                borderColor: currentTextColor,
                borderRadius: 4,
                px: 1,
                py: 0.5,
                height: '35px',
                width: {md:'22.5vw', lg:'27.5vw'},
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'left',
              }}
            >
              <SearchIcon sx={{ color: currentTextColor, mr: 1 }} />
              <InputBase
                placeholder="AI Search"
                sx={{
                  width: '100%',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '16px',
                  color: currentTextColor,
                }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
            </Box>
          </Box>
        </Grid>

        {/* Buttons */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Grid container spacing={2} justifyContent={{ xs: 'center', md: 'flex-end' }}>
            <Grid>
              <Button
                variant="text"
                href={'/properties'}
                sx={{
                  color: currentTextColor,
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'Montserrat, sans-serif',
                  //textTransform: 'capitalize',
                  borderRadius: 3,
                }}
              >
                PROPERTIES
              </Button>
            </Grid>

            <Grid>
              <Button
                variant="text"
                href={'/dashboard'}
                sx={{
                  color: currentTextColor,
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'Montserrat, sans-serif',
                  //textTransform: 'capitalize',
                  borderRadius: 3,
                }}
              >
                DASHBOARD
              </Button>
            </Grid>

            <Grid>
              <Button
                variant="text"
                sx={{
                  //backgroundColor: 'primary.main',
                  color: currentTextColor,
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 500,
                  borderRadius: 3,
                }}
                onClick={() => router.push('/sorry')}
              >
                BOOK A CALL
              </Button>
            </Grid>

            <Grid>
              <Button
                variant="text"
                startIcon={<CreditCardOutlinedIcon />}
                sx={{
                  //backgroundColor: 'primary.main',
                  color: currentTextColor,
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 500,
                  borderRadius: 3,
                }}
                onClick={() => router.push('/sorry')}
              >
                PLANS
              </Button>
            </Grid>

            <Grid>
              <Button
                variant="outlined"
                sx={{
                  borderColor: currentTextColor,
                  color: currentTextColor,
                  fontFamily: 'Montserrat, sans-serif',
                  textTransform: 'none',
                  borderRadius: 3,
                  '&:hover': {
                    backgroundColor: '#cc0000',
                    borderColor: '#cc0000',
                  },
                }}
                onClick={() => router.push(isLoggedIn ? '/user' : '/login')}
              >
                {isLoggedIn ?
                 "MY ACCOUNT"
                 : 'Log in'}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container sx={{ marginTop: 6 }} columns={{ xs: 12, sm: 16, lg: 12 }}>
        <Grid size={{ xs: isLoggedIn ? 9 : 10, sm: isLoggedIn ? 8 : 9, lg: 6 }}>
          <Box
            sx={{
              alignItems: 'center',
              border: '1px solid',
              borderColor: currentTextColor,
              borderRadius: 4,
              mx:1,
              py: 0.5,
              height: '35px',
              display: { xs: 'flex', lg: 'none' },
            }}
          >
            <SearchIcon sx={{ color: currentTextColor, ml: 1 }} />
            <InputBase
              placeholder="AI Search"
              sx={{
                width: '100%',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '14px',
                color: currentTextColor,
                ml: 1,
              }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 0, sm: 5, lg: 0 }}
          width={'100%'} sx={{ display: { xs: 'none',sm: 'block', lg: 'none' }, justifyContent: 'center' }}>
        </Grid>
        <Grid
          size={{ xs: 1, sm: 1, lg: 2 }}
          sx={{ display: { xs: 'flex', lg: 'none' }, justifyContent: 'center' }}
        >
          <IconButton
            aria-label="login"
            component={Link}
            href={isLoggedIn ? '/user' : '/login'}
            title={isLoggedIn ? 'My Account' : 'Log in'}
          >
            <PersonOutlineOutlinedIcon sx={{ color: currentTextColor }} />
          </IconButton>
        </Grid>

        {isLoggedIn ? (
          <Grid
            size={{ xs: 1, sm: 1, lg: 2 }}
            sx={{ display: { xs: 'flex', lg: 'none' }, justifyContent: 'center', }}
          >
            <IconButton aria-label="log out" onClick={handleLogout} title="Log out">
              <LogoutOutlinedIcon sx={{ color: currentTextColor }} />
            </IconButton>
          </Grid>
        ) : null}

        <Grid
          size={{ xs: 1, sm: 1, lg: 2 }}
          sx={{ display: { xs: 'flex', lg: 'none' }, justifyContent: 'center', m: 0  }}
        >
          <IconButton onClick={handleDrawerToggle}>
            <MenuIcon sx={{ color: currentTextColor, ml: 0 }} />
          </IconButton>
        </Grid>

        {/* Mobile animated drawer using StaggeredMenu (right anchored) */}
        {drawerOpen && (
          <MobileStaggeredDrawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            pages={pages}
            isLoggedIn={isLoggedIn}
            onNavigate={(href) => router.push(href)}
            onLogout={handleLogout}
          />
        )}
      </Grid>
    </Box>
  );
}