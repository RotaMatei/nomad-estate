'use client';

import { Paper, Typography, useTheme } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const data = [
  { month: 'Jan', yield: 4.8 },
  { month: 'Feb', yield: 5.0 },
  { month: 'Mar', yield: 5.2 },
  { month: 'Apr', yield: 5.3 },
  { month: 'May', yield: 5.4 },
  { month: 'Jun', yield: 5.1 },
  { month: 'Jul', yield: 5.3 },
  { month: 'Aug', yield: 5.5 },
  { month: 'Sep', yield: 5.6 },
  { month: 'Oct', yield: 5.7 },
  { month: 'Nov', yield: 5.8 },
  { month: 'Dec', yield: 5.9 },
];

export default function YieldGraph() {
  const theme = useTheme();
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 4, backgroundColor: 'background.default' }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'secondary.main' }}>
        Average Yield (last 12 months)
      </Typography>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[4, 6]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="yield"
            stroke={theme.palette.secondary.main}
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}