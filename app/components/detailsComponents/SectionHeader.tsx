"use client";

import { Typography } from '@mui/material';

export default function SectionHeader({ title }: { title: string }) {
  return (
    <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
      {title}
    </Typography>
  );
}