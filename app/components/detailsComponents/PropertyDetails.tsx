"use client";

import Link from 'next/link';
import { Box, Typography, Container, Divider, Card, CardContent, Grid, Button, Chip, Stack } from '@mui/material';
import { useState, useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EuroIcon from '@mui/icons-material/Euro';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarsIcon from '@mui/icons-material/Stars';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import ShowerIcon from '@mui/icons-material/Shower';
import SquareFootIcon from '@mui/icons-material/SquareFoot';

// Define a narrowed type for display (subset of full DTO)
interface DisplayProperty {
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
  heatingSystem?: string;
  coolingSystem?: string;
  kitchen?: string;
  security?: string;
  utility?: string;
  smartHomeFeature?: string;
  investmentGoalTag?: string;
  locationBenefitTag?: string;
  otherFeature?: string;
  propertyTaxes?: number;
  HOAFees?: number;
  picture?: { id: string; imageData: unknown; isPrimary: boolean; altText?: string | null }[];
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

  // Ensure hydration completes before rendering interactive elements
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
  const primaryColor = '#1976d2'; // Material-UI primary blue

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Navigation */}
      <Button
        startIcon={<ArrowBackIcon />}
        component={Link}
        href="/propertiesDashboard"
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
          }}
        />
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
                  }}
                />
              ))}
            </Box>
          </>
        )}
      </Box>

      {/* Title & Basic Info */}
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
        {property.title}
      </Typography>
      {property.streetAddress && (
        <Stack direction="row" spacing={1} sx={{ mb: 2, alignItems: 'center' }}>
          <LocationOnIcon sx={{ color: primaryColor }} />
          <Typography variant="body1" color="text.secondary">
            {property.streetAddress}
            {property.postalCode && ` • ${property.postalCode}`}
          </Typography>
        </Stack>
      )}

      {/* Price & Key Metrics */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ textAlign: 'center', backgroundColor: 'background.default', boxShadow: 'none', border: '1px solid #ddd' }}>
            <CardContent>
              <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center', mb: 1 }}>
                <EuroIcon sx={{ color: primaryColor }} />
              </Stack>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {priceFormatted}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Price
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ textAlign: 'center', backgroundColor: 'background.default', boxShadow: 'none', border: '1px solid #ddd' }}>
            <CardContent>
              <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center', mb: 1 }}>
                <TrendingUpIcon sx={{ color: 'green' }} />
              </Stack>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'green' }}>
                {property.yield}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Yield
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ textAlign: 'center', backgroundColor: 'background.default', boxShadow: 'none', border: '1px solid #ddd' }}>
            <CardContent>
              <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center', mb: 1 }}>
                <StarsIcon sx={{ color: 'orange' }} />
              </Stack>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {property.score}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Score
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ textAlign: 'center', backgroundColor: 'background.default', boxShadow: 'none', border: '1px solid #ddd' }}>
            <CardContent>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Type
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {property.type || 'N/A'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Description */}
      {property.description && (
        <>
          <Card sx={{ mb: 4, backgroundColor: 'background.default', boxShadow: 'none', border: '1px solid #ddd' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                About This Property
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {property.description}
              </Typography>
            </CardContent>
          </Card>
        </>
      )}

      {/* Quick Stats */}
      <Card sx={{ mb: 4, backgroundColor: 'background.default', boxShadow: 'none', border: '1px solid #ddd' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Property Specs
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Stack direction="row" spacing={1}>
                <BedtimeIcon sx={{ color: primaryColor }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Bedrooms
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {property.bedrooms || '—'}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Stack direction="row" spacing={1}>
                <ShowerIcon sx={{ color: primaryColor }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Bathrooms
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {property.bathrooms || '—'}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Stack direction="row" spacing={1}>
                <SquareFootIcon sx={{ color: primaryColor }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total Area
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {property.totalArea ? `${property.totalArea} m²` : '—'}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Rooms
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {property.rooms || '—'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Features & Amenities */}
      <Card sx={{ mb: 4, backgroundColor: 'background.default', boxShadow: 'none', border: '1px solid #ddd' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Features & Amenities
          </Typography>
          <Grid container spacing={2}>
            {property.parking && <Grid size={{ xs: 12, sm: 6 }}><Chip label={`Parking: ${property.parking}`} variant="outlined" /></Grid>}
            {property.balconyType && <Grid size={{ xs: 12, sm: 6 }}><Chip label={`Balcony: ${property.balconyType}`} variant="outlined" /></Grid>}
            {property.energyEfficiencyRating && <Grid size={{ xs: 12, sm: 6 }}><Chip label={`Energy: ${property.energyEfficiencyRating}`} variant="outlined" /></Grid>}
            {property.orientation && <Grid size={{ xs: 12, sm: 6 }}><Chip label={`Orientation: ${property.orientation}`} variant="outlined" /></Grid>}
            {property.heatingSystem && <Grid size={{ xs: 12, sm: 6 }}><Chip label={`Heating: ${property.heatingSystem}`} variant="outlined" /></Grid>}
            {property.coolingSystem && <Grid size={{ xs: 12, sm: 6 }}><Chip label={`Cooling: ${property.coolingSystem}`} variant="outlined" /></Grid>}
            {property.kitchen && <Grid size={{ xs: 12, sm: 6 }}><Chip label={`Kitchen: ${property.kitchen}`} variant="outlined" /></Grid>}
            {property.security && <Grid size={{ xs: 12, sm: 6 }}><Chip label={`Security: ${property.security}`} variant="outlined" /></Grid>}
          </Grid>
        </CardContent>
      </Card>

      {/* Location & Coordinates */}
      <Card sx={{ mb: 4, backgroundColor: 'background.default', boxShadow: 'none', border: '1px solid #ddd' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Location Details
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Latitude
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {property.latitude || '—'}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Longitude
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {property.longitude || '—'}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Financial Info */}
      <Card sx={{ mb: 4, backgroundColor: 'background.default', boxShadow: 'none', border: '1px solid #ddd' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Financial Details
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Property Taxes (Annual)
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {property.propertyTaxes ? `€${property.propertyTaxes.toLocaleString()}` : '—'}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                HOA Fees (Monthly)
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {property.HOAFees ? `€${property.HOAFees.toLocaleString()}` : '—'}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Divider />
    </Container>
  );
}