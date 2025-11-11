import React from 'react';
import { useRouter } from 'next/navigation';
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
// imageData now comes as a direct URL string from the backend

// Interfaces
interface PropertyPictureDto {
  id: string;
  propertyId: string;
  imageData: string;
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

// Component
const RealEstateCard: React.FC<PropertySummaryCardProps> = ({ property, onViewDetails }) => {
  const router = useRouter();
  const pics = property.propertyPictures || (property as unknown as { picture?: PropertyPictureDto[] }).picture || [];
  console.log('[propertyCard] Full property object:', JSON.stringify(property, null, 2));
  console.log('[propertyCard] Picture count:', pics.length);
  console.log('[propertyCard] Pictures array:', pics);
  
  const primary = pics.find((p) => p.isPrimary) || pics[0];
  console.log('[propertyCard] Primary picture:', primary);
  console.log('[propertyCard] Primary imageData type:', typeof primary?.imageData);
  console.log('[propertyCard] Primary imageData value:', primary?.imageData);
  
  const initialUrl = typeof primary?.imageData === 'string' && primary.imageData.trim().length > 0
    ? primary.imageData
    : '/dubai4.jpg';
  const [imageUrl, setImageUrl] = React.useState<string>(initialUrl);
  React.useEffect(() => {
    // When primary changes, recompute URL (direct string URL now)
    const url = typeof primary?.imageData === 'string' && primary.imageData.trim().length > 0
      ? primary.imageData
      : '/dubai4.jpg';
    setImageUrl(url);
  }, [primary?.imageData]);
  
  console.log('[propertyCard] Final image URL:', imageUrl, 'length:', imageUrl?.length);
  console.log('[propertyCard] Image URL is fallback:', imageUrl === '/dubai4.jpg');

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
          image={imageUrl}
          alt={primary?.altText || property.title}
          onError={() => {
            console.warn('[propertyCard] Image failed to load, switching to fallback. src was:', imageUrl);
            const fallback = '/dubai4.jpg';
            if (imageUrl && imageUrl.startsWith('blob:')) URL.revokeObjectURL(imageUrl);
            setImageUrl(fallback);
          }}
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
          onClick={() => {
            // Prefer passed handler, fallback to router navigation
            if (onViewDetails) {
              onViewDetails(property.id);
            } else {
              router.push(`/details/${property.id}`);
            }
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default RealEstateCard;