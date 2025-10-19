'use client';
import React from "react";
import styles from "../page.module.css";
import { ThemeProvider } from "@emotion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { lightTheme } from "../../theme";
import Box from '@mui/material/Box';
import HeroSection from "../../components/homeComponents/heroSection";
import InvestmentStats from "../../components/homeComponents/investmentStats";
import WhyChooseNomad from "../../components/homeComponents/whyChooseNomad";
import GlobalTrustGrid from "../../components/homeComponents/globalTrustGrid";
import ChoosePath from "../../components/homeComponents/choosePath";
export default function Home() {
  const router = useRouter();

  // const [user, setUser] = useState('');

  // useEffect(() => {
  //   const storedUser = localStorage.getItem('user');
  //   if (storedUser) setUser(storedUser);
  // }, [])

  return (
    <ThemeProvider theme={lightTheme}>
      
        <HeroSection />
        <InvestmentStats />
        <WhyChooseNomad />
        <GlobalTrustGrid />
        <ChoosePath />
  
    <Box
        sx={{
          backgroundColor: 'text.secondary',
          height: '40vh',
          display: 'flex',
          justifyContent: 'normal',
          alignItems: 'center',
        }}
      >
        {/* <button onClick={() => router.push('/login')} className={styles.secondary}>Login</button>
        <button onClick={() => router.push('/register')} className={styles.secondary}>Register</button>
        <button onClick={() => router.push('/user/changePassword')} className={styles.secondary}>Change Password</button> */}
      </Box>
    </ThemeProvider >

  );
}
