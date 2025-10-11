import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import HeroBackground from './heroBackground';
import Phone from './phone';
import GlassPropertyGallery from './glassedCardHero';

const HeroSection = () => {
  return (
    <>
      <Box sx={{ position: 'relative' }}>
        <HeroBackground>
          <Box
            sx={{
              textAlign: 'center',
              color: '#fff',
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            <Grid container>
              <Grid size={{ xs: 10, md: 5 }}>
                <Typography
                  variant="h2"
                  fontWeight="900"
                  textAlign={{ xs: 'center', md: 'left' }}
                  fontSize={{ xs: '35px', lg: '56px' }}
                  sx={{ paddingLeft: '88px', color: 'background.default' }}
                >
                  Welcome to the Future of Global Real Estate
                </Typography>
                <Grid container sx={{ paddingLeft: '70px' }}>
                  <Grid
                    size={{ md: 2 }}
                    sx={{ paddingTop: '24px', display: { xs: 'none', md: 'block' } }}
                  >
                    <img
                      src="logo.jpeg"
                      alt="Logo"
                      style={{ width: '45px', height: '45px', borderRadius: '10%' }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 10 }}>
                    <Typography
                      fontWeight="600"
                      textAlign={{ xs: 'center', md: 'left' }}
                      fontSize={'20px'}
                      sx={{ paddingTop: '20px' }}
                    >
                      Nomad Estate
                    </Typography>
                    <Typography
                      fontWeight="200"
                      textAlign={{ xs: 'center', md: 'left' }}
                      fontSize={'15px'}
                    >
                      Global Investment Platform
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </HeroBackground>
        <Grid container>
          <Grid
            size={{ xs: false, md: 6 }}
            offset={{ xs: 6 }}
            sx={{
              position: 'absolute',
              top: '60px',
              right: '3vw',
              zIndex: 10,
              display: { xs: 'none', md: 'block' },
            }}
          >
            <Phone />
          </Grid>
          <Grid
            size={{ xs: false, md: 6 }}
            sx={{
              position: 'absolute',
              top: '5vh',
              left: '55vw',
              zIndex: 5,
              width: '70%',
              overflow: 'hidden',
              display: { xs: 'none', md: 'block' },
            }}
          >
            <GlassPropertyGallery />
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          backgroundColor: 'background.default',
          height: '100vh',
          display: 'flex',
          justifyContent: 'normal',
          alignItems: 'center',
        }}
      >
        {/* <button onClick={() => router.push('/login')} className={styles.secondary}>Login</button>
        <button onClick={() => router.push('/register')} className={styles.secondary}>Register</button>
        <button onClick={() => router.push('/user/changePassword')} className={styles.secondary}>Change Password</button> */}
      </Box>
    </>
  );
};

export default HeroSection;