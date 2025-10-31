'use client';
import { Box, Button, Grid, InputBase, Typography } from '@mui/material';
import MagicBento from '@/app/reactDevBits/MagicBento/MagicBento';

export default function Filters() {
    return (
        <Box className="filters-container" sx={{ mt: { xs: 2, md: 3 } }}>
            <Box>
                <MagicBento
                    textAutoHide={true}
                    enableStars={true}
                    enableSpotlight={false}
                    enableBorderGlow={true}
                    enableTilt={false}
                    enableMagnetism={false}
                    clickEffect={false}
                    spotlightRadius={400}
                    particleCount={12}
                />
            </Box>
        </Box>
    );
}