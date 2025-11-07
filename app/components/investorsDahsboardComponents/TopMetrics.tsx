'use client';

import { Grid, Paper, Typography } from '@mui/material';

const metrics = [
  { label: 'Global Markets', value: 127 },
  { label: 'Avg. ROI', value: '8.2%' },
  { label: 'Vacation Cities', value: 24 },
  { label: 'End ROI', value: '6.0%' },
  { label: 'Avg. Appreciation', value: '4.2%' },
  { label: 'Avg. Rental Yield', value: '5.1%' },
];

export default function TopMetrics() {
  return (
    <Grid container spacing={2}>
      {metrics.map((m, i) => (
        <Grid sx={{ xs: 6, md: 4 }} key={i} component="div">
          <Paper elevation={3} sx={{ p: 2, borderRadius: 4, textAlign: 'center' , backgroundColor: 'background.default' }}>
            <Typography variant="h6" sx={{ color: 'secondary.main' }}>{m.value}</Typography>
            <Typography variant="body2" color="text.secondary">{m.label}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}