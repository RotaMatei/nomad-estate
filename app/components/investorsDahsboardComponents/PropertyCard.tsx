'use client';

import { Card, CardContent, Typography, Button, useTheme, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useRouter } from 'next/navigation';

interface Props {
  // Legacy investment summary fields
  city: string;
  roi?: string;
  appreciation?: string;
  yield?: string; // rental yield (string form)
  price?: string;
  income?: string;
  colorScheme?: 'primary' | 'secondary';
  // Liked properties variant extra fields
  variant?: 'legacy' | 'liked';
  propertyId?: string;
  title?: string;
  imageUrl?: string;
  bedrooms?: number;
  bathrooms?: number;
  totalArea?: number;
  yieldPct?: number; // numeric yield
  onViewDetails?: (propertyId: string) => void;
  onUnsave?: (propertyId: string) => void;
  isSaved?: boolean;
}

export default function PropertyCard(props: Props) {
  const {
    city,
    roi,
    appreciation,
    yield: rentalYield,
    price,
    income,
    colorScheme = 'secondary',
    variant = 'legacy',
    propertyId,
    title,
    imageUrl,
    bedrooms,
    bathrooms,
    totalArea,
    yieldPct,
    onViewDetails,
    onUnsave,
    isSaved,
  } = props;
  const theme = useTheme();
  const router = useRouter();
  const mainColor = colorScheme === 'primary' ? theme.palette.primary.main : theme.palette.secondary.main;

  // Liked properties variant with photo + summary + buttons
  if (variant === 'liked' && propertyId) {
    return (
      <Card elevation={4} sx={{ borderRadius: 4, backgroundColor: theme.palette.background.default, boxShadow: 'none', display: 'flex', flexDirection: 'column', height: 420 }}>
        <Box sx={{ position: 'relative', height: 200, borderRadius: '4px 4px 0 0', overflow: 'hidden', bgcolor: 'grey.200' }}>
          <Box
            component="img"
            src={imageUrl || '/dubai4.jpg'}
            alt={title || city}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/dubai4.jpg'; }}
          />
        </Box>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.info' }} noWrap>
              {title || city}
            </Typography>
            <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>{city}</Typography>
            {price && (
              <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }} noWrap>
                Price: {price}
              </Typography>
            )}
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {typeof bedrooms === 'number' && <Typography variant="caption" sx={{ fontWeight: 600 }}>{bedrooms} beds</Typography>}
              {typeof bathrooms === 'number' && <Typography variant="caption" sx={{ fontWeight: 600 }}>{bathrooms} baths</Typography>}
              {typeof totalArea === 'number' && <Typography variant="caption" sx={{ fontWeight: 600 }}>{totalArea}m²</Typography>}
              {typeof yieldPct === 'number' && <Typography variant="caption" sx={{ fontWeight: 600, color: 'success.main' }}>{yieldPct}% yield</Typography>}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button
              variant="contained"
              fullWidth
              color={colorScheme === 'primary' ? 'primary' : 'secondary'}
              onClick={() => {
                if (onViewDetails) onViewDetails(propertyId); else router.push(`/details/${encodeURIComponent(propertyId)}`);
              }}
            >
              View Details
            </Button>
            <Button
              variant="outlined"
              fullWidth
              color={colorScheme === 'primary' ? 'primary' : 'secondary'}
              onClick={() => { if (onUnsave) onUnsave(propertyId); }}
            >
              Unsave
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Legacy card (unchanged layout)
  return (
    <Card elevation={4} sx={{ borderRadius: 4 , backgroundColor: theme.palette.background.default, boxShadow:'none', justifyContent:'center' }}>
      <CardContent>
        <Typography variant="h6" sx={{ color: mainColor }}>{city}</Typography>
        {roi && <Typography variant="body2">ROI: {roi}</Typography>}
        {appreciation && <Typography variant="body2">Appreciation: {appreciation}</Typography>}
        {rentalYield && <Typography variant="body2">Rental Yield: {rentalYield}</Typography>}
        {price && <Typography variant="body2">Price: {price}</Typography>}
        {income && <Typography variant="body2">Monthly Income: {income}</Typography>}
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          color={colorScheme === 'primary' ? 'primary' : 'secondary'}
          onClick={() => {
            try { router.push('/sorry'); } catch {}
          }}
        >
          View Properties
        </Button>
      </CardContent>
    </Card>
  );
}