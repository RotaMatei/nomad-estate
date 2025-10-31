import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import HeroBackground from './heroBackground';
import Phone from './phone';
import GlassPropertyGallery from './glassedCardHero';
import Navbar from './navbar';

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
            <Grid
              container
              display={{ xs: 'flex', sm: 'flex', md: 'block' }}
              justifyContent={{ xs: 'center', sm: 'center', md: 'flex-start' }}
              flexDirection={{ xs: 'row' }}
            >
              <Grid
                size={{ xs: 12 }}
                sx={{ position: 'absolute', top: 0, width: '100vw', zIndex: 300 }}
              >
                <Navbar />
              </Grid>
              <Grid size={{ xs: 10, md: 5 }} sx={{ marginTop: { xs: '70px', md: '80px' } }}>
                <Typography
                  variant="h2"
                  fontWeight={900}
                  textAlign={{ xs: 'center', sm: 'center', md: 'left' }}
                  fontSize={{ xs: '40px', lg: '56px' }}
                  sx={{
                    paddingLeft: { md: '10vw' },
                    color: 'background.default',
                  }}
                >
                  Welcome to the Future of Global Real Estate
                </Typography>

                <Grid container sx={{ paddingLeft: { md: '9vw' } }}>
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
              top: '115px',
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
              top: '90px',
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
    </>
  );
};

export default HeroSection;
