'use client';
import { Box, Button, Grid, InputBase, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import { useEffect, useState } from 'react';
import { Drawer, IconButton, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

export default function Navbar(
  { navColor = 'background.default', mobileNavColor }: { navColor?: string; mobileNavColor?: string }
) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const mColor = mobileNavColor ?? navColor;

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Detect auth state from localStorage token
  useEffect(() => {
    // Initial check
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    setIsLoggedIn(!!token);

    // Listen for token changes across tabs/windows
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'token') {
        setIsLoggedIn(!!e.newValue);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const pages = ['Home', 'About Us', 'Properties', 'Plans', 'Contact'];

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
      <Grid container spacing={2} alignItems="center" display={{ xs: 'none', md: 'flex' }}>
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
                color: navColor,
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
                borderColor: navColor,
                borderRadius: 4,
                px: 1,
                py: 0.5,
                height: '35px',
                width: {md:'22.5vw', lg:'27.5vw'},
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'left',
              }}
            >
              <SearchIcon sx={{ color: navColor, mr: 1 }} />
              <InputBase
                placeholder="Search Properties"
                sx={{
                  width: '100%',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '16px',
                  color: navColor,
                }}
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
                sx={{
                  color: navColor,
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'Montserrat, sans-serif',
                  //textTransform: 'capitalize',
                  borderRadius: 3,
                }}
              >
                ABOUT US
              </Button>
            </Grid>

            <Grid>
              <Button
                variant="text"
                sx={{
                  //backgroundColor: 'primary.main',
                  color: navColor,
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 500,
                  borderRadius: 3,
                }}
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
                  color: navColor,
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 500,
                  borderRadius: 3,
                }}
              >
                PLANS
              </Button>
            </Grid>

            <Grid>
              <Button
                variant="outlined"
                sx={{
                  borderColor: navColor,
                  color: navColor,
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
                {isLoggedIn ? 'My Account' : 'Log in'}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container sx={{ marginTop: 6 }} columns={{ xs: 12, sm: 16, md: 12 }}>
        <Grid size={{ xs: isLoggedIn ? 9 : 10, sm: isLoggedIn ? 8 : 9, md: 6 }}>
          <Box
            sx={{
              alignItems: 'center',
              border: '1px solid',
              borderColor: mColor,
              borderRadius: 4,
              mx:1,
              py: 0.5,
              height: '35px',
              display: { xs: 'flex', md: 'none' },
            }}
          >
            <SearchIcon sx={{ color: mColor, ml: 1 }} />
            <InputBase
              placeholder="AI Search"
              sx={{
                width: '100%',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '14px',
                color: mColor,
                ml: 1,
              }}
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 0, sm: 5, md: 0 }}
          width={'100%'} sx={{ display: { xs: 'none',sm: 'block', md: 'none' }, justifyContent: 'center' }}>
        </Grid>
        <Grid
          size={{ xs: 1, sm: 1, md: 2 }}
          sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center' }}
        >
          <IconButton
            aria-label="login"
            component={Link}
            href={isLoggedIn ? '/user' : '/login'}
            title={isLoggedIn ? 'My Account' : 'Log in'}
          >
            <PersonOutlineOutlinedIcon sx={{ color: mColor }} />
          </IconButton>
        </Grid>

        {isLoggedIn ? (
          <Grid
            size={{ xs: 1, sm: 1, md: 2 }}
            sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', }}
          >
            <IconButton aria-label="log out" onClick={handleLogout} title="Log out">
              <LogoutOutlinedIcon sx={{ color: mColor }} />
            </IconButton>
          </Grid>
        ) : null}

        <Grid
          size={{ xs: 1, sm: 1, md: 2 }}
          sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', m: 0  }}
        >
          <IconButton onClick={handleDrawerToggle}>
            <MenuIcon sx={{ color: mColor, ml: 0 }} />
          </IconButton>
        </Grid>

        {/* Drawer */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: '100vw',
              height: '100vh',
              backgroundColor: 'background.default',
              padding: 4,
            },
          }}
        >
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: 'grey.500',
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box sx={{ mt: 10 }}>
            <List>
              {pages.map((page, index) => (
                <ListItem key={index} disableGutters>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontFamily: 'Montserrat, sans-serif',
                          fontSize: '18px',
                          fontWeight: 500,
                          color: 'primary.main',
                          ml: 2,
                        }}
                      >
                        {page}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
            <Grid container sx={{ paddingTop: '42vh' }}>
              <Grid size={{ xs: 2 }} sx={{ paddingTop: '24px' }}>
                <img
                  src="logo.jpeg"
                  alt="Logo"
                  style={{ width: '45px', height: '45px', borderRadius: '10%' }}
                />
              </Grid>
              <Grid size={{ xs: 10 }}>
                <Typography
                  fontWeight="600"
                  textAlign={{ xs: 'left', md: 'left' }}
                  fontSize={'20px'}
                  sx={{ paddingTop: '20px', color: 'primary.main' }}
                >
                  Nomad Estate
                </Typography>
                <Typography
                  fontWeight="200"
                  textAlign={{ xs: 'left', md: 'left' }}
                  fontSize={'15px'}
                  sx={{ color: 'grey.500' }}
                >
                  Global Investment Platform
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Drawer>
      </Grid>
    </Box>
  );
}
