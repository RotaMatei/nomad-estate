import { Container, Grid } from '@mui/material';
import RealEstateCard from './propertyCard';
const ListingsPage = () => {
  return (
    <Container sx={{ py: 4 }}>
      <Grid container sx={{  flexDirection: 'column', gap: 4,  }}>
        {/* Row 1: 5 cards per row on md screens */}
        <Grid container spacing={3} columns={{ xs: 12, sm: 12, md:12,lg: 20 }} >
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
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
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
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
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
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

          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
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
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
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