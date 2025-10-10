'use client';
import React from "react";
import styles from "../page.module.css";
import { ThemeProvider } from "@emotion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { lightTheme } from "./theme";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Navbar from "./components/navbar";
import HeroBackground from "./components/heroBackground";
import Phone from "./components/phone";
export default function Home() {
  const router = useRouter();



  // const [user, setUser] = useState('');

  // useEffect(() => {
  //   const storedUser = localStorage.getItem('user');
  //   if (storedUser) setUser(storedUser);
  // }, [])

  return (
    <ThemeProvider theme={lightTheme}>
      <Box sx={{ overflow: 'visible' }}>
        <Navbar />
        <Box  sx={{
                position: 'relative'}}>
          <HeroBackground>
            <Box
              sx={{
                textAlign: 'center',
                color: '#fff',
                fontFamily: 'Montserrat, sans-serif',

              }}
            >
              <Grid container>
                <Grid size={{ xs: 12, sm: 5 }}>
                  <Typography variant="h2" fontWeight="900" textAlign={"left"} fontSize={"56px"} sx={{ paddingLeft: '88px', color: 'background.default' }}>
                    Welcome to the Future of Global Real Estate
                  </Typography>
                  <Grid container sx={{ paddingLeft: '70px', }} >
                    <Grid size={{ xs: 2 }} sx={{ paddingTop: '24px' }}>
                      <img src="logo.jpeg" alt="Logo" style={{ width: '45px', height: '45px', borderRadius: '10%' }} />
                    </Grid>
                    <Grid size={{ xs: 10 }}>
                      <Typography fontWeight="600" textAlign={"left"} fontSize={"20px"} sx={{ paddingTop: '20px' }}>
                        Nomad Estate
                      </Typography>
                      <Typography fontWeight="200" textAlign={"left"} fontSize={"15px"} >
                        Global Investment Platform
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </HeroBackground>
          <Box
            sx={{
              position: 'absolute',
              top: '60px',
              right: '28vw',
              zIndex: 10,
            }}
          >
            <Phone />
          </Box>
        </Box>

        <Box sx={{ backgroundColor: "background.default", height: '100vh', display: 'flex', justifyContent: 'normal', alignItems: 'center' }}>

          {/* <button onClick={() => router.push('/login')} className={styles.secondary}>Login</button>
        <button onClick={() => router.push('/register')} className={styles.secondary}>Register</button>
        <button onClick={() => router.push('/user/changePassword')} className={styles.secondary}>Change Password</button> */}
        </Box>
      </Box>
    </ThemeProvider>

  );
}
