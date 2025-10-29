import React, { type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { grey } from '@mui/material/colors';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { useTheme } from '@mui/material/styles';

type Option = { value: string | number; label: string };

type AutocompleteProps = {
  focusColor?: string;
  icon?: ReactNode;
  label?: string;
  value?: string | number | '';
  onChange?: (value: string | number | '') => void;
  placeholder?: string;
  options?: Option[];
  disabled?: boolean;
  locked?: boolean;
  selectedColor?: string; // highlight color for selected option in dropdown
};

export const CustomAutocomplete = ({
  focusColor = '#000000',
  icon = <PersonOutlineOutlinedIcon />,
  label = '',
  value = '',
  onChange = () => {},
  placeholder = '',
  options = [],
  disabled = false,
  locked = false,
  selectedColor,
}: AutocompleteProps) => {
  const theme = useTheme();
  const isDisabled = disabled || locked;
  const selectedOption = options.find((o) => o.value === value) ?? null;
  const paperSx = {
    bgcolor: 'background.default',
    '& .MuiAutocomplete-option': {
      color: grey[700],
    },
    ...(selectedColor
      ? {
          // Ensure selected uses provided brand color instead of theme default
          '& .MuiAutocomplete-option.Mui-selected, & .MuiAutocomplete-option[aria-selected="true"]': {
            backgroundColor: `${selectedColor} !important`,
            color: '#fff',
          },
          '& .MuiAutocomplete-option.Mui-focused': {
            backgroundColor: `${selectedColor}22`,
          },
        }
      : {}),
  } as const;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: { xs: '32px', lg: '40px' },
        bgcolor: isDisabled ? 'grey.200' : theme.palette.common.white,
        mx: 0,
        borderRadius: { xs: '12px', lg: '16px' },
        color: 'grey.200',
        boxShadow: `0 6px 0 ${grey[300]}`,
        px: { xs: 1, lg: 2 },
        py: { xs: 1, lg: 2 },
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
      <Box sx={{ mr: 1, display: 'flex', alignItems: 'center', color: isDisabled ? grey[500] : focusColor }}>{icon}</Box>

      <Autocomplete<Option, false, false, false>
        options={options}
        getOptionLabel={(opt) => opt.label}
        value={selectedOption}
        onChange={(_, newVal) => onChange((newVal)?.value ?? '')}
        disabled={isDisabled}
        isOptionEqualToValue={(opt, val) => opt.value === val.value}
        slotProps={{
          paper: {
            sx: paperSx,
          },
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder || label}
            variant="standard"
            InputProps={{
              ...params.InputProps,
              disableUnderline: true,
            }}
            sx={{
              width: '100%',
              '& .MuiInputBase-input': {
                pl: 0,
                fontFamily: 'Montserrat, sans-serif',
                fontSize: { xs: '14px', lg: '16px' },
                color: isDisabled ? 'text.disabled' : 'text.primary',
              },
            }}
          />
        )}
        renderOption={(props, option) => {
          // Avoid React warning about spreading a key prop by extracting it
          // See: https://mui.com/material-ui/api/autocomplete/#props-renderoption
          const { key, ...optionProps } = props as unknown as { key: string } & React.HTMLAttributes<HTMLLIElement>;
          return (
            <li key={key} {...optionProps}>{option.label}</li>
          );
        }}
        freeSolo={false}
        disableClearable={false}
        // keep default popup icon and keyboard interactions like MUI
        sx={{ width: '100%' }}
      />
    </Box>
  );
};

export default CustomAutocomplete;