import { ReactNode } from "react";
import { Box, Input } from "@mui/material";
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import { grey } from "@mui/material/colors";

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
};

export default function DateInput({
  focusColor = '#000000',
  icon = <EventOutlinedIcon sx={{ color: grey[500] }} />,
  label = "",
  value = "",
  onChange = () => {},
  onFocus,
  onBlur,
  placeholder = "",
  disabled = false,
  locked = false,
  endAdornment,
  onEndAdornmentClick,
  invalid = false,
  min,
  max,
}: Props) {
  const isDisabled = disabled || locked;
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: { xs: '36px', lg: '48px' },
        bgcolor: isDisabled ? 'grey.200' : (invalid ? '#ffebee' : '#fff'),
        mx: 0,
        borderRadius: { xs: '12px', lg: '16px' },
        color: 'grey.200',
        boxShadow: `0 6px 0 ${grey[300]}`,
        px: { xs: 1, lg: 2 },
        py: { xs: 1, lg: 2 },
        ...(isDisabled ? {} : {
          '&:focus-within': {
            boxShadow: `0 6px 0 ${focusColor}`,
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
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        type="text"
        aria-label={label}
        disabled={isDisabled}
        inputProps={{ min, max, inputMode: 'numeric', pattern: '[0-9/]*' }}
        sx={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: { xs: '14px', lg: '18px' },
          paddingLeft: 2,
          flex: 1,
          color: isDisabled ? 'text.disabled' : 'text.primary',
        }}
      />
      {endAdornment ? (
        <Box onClick={onEndAdornmentClick} sx={{ ml: 1, display: 'flex', alignItems: 'center', color: isDisabled ? grey[500] : focusColor, cursor: onEndAdornmentClick ? 'pointer' : 'default' }}>
          {endAdornment}
        </Box>
      ) : null}
    </Box>
  );
}
