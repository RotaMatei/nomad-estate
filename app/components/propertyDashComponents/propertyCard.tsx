import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Box,
  Button,
  Stack,
} from '@mui/material';

// Interfaces
interface PropertyPictureDto {
  id: string;
  propertyId: string;
  imageData: unknown;
  altText?: string | null;
  isPrimary: boolean;
}

interface InvestmentGoalTagDto {
  investmentGoalTag: string;
}

interface LocationBenefitTagDto {
  locationBenefitTag: string;
}

export interface PropertySummaryCardProps {
  property: {
    id: string;
    title: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    totalArea: number;
    yield: number;
    score: number;
    propertyPictures?: PropertyPictureDto[];
    propertyInvestmentGoalTags?: InvestmentGoalTagDto[];
    propertyLocationBenefitTags?: LocationBenefitTagDto[];
    cityName?: string;
    countryName?: string;
  };
  onViewDetails?: (id: string) => void;
}

// Utility: Convert number[] to base64
// function bufferToBase64(data: number[]): string {
//   const bytes = new Uint8Array(data);
//   let binary = '';
//   const chunkSize = 0x8000;
//   for (let i = 0; i < bytes.length; i += chunkSize) {
//     const chunk = bytes.subarray(i, i + chunkSize);
//     binary += String.fromCharCode.apply(null, Array.from(chunk));
//   }
//   return btoa(binary);
// }

// Utility: Normalize imageData to base64 URI
// function toImageSrc(imageData?: unknown, mime = 'image/jpeg'): string | undefined {
//   if (!imageData) return undefined;

//   if (typeof imageData === 'string') {
//     return imageData.startsWith('data:')
//       ? imageData
//       : `data:${mime};base64,${imageData}`;
//   }

//   if (Array.isArray(imageData)) {
//     const base64 = bufferToBase64(imageData);
//     return `data:${mime};base64,${base64}`;
//   }

//   if (typeof imageData === 'object' && imageData !== null) {
//     const bufferLike = imageData as { data?: unknown };
//     if (Array.isArray(bufferLike.data)) {
//       const base64 = bufferToBase64(bufferLike.data);
//       return `data:${mime};base64,${base64}`;
//     }
//   }

//   return undefined;
// }

// Component
const RealEstateCard: React.FC<PropertySummaryCardProps> = ({ property, onViewDetails }) => {
  const pics = property.propertyPictures || [];
  console.log('PropertyCard Props:', property);
  const primary = pics.find((p) => p.isPrimary) || pics[0];
  // const imageUrl = toImageSrc(primary?.imageData) || 'dubai4.jpg';
  console.log('PropertyCard Image Data:', primary?.imageData);

  const tags = [
    ...(property.propertyInvestmentGoalTags || []).map((t) => t.investmentGoalTag),
    ...(property.propertyLocationBenefitTags || []).map((t) => t.locationBenefitTag),
  ];

  const priceFormatted = property.price ? `$${property.price.toLocaleString()}` : 'N/A';
  const locationDisplay = [property.cityName, property.countryName].filter(Boolean).join(', ') || 'Unknown';

  return (
    <Card sx={{ width: '100%', borderRadius: 4, boxShadow: 'none', backgroundColor: 'background.default' }}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={
            primary?.imageData && typeof primary.imageData === 'string' && primary.imageData.trim() !== ''
              ? primary.imageData.startsWith('data:image')
                ? primary.imageData
                : `data:image/jpeg;base64,${primary.imageData}`
              : '/dubai4.jpg' // fallback image
          }
          alt={primary?.altText || property.title}
        />
        <Chip
          label={`Score: ${property.score}`}
          color="success"
          size="small"
          sx={{ position: 'absolute', top: 8, right: 8 }}
        />
      </Box>

      <CardContent sx={{ px: 2, py: 1, backgroundColor: 'background.default' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>{property.title}</Typography>
        <Typography variant="body2" color="text.secondary">{locationDisplay}</Typography>

        <Typography variant="h5" sx={{ mt: 1, color: 'primary.main', fontWeight: 700 }}>{priceFormatted}</Typography>

        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
          <Typography variant="body2">{property.bedrooms} beds</Typography>
          <Typography variant="body2">{property.bathrooms} bathrooms</Typography>
          <Typography variant="body2">{property.totalArea}m²</Typography>
        </Stack>

        <Typography variant="body2" sx={{ mt: 1 }}>
          Expected yield{' '}
          <Box component="span" sx={{ color: 'green', fontWeight: 600 }}>
            {property.yield}%
          </Box>
        </Typography>

        {tags.length > 0 && (
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {tags.slice(0, 4).map((t) => (
              <Chip key={t} label={t} size="small" />
            ))}
          </Box>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2, borderRadius: 2 }}
          onClick={() => onViewDetails?.(property.id)}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default RealEstateCard;