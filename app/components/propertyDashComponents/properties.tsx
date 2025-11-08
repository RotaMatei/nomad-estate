import { Container, Grid } from '@mui/material';
import RealEstateCard from './propertyCard';
const ListingsPage = () => {
  return (
    <Container sx={{ py: 4 }}>
      <Grid container sx={{ flexDirection: 'column', gap: 4 }}>
        <Grid container spacing={4} sx={{ display: 'flex' }}>
          <Grid size={{ xs: 12, sm: 4, md: 2 }}>
            <RealEstateCard
              imageUrl="dubai4.jpg"
              tags={['Low tax', 'Stable', 'Golden Visa']}
              score={97}
              title="Flat in Dubai"
              location="Dubai, United Arab Emirates"
              price="$4,884,269"
              beds={0}
              baths={800}
              area={5001}
              yield={8.9}
              company="Portugal Properties Ltd."
              onViewDetails={() => console.log('View Details clicked')}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4, md: 2 }}>
            <RealEstateCard
              imageUrl="dubai4.jpg"
              tags={['Low tax', 'Stable', 'Golden Visa']}
              score={97}
              title="Flat in Dubai"
              location="Dubai, United Arab Emirates"
              price="$4,884,269"
              beds={0}
              baths={80}
              area={5001}
              yield={8.9}
              company="Portugal Properties Ltd."
              onViewDetails={() => console.log('View Details clicked')}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4, md: 2 }}>
            <RealEstateCard
              imageUrl="dubai4.jpg"
              tags={['Low tax', 'Stable', 'Golden Visa']}
              score={97}
              title="Flat in Dubai"
              location="Dubai, United Arab Emirates"
              price="$4,884,269"
              beds={0}
              baths={80}
              area={5001}
              yield={8.9}
              company="Portugal Properties Ltd."
              onViewDetails={() => console.log('View Details clicked')}
            />
          </Grid>
      
        </Grid>
        <Grid container spacing={4} sx={{ display: 'flex', }}>
          <Grid size={{ xs: 12, sm: 4, md: 2 }}>
            <RealEstateCard
              imageUrl="dubai4.jpg"
              tags={['Low tax', 'Stable', 'Golden Visa']}
              score={97}
              title="Flat in Dubai"
              location="Dubai, United Arab Emirates"
              price="$4,884,269"
              beds={0}
              baths={80}
              area={5001}
              yield={8.9}
              company="Portugal Properties Ltd."
              onViewDetails={() => console.log('View Details clicked')}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4, md: 2 }}>
            <RealEstateCard
              imageUrl="dubai4.jpg"
              tags={['Low tax', 'Stable', 'Golden Visa']}
              score={97}
              title="Flat in Dubai"
              location="Dubai, United Arab Emirates"
              price="$4,884,269"
              beds={0}
              baths={80}
              area={5001}
              yield={8.9}
              company="Portugal Properties Ltd."
              onViewDetails={() => console.log('View Details clicked')}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4, md: 2 }}>
            <RealEstateCard
              imageUrl="dubai4.jpg"
              tags={['Low tax', 'Stable', 'Golden Visa']}
              score={97}
              title="Flat in Dubai"
              location="Dubai, United Arab Emirates"
              price="$4,884,269"
              beds={0}
              baths={80}
              area={5001}
              yield={8.9}
              company="Portugal Properties Ltd."
              onViewDetails={() => console.log('View Details clicked')}
            />
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ListingsPage;