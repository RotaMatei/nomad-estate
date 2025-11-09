// ...existing code...
import React, { type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { grey } from '@mui/material/colors';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useTheme } from '@mui/material/styles';

type Option = { value: string | number; label: string };

export const CustomSelect = ({
  focusColor = grey[500],
  bgColor,
  textColor,
  icon = <PersonOutlineOutlinedIcon sx={{ color: grey[500] }} />,
  selectIcon: SelectIcon = ArrowDropDownIcon,
  label = '',
  value = '',
  onChange = () => { },
  placeholder = '',
  options = [],
  disabled = false,
  locked = false,
  selectedColor,
}: {
  focusColor?: string;
  bgColor?: string;
  textColor?: string;
  icon?: ReactNode;
  selectIcon?: React.ElementType;
  label?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  options?: Option[];
  disabled?: boolean;
  locked?: boolean;
  selectedColor?: string;
}) => {
  const theme = useTheme();
  const isDisabled = disabled || locked;
  const resolvedBg = isDisabled ? theme.palette.grey[200] : (bgColor ?? theme.palette.background.default);
  const resolvedText = textColor ?? grey[700];
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
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.95 : 1,
      }}
    >
      <Box sx={{ mr: 1, display: 'flex', alignItems: 'center', color: isDisabled ? grey[700]: focusColor }}>{icon}</Box>

      <Select
        value={value}
        onChange={handleChange}
        displayEmpty
        variant="standard"
        disabled={isDisabled}
        IconComponent={SelectIcon}
        MenuProps={{
          PaperProps: {
            sx: {
              bgcolor: 'background.default',
              '& .MuiMenuItem-root': {
                color: grey[700],
              },
              ...(selectedColor
                ? {
                    '& .MuiMenuItem-root.Mui-selected, & .MuiMenuItem-root[aria-selected="true"]': {
                      backgroundColor: `${selectedColor} !important`,
                      color: '#fff',
                    },
                    '& .MuiMenuItem-root.Mui-focusVisible, & .MuiMenuItem-root.Mui-selected.Mui-focusVisible': {
                      backgroundColor: `${selectedColor}22`,
                    },
                  }
                : {}),
            },
          },
        }}
        // hide standard underline
        renderValue={(selected) => {
          if (selected === '' || selected === undefined) return label || placeholder || '';
          const found = options.find((o) => o.value === selected);
          return found ? found.label : String(selected);
        }}
        inputProps={{ 'aria-label': label || placeholder || 'select' }}
        sx={{
          width: '100%',
          pl: 0,
          fontFamily: 'Montserrat, sans-serif',
          fontSize: { xs: '14px', lg: '16px' },
          color: (value === '' || value === undefined) ? grey[500] : (isDisabled ? 'text.disabled' : resolvedText),
          '&:before, &:after': { display: 'none' },
          '& .MuiSvgIcon-root': {
            color: isDisabled ? grey[700] : focusColor,
          },
        }}
      >
        {/* Removed header/placeholder item inside the dropdown as requested */}
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
