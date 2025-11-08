import { ReactNode } from 'react';
import { Box, Input } from '@mui/material';
import DoNotDisturbAltOutlinedIcon from '@mui/icons-material/DoNotDisturbAltOutlined';
import { grey } from '@mui/material/colors';
import { alpha, useTheme } from '@mui/material/styles';

export const CustomInput = ({
    focusColor = grey[700],
    bgColor,
        textColor,
  icon = <DoNotDisturbAltOutlinedIcon sx={{ color: grey[500] }} />,
  label = '',
  value = '',
  onChange = () => {},
    onKeyDown,
  onFocus,
  onBlur,
  placeholder = '',
  type = 'text',
  disabled = false,
  locked = false,
  endAdornment,
  onEndAdornmentClick,
  invalid = false,
}: {
  focusColor?: string;
    bgColor?: string;
    textColor?: string;
  icon?: ReactNode;
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  locked?: boolean;
  endAdornment?: ReactNode;
  onEndAdornmentClick?: (e?: React.MouseEvent<HTMLElement>) => void;
  invalid?: boolean;
}) => {
    const theme = useTheme();
    const isDisabled = disabled || locked;
    const resolvedBg = isDisabled
      ? theme.palette.grey[200]
      : invalid
        ? alpha(theme.palette.error.main, 0.08)
        : (bgColor ?? theme.palette.background.default);
    const resolvedText = textColor ?? grey[700];
    return (
        <Box
            sx= {{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                height: { xs: '32px', lg: '40px' },
                bgcolor: resolvedBg,
                mx: 0,
                borderRadius: {xs:'12px', lg: '16px'},
                color: resolvedText,
                boxShadow: `0 3px 0 ${grey[300]}`,
                px: {xs: 1, lg: 2},
                py: {xs: 1, lg: 2},
                ...(isDisabled ? {} : {
                    '&:focus-within': {
                        boxShadow: `0 3px 0 ${focusColor}`,
                    },
                }),
                cursor: isDisabled ? 'not-allowed' : 'text',
                opacity: isDisabled ? 0.95 : 1,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', color: isDisabled ? grey[500] : focusColor }}>
                {icon}
            </Box>
            
            <Input
                disableUnderline
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                onFocus={onFocus}
                onBlur={onBlur}
                placeholder={placeholder}
                type={type}
                aria-label={label}
                disabled={isDisabled}
                sx={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: {xs: '14px', lg: '16px'},
                    paddingLeft: 2,
                    flex: 1,
                    color: isDisabled ? 'text.disabled' : resolvedText,
                }}
            />
            {endAdornment ? (
                <Box onClick={(e) => onEndAdornmentClick?.(e)} sx={{ ml: 1, display: 'flex', alignItems: 'center', color: isDisabled ? grey[500] : focusColor, cursor: onEndAdornmentClick ? 'pointer' : 'default' }}>
                    {endAdornment}
                </Box>
            ) : null}
        </Box>
    )
}

export default CustomInput;
