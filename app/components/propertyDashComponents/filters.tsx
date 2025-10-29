'use client';
import { Box, Button, Grid, InputBase, Typography } from '@mui/material';
import MagicBento from '@/app/reactDevBits/MagicBento/MagicBento';

export default function Filters() {
    return (
        <Box className="filters-container">

            <Box sx={{ position: 'absolute', }}>
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