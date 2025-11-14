'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function SorryPage() {
  const router = useRouter();

  const handleBack = React.useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  }, [router]);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
      <Box sx={{ textAlign: 'center', maxWidth: 720 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          Oops! We are sorry, but this feature is not here yet... :(
        </Typography>
        <Typography variant="body2" sx={{ mb: 4, color: 'text.secondary' }}>
          We&apos;re working on it. In the meantime, you can go back.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleBack}>
          Go back
        </Button>
      </Box>
    </Box>
  );
}
