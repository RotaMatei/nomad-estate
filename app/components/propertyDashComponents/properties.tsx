import { Container, Grid, CircularProgress, Typography, Box, IconButton, useMediaQuery, useTheme } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import RealEstateCard from './propertyCard';
import api from '@/app/lib/api';
import React from 'react';

interface PropertyPictureDto {
  id: string;
  propertyId: string;
  imageData: string; // backend now sends URL string
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

// No client-side conversion needed anymore; backend sends URL strings

const ListingsPage: React.FC = () => {
  const [data, setData] = React.useState<PropertySummary[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [cityMap, setCityMap] = React.useState<Record<number, string>>({});
  const [countryMap, setCountryMap] = React.useState<Record<number, string>>({});
  const [currentPage, setCurrentPage] = React.useState(1);
  // Track whether we restored from cache to decide if we must fetch
  const [restored, setRestored] = React.useState(false);

  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up('lg'));
  const pageSize = isLarge ? 30 : 28; // 5 columns x 6 rows (lg) or 4 columns x 7 rows (md)

  const totalPages = React.useMemo(() => Math.max(1, Math.ceil(data.length / pageSize)), [data.length, pageSize]);
  // Adjust currentPage if shrinking pageSize reduces total pages
  React.useEffect(() => {
    setCurrentPage((prev) => (prev > totalPages ? totalPages : prev));
  }, [totalPages]);

  const pagedData = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, currentPage, pageSize]);

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
    // scroll to top of listing on page change for better UX
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const pageNumbers = React.useMemo(() => {
    // For large counts, we could add ellipsis, but requirement says show all pages.
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

  // Try to restore from sessionStorage cache first
  React.useEffect(() => {
    if (typeof window === 'undefined') return; // SSR safety
    try {
      const cachedAll = sessionStorage.getItem('properties_all');
      const cachedPage = sessionStorage.getItem('properties_current_page');
      const cachedCityMap = sessionStorage.getItem('properties_city_map');
      const cachedCountryMap = sessionStorage.getItem('properties_country_map');
      if (cachedAll) {
        const parsed: PropertySummary[] = JSON.parse(cachedAll);
        setData(parsed);
        setRestored(true);
        setLoading(false);
        if (cachedPage) {
          const num = parseInt(cachedPage, 10);
          if (!isNaN(num) && num > 0) setCurrentPage(num);
        }
        if (cachedCityMap) {
          setCityMap(JSON.parse(cachedCityMap));
        }
        if (cachedCountryMap) {
          setCountryMap(JSON.parse(cachedCountryMap));
        }
      }
    } catch (err) {
      console.warn('[Listings] Failed to parse cache', err);
    }
  }, []);

  // Fetch only if not restored from cache
  React.useEffect(() => {
    if (restored) return;
    let cancelled = false;
    (async () => {
      try {
  // Fetching properties (no cache)
        // Attempt to replay last filter search if present
        let res;
        if (typeof window !== 'undefined') {
          try {
            const last = sessionStorage.getItem('properties_last_search');
            if (last) {
              const parsed = JSON.parse(last) as { filterBody?: Record<string, unknown>; InvG?: string[]; LocB?: string[] };
              console.log('[Properties] REQUEST /property/retrieve-search', {
                url: '/property/retrieve-search',
                method: 'POST',
                params: { InvG: parsed.InvG, LocB: parsed.LocB },
                body: parsed.filterBody ?? {},
              });
              res = await api.request({
                method: 'post',
                url: '/property/retrieve-search',
                params: { InvG: parsed.InvG, LocB: parsed.LocB },
                data: parsed.filterBody ?? {},
              });
            }
          } catch (err) {
            console.warn('[Listings] Failed to replay last search, falling back to unfiltered', err);
          }
        }
        if (!res) {
          // Fallback: unfiltered base call
          console.log('[Properties] REQUEST /property/retrieve-search', {
            url: '/property/retrieve-search',
            method: 'GET',
            params: undefined,
            body: undefined,
          });
          res = await api.get('/property/retrieve-search');
        }
        const list: PropertySummary[] = Array.isArray(res.data) ? res.data : [];
        if (!cancelled) setData(list);

        const uniqueCityIds = Array.from(new Set(list.map(p => p.cityId).filter((x): x is number => typeof x === 'number')));
        const uniqueCountryIds = Array.from(new Set(list.map(p => p.countryId).filter((x): x is number => typeof x === 'number')));
        const newCityMap: Record<number, string> = { };
        const newCountryMap: Record<number, string> = { };
        for (const id of uniqueCityIds) {
          try { const r = await api.get(`/cities/retrieve/${id}`); if (r?.data?.name) newCityMap[id] = r.data.name as string; } catch {}
        }
        for (const id of uniqueCountryIds) {
          try { const r = await api.get(`/countries/retrieve/${id}`); if (r?.data?.name) newCountryMap[id] = r.data.name as string; } catch {}
        }
        if (!cancelled) {
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
  }, [restored]);

  // Listen for filtered results from Filters (MagicBento) and update listings
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    let cancelled = false;
    const handler = async (e: Event) => {
      // CustomEvent with detail = PropertySummary[]
      const detail = (e as CustomEvent).detail as PropertySummary[] | undefined;
      if (!detail || cancelled) return;
      setData(detail);
      setCurrentPage(1);
      // refresh maps for displayed properties
      const uniqueCityIds = Array.from(new Set(detail.map(p => p.cityId).filter((x): x is number => typeof x === 'number')));
      const uniqueCountryIds = Array.from(new Set(detail.map(p => p.countryId).filter((x): x is number => typeof x === 'number')));
      const newCityMap: Record<number, string> = { };
      const newCountryMap: Record<number, string> = { };
      for (const id of uniqueCityIds) {
        try { const r = await api.get(`/cities/retrieve/${id}`); if (r?.data?.name) newCityMap[id] = r.data.name as string; } catch {}
      }
      for (const id of uniqueCountryIds) {
        try { const r = await api.get(`/countries/retrieve/${id}`); if (r?.data?.name) newCountryMap[id] = r.data.name as string; } catch {}
      }
      if (!cancelled) {
        setCityMap((prev) => ({ ...prev, ...newCityMap }));
        setCountryMap((prev) => ({ ...prev, ...newCountryMap }));
      }
    };
    window.addEventListener('properties:filter-results', handler as EventListener);
    return () => {
      cancelled = true;
      window.removeEventListener('properties:filter-results', handler as EventListener);
    };
  }, []);

  // Persist cache for current and previous page slices plus maps
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!data.length) return;
    try {
      // Cache full dataset for simplicity and immediate future navigation
      sessionStorage.setItem('properties_all', JSON.stringify(data));
      sessionStorage.setItem('properties_current_page', String(currentPage));
      if (Object.keys(cityMap).length) sessionStorage.setItem('properties_city_map', JSON.stringify(cityMap));
      if (Object.keys(countryMap).length) sessionStorage.setItem('properties_country_map', JSON.stringify(countryMap));
      // Additionally store current and previous page slices individually (optional per requirement)
      const currentSliceStart = (currentPage - 1) * pageSize;
      const currentSlice = data.slice(currentSliceStart, currentSliceStart + pageSize);
      sessionStorage.setItem(`properties_page_${currentPage}`, JSON.stringify(currentSlice));
      if (currentPage > 1) {
        const prevSliceStart = (currentPage - 2) * pageSize;
        const prevSlice = data.slice(prevSliceStart, prevSliceStart + pageSize);
        sessionStorage.setItem(`properties_page_${currentPage - 1}`, JSON.stringify(prevSlice));
      }
    } catch (err) {
      console.warn('[Listings] Failed to persist cache', err);
    }
  }, [data, currentPage, cityMap, countryMap, pageSize]);

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
    <Container
      maxWidth="xl"
      sx={{
        py: 4,
        px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
      }}
    >
      {/* Top pagination controls */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
        <IconButton
          size="small"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          sx={{ border: '1px solid', borderColor: 'divider' }}
        >
          <ArrowBackIosNewIcon fontSize="inherit" />
        </IconButton>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {pageNumbers.map((num) => (
            <Box
              key={num}
              onClick={() => goToPage(num)}
              sx={{
                cursor: 'pointer',
                px: 1.2,
                py: 0.7,
                minWidth: 36,
                textAlign: 'center',
                borderRadius: 1,
                fontSize: 14,
                fontWeight: 500,
                border: '1px solid',
                borderColor: num === currentPage ? 'primary.main' : 'divider',
                bgcolor: num === currentPage ? 'primary.main' : 'background.paper',
                color: num === currentPage ? 'primary.contrastText' : 'text.primary',
                transition: 'background-color 0.2s',
                '&:hover': {
                  bgcolor: num === currentPage ? 'primary.dark' : 'action.hover',
                },
              }}
            >
              {num}
            </Box>
          ))}
        </Box>
        <IconButton
          size="small"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          sx={{ border: '1px solid', borderColor: 'divider' }}
        >
          <ArrowForwardIosIcon fontSize="inherit" />
        </IconButton>
      </Box>

      <Grid
        container
        spacing={3}
        sx={{ px: 0, mx: 0 }}
        columns={{ xs: 12, sm: 12, md: 12, lg: 15, xl: 15 }}
      >
        {pagedData.map(p => (
          <Grid
            key={p.id}
            size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}
          > {/* 5 columns at lg+ (15/3) */}
            {(() => {
              const cityName = p.cityId !== undefined ? cityMap[p.cityId] : undefined;
              const countryName = p.countryId !== undefined ? countryMap[p.countryId] : undefined;
              // Rendering card for property
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

      {/* Bottom arrow navigation */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <IconButton
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          sx={{ border: '1px solid', borderColor: 'divider' }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <Typography variant="body2" sx={{ alignSelf: 'center' }}>
          Page {currentPage} of {totalPages}
        </Typography>
        <IconButton
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          sx={{ border: '1px solid', borderColor: 'divider' }}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </Box>
    </Container>
  );
};

export default ListingsPage;