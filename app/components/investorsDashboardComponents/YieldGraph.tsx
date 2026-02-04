'use client';

import { Grid, Paper, Typography, useTheme, Box, Stack } from '@mui/material';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
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
  { month: 'Sep', yield: 6.0 },
  { month: 'Oct', yield: 5.7 },
  { month: 'Nov', yield: 5.8 },
  { month: 'Dec', yield: 5.9 },
];

interface YieldGraphProps {
  colorScheme?: 'primary' | 'secondary';
}

export default function YieldGraph({ colorScheme = 'secondary' }: YieldGraphProps) {
  const theme = useTheme();
  const mainColor = colorScheme === 'primary' ? theme.palette.primary.main : theme.palette.secondary.main;
  const avgYield = data.reduce((sum, d) => sum + d.yield, 0) / data.length;
  const avgText = `${avgYield.toFixed(1)}%`;
  // Highest yield across all data points
  const highestYield = Math.max(...data.map(d => d.yield));
  const highestYieldText = `${highestYield.toFixed(1)}%`;
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 4, backgroundColor: 'background.default', boxShadow: 'none', border: '1px solid', borderColor: '#c2c2c265' }}>
      <Typography variant="subtitle2" gutterBottom sx={{ color: mainColor, mb: 2 }}>
        Average Yield
      </Typography>
      <Grid container sx={{ alignItems: 'flex-start' }}>
        <Grid size={{ xs: 12, sm: 9 }} sx={{ borderRight: {sm:'1px solid'}, borderColor: {sm: '#c2c2c265'}, pr: 4 }}>
          <Box sx={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 8, bottom: 0, left:10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tickMargin={8} />
                <YAxis domain={[4, 6]} width={28} tickMargin={6} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="yield"
                  stroke={mainColor}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
        <Grid
          size={{ sm: 3 }}
          display={{ xs: 'none', sm: 'flex' }}
          sx={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', pt:3.5 }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1, borderBottom: '1px solid', borderColor: '#c2c2c265', pb:3,mb: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <InsightsOutlinedIcon sx={{ color: mainColor }} />
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}> Total Average</Typography>
            </Stack>
            <Typography sx={{ fontWeight: 600, color: 'text.primary', lineHeight: 1, fontSize: { xs: 30 } }}>
              {avgText}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <WorkspacePremiumOutlinedIcon sx={{ color: mainColor }} />
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}> Highest Yield</Typography>
            </Stack>
            <Typography sx={{ fontWeight: 600, color: 'text.primary', lineHeight: 1, fontSize: { xs: 30} }}>
              {highestYieldText}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
