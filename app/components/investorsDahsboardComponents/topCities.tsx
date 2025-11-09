'use client';

import { Grid, Box, useMediaQuery, useTheme, Typography, Chip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import PropertyCard from './PropertyCard';

const listings = [
  { city: 'Lisbon, Portugal', roi: '6%', appreciation: '4%', yield: '5%', price: '$230K', income: '$950' },
  { city: 'Istanbul, Turkey', roi: '8%', appreciation: '5%', yield: '6%', price: '$210K', income: '$1,050' },
  { city: 'Dubai, UAE', roi: '9%', appreciation: '6%', yield: '7%', price: '$250K', income: '$1,200' },
  { city: 'Athens, Greece', roi: '7%', appreciation: '3%', yield: '5%', price: '$220K', income: '$1,000' },
];

interface TopCitiesProps {
  colorScheme?: 'primary' | 'secondary';
}

export default function TopCities({ colorScheme = 'secondary' }: TopCitiesProps) {
  const theme = useTheme();
  const mainColor = colorScheme === 'primary' ? theme.palette.primary.main : theme.palette.secondary.main;
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const cols = isLgUp ? 4 : isSmUp ? 2 : 1;
  return (
    <Box sx={{ mt: 2, boxShadow: 'none', mb: 4, border: '1px solid', borderColor: '#c2c2c265', borderRadius: 4, p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <Typography variant="subtitle2" sx={{ color: mainColor, m: 0 }}>
          Places to Invest In Right Now
        </Typography>
        <Chip
          label="Most Popular"
          size="small"
          sx={(theme) => ({
            fontWeight: 600,
            bgcolor: alpha(theme.palette.success.main, 0.12),
            color: theme.palette.success.dark,
        
          })}
        />
      </Box>
      <Grid container spacing={3}>
        {listings.map((props, i) => {
          const hasRightNeighbor = cols > 1 && (i % cols) !== cols - 1 && i < listings.length - 1;
          return (
            <Grid
              key={i}
              size={{ xs: 12, sm: 6, lg: 3 }}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                borderRight: isSmUp && hasRightNeighbor ? '1px solid' : 'none',
                borderColor: '#c2c2c265',
                pr: hasRightNeighbor ? 2 : 0,
              }}
            >
              <Box sx={{ width: '100%' }}>
                <PropertyCard {...props} colorScheme={colorScheme} />
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}