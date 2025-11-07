import { ReactNode } from 'react';
import { Box, Input } from '@mui/material';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import { grey } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';

type Props = {
  focusColor?: string;
  icon?: ReactNode;
  label?: string;
  value?: string; // typically dd/mm/yyyy
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  locked?: boolean;
  endAdornment?: ReactNode;
  onEndAdornmentClick?: () => void;
  invalid?: boolean;
  min?: string; // YYYY-MM-DD
  max?: string; // YYYY-MM-DD
  bgColor?: string;
  textColor?: string;
};

export default function DateInput({
  focusColor = grey[700],
  icon = <EventOutlinedIcon sx={{ color: grey[500] }} />,
  label = '',
  value = '',
  onChange = () => {},
  onFocus,
  onBlur,
  placeholder = '',
  disabled = false,
  locked = false,
  endAdornment,
  onEndAdornmentClick,
  invalid = false,
  min,
  max,
  bgColor,
  textColor,
}: Props) {
  const theme = useTheme();
  const isDisabled = disabled || locked;
  const resolvedBg = isDisabled ? theme.palette.grey[200] : (invalid ? '#ffebee' : (bgColor ?? theme.palette.background.default));
  const resolvedText = textColor ?? grey[700];
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: { xs: '32px', lg: '40px' },
  bgcolor: resolvedBg,
        mx: 0,
        borderRadius: { xs: '12px', lg: '16px' },
  color: resolvedText,
        boxShadow: `0 3px 0 ${grey[300]}`,
        px: { xs: 1, lg: 2 },
        py: { xs: 1, lg: 2 },
        ...(isDisabled ? {} : {
          '&:focus-within': {
            boxShadow: `0 3px 0 ${focusColor}`,
          },
        }),
        cursor: isDisabled ? 'not-allowed' : 'text',
        opacity: isDisabled ? 0.95 : 1,
      }}
    >
      <Box
        sx={{ display: 'flex', alignItems: 'center', color: isDisabled ? grey[500] : focusColor }}
      >
        {icon}
      </Box>
      <Input
        disableUnderline
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        type="text"
        aria-label={label}
        disabled={isDisabled}
        inputProps={{ min, max, inputMode: 'numeric', pattern: '[0-9/]*' }}
        sx={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: { xs: '14px', lg: '16px' },
          paddingLeft: 2,
          flex: 1,
          color: isDisabled ? 'text.disabled' : resolvedText,
        }}
      />
      {endAdornment ? (
        <Box
          onClick={onEndAdornmentClick}
          sx={{
            ml: 1,
            display: 'flex',
            alignItems: 'center',
            color: isDisabled ? grey[500] : focusColor,
            cursor: onEndAdornmentClick ? 'pointer' : 'default',
          }}
        >
          {endAdornment}
        </Box>
      ) : null}
    </Box>
  );
}
