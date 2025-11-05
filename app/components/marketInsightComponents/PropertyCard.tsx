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
}

export default function PropertyCard({ city, roi, appreciation, yield: rentalYield, price, income }: Props) {
  const theme = useTheme();
  return (
    <Card elevation={4} sx={{ borderRadius: 4 , backgroundColor: theme.palette.background.default }}>
      <CardContent>
  <Typography variant="h6" sx={{ color: 'secondary.main' }}>{city}</Typography>
        <Typography variant="body2">ROI: {roi}</Typography>
        <Typography variant="body2">Appreciation: {appreciation}</Typography>
        <Typography variant="body2">Rental Yield: {rentalYield}</Typography>
        <Typography variant="body2">Price: {price}</Typography>
        <Typography variant="body2">Monthly Income: {income}</Typography>
        <Button variant="contained" fullWidth sx={{ mt: 2 }} color="secondary">
          View Properties
        </Button>
      </CardContent>
    </Card>
  );
}