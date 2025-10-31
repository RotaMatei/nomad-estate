import { ReactNode, isValidElement } from 'react';
import { Button, Box } from '@mui/material';
import TouchAppOutlinedIcon from '@mui/icons-material/TouchAppOutlined';
import { grey } from '@mui/material/colors';
import type { SxProps, Theme } from '@mui/material';
import { useTheme } from '@mui/material/styles';

type BtnColor = 'primary' | 'secondary';

export const CustomButton = ({
  color = 'primary',
  icon = <TouchAppOutlinedIcon sx={{ color: '#fff' }} />,
  label = '',
  onClick = () => {},
  children = null,
  type = 'button',
  fullWidth = true,
  sx = {},
  disabled = false,
  containerSx = {},
}: {
  color?: BtnColor;
  icon?: ReactNode;
  label?: string;
  onClick?: () => void;
  children?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
  disabled?: boolean;
  containerSx?: SxProps<Theme>;
}) => {
  const theme = useTheme();
  const paletteSlot = theme.palette[color];
  const colorMain = paletteSlot.main;
  const colorHover = paletteSlot.dark ?? paletteSlot.main;
  const colorLight = paletteSlot.light ?? paletteSlot.main;

  // Ensure icon color matches disabled text color by overriding its sx when disabled
  const startIconEl = (() => {
    if (disabled && isValidElement(icon)) {
      return <span style={{ color: colorMain, display: 'inline-flex' }}>{icon}</span>;
    }
    return icon;
  })();

    return (
      <Box sx={{ position: 'relative', display: fullWidth ? 'block' : 'inline-block', width: fullWidth ? '100%' : 'auto', ...containerSx }}>
        <Button
          onClick={onClick}
          aria-label={label}
          type={type}
          fullWidth={fullWidth}
          startIcon={startIconEl}
          disabled={disabled}
          sx={{
            height: { xs: 42, md: 48 },
            textTransform: 'none',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: { xs: '12px', md: '14px', lg: '18px' },
            fontWeight: 700,
            color: '#fff',
            backgroundColor: colorMain,
            boxShadow: `0 3px 0 ${colorLight}`,
            px: 3,
            borderRadius: { xs: '12px', lg: '16px' },
            justifyContent: 'center',
            '& .MuiButton-startIcon': { mr: 1.5 },
            '&:hover': {
              backgroundColor: colorHover,
            },
            '&:focus-visible': {
              outline: `2px solid ${colorMain}`,
              outlineOffset: 2,
            },
            // Disabled appearance: text/icon in page primary color, background same grey as disabled Autocomplete
            '&.Mui-disabled': {
              color: colorMain,
              backgroundColor: grey[200],
              boxShadow: `0 3px 0 ${grey[300]}`,
              opacity: 1,
            },
            '&.Mui-disabled .MuiButton-startIcon': {
              color: colorMain,
            },
            ...sx,
          }}
        >
          {children ?? label}
        </Button>
      </Box>
    );
};

export default CustomButton;
