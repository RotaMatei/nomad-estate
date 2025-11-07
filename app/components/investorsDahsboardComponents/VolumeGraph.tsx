'use client';

import { Paper, Typography } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const data = [
  { quarter: 'Q1', volume: 120 },
  { quarter: 'Q2', volume: 150 },
  { quarter: 'Q3', volume: 180 },
  { quarter: 'Q4', volume: 200 },
];

export default function VolumeGraph() {
  const theme = useTheme();
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 4 , backgroundColor: 'background.default' }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'secondary.main' }}>
        Investment Volume (per quarter)
      </Typography>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="quarter" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="volume"
            stroke={theme.palette.secondary.main}
            fill={alpha(theme.palette.secondary.main, 0.16)}
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
}