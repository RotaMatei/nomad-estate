'use client';

import { Grid, Box, useMediaQuery, useTheme, Typography, Chip, Button } from '@mui/material';
import { alpha } from '@mui/material/styles';
import PropertyCard from './PropertyCard';

import React from 'react';
import axios from 'axios';
import { env } from '@/app/config/env';
import { CountryMarketData } from '@/app/lib/types/api';

interface TopCitiesProps {
  colorScheme?: 'primary' | 'secondary';
}

export default function TopCities({ colorScheme = 'secondary' }: TopCitiesProps) {
  const theme = useTheme();
  const mainColor = colorScheme === 'primary' ? theme.palette.primary.main : theme.palette.secondary.main;
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const cols = isLgUp ? 4 : isSmUp ? 2 : 1;
  const [countries, setCountries] = React.useState<CountryMarketData[]>([]);
  React.useEffect(() => {
    axios.get<{ data: CountryMarketData[] }>(`${env.aiApiUrl}/api/country-market-data/all`)
      .then(res => {
        // Handle paginated response structure
        const responseData = res.data as { data?: CountryMarketData[] } | CountryMarketData[];
        const arr = Array.isArray(responseData) 
          ? responseData 
          : (Array.isArray(responseData.data) ? responseData.data : []);
        setCountries(arr.slice(0, 4));
      })
      .catch(() => setCountries([]));
  }, []);

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
        {countries.map((c, i) => {
          const hasRightNeighbor = cols > 1 && (i % cols) !== cols - 1 && i < countries.length - 1;
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
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" sx={{ color: mainColor, flexGrow: 1 }}>{c.countryName}</Typography>
                  {c.aiMarketScore && (
                    <Chip label={`Score: ${Math.round(Number(c.aiMarketScore))}`} color="success" size="small" sx={{ ml: 'auto' }} />
                  )}
                </Box>
                {c.rentalYieldProxy && (
                  <Typography variant="body2">Rental Yield Proxy: {Math.round(Number(c.rentalYieldProxy))}</Typography>
                )}
                {c.regulationLegal && (
                  <Typography variant="body2">Regulation & Legal: {Math.round(Number(c.regulationLegal))}</Typography>
                )}
                {c.transactionFriction && (
                  <Typography variant="body2">Transaction Friction: {Math.round(Number(c.transactionFriction))}</Typography>
                )}
                {c.currencyStability && (
                  <Typography variant="body2">Currency Stability: {Math.round(Number(c.currencyStability))}</Typography>
                )}
                {c.marketLiquidityProxy && (
                  <Typography variant="body2">Market Liquidity Proxy: {Math.round(Number(c.marketLiquidityProxy))}</Typography>
                )}
                {c.mortgageAvailability && (
                  <Typography variant="body2">Mortgage Availability: {Math.round(Number(c.mortgageAvailability))}</Typography>
                )}
                {c.macroEconomics && (
                  <Typography variant="body2">Macro Economics: {Math.round(Number(c.macroEconomics))}</Typography>
                )}
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                  color={colorScheme === 'primary' ? 'primary' : 'secondary'}
                  onClick={() => {}}
                >
                  View Properties
                </Button>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
