import { ReactNode } from 'react';
import { Box, TextField } from '@mui/material';
import DoNotDisturbAltOutlinedIcon from '@mui/icons-material/DoNotDisturbAltOutlined';
import { grey } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';

type Props = {
  focusColor?: string;
  icon?: ReactNode;
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  locked?: boolean;
  minRows?: number;
  maxRows?: number;
  bgColor?: string;
  textColor?: string;
};

export default function CustomTextArea({
  focusColor = grey[700],
  icon = <DoNotDisturbAltOutlinedIcon sx={{ color: grey[500] }} />,
  label = '',
  value = '',
  onChange = () => {},
  placeholder = '',
  disabled = false,
  locked = false,
  minRows = 3,
  maxRows = 6,
  bgColor,
  textColor,
}: Props) {
  const theme = useTheme();
  const isDisabled = disabled || locked;
  const resolvedBg = isDisabled ? theme.palette.grey[200] : (bgColor ?? theme.palette.background.default);
  const resolvedText = textColor ?? grey[700];
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        minHeight: { xs: 72, lg: 96 },
  bgcolor: resolvedBg,
        mx: 0,
        borderRadius: { xs: '12px', lg: '16px' },
  color: resolvedText,
        boxShadow: `0 3px 0 ${grey[300]}`,
  px: { xs: 1, lg: 2 },
  py: { xs: 1.5, lg: 2 },
        ...(isDisabled
          ? {}
          : {
              '&:focus-within': {
                boxShadow: `0 3px 0 ${focusColor}`,
              },
            }),
        cursor: isDisabled ? 'not-allowed' : 'text',
        opacity: isDisabled ? 0.95 : 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          color: isDisabled ? grey[500] : focusColor,
          pt: 0.5,
        }}
      >
        {icon}
      </Box>

      <TextField
        variant="standard"
        multiline
        minRows={minRows}
        maxRows={maxRows}
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
        InputProps={{ disableUnderline: true }}
        aria-label={label}
        disabled={isDisabled}
        sx={{
          width: '100%',
          ml: 2,
          '& .MuiInputBase-input': {
            fontFamily: 'Montserrat, sans-serif',
            fontSize: { xs: '14px', lg: '16px' },
            color: isDisabled ? 'text.disabled' : resolvedText,
          },
        }}
      />
    </Box>
  );
}
