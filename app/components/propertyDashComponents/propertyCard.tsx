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

interface RealEstateCardProps {
  imageUrl: string;
  tags: string[];
  score: number;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  area: number;
  yield: number;
  company: string;
  onViewDetails?: () => void;
}

const RealEstateCard: React.FC<RealEstateCardProps> = ({
  imageUrl,
  tags,
  score,
  title,
  location,
  price,
  beds,
  baths,
  area,
  yield: expectedYield,
  company,
  onViewDetails,
}) => {
  return (
    <Card sx={{ width: '100%', borderRadius: 4, boxShadow: 'none', backgroundColor: 'background.default' }}>
      <Box sx={{ position: 'relative'}}>
        <CardMedia
          component="img"
          height="200"
          image={imageUrl}
          alt={title}
        />
        <Chip
          label={`Score: ${score}`}
          color="success"
          size="small"
          sx={{ position: 'absolute', top: 8, right: 8 }}
        />
      </Box>

      <CardContent sx={{ px: 2, py: 1, backgroundColor: 'background.default' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {location}
        </Typography>

        <Typography variant="h5" sx={{ mt: 1, color: 'primary.main', fontWeight: 700 }}>
          {price}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
          <Typography variant="body2">{beds} beds</Typography>
          <Typography variant="body2">{baths} bathrooms</Typography>
          <Typography variant="body2">{area}m²</Typography>
        </Stack>

        <Typography variant="body2" sx={{ mt: 1 }}>
          Expected yield{' '}
          <Box component="span" sx={{ color: 'green', fontWeight: 600 }}>
            {expectedYield}%
          </Box>
        </Typography>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {company}
        </Typography>

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2, borderRadius: 2 }}
          onClick={onViewDetails}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default RealEstateCard;