'use client';

import { Grid, Box, useMediaQuery, useTheme, Typography, Chip, Button } from '@mui/material';
import { alpha } from '@mui/material/styles';
import PropertyCard from './PropertyCard';

import React from 'react';
import axios from 'axios';

interface CountryMarketData {
  country_name: string;
  ai_market_score: string;
  rental_yield_proxy: string;
  appreciation: string;
  price: string;
  monthly_income: string;
  regulation_legal: string;
  transaction_friction: string;
  currency_stability: string;
  market_liquidity_proxy: string;
  mortgage_availability: string;
  macro_economics: string;
}

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
    axios.get('https://ai.nomadestatehub.com/country-market-data/all')
      .then(res => {
        const arr = Array.isArray(res.data) ? res.data : [];
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
                  <Typography variant="h6" sx={{ color: mainColor, flexGrow: 1 }}>{c.country_name}</Typography>
                  <Chip label={`Score: ${Math.round(Number(c.ai_market_score))}`} color="success" size="small" sx={{ ml: 'auto' }} />
                </Box>
                <Typography variant="body2">Rental Yield Proxy: {Math.round(Number(c.rental_yield_proxy))}</Typography>
                <Typography variant="body2">Regulation & Legal: {Math.round(Number(c.regulation_legal))}</Typography>
                <Typography variant="body2">Transaction Friction: {Math.round(Number(c.transaction_friction))}</Typography>
                <Typography variant="body2">Currency Stability: {Math.round(Number(c.currency_stability))}</Typography>
                <Typography variant="body2">Market Liquidity Proxy: {Math.round(Number(c.market_liquidity_proxy))}</Typography>
                <Typography variant="body2">Mortgage Availability: {Math.round(Number(c.mortgage_availability))}</Typography>
                <Typography variant="body2">Macro Economics: {Math.round(Number(c.macro_economics))}</Typography>
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