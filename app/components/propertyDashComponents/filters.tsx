'use client';
import { Box } from '@mui/material';
import MagicBento from '@/app/reactDevBits/MagicBento/MagicBento';

export default function Filters() {
    return (
        <Box
            className="filters-container"
            sx={{
                mt: { xs: 3, sm: 3, md: 4 },
                mb: { xs: 3, md: 4 }, // bottom margin controls space above properties list
                // ensure consistent spacing inside a 100vh layout without huge gaps
            }}
        >
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