import React from 'react';
import { Box, Card, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const images = [
  'villa1.jpg',
  'villa2.jpg',
  'dubai4.jpg',
  'villa3.jpg',
  'garden5.jpg',
  'brasov6.jpg',
];

export default function GlassPropertyGallery() {
  return (
    <Box>
      <Card
        sx={{
          width: '100%',
          height: '550px',
          maxWidth: 1000,
          padding: 3,
          borderRadius: 4,
          backdropFilter: 'blur(20px)',
          background: 'rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          border: '1px solid rgba(235, 235, 235, 0.48)',
          mt:{md:4, lg:0}
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginLeft: 20,
            mb: 3,
            height: 40,
            borderRadius: '25px',
            background: 'rgba(255,255,255,0.15)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', paddingLeft: 6 }}>
            <SearchIcon sx={{ color: 'white', mr: 1 }} />
            <Typography
              variant="body1"
              sx={{
                color: 'white',
                fontWeight: 500,
                letterSpacing: 0.3,
              }}
            >
              Nomad Estate Properties
            </Typography>
          </Box>
        </Box>

        {/* Image grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 2,
            position: 'relative',
            ml: 15,
          }}
        >
          {images.map((src, i) => {
            // compute row number
            const row = Math.floor(i / 2); // 0,1,2...
            const offset = row * 30;
            const gap = 60;

            return (
              <Box
                key={i}
                component="img"
                src={src}
                alt={`property-${i}`}
                sx={{
                  width: '17vw',
                  height: 135,
                  objectFit: 'cover',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  ml: i % 2 === 0 ? `${offset}px` : `${offset - gap}px`,
                }}
              />
            );
          })}
        </Box>
      </Card>
    </Box>
  );
}
