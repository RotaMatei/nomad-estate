import { ReactNode } from 'react';
import { Box, TextField } from '@mui/material';
import DoNotDisturbAltOutlinedIcon from '@mui/icons-material/DoNotDisturbAltOutlined';
import { grey } from '@mui/material/colors';

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
};

export default function CustomTextArea({
  focusColor = '#000000',
  icon = <DoNotDisturbAltOutlinedIcon sx={{ color: grey[500] }} />,
  label = '',
  value = '',
  onChange = () => {},
  placeholder = '',
  disabled = false,
  locked = false,
  minRows = 3,
  maxRows = 6,
}: Props) {
  const isDisabled = disabled || locked;
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        minHeight: { xs: 72, md: 96 },
        bgcolor: isDisabled ? 'grey.200' : '#fff',
        mx: 0,
        borderRadius: { xs: '12px', md: '16px' },
        color: 'grey.200',
        boxShadow: `0 6px 0 ${grey[300]}`,
        px: { xs: 1, md: 2 },
        py: { xs: 1.5, md: 2 },
        ...(isDisabled
          ? {}
          : {
              '&:focus-within': {
                boxShadow: `0 6px 0 ${focusColor}`,
              },
            }),
        cursor: isDisabled ? 'not-allowed' : 'text',
        opacity: isDisabled ? 0.95 : 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', color: isDisabled ? grey[500] : focusColor, pt: 0.5 }}>{icon}</Box>

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
            fontSize: { xs: '14px', md: '18px' },
            color: isDisabled ? 'text.disabled' : 'text.primary',
          },
        }}
      />
    </Box>
  );
}
