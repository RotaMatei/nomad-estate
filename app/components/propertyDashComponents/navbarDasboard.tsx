'use client';
import { Box, Button, Grid, InputBase, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import { useState } from 'react';
import { Drawer, IconButton, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const pages = ['Home', 'About Us', 'Properties', 'Plans', 'Contact'];

  return (
    <Box
      sx={{
        px: 4,
        paddingTop: { xs: 0, md: 3 },
        paddingBottom: { xs: 6, sm: 3, md: 1 },
        fontFamily: 'Montserrat, sans-serif',
        position: 'relative',
        zIndex: 1000, // ensure navbar sits above gradient/cards on all devices
      }}
    >
      <Grid container spacing={2} alignItems="center" display={{ xs: 'none', md: 'flex' }}>
        {/* Logo */}
        <Grid size={{ xs: 12, md: 6 }} >
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 2, // spacing between Typography and Search Box
            }}
          >

            <Typography
              sx={{
                color: 'secondary.main',
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
                borderColor: 'secondary.main',
                borderRadius: 4,
                px: 4,
                py: 0.5,
                height: '35px',
                width: '30vw',
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'left',
              }}
            >
              <SearchIcon sx={{ color: 'secondary.main', mr: 1 }} />
              <InputBase
                placeholder="Search Properties"
                sx={{
                  width: '100%',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '16px',
                  color: 'secondary.main',
                }}
              />
            </Box>
          </Box>
        </Grid>


        {/* Buttons */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Grid container spacing={2} justifyContent={{ xs: 'center', md: 'flex-end' }}>
            <Grid>
              <Button
                variant='text'
                sx={{
                  color: 'secondary.main',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'Montserrat, sans-serif',
                  //textTransform: 'capitalize',
                  borderRadius: 3,
                   '&:hover': {
                    backgroundColor: '#d9dbff47',
                   }
                }}
              >
                ABOUT US
              </Button>
            </Grid>

            <Grid>
              <Button
                variant='text'
                sx={{
                  //backgroundColor: 'secondary.main',
                  color: 'secondary.main',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 500,
                  borderRadius: 3,
                  '&:hover': {
                    backgroundColor: '#d9dbff47',
                   }
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
                  //backgroundColor: 'secondary.main',
                  color: 'secondary.main',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 500,
                  borderRadius: 3,
                  '&:hover': {
                    backgroundColor: '#d9dbff47',
                   }
                }}
              >
               PLANS
              </Button>
            </Grid>

            <Grid>
              <Button
                variant="outlined"
                sx={{
                  borderColor: 'secondary.main',
                  color: 'secondary.main',
                  fontFamily: 'Montserrat, sans-serif',
                  textTransform: 'none',
                  borderRadius: 3,
                  '&:hover': {
                    backgroundColor: 'secondary.main',
                    borderColor: 'secondary.main',
                    color: '#fff',
                  },
                }}
              >
                Log in
              </Button>
            </Grid>
          </Grid>
        </Grid>

      </Grid>
  <Grid container sx={{ marginTop: { xs: 6, sm: 3, md: 0 }, display:{ xs: 'flex', md: 'none' }, justifyContent:'center' }}>
        <Grid size={{ xs: 9, md: 6 }}>
          <Box
            sx={{
              alignItems: 'center',
              border: '1px solid',
              borderColor: 'secondary.main',
              borderRadius: 4,
              px: 4,
              py: 0.5,
              height: '35px',
              display: { xs: 'flex', md: 'none' },
            }}
          >
            <SearchIcon sx={{ color: 'secondary.main', mr: 1 }} />
            <InputBase
              placeholder="Search Properties"
              sx={{
                width: '100%',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '16px',
                color: 'secondary.main',
              }}
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 2, sm: 1 }} sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', }}>
          <IconButton aria-label="login">
            <PersonOutlineOutlinedIcon sx={{ color: 'secondary.main' }} />
          </IconButton>
        </Grid>

        <Grid size={{ xs: 1, md: 0 }} sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end' }}>
          <IconButton onClick={handleDrawerToggle}>
            <MenuIcon sx={{ color: 'secondary.main' }} />
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
                          color: 'secondary.main',
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
              <Grid
                size={{ xs: 2 }}
                sx={{ paddingTop: '24px' }}
              >
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
                  sx={{ paddingTop: '20px', color: 'secondary.main' }}
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