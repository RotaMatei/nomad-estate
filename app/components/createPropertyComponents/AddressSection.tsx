"use client";

import React, { useEffect, useMemo, useState, useEffect as ReactEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import CustomInput from '../../components/utils/input';
import CustomSelect from '../../components/utils/select';
import { PropertyFormData } from './types';
import { getCitiesByState, getCountries, getStates, City, Country, State } from '../../lib/locationApi';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MailIcon from '@mui/icons-material/Mail';
// Removed unused icons PublicIcon and MapIcon
import MyLocationIcon from '@mui/icons-material/MyLocation';

interface Props {
  formData: PropertyFormData;
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>;
}

export default function AddressSection({ formData, setFormData }: Props) {
  const theme = useTheme();
  const focusColor = theme.palette.primary.main;
  const bgColor = theme.palette.background.default;
  const textColor = grey[500];

  // Parsing helper kept for other numeric fields (not used now for lat/lon which have custom format)
  const toFloat = (v: string) => (v === '' ? undefined : parseFloat(v));

  // Local controlled strings for latitude/longitude formatted as sign + DDD,dddddd
  const [latitudeInput, setLatitudeInput] = useState<string>('');
  const [longitudeInput, setLongitudeInput] = useState<string>('');
  const [latValid, setLatValid] = useState<boolean>(true);
  const [lonValid, setLonValid] = useState<boolean>(true);

  // Regex: optional + or -, 1-3 digits, comma, 1-6 digits
  const coordRegex = /^[+-]?\d{1,3},\d{1,6}$/;

  // Initialize from formData if numbers exist (convert dot to comma)
  useEffect(() => {
    if (formData.latitude !== undefined) {
      const latStr = formData.latitude.toFixed(6).replace('.', ',').replace(/0+$/,'').replace(/,$/,'');
      setLatitudeInput(latStr);
    }
    if (formData.longitude !== undefined) {
      const lonStr = formData.longitude.toFixed(6).replace('.', ',').replace(/0+$/,'').replace(/,$/,'');
      setLongitudeInput(lonStr);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLatChange = (raw: string) => {
    // Allow user to build value: restrict characters first
    // Permit: digits, leading +/-, single comma
    if (/[^0-9+\-,]/.test(raw)) return; // ignore invalid chars
    // Enforce single sign at start
    if ((raw.match(/[+-]/g)?.length || 0) > 1) return;
    if (raw.length > 1 && /[+-]/.test(raw.slice(1))) return;
    // Enforce single comma
    if ((raw.match(/,/g)?.length || 0) > 1) return;
    // Split check lengths
    const [intPart, fracPart] = raw.split(',');
    if (intPart) {
      const digits = intPart.replace(/[+-]/,'');
      if (digits.length > 3) return;
    }
    if (fracPart && fracPart.length > 6) return;
    setLatitudeInput(raw);
    const isValid = coordRegex.test(raw);
    setLatValid(isValid);
    if (isValid) {
      const numeric = parseFloat(raw.replace(',', '.'));
      setFormData({ ...formData, latitude: numeric });
    } else {
      setFormData({ ...formData, latitude: undefined });
    }
  };

  const handleLonChange = (raw: string) => {
    if (/[^0-9+\-,]/.test(raw)) return;
    if ((raw.match(/[+-]/g)?.length || 0) > 1) return;
    if (raw.length > 1 && /[+-]/.test(raw.slice(1))) return;
    if ((raw.match(/,/g)?.length || 0) > 1) return;
    const [intPart, fracPart] = raw.split(',');
    if (intPart) {
      const digits = intPart.replace(/[+-]/,'');
      if (digits.length > 3) return;
    }
    if (fracPart && fracPart.length > 6) return;
    setLongitudeInput(raw);
    const isValid = coordRegex.test(raw);
    setLonValid(isValid);
    if (isValid) {
      const numeric = parseFloat(raw.replace(',', '.'));
      setFormData({ ...formData, longitude: numeric });
    } else {
      setFormData({ ...formData, longitude: undefined });
    }
  };

  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCountry, setLoadingCountry] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [loadingCity, setLoadingCity] = useState(false);

  // Fetch countries on mount
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoadingCountry(true);
        const data = await getCountries();
        if (active) setCountries(data);
      } finally {
        if (active) setLoadingCountry(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    let active = true;
    const cid = formData.countryId;
    if (cid && typeof cid === 'number') {
      (async () => {
        try {
          setLoadingState(true);
          const data = await getStates(cid);
          if (active) {
            setStates(data);
            setCities([]);
          }
        } finally {
          if (active) setLoadingState(false);
        }
      })();
    } else {
      setStates([]);
      setCities([]);
    }
    return () => {
      active = false;
    };
  }, [formData.countryId]);

  // Fetch cities when state changes
  useEffect(() => {
    let active = true;
    const sid = formData.stateId;
    if (sid && typeof sid === 'number') {
      (async () => {
        try {
          setLoadingCity(true);
          const data = await getCitiesByState(sid);
          if (active) setCities(data);
        } finally {
          if (active) setLoadingCity(false);
        }
      })();
    } else {
      setCities([]);
    }
    return () => {
      active = false;
    };
  }, [formData.stateId]);

  const countryOptions = useMemo(() => countries.map(c => ({ value: c.id, label: c.name })), [countries]);
  const stateOptions = useMemo(() => states.map(s => ({ value: s.id, label: s.name })), [states]);
  const cityOptions = useMemo(() => cities.map(c => ({ value: c.id, label: c.name })), [cities]);

  return (
    <Box component="fieldset" sx={{ display: 'flex', flexDirection: 'column', gap: 3, my: '1px', p:2, borderRadius:4, border: '1px solid', borderColor: '#c2c2c265' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, color:'primary.main' }}>
        Address & Location
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Street Address used for display and geocoding *</Typography>
        <CustomInput
          placeholder="Street Address"
          value={formData.streetAddress || ''}
          onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          icon={<LocationOnIcon sx={{ color: textColor }} />}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Postal Code for address validation and search *</Typography>
        <CustomInput
          placeholder="Postal Code"
          value={formData.postalCode || ''}
          onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          icon={<MailIcon sx={{ color: textColor }} />}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Country (select to load states) *</Typography>
        <CustomSelect
          label={loadingCountry ? 'Loading countries…' : 'Country'}
          value={formData.countryId ?? ''}
          onChange={(value) => {
            const id = typeof value === 'string' ? parseInt(value, 10) : (value as number);
            setFormData({ ...formData, countryId: isNaN(id) ? undefined : id, stateId: undefined, cityId: undefined });
          }}
          options={countryOptions}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>State/Region (loads after country)</Typography>
        <CustomSelect
          label={loadingState ? 'Loading states…' : 'State'}
          value={formData.stateId ?? ''}
          onChange={(value) => {
            const id = typeof value === 'string' ? parseInt(value, 10) : (value as number);
            setFormData({ ...formData, stateId: isNaN(id) ? undefined : id, cityId: undefined });
          }}
          options={stateOptions}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>City (loads after state) *</Typography>
        <CustomSelect
          label={loadingCity ? 'Loading cities…' : 'City'}
          value={formData.cityId ?? ''}
          onChange={(value) => {
            const id = typeof value === 'string' ? parseInt(value, 10) : (value as number);
            setFormData({ ...formData, cityId: isNaN(id) ? undefined : id });
          }}
          options={cityOptions}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
        />
      </Box>

      

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Latitude coordinate for map placement (format ±DDD,DDDDDD) *</Typography>
        <CustomInput
          placeholder="e.g. +45,123456"
          value={latitudeInput}
          onChange={(e) => handleLatChange(e.target.value)}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          invalid={!latValid && latitudeInput.length > 0}
          icon={<MyLocationIcon sx={{ color: textColor }} />}
        />
        {!latValid && latitudeInput.length > 0 && (
          <Typography variant="caption" sx={{ color: theme.palette.error.main, mt: 0.5 }}>
            Invalid latitude format. Use ±DDD,DDDDDD (max 3 digits before, 6 after comma).
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[500]}>Longitude coordinate for map placement (format ±DDD,DDDDDD) *</Typography>
        <CustomInput
          placeholder="e.g. -120,98765"
          value={longitudeInput}
          onChange={(e) => handleLonChange(e.target.value)}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          invalid={!lonValid && longitudeInput.length > 0}
          icon={<MyLocationIcon sx={{ color: textColor }} />}
        />
        {!lonValid && longitudeInput.length > 0 && (
          <Typography variant="caption" sx={{ color: theme.palette.error.main, mt: 0.5 }}>
            Invalid longitude format. Use ±DDD,DDDDDD (max 3 digits before, 6 after comma).
          </Typography>
        )}
      </Box>
    </Box>
  );
}