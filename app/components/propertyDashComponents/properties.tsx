import { Container, Grid, CircularProgress, Typography } from '@mui/material';
import RealEstateCard from './propertyCard';
import api from '@/app/lib/api';
import React from 'react';

interface PropertyPictureDto {
  id: string;
  propertyId: string;
  imageData: unknown; // backend now sends number[] (Uint8Array) or string
  altText?: string | null;
  isPrimary: boolean;
}

interface InvestmentGoalTagDto { investmentGoalTag: string }
interface LocationBenefitTagDto { locationBenefitTag: string }

interface PropertySummary {
  id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  totalArea: number;
  yield: number;
  score: number;
  cityId?: number;
  countryId?: number;
  propertyPictures?: PropertyPictureDto[];
  propertyInvestmentGoalTags?: InvestmentGoalTagDto[];
  propertyLocationBenefitTags?: LocationBenefitTagDto[];
}

// No client-side buffer conversion needed anymore; backend sends base64 strings

const ListingsPage: React.FC = () => {
  const [data, setData] = React.useState<PropertySummary[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [cityMap, setCityMap] = React.useState<Record<number, string>>({});
  const [countryMap, setCountryMap] = React.useState<Record<number, string>>({});

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Basic search endpoint wiring (extend with query params later)
        console.log('[Listings] Fetching properties...');
        const res = await api.get('/property/retrieve-search');
        console.log('[Listings] Properties response:', res.status, Array.isArray(res.data) ? `count=${res.data.length}` : res.data);
        const list: PropertySummary[] = Array.isArray(res.data) ? res.data : [];
        if (!cancelled) {
          console.log('[Listings] Setting properties data (count):', list.length);
          setData(list);
        }

        // fetch city and country names for unique ids present
        const uniqueCityIds = Array.from(new Set(list.map(p => p.cityId).filter((x): x is number => typeof x === 'number')));
        const uniqueCountryIds = Array.from(new Set(list.map(p => p.countryId).filter((x): x is number => typeof x === 'number')));
        console.log('[Listings] Unique cityIds:', uniqueCityIds, 'Unique countryIds:', uniqueCountryIds);

        const newCityMap: Record<number, string> = { };
        const newCountryMap: Record<number, string> = { };

        for (const id of uniqueCityIds) {
          try {
            console.log(`[Listings] Fetching city ${id} ...`);
            const r = await api.get(`/cities/retrieve/${id}`);
            console.log(`[Listings] City ${id} response:`, r.status, r.data);
            if (r?.data?.name) newCityMap[id] = r.data.name as string;
          } catch { /* ignore per-id errors */ }
        }
        for (const id of uniqueCountryIds) {
          try {
            console.log(`[Listings] Fetching country ${id} ...`);
            const r = await api.get(`/countries/retrieve/${id}`);
            console.log(`[Listings] Country ${id} response:`, r.status, r.data);
            if (r?.data?.name) newCountryMap[id] = r.data.name as string;
          } catch { /* ignore per-id errors */ }
        }
        if (!cancelled) {
          console.log('[Listings] City map size:', Object.keys(newCityMap).length, 'Country map size:', Object.keys(newCountryMap).length);
          setCityMap((prev) => ({ ...prev, ...newCityMap }));
          setCountryMap((prev) => ({ ...prev, ...newCountryMap }));
        }
      } catch (e) {
        console.error('[Listings] Failed to load properties', e);
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
            {(() => {
              const cityName = p.cityId !== undefined ? cityMap[p.cityId] : undefined;
              const countryName = p.countryId !== undefined ? countryMap[p.countryId] : undefined;
              console.log('[Listings] Rendering card for', p.id, 'with cityName:', cityName, 'countryName:', countryName);
              const propertyWithNames = { ...p, cityName, countryName } as PropertySummary & { cityName?: string; countryName?: string };
              return (
                <RealEstateCard
                  property={propertyWithNames}
                  onViewDetails={(id: string) => {
                    // Prefer router for SPA navigation if available
                    if (typeof window !== 'undefined') {
                      window.location.assign(`/details/${id}`);
                    }
                  }}
                />
              );
            })()}
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ListingsPage;