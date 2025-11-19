import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import HandshakeIcon from '@mui/icons-material/Handshake';
// Removed unused FadeContent import
import AnimatedContent from '../../reactDevBits/AnimatedContent/AnimatedContent';
import api from '../../lib/api';

const useHomeStats = () => {
  const [stats, setStats] = React.useState<{ countries: number; properties: number; partners: number } | null>(null);
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get('/property/stats-home');
        if (!cancelled) setStats(res.data as { countries: number; properties: number; partners: number });
      } catch {
        // ignore; keep null so we fall back to defaults
      }
    })();
    return () => { cancelled = true; };
  }, []);
  return stats;
};

export default function GlobalTrustGrid() {
  const live = useHomeStats();
  const features = React.useMemo(() => ([
    {
      icon: <LocationOnIcon color="action" fontSize="small" />,
      title: `${live?.countries ?? 50}+ Countries`,
    },
    {
      icon: <BusinessIcon color="action" fontSize="small" />,
      title: `${live?.properties ?? 1000}+ Properties`,
    },
    {
      icon: <HandshakeIcon color="action" fontSize="small" />,
      title: `${live?.partners ?? 500}+ Partners`,
    },
  ]), [live]);
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
