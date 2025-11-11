import React, { useState, ReactNode } from 'react';
import {
  Box,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Menu,
  Typography,
  Button,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export type Option = { value: string; label: string };

type Props = {
  label?: string;
  options: Option[];
  values: string[];
  onChange: (values: string[]) => void;
  focusColor?: string;
  bgColor?: string;
  textColor?: string;
  placeholder?: string;
  icon?: ReactNode;
};

export default function MultiSelectDropdown({
  label = '',
  options,
  values,
  onChange,
  focusColor = grey[500],
  bgColor,
  textColor = grey[500],
  placeholder = 'Select options',
  icon,
}: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCheckboxChange = (value: string) => {
    const newValues = values.includes(value)
      ? values.filter((v) => v !== value)
      : [...values, value];
    onChange(newValues);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const displayLabel = values.length === 0 
    ? placeholder 
    : values.length === 1 
    ? options.find((o) => o.value === values[0])?.label || placeholder
    : `${values.length} selected`;

  const theme = {
    bgColor: bgColor || '#fff',
    textColor: textColor,
  };

  return (
    <Box>
      <Button
        id="multi-select-button"
        aria-controls={open ? 'multi-select-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          height: { xs: '32px', lg: '40px' },
          bgcolor: theme.bgColor,
          color: theme.textColor,
          px: { xs: 1, lg: 2 },
          py: { xs: 1, lg: 2 },
          borderRadius: { xs: '12px', lg: '16px' },
          boxShadow: `0 3px 0 ${grey[300]}`,
          textTransform: 'none',
          fontFamily: 'Montserrat, sans-serif',
          fontSize: { xs: '14px', lg: '16px' },
          fontWeight: 400,
          border: 'none',
          '&:hover': {
            bgcolor: theme.bgColor,
          },
          '&:focus': {
            outline: 'none',
          },
          ...(open ? {
            boxShadow: `0 3px 0 ${focusColor}`,
          } : {}),
        }}
      >
        {icon ? (
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 1, color: textColor }}>
            {/* Icon inherits current color via 'currentColor' if set by caller */}
            {icon}
          </Box>
        ) : null}
        <Box sx={{ textAlign: 'left', flex: 1 }}>
          {displayLabel}
        </Box>
        <ArrowDropDownIcon
          sx={{
            color: focusColor,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
            ml: 1,
          }}
        />
      </Button>

      <Menu
        id="multi-select-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        MenuListProps={{
          'aria-labelledby': 'multi-select-button',
        }}
        PaperProps={{
          sx: {
            bgcolor: 'background.default',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            borderRadius: '8px',
            mt: 0.5,
            width: anchorEl ? anchorEl.offsetWidth : 'auto',
          },
          onClick: handleMenuClick,
        }}
      >
        <Box sx={{ p: 2 }}>
          <FormGroup>
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={values.includes(option.value)}
                    onChange={() => handleCheckboxChange(option.value)}
                    sx={{
                      color: grey[500],
                      '&.Mui-checked': {
                        color: focusColor,
                      },
                    }}
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontSize: '14px',
                      color: textColor,
                    }}
                  >
                    {option.label}
                  </Typography>
                }
                sx={{
                  mb: 1,
                  '&:last-child': {
                    mb: 0,
                  },
                }}
              />
            ))}
          </FormGroup>
        </Box>
      </Menu>
    </Box>
  );
}
