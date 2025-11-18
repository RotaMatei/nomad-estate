"use client";

import Link from 'next/link';
import { Box, Typography, Container, Divider, Card, CardContent, Grid, Button, Chip, Stack, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DiamondIcon from '@mui/icons-material/Diamond';
import CrownIcon from '@mui/icons-material/EmojiEventsOutlined';
import { getYieldForProperty, getUserProfile, getAgencyDetails } from '@/app/lib/propertyApi';


interface DisplayProperty {
  id?: string | number;
  agencyId?: string;
  agentId?: string;
  agent?: { firstName?: string; lastName?: string; phoneNumber?: string } | null;
  agency?: { id?: string; companyName?: string; phoneNumber?: string; profilePictureData?: string; email?: string; establishedYear?: number; companyExperience?: string } | null;
  title?: string;
  description?: string;
  type?: string;
  status?: string;
  price?: number;
  yield?: number;
  score?: number;
  streetAddress?: string;
  postalCode?: string;
  cityId?: number;
  stateId?: number;
  countryId?: number;
  cityName?: string;
  stateName?: string;
  countryName?: string;
  latitude?: number;
  longitude?: number;
  builtArea?: number;
  landArea?: number;
  totalArea?: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  floorLevel?: number;
  energyEfficiencyRating?: string;
  orientation?: string;
  parking?: string;
  balconyType?: string;
  balconyTotalSize?: number;
  balconyNumber?: number;
  ownershipStatus?: boolean;
  availabilityDateStart?: string;
  availabilityDateEnd?: string;
  constructionDate?: string;
  heatingSystem?: string | Array<{ heatingSystem: string }>;
  coolingSystem?: string | Array<{ coolingSystem: string }>;
  kitchen?: string | Array<{ kitchen: string }>;
  security?: string | Array<{ security: string }>;
  utility?: string | Array<{ utility: string }>;
  smartHomeFeature?: string | Array<{ smartHomeFeature: string }>;
  otherFeature?: string | Array<{ otherFeature: string }>;
  investmentGoalTag?: string;
  locationBenefitTag?: string;
  propertyTaxes?: number;
  HOAFees?: number;
  picture?: { id: string; imageData: unknown; isPrimary: boolean; altText?: string | null }[];
}

interface PropertyDetailsProps {
  property: DisplayProperty;
}

// Modern Map Component with Leaflet
function MapComponent({ latitude, longitude, title }: { latitude: number; longitude: number; title: string }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const mapInitialized = useRef(false);

  useEffect(() => {
    if (!mapContainer.current || mapInitialized.current) return;

    // Dynamically import leaflet only on client side
    import('leaflet').then((L) => {
      if (!mapContainer.current || mapInitialized.current) return;

      mapInitialized.current = true;
      map.current = L.map(mapContainer.current).setView([latitude, longitude], 15);

      // Modern light tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20,
      }).addTo(map.current);

      // Custom marker with glassmorphism style
      const customIcon = L.divIcon({
        html: `
          <div style="
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.8), rgba(168, 85, 247, 0.8));
            border: 2px solid rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 32px 0 rgba(99, 102, 241, 0.3);
            backdrop-filter: blur(4px);
            cursor: pointer;
            transform: translateY(-40px);
          ">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
            </svg>
          </div>
        `,
        iconSize: [40, 40],
        className: 'custom-div-icon',
      });

      const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map.current);

      // Popup with modern styling
      marker.bindPopup(`
        <div style="
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 8px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9));
          border-radius: 12px;
          border: 1px solid rgba(99, 102, 241, 0.2);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
        ">
          <strong style="color: #333;">${title}</strong>
        </div>
      `, {
        closeButton: true,
        offset: L.point(0, -35),
      });

      // Open popup by default
      marker.openPopup();
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        mapInitialized.current = false;
      }
    };
  }, []);

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
}

interface PropertyDetailsProps {
  property: DisplayProperty;
}

