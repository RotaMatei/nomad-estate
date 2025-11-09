'use client';

import { Grid, Paper, Typography, useTheme } from '@mui/material';

const metrics = [
  { label: 'Global Markets', value: 127 },
  { label: 'Avg. ROI', value: '8.2%' },
  { label: 'Vacation Cities', value: 24 },
  { label: 'End ROI', value: '6.0%' },
  { label: 'Avg. Appreciation', value: '4.2%' },
  { label: 'Avg. Rental Yield', value: '5.1%' },
];

interface TopMetricsProps {
  colorScheme?: 'primary' | 'secondary';
}

export default function TopMetrics({ colorScheme = 'secondary' }: TopMetricsProps) {
  const theme = useTheme();
  const mainColor = colorScheme === 'primary' ? theme.palette.primary.main : theme.palette.secondary.main;

  return (
    <Grid container spacing={2} sx={{mt:4, mb:4}}>
      {metrics.map((m, i) => (
        <Grid key={i} size={{ xs: 6, sm: 4, md: 2 }}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 4, textAlign: 'center' , backgroundColor: 'background.default', boxShadow: 'none', border: '1px solid', borderColor: '#c2c2c265', height: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h6" sx={{ color: mainColor }}>{m.value}</Typography>
            <Typography variant="body2" color="text.secondary">{m.label}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}