import React, { ReactNode } from 'react';
import { Box } from '@mui/material';

interface GradientContainerProps {
  children?: ReactNode;
  borderRadius?: number | string;
  padding?: number | string;
}

const GradientContainer: React.FC<GradientContainerProps> = ({
  children,
  borderRadius = '16px',
  padding = '24px',
}) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '95vw',
        mx: 'auto',
        mt: { xs: 2, sm: 3, md: 4 },
        mb: { xs: 4, md: 6 },
        minHeight: 'auto',
        background: 'linear-gradient(to bottom, #ffffff, #ffffff, #e0cfff, #c1ccffff )',
        borderRadius,
        display: 'flex',
        flexDirection: 'column',
        p: padding,
        // Extend the gradient lower so cards can overlap it visually
        pb: { xs: '150px', sm: '220px', md: '300px', lg: '350px' },
      }}
    >
      {children}
    </Box>
  );
};

export default GradientContainer;