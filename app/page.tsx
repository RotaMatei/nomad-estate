'use client';
import React from "react";
import styles from "../page.module.css";
import { ThemeProvider } from "@emotion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import '@fontsource/montserrat';
import { lightTheme } from "./theme";
import Box from "@mui/material/Box";
import Navbar from "./components/navbar";

export default function Home() {
  const router = useRouter();

  // const [user, setUser] = useState('');

  // useEffect(() => {
  //   const storedUser = localStorage.getItem('user');
  //   if (storedUser) setUser(storedUser);
  // }, [])

  return (
    <ThemeProvider theme={lightTheme}>
      <Navbar />
    <div>
        <Box component="h1" sx={{ color: lightTheme.palette.text.primary, fontFamily: lightTheme.typography.fontFamily }}>
          Home
        </Box>
        {/* <button onClick={() => router.push('/login')} className={styles.secondary}>Login</button>
        <button onClick={() => router.push('/register')} className={styles.secondary}>Register</button>
        <button onClick={() => router.push('/user/changePassword')} className={styles.secondary}>Change Password</button> */}
      </div>
    </ThemeProvider>

  );
}
