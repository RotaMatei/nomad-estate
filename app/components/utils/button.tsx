import { ReactNode } from "react";
import { Button } from "@mui/material";
import TouchAppOutlinedIcon from '@mui/icons-material/TouchAppOutlined';
import { grey } from "@mui/material/colors";

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
}: {
  color?: BtnColor;
  icon?: ReactNode;
  label?: string;
  onClick?: () => void;
  children?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
    fullWidth?: boolean;
    sx?: any;
    disabled?: boolean;
}) => {
    const palette: Record<BtnColor, { main: string; hover: string; light: string }> = {
      primary: { main: '#003FC7', hover: '#0034A5', light: '#6FA8FF' },
      secondary: { main: '#e93b20', hover: '#c43019', light: '#f06a53' },
    };
    const colorMain = palette[color].main;
    const colorHover = palette[color].hover;
    const colorLight = palette[color].light;
        return (
                    <Button
                onClick={onClick}
                aria-label={label}
                type={type}
                fullWidth={fullWidth}
                startIcon={icon}
        disabled={disabled}
                sx={{
                    height: { xs: 44, md: 56 },
                    textTransform: 'none',
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: { xs: '14px', md: '18px' },
                    fontWeight: 700,
                    color: '#fff',
                    backgroundColor: colorMain,
                    boxShadow: `0 3px 0 ${colorLight}`,
                    px: 3,
                    borderRadius: { xs: '12px', md: '16px' },
                    justifyContent: 'center',
                    '& .MuiButton-startIcon': { mr: 1.5 },
                    '&:hover': {
                        backgroundColor: colorHover,
                    },
                    '&:focus-visible': {
                        outline: `2px solid ${colorMain}`,
                        outlineOffset: 2,
                    },
                            ...sx,
                }}
            >
                {children ?? label}
            </Button>
        );
};

export default CustomButton;
