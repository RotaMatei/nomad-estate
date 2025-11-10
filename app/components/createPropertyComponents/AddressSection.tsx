"use client";

import React, { useEffect, useMemo, useState } from 'react';
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
  const textColor = grey[700];

  const toFloat = (v: string) => (v === '' ? undefined : parseFloat(v));

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
        <Typography variant="body2" color={grey[700]}>Street Address used for display and geocoding</Typography>
        <CustomInput
          placeholder="Street Address"
          value={formData.streetAddress || ''}
          onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          icon={<LocationOnIcon sx={{ color: grey[500] }} />}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>Postal Code for address validation and search</Typography>
        <CustomInput
          placeholder="Postal Code"
          value={formData.postalCode || ''}
          onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          icon={<MailIcon sx={{ color: grey[500] }} />}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>Country (select to load states)</Typography>
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
        <Typography variant="body2" color={grey[700]}>State/Region (loads after country)</Typography>
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
        <Typography variant="body2" color={grey[700]}>City (loads after state)</Typography>
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
        <Typography variant="body2" color={grey[700]}>Latitude coordinate for map placement</Typography>
        <CustomInput
          type="number"
          placeholder="Latitude"
          value={formData.latitude !== undefined ? String(formData.latitude) : ''}
          onChange={(e) => setFormData({ ...formData, latitude: toFloat(e.target.value) })}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          icon={<MyLocationIcon sx={{ color: grey[500] }} />}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, my: '1px' }}>
        <Typography variant="body2" color={grey[700]}>Longitude coordinate for map placement</Typography>
        <CustomInput
          type="number"
          placeholder="Longitude"
          value={formData.longitude !== undefined ? String(formData.longitude) : ''}
          onChange={(e) => setFormData({ ...formData, longitude: toFloat(e.target.value) })}
          focusColor={focusColor}
          bgColor={bgColor}
          textColor={textColor}
          icon={<MyLocationIcon sx={{ color: grey[500] }} />}
        />
      </Box>
    </Box>
  );
}