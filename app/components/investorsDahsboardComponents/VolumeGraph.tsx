'use client';

import { Grid, Paper, Typography, useTheme, Box, Stack } from '@mui/material';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import { alpha } from '@mui/material/styles';
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
  const avgVolume = data.reduce((sum, d) => sum + d.volume, 0) / data.length;
  const highestVolume = Math.max(...data.map(d => d.volume));
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 4, backgroundColor: 'background.default', boxShadow: 'none', border: '1px solid', borderColor: '#c2c2c265' }}>
      <Typography variant="subtitle2" gutterBottom sx={{ color: 'secondary.main', mb: 2 }}>
        Investment Volume
      </Typography>
      <Grid container sx={{ alignItems: 'flex-start' }}>
        <Grid size={{ xs: 12, sm: 9 }} sx={{ borderRight: { sm: '1px solid' }, borderColor: { sm: '#c2c2c265' }, pr: 4 }}>
          <Box sx={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 8, bottom: 0, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" tickMargin={8} />
                <YAxis domain={[0, Math.ceil(highestVolume * 1.1)]} width={40} tickMargin={6} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke={theme.palette.secondary.main}
                  fill={alpha(theme.palette.secondary.main, 0.16)}
                  strokeWidth={3}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
        <Grid
          size={{ sm: 3 }}
          display={{ xs: 'none', sm: 'flex' }}
          sx={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', pt: 3.5 }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1, borderBottom: '1px solid', borderColor: '#c2c2c265', pb: 3, mb: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <CalculateOutlinedIcon sx={{ color: 'secondary.main' }} />
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}> Avg Volume</Typography>
            </Stack>
            <Typography sx={{ fontWeight: 600, color: 'text.primary', lineHeight: 1, fontSize: { xs: 30 } }}>
              {avgVolume.toFixed(0)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <WorkspacePremiumOutlinedIcon sx={{ color: 'secondary.main' }} />
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}> Highest Volume</Typography>
            </Stack>
            <Typography sx={{ fontWeight: 600, color: 'text.primary', lineHeight: 1, fontSize: { xs: 30 } }}>
              {highestVolume.toFixed(0)}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}