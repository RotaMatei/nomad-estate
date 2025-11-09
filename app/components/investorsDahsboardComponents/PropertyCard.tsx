'use client';

import { Card, CardContent, Typography, Button, useTheme } from '@mui/material';
import { use } from 'react';

interface Props {
  city: string;
  roi: string;
  appreciation: string;
  yield: string;
  price: string;
  income: string;
  colorScheme?: 'primary' | 'secondary';
}

export default function PropertyCard({ city, roi, appreciation, yield: rentalYield, price, income, colorScheme = 'secondary' }: Props) {
  const theme = useTheme();
  const mainColor = colorScheme === 'primary' ? theme.palette.primary.main : theme.palette.secondary.main;
  return (
    <Card elevation={4} sx={{ borderRadius: 4 , backgroundColor: theme.palette.background.default, boxShadow:'none', justifyContent:'center' }}>
      <CardContent>
  <Typography variant="h6" sx={{ color: mainColor }}>{city}</Typography>
        <Typography variant="body2">ROI: {roi}</Typography>
        <Typography variant="body2">Appreciation: {appreciation}</Typography>
        <Typography variant="body2">Rental Yield: {rentalYield}</Typography>
        <Typography variant="body2">Price: {price}</Typography>
        <Typography variant="body2">Monthly Income: {income}</Typography>
        <Button variant="contained" fullWidth sx={{ mt: 2 }} color={colorScheme === 'primary' ? 'primary' : 'secondary'}>
          View Properties
        </Button>
      </CardContent>
    </Card>
  );
}