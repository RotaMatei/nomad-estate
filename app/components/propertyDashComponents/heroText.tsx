'use client';
import GradientText from '@/app/GradientText/GradientText';
import { Box, Typography } from '@mui/material';

export default function HeroText() {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 2, // above background, below filters/navbar
            pointerEvents: 'none',
            mt: { xs: 5, sm: 3}, // push text lower on sm+
        }}>
            <Typography variant="h1" sx={{textAlign:'center'}}>
                <GradientText
                    colors={["#e80000ff", "#BC2DFF", "#121de6ff", "#BC2DFF", "#E80000"]}
                    animationSpeed={5}
                    showBorder={false}
                    className="custom-class font-class"
                    
                >
                    Properties Search Dashboard
                </GradientText>
            </Typography>
            <Typography variant="h6" sx={{ fontFamily: 'Montserrat, sans-serif', fontSize: { xs: '16px', md: '18px' }, color: 'text.secondary', textAlign: 'center', mb: 4, fontWeight:'400' }}>
                Start investing in properties around the globe
            </Typography>

        </Box>
    );
}