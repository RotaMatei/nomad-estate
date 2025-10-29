// ...existing code...
import React, { type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { grey } from '@mui/material/colors';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

type Option = { value: string | number; label: string };

export const CustomSelect = ({
  focusColor = '#000000',
  icon = <PersonOutlineOutlinedIcon sx={{ color: grey[500] }} />,
  selectIcon: SelectIcon = ArrowDropDownIcon,
  label = '',
  value = '',
  onChange = () => {},
  placeholder = '',
  options = [],
  disabled = false,
  locked = false,
}: {
  focusColor?: string;
  icon?: ReactNode;
  selectIcon?: React.ElementType;
  label?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  options?: Option[];
  disabled?: boolean;
  locked?: boolean;
}) => {
  const isDisabled = disabled || locked;
  const handleChange = (e: SelectChangeEvent<string | number>) => {
    onChange(e.target.value as string | number);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
  height: { xs: '32px', lg: '40px' },
        bgcolor: isDisabled ? 'grey.200' : '#fff',
  mx: 0,
  borderRadius: { xs: '12px', lg: '16px' },
        color: 'grey.200',
        boxShadow: `0 3px 0 ${grey[300]}`,
        px: { xs: 1, md: 2 },
        py: { xs: 1, md: 2 },
        ...(isDisabled ? {} : {
          '&:focus-within': {
            boxShadow: `0 3px 0 ${focusColor}`,
          },
        }),
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.95 : 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', color: isDisabled ? grey[500] : focusColor }}>{icon}</Box>

      <Select
        value={value}
        onChange={handleChange}
        displayEmpty
        variant="standard"
        disabled={isDisabled}
        IconComponent={SelectIcon}
        // hide standard underline
        renderValue={(selected) => {
          if (selected === '' || selected === undefined) return placeholder || label || 'Select';
          const found = options.find((o) => o.value === selected);
          return found ? found.label : String(selected);
        }}
        inputProps={{ 'aria-label': label || placeholder || 'select' }}
        sx={{
          width: '100%',
          pl: 1,
          fontFamily: 'Montserrat, sans-serif',
          fontSize: { xs: '14px', lg: '16px' },
          color: isDisabled ? 'text.disabled' : 'text.primary',
          '&:before, &:after': { display: 'none' },
        }}
      >
        {placeholder ? (
          <MenuItem value="" disabled>
            {placeholder}
          </MenuItem>
        ) : null}
        {options.map((opt) => (
          <MenuItem key={String(opt.value)} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default CustomSelect;
// ...existing code...
