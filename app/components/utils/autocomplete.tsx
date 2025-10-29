import React, { type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { grey } from '@mui/material/colors';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

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
  const isDisabled = disabled || locked;
  const selectedOption = options.find((o) => o.value === value) ?? null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: { xs: '36px', md: '48px' },
        bgcolor: isDisabled ? 'grey.200' : '#fff',
        mx: 0,
        borderRadius: { xs: '12px', md: '16px' },
        color: 'grey.200',
        boxShadow: `0 3px 0 ${grey[300]}`,
        px: { xs: 1, md: 2 },
        py: { xs: 1, md: 2 },
        ...(isDisabled ? {} : {
          '&:focus-within': {
            boxShadow: `0 3px 0 ${focusColor}`,
          },
        }),
        cursor: isDisabled ? 'not-allowed' : 'text',
        opacity: isDisabled ? 0.95 : 1,
      }}
    >
      <Box sx={{ mr: 1, display: 'flex', alignItems: 'center', color: isDisabled ? grey[500] : focusColor }}>{icon}</Box>

      <Autocomplete
        options={options}
        getOptionLabel={(opt) => (typeof opt === 'string' ? opt : opt.label)}
        value={selectedOption}
        onChange={(_, newVal) => onChange((newVal as Option | null)?.value ?? '')}
        disabled={isDisabled}
        isOptionEqualToValue={(opt, val) => (opt as Option).value === (val as Option).value}
        slotProps={selectedColor ? {
          paper: {
            sx: {
              '& .MuiAutocomplete-option[aria-selected="true"]': {
                bgcolor: selectedColor,
                color: '#fff',
              },
              '& .MuiAutocomplete-option.Mui-focused': {
                bgcolor: `${selectedColor}22`,
              },
            },
          },
        } : undefined}
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
                fontSize: { xs: '14px', md: '16px' },
                color: isDisabled ? 'text.disabled' : 'text.primary',
              },
            }}
          />
        )}
        renderOption={(props, option) => {
          // Avoid React warning about spreading a key prop by extracting it
          // See: https://mui.com/material-ui/api/autocomplete/#props-renderoption
          const { key, ...optionProps } = props as unknown as { key: string } & Record<string, unknown>;
          return (
            <li key={key} {...(optionProps as any)}>{(option as Option).label}</li>
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