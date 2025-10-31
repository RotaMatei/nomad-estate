import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import HandshakeIcon from '@mui/icons-material/Handshake';
import FadeContent from '../../reactDevBits/FadeContent/FadeContent';
import AnimatedContent from '../../reactDevBits/AnimatedContent/AnimatedContent';

const features = [
  {
    icon: <LocationOnIcon color="action" fontSize="small" />,
    title: '50+ Countries',
  },
  {
    icon: <BusinessIcon color="action" fontSize="small" />,
    title: '1000+ Properties',
  },
  {
    icon: <HandshakeIcon color="action" fontSize="small" />,
    title: '500+ Partners',
  },
];

export default function GlobalTrustGrid() {
  return (
    <Box
      sx={{
        position: 'normal',
        py: 6,
        px: 2,
        textAlign: 'center',
        backgroundColor: '#fff',
        pt: 15,
        pb: 6,
      }}
    >
      <Typography variant="subtitle1" fontWeight="400" gutterBottom sx={{ color: 'grey.500' }}>
        Trusted by investors and agencies worldwide.
      </Typography>
      <Grid container alignItems="center" justifyContent="center" sx={{ mt: 2 }}>
        {features.map((feature, index) => (
          <Grid size={{ xs: 6, sm: 2 }} key={index}>
            <AnimatedContent
              distance={50}
              direction="vertical"
              reverse={false}
              duration={1.1}
              //ease="bounce.out"
              initialOpacity={0.2}
              animateOpacity
              scale={1.0}
              threshold={0.1}
              delay={0}
            >
              <div>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    {feature.icon}
                    <Typography variant="body2" color="grey.500" fontWeight={400}>
                      {feature.title}
                    </Typography>
                  </Box>
                </Box>
              </div>
            </AnimatedContent>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
