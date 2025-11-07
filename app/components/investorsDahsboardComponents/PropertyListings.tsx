'use client';

import { Grid } from '@mui/material';
import PropertyCard from './PropertyCard';

const listings = [
  { city: 'Lisbon, Portugal', roi: '6%', appreciation: '4%', yield: '5%', price: '$230K', income: '$950' },
  { city: 'Istanbul, Turkey', roi: '8%', appreciation: '5%', yield: '6%', price: '$210K', income: '$1,050' },
  { city: 'Dubai, UAE', roi: '9%', appreciation: '6%', yield: '7%', price: '$250K', income: '$1,200' },
  { city: 'Athens, Greece', roi: '7%', appreciation: '3%', yield: '5%', price: '$220K', income: '$1,000' },
];

export default function PropertyListings() {
  return (
    <Grid container spacing={3} sx={{ mt: 2, }}>
      {listings.map((props, i) => (
        <Grid sx={{ xs: 12, sm: 6, md: 3 }} key={i}>
          <PropertyCard {...props} />
        </Grid>
      ))}
    </Grid>
  );
}