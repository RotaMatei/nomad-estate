'use client';
import React from "react";
import styles from "../page.module.css";
import { ThemeProvider } from "@emotion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { lightTheme } from "./theme";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Navbar from "./components/navbar";
import HeroSection from "./components/heroSection";
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
        <HeroSection />
    </Box >
    </ThemeProvider >

  );
}
