import { Container, Grid, CircularProgress, Typography } from '@mui/material';
import RealEstateCard from './propertyCard';
import api from '@/app/lib/api';
import React from 'react';

interface PropertySummary {
  id: string;
  title?: string;
  city?: string;
  country?: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  totalArea?: number;
  yield?: number;
  score?: number;
  tags?: string[];
}

const ListingsPage: React.FC = () => {
  const [data, setData] = React.useState<PropertySummary[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Basic search endpoint wiring (extend with query params later)
        const res = await api.get('/property/retrieve-search');
        if (!cancelled) setData(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        if (!cancelled) setError('Failed to load properties');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <Container sx={{ py: 6, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 6, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {data.map(p => (
          <Grid key={p.id} size={{ xs: 12, sm: 6, md: 3 }}>
            <RealEstateCard
              imageUrl={"dubai4.jpg" /* TODO: replace with p.imageUrl when backend provides */}
              tags={p.tags || []}
              score={p.score ?? 0}
              title={p.title || 'Property'}
              location={[p.city, p.country].filter(Boolean).join(', ') || 'Unknown'}
              price={p.price ? `$${p.price.toLocaleString()}` : 'N/A'}
              beds={p.bedrooms ?? 0}
              baths={p.bathrooms ?? 0}
              area={p.totalArea ?? 0}
              yield={p.yield ?? 0}
              company={''}
              onViewDetails={() => window.location.assign(`/details/${p.id}`)}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ListingsPage;