export default function PropertyDetails({ property }: PropertyDetailsProps) {
  const pics = property.picture || [];

  // Filter for valid images
  const validImages = pics.filter(p => typeof p.imageData === 'string' && p.imageData.trim().length > 0);
  const images = validImages.length > 0 ? validImages : [{
    imageData: '/dubai4.jpg',
    altText: 'Property image',
    isPrimary: true,
    id: '',
    propertyId: ''
  }];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);


  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const currentImage = images[currentImageIndex];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const priceFormatted = property.price ? `€${property.price.toLocaleString()}` : 'N/A';
  const primaryColor = 'secondary.main';

  // Yield: use server-provided property.yield if present; otherwise fetch analytics yield
  const [fetchedYield, setFetchedYield] = useState<number | undefined>(undefined);
  useEffect(() => {
    // Only fetch if not provided on the base property and we have an id
    if ((property.yield == null || isNaN(property.yield as number)) && property.id) {
      const pid = String(property.id);
      getYieldForProperty(pid)
        .then((arr) => {
          const y = Array.isArray(arr) && arr.length > 0 ? arr[0]?.yield : undefined;
          if (typeof y === 'number' && !isNaN(y)) setFetchedYield(y);
        })
        .catch(() => {
          // silent fail
        });
    }
  }, [property.id, property.yield]);

  const rawYield = typeof property.yield === 'number' ? property.yield : fetchedYield;
  const yieldDisplay = typeof rawYield === 'number'
    ? (rawYield > 1 ? `${rawYield}%` : `${(rawYield * 100).toFixed(1)}%`)
    : '—';

  // Contact Agency (Agent phone reveal)
  const [phone, setPhone] = useState<string | null>(null);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [showPhone, setShowPhone] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [expandedFeatures, setExpandedFeatures] = useState(false);

  const handleCopyPhone = () => {
    if (phone) {
      navigator.clipboard.writeText(phone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const handleContactClick = async () => {
    // Toggle off if already showing
    if (showPhone) {
      setShowPhone(false);
      return;
    }

    setContactLoading(true);
    setContactError(null);

    try {
      // Try to get phone from property.agent first, fall back to fetching via agentId
      let phoneNumber = property.agent?.phoneNumber;

      if (!phoneNumber && property.agentId) {
        // Fetch agent profile
        const profile = await getUserProfile(String(property.agentId));
        phoneNumber = profile?.phoneNumber;
      }

      if (!phoneNumber) {
        setContactError('Agent phone not available.');
        return;
      }

      setPhone(phoneNumber);
      setShowPhone(true);
    } catch {
      setContactError('Unable to fetch contact details.');
    } finally {
      setContactLoading(false);
    }
  };

  // Fetch agency details
  const [fetchedAgency, setFetchedAgency] = useState<any>(null);
  useEffect(() => {
    if (!property.agencyId) {
      console.debug('No agencyId, skipping fetch');
      return;
    }
    if (property.agency) {
      console.debug('Agency already in property, skipping fetch');
      return;
    }
    console.debug('Attempting agency fetch for agencyId:', property.agencyId);
    getAgencyDetails(String(property.agencyId))
      .then((agencyData) => {
        console.debug('Agency fetch resolved:', agencyData);
        if (agencyData) setFetchedAgency(agencyData);
      })
      .catch((err) => {
        console.debug('Agency fetch error:', err);
      });
  }, [property.agencyId, property.agency]);

  const displayedAgency = property.agency || fetchedAgency || null;

  // Helper: format company experience (string may contain years or description)
  const formatExperience = (exp: unknown): string => {
    if (!exp) return '—';
    if (typeof exp === 'number') return `${exp} years`;
    if (typeof exp === 'string') {
      // Try to extract a number of years
      const match = exp.match(/(\d{1,3})/);
      if (match) return `${match[1]} years`;
      return exp; // descriptive text
    }
    return '—';
  };

  return (
    <><Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Navigation */}
      <Button
        startIcon={<ArrowBackIcon />}
        component={Link}
        href="/properties"
        sx={{ mb: 2, textTransform: 'none', fontSize: '14px' }}
      >
        Back to Properties
      </Button>

      {/* Image Gallery */}
      <Box sx={{ position: 'relative', borderRadius: 4, overflow: 'hidden', mb: 4, backgroundColor: '#f0f0f0', height: 450 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentImage?.imageData as string}
          alt={currentImage?.altText || property.title || 'Property'}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/dubai4.jpg';
          } } />
        {isHydrated && images.length > 1 && (
          <>
            <Button
              sx={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                minWidth: 40,
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
              }}
              onClick={prevImage}
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              sx={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                minWidth: 40,
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
              }}
              onClick={nextImage}
            >
              <ChevronRightIcon />
            </Button>
            <Box sx={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 1 }}>
              {images.map((_, idx) => (
                <Box
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: idx === currentImageIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }} />
              ))}
            </Box>
          </>
        )}
      </Box>

      {/* Title & Basic Info */}
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', fontSize: { xs: '24px', md: '32px' } }}>
        {property.title}
      </Typography>
      {property.streetAddress && (
        <Stack direction="row" spacing={1} sx={{ mb: 2, alignItems: 'center' }}>
          <LocationOnIcon sx={{ color: 'primary.main' }} />
          <Typography variant="subtitle2" color="primary.main">
            {property.streetAddress}
            {property.postalCode && ` • ${property.postalCode}`}
            {property.cityName && ` • ${property.cityName}`}
            {property.stateName && ` • ${property.stateName}`}
            {property.countryName && ` • ${property.countryName}`}
          </Typography>
        </Stack>
      )}

      {/* Price & Key Metrics */}
      <Grid container sx={{ mb: 4, borderBottom: '1px solid #c2c2c265', pb: 4 }} spacing={1}>
        <Grid size={{ xs: 12, md: 6 }} sx={{ p: 3, borderRadius: 4, backgroundColor: 'background.default', boxShadow: 'none', border: '1px solid', borderColor: '#c2c2c265', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="subtitle2" sx={{ color: 'primary.main', mb: 2 }}> Property Specs</Typography>
          <Grid container sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <Grid size={4} sx={{ borderRight: '1px solid #c2c2c265', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">Bedrooms</Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>{property.bedrooms || '—'}</Typography>
            </Grid>
            <Grid size={4} sx={{ borderRight: '1px solid #c2c2c265', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">Bathrooms</Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>{property.bathrooms || '—'}</Typography>
            </Grid>
            <Grid size={4} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">Total Area</Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>{property.totalArea ? `${property.totalArea} m²` : '—'}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} sx={{ p: 3, borderRadius: 4, backgroundColor: 'background.default', boxShadow: 'none', border: '1px solid', borderColor: '#c2c2c265' }}>
          <Typography variant="subtitle2" sx={{ color: 'primary.main' }}> Asking Price</Typography>
          <Stack direction="row" spacing={1} alignItems="baseline" sx={{ mt: 1, flexWrap: 'wrap' }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary', textDecoration: 'underline' }}>{priceFormatted}</Typography>
            <Typography variant="h5" sx={{ mx: 0.5, color: 'text.secondary' }}>•</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Expected yield:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main' }}>{property.yield}%</Typography>
          </Stack>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleContactClick}
              disabled={contactLoading}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              {contactLoading ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <CircularProgress size={16} />
                  <span>Loading...</span>
                </Stack>
              ) : showPhone && phone ? 'Hide Phone' : 'Contact Agency'}
            </Button>
            {showPhone && phone && (
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  <Box component="span" sx={{ color: 'primary.main' }}>{phone}</Box>
                </Typography>
                <Tooltip title={copiedPhone ? 'Copied!' : 'Copy phone'}>
                  <IconButton
                    size="small"
                    onClick={handleCopyPhone}
                    sx={{ p: 0.5 }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
            {contactError && (
              <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                {contactError}
              </Typography>
            )}
          </Box>

        </Grid>
      </Grid>

      {/* Description */}
      <Grid container sx={{ mb: 4, borderBottom: '1px solid #c2c2c265', pb: 4 }}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
            Property Description
          </Typography>
          <Typography variant="subtitle2" sx={{ color: 'grey.500', whiteSpace: 'pre-line', fontWeight: 500 }}>
            {property.description || 'No description available.'}
          </Typography>
        </Grid>
      </Grid>
      <Grid container sx={{ mb: 4, borderBottom: '1px solid #c2c2c265', pb: 4 }} spacing={2}>
        <Grid size={{ xs: 12, md: 6 }} sx={{ borderRight: { md: '1px solid #c2c2c265' }, pr: { md: 2 } }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
            Property Details
          </Typography>

          {/* Row 1: Construction date and availability date */}
          <Typography variant="body2" sx={{ mb: 1 }}>
            <Box component="span" sx={{ fontWeight: 600 }}>Construction Date:</Box> {property.constructionDate ? new Date(property.constructionDate).toLocaleDateString() : '—'}
            {property.availabilityDateStart && (
              <>
                <Box component="span" sx={{ mx: 1 }}>•</Box>
                <Box component="span" sx={{ fontWeight: 600 }}>Available Since:</Box> {new Date(property.availabilityDateStart).toLocaleDateString()}
              </>
            )}
          </Typography>

          {/* Row 2: Built Area and Land Area */}
          <Typography variant="body2" sx={{ mb: 1 }}>
            <Box component="span" sx={{ fontWeight: 600 }}>Built Area:</Box> {property.builtArea ? `${property.builtArea} m²` : '—'}
            {property.landArea && (
              <>
                <Box component="span" sx={{ mx: 1 }}>•</Box>
                <Box component="span" sx={{ fontWeight: 600 }}>Land Area:</Box> {`${property.landArea} m²`}
              </>
            )}
          </Typography>

          {/* Row 3: Floor Level and Floors */}
          <Typography variant="body2" sx={{ mb: 1 }}>
            <Box component="span" sx={{ fontWeight: 600 }}>Floor Level:</Box> {property.floorLevel ?? '—'}
            {property.floors && (
              <>
                <Box component="span" sx={{ mx: 1 }}>•</Box>
                <Box component="span" sx={{ fontWeight: 600 }}>Floors:</Box> {property.floors}
              </>
            )}
            {property.orientation && (
              <>
                <Box component="span" sx={{ mx: 1 }}>•</Box>
                <Box component="span" sx={{ fontWeight: 600 }}>Orientation:</Box> {property.orientation}
              </>
            )}
          </Typography>

          {/* Row 4: Balcony Type and Total Size */}
          {(property.balconyType || property.balconyTotalSize || property.balconyNumber) && (
            <Typography variant="body2" sx={{ mb: 1 }}>
              <Box component="span" sx={{ fontWeight: 600 }}>Balcony Type:</Box> {property.balconyType || '—'}
              {property.balconyNumber && (
                <>
                  <Box component="span" sx={{ mx: 1 }}>•</Box>
                  <Box component="span" sx={{ fontWeight: 600 }}>Count:</Box> {property.balconyNumber}
                </>
              )}
              {property.balconyTotalSize && (
                <>
                  <Box component="span" sx={{ mx: 1 }}>•</Box>
                  <Box component="span" sx={{ fontWeight: 600 }}>Total Size:</Box> {`${property.balconyTotalSize} m²`}
                </>
              )}

            </Typography>
          )}

          {/* Row 5: Property Taxes and HOA Fees */}
          <Typography variant="body2">
            <Box component="span" sx={{ fontWeight: 600 }}>Property Taxes (Annual):</Box> {property.propertyTaxes ? `€${Number(property.propertyTaxes).toLocaleString()}` : '—'}
            {property.HOAFees && (
              <>
                <Box component="span" sx={{ mx: 1 }}>•</Box>
                <Box component="span" sx={{ fontWeight: 600 }}>HOA Fees (Monthly):</Box> {`€${Number(property.HOAFees).toLocaleString()}`}
              </>
            )}
          </Typography>

        </Grid>
        <Grid size={{ xs: 12, md: 6 }} sx={{ pl: { md: 2 }, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
            Features
          </Typography>
          {(() => {
            const extractValues = (val: unknown): string[] => {
              if (!val) return [];
              if (Array.isArray(val)) {
                return val
                  .map((item: any) => {
                    if (typeof item === 'string') return item;
                    if (typeof item === 'object' && item !== null) {
                      // Handle relation objects - find the enum value (not the id)
                      const values = Object.entries(item)
                        .filter(([key, v]) => {
                          // Skip 'id' field and only get string values that aren't UUIDs
                          return key !== 'id' && typeof v === 'string' && !v.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
                        })
                        .map(([, v]) => v);
                      return values[0] || '';
                    }
                    return '';
                  })
                  .filter((s): s is string => typeof s === 'string' && s.length > 0);
              }
              if (typeof val === 'string') return [val];
              return [];
            };

            const featuresList = [
              { label: 'Parking', value: property.parking },
              { label: 'Balcony', value: property.balconyType },
              { label: 'Energy Rating', value: property.energyEfficiencyRating },
              { label: 'Orientation', value: property.orientation },
              { label: 'Heating', value: property.heatingSystem },
              { label: 'Cooling', value: property.coolingSystem },
              { label: 'Kitchen', value: property.kitchen },
              { label: 'Security', value: property.security },
              { label: 'Utility', value: property.utility },
              { label: 'Smart Home', value: property.smartHomeFeature },
              { label: 'Other', value: property.otherFeature },
            ]
              .map(f => ({ ...f, formattedValues: extractValues(f.value) }))
              .filter(f => f.formattedValues.length > 0); // Only show features that have values

            const displayedFeatures = expandedFeatures ? featuresList : featuresList.slice(0, 8);
            const hasMore = featuresList.length > 8;

            return (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, flex: 1, alignContent: 'flex-start' }}>
                {displayedFeatures.map((feature) => (
                  <Chip
                    key={feature.label}
                    label={`${feature.label}: ${feature.formattedValues.join(', ')}`}
                    variant="outlined"
                    sx={{ mb: 0.5 }} />
                ))}
                {hasMore && (
                  <Button
                    onClick={() => setExpandedFeatures(!expandedFeatures)}
                    sx={{
                      textTransform: 'none',
                      fontSize: '12px',
                      alignSelf: 'flex-start',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <DiamondIcon sx={{ fontSize: '14px' }} />
                    {expandedFeatures ? 'Show less' : 'Show more'}
                  </Button>
                )}
              </Box>
            );
          })()}
        </Grid>
      </Grid>
      <Grid container sx={{ mb: 4, borderBottom: '1px solid #c2c2c265', pb: 4 }}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
            Map
          </Typography>
          <Box sx={{ height: 400, borderRadius: 4, overflow: 'hidden', position: 'relative', border: '1px solid #c2c2c265', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)' }}>
            {property.latitude && property.longitude ? (
              <MapComponent
                latitude={Number(property.latitude)}
                longitude={Number(property.longitude)}
                title={property.title || 'Property Location'} />
            ) : (
              <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'background.default' }}>
                <Typography color="text.secondary">Location data not available</Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
      <Grid container sx={{ mb: 4, borderBottom: '1px solid #c2c2c265', pb: 4 }}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>About the Agency
          </Typography>
          {(() => {
            const agencyData = displayedAgency ?? {
              companyName: 'Agency',
              phoneNumber: null,
              email: null,
              establishedYear: null,
              companyExperience: null,
              profilePictureData: null,
            } as any;
            return (
              <Box sx={{
                backgroundColor: 'white',
                borderRadius: 3,
                padding: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'center', md: 'center' },
                gap: 3,
              }}>
                {/* Left: Profile Picture with Experience (xs/sm only) */}
                <Box sx={{
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    backgroundColor: agencyData.profilePictureData ? 'transparent' : 'grey.300',
                    overflow: 'hidden',
                  }}>
                    {agencyData.profilePictureData ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={agencyData.profilePictureData}
                        alt={agencyData.companyName || 'Agency'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                        {(agencyData.companyName || 'A')
                          .split(' ')
                          .map((word: string) => word[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)}
                      </Typography>
                    )}
                  </Box>
                  {/* Experience under picture - xs/sm only */}

                </Box>

                {/* Right: Agency Information */}
                <Box sx={{ flex: 1, width: { xs: '100%', md: 'auto' } }}>
                  <Grid container>
                    <Grid size={{ xs: 12, md: 3 }} sx={{ borderRight: { md: '1px solid #c2c2c265' }, pr: { md: 2 } }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', textAlign: { xs: 'center', md: 'left' } }}>
                        {agencyData.companyName || 'Agency'}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1, color: agencyData.phoneNumber ? 'text.secondary' : 'text.disabled', textAlign: { xs: 'center', md: 'left' } }}>
                        <Box component="span" sx={{ fontWeight: 600 }}>Phone:</Box> {agencyData.phoneNumber || '—'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: agencyData.email ? 'text.secondary' : 'text.disabled', textAlign: { xs: 'center', md: 'left' } }}>
                        <Box component="span" sx={{ fontWeight: 600 }}>Email:</Box> {agencyData.email || '—'}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 2 }} sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <CrownIcon sx={{ fontSize: 24, color: 'primary.main', mb: 0.5 }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                        <Box component="span" sx={{ fontWeight: 600 }}>Established</Box>
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                        {typeof agencyData.establishedYear === 'number' ? agencyData.establishedYear : '—'}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 7 }} sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', justifyContent: 'center' }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        <Box component="span" sx={{ fontWeight: 600 }}>Experience:</Box> {formatExperience(agencyData.companyExperience)}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                      {formatExperience(agencyData.companyExperience)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })()}
        </Grid>
      </Grid>
    </Container><Box
      sx={{
        backgroundColor: 'text.secondary',
        height: '40vh',
        display: 'flex',
        justifyContent: 'normal',
        alignItems: 'center',
      }}
    >
      </Box></>
  );
}