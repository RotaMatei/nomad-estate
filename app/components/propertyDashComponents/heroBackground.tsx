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
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        height: '150vh',
        width: '95vw',
        background: 'linear-gradient(to bottom, #ffffff, #d0e6ff, #e0cfff)',
        borderRadius,
        padding,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {children}
    </Box>
  );
};

export default GradientContainer;
