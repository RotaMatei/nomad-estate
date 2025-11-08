"use client";

import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function AgencyDashboardPage() {
  const router = useRouter();
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Agency Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Welcome! This is a placeholder dashboard. You can build out your portfolio and agency tools here.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => router.push('/')}>Go to Home</Button>
    </Box>
  );
}
