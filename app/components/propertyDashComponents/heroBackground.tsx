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
        top: { xs: '34%', md: '20%' },
        left: '50%',
        transform: 'translate(-50%, -50%)',
        height: {xs:'160vh',md:'700px'},
        width: '95vw',
        background: 'linear-gradient(to bottom, #ffffff, #ffffff, #e0cfff, #c1ccffff )',
        borderRadius,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {children}
    </Box>
  );
};

export default GradientContainer;
