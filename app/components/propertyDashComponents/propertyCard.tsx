import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Box,
  Stack,
  CardActionArea,
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
    <Card
      sx={{
        width: '100%',
        borderRadius: 4,
        boxShadow: 'none',
        backgroundColor: 'background.default',
      }}
    >
      <CardActionArea onClick={onViewDetails} sx={{ borderRadius: 4 }}>
        <Box sx={{ position: 'relative', borderRadius: 4, overflow: 'hidden' }}>
          <CardMedia component="img" height="200" image={imageUrl} alt={title} sx={{ display: 'block' }} />
          <Chip
            label={`Score: ${score}`}
            color="success"
            size="small"
            sx={{ position: 'absolute', top: 8, right: 8 }}
          />
        </Box>

        <CardContent sx={{ px: 0, py: 1, backgroundColor: 'background.default' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Typography variant="caption" color="grey.500" sx={{fontWeight: 500}}>
            {location}
          </Typography>

          <Typography variant="body1" sx={{ mt: 1, color: 'primary.main', fontWeight: 700 }}>
            {price}
          </Typography>

          <Stack direction="row"  sx={{ mt: 1, flexWrap: 'wrap'  }}>
            <Typography variant="caption" sx={{ fontWeight: 500, mr: 2 }}>{beds} beds</Typography>
            <Typography variant="caption" sx={{ fontWeight: 500, mr: 2 }}>{baths} bathrooms</Typography>
            <Typography variant="caption" sx={{ fontWeight: 500 }}>{area}m²</Typography>
          </Stack>

          <Typography variant="caption" sx={{ mt: 1, fontWeight: 500, color:'text.secondary' }}>
            Expected yield{' '}
            <Box component="span" sx={{ color: 'green', fontWeight: 600 }}>
              {expectedYield}%
            </Box>
          </Typography>

          <Typography variant="caption" color="grey.500" sx={{ mt: 1, display: 'block', fontWeight: 500 }}>
            {company}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default RealEstateCard;