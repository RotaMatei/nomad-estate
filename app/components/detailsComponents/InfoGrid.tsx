"use client";

import { Grid, Typography, Box } from '@mui/material';

interface InfoGridProps {
  items: { label: string; value: string | number | boolean | null | undefined }[];
}

export default function InfoGrid({ items }: InfoGridProps) {
  return (
    <Grid container spacing={2}>
      {items.map(({ label, value }) => (
        <Grid size={{ xs: 12, sm: 6 }} key={label}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              {label}
            </Typography>
            <Typography variant="body1">
              {value !== null && value !== undefined ? value.toString() : '—'}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}