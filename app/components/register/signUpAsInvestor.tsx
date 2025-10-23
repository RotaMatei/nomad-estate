import React, { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Link from 'next/link';
import CustomInput from '@/app/components/utils/input';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import Typography from '@mui/material/Typography';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import CustomAutocomplete from '@/app/components/utils/autocomplete';
import CustomButton from '@/app/components/utils/button';

type Props = {
  countries: { id: number; name: string }[];
  states: { id: number; name: string }[];
  cities: { id: number; name: string }[];
  selectedCountryId: number | '';
  selectedStateId: number | '';
  selectedCityId: number | '';
  setSelectedCountryById: (id: number | '') => void;
  setSelectedStateById: (id: number | '') => void;
  setSelectedCityById: (id: number | '') => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  firstName: string;
  setFirstName: (v: string) => void;
  lastName: string;
  setLastName: (v: string) => void;
  phonePrefix: string | number | '';
  setPhonePrefix: (v: string | number | '') => void;
  phoneNumber: string;
  setPhoneNumber: (v: string) => void;
  onSubmit: () => void;
};

export default function SignUpAsInvestor(props: Props) {
  const { countries, states, cities, selectedCountryId, selectedStateId, selectedCityId, setSelectedCountryById, setSelectedStateById, setSelectedCityById, email, setEmail, password, setPassword, firstName, setFirstName, lastName, setLastName, phonePrefix, setPhonePrefix, phoneNumber, setPhoneNumber, onSubmit } = props;

  const phonePrefixOptions = [
    '+1', '+7', '+20', '+27', '+30', '+31', '+32', '+33', '+34', '+36', '+39',
    '+40', '+41', '+43', '+44', '+45', '+46', '+47', '+48', '+49', '+52', '+55', '+57', '+60', '+61', '+62', '+63', '+64', '+65', '+66', '+81', '+82', '+84', '+86', '+90', '+91', '+92', '+94', '+351', '+352', '+353', '+354', '+355', '+356', '+358', '+359', '+370', '+371', '+372', '+380', '+386', '+420', '+421'
  ].map((p) => ({ value: p, label: p }));

  // phonePrefix is lifted to parent via props

  const GAP = 2;
  // completion over 4 rounds
  const [showPassword, setShowPassword] = useState(false);

  const isLettersOnly = (s: string) => /^[A-Za-z\u00C0-\u017F\s'-]+$/.test(s);
  const isEmail = (s: string) => /.+@.+\..+/.test(s);
  const isDigits = (s: string) => /^\d+$/.test(s);

  // Deterministic ASCII-ish comparator to avoid locale-driven SSR/CSR differences
  const compareByName = <T extends { name: string }>(a: T, b: T) => {
    const an = a.name.toUpperCase();
    const bn = b.name.toUpperCase();
    if (an < bn) return -1;
    if (an > bn) return 1;
    return 0;
  };

  const completion = useMemo(() => {
    const step1 = email.includes('@') && password.trim().length >= 6;
    const step2 = firstName.trim().length > 0 && lastName.trim().length > 0;
    const step3 = String(phonePrefix).trim().length > 0 && phoneNumber.trim().length > 0;
    const step4 = selectedCountryId !== '' && selectedCityId !== ''; // allow state to be optional (can be 0)
    const done = [step1, step2, step3, step4].filter(Boolean).length;
    return done * 25;
  }, [email, password, firstName, lastName, phonePrefix, phoneNumber, selectedCountryId, selectedCityId]);

  const isFormComplete = useMemo(() => {
    return (
      email.includes('@') && password.trim().length >= 6 &&
      firstName.trim().length > 0 && lastName.trim().length > 0 &&
      String(phonePrefix).trim().length > 0 && phoneNumber.trim().length > 0 &&
      selectedCountryId !== '' && selectedCityId !== ''
    );
  }, [email, password, firstName, lastName, phonePrefix, phoneNumber, selectedCountryId, selectedCityId]);

  return (
  <Box sx={{ p: { xs: 3, md: 4 }, width: '100%', maxWidth: { xs: '100%', md: '100%' }, mx: 'auto', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {/* Title unified to theme primary color; emphasize role slightly more */}
      <Typography variant="h4" sx={{ mb: { xs: GAP, md: GAP * 1.5 }, fontWeight: 700, textAlign: 'center' }}>
        <Box component="span" sx={{ color: '#003FC7', fontWeight: 700 }}>Sign up as</Box> <Box component="span" sx={{ color: '#003FC7', textDecoration: 'none', fontWeight: 800 }}>Investor</Box>
      </Typography>

      {/* Middle content: progress + entries centered vertically */}
      <Box sx={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Progress bar with percentage label */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: GAP }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ height: 8, bgcolor: 'grey.300', borderRadius: 5, overflow: 'hidden' }}>
              <Box sx={{ width: `${completion}%`, height: '100%', bgcolor: '#003FC7' }} />
            </Box>
          </Box>
          <Typography sx={{ minWidth: 48, textAlign: 'right', fontWeight: 600, color: '#003FC7' }}>{completion}%</Typography>
        </Box>

        {/* Entries */}
        <Box>
          {/* Email */}
          <CustomInput
            label="Email"
            value={email}
            onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
            placeholder="Email Completed"
            icon={<EmailOutlinedIcon />}
            focusColor="#003FC7"
          />
          {!isEmail(email) && email.length > 0 && (
            <Typography variant="caption" sx={{ color: 'error.main', pl: 1, mt: 0.5 }}>Please enter a valid email address.</Typography>
          )}

          {/* Password */}
          <Box sx={{ mt: 2 }}>
            <CustomInput
              label="Password"
              value={password}
              onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
              placeholder="Password"
              icon={<LockOutlinedIcon />}
              focusColor="#003FC7"
              type={showPassword ? 'text' : 'password'}
              endAdornment={showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
              onEndAdornmentClick={() => setShowPassword((v) => !v)}
            />
            {password.length > 0 && password.length < 6 && (
              <Typography variant="caption" sx={{ color: 'error.main', pl: 1, mt: 0.5 }}>Password must be at least 6 characters.</Typography>
            )}
          </Box>

          {/* First / Last Name */}
          <Box sx={{ display: 'flex', gap: GAP, mt: GAP }}>
            <Box sx={{ flex: 1 }}>
              <CustomInput
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName((e.target as HTMLInputElement).value.replace(/[^A-Za-z\u00C0-\u017F\s'-]/g, ''))}
                placeholder="First Name"
                icon={<PersonOutlineOutlinedIcon />}
                focusColor="#003FC7"
              />
              {firstName.length > 0 && !isLettersOnly(firstName) && (
                <Typography variant="caption" sx={{ color: 'error.main', pl: 1, mt: 0.5 }}>Use letters only for first name.</Typography>
              )}
            </Box>
            <Box sx={{ flex: 1 }}>
              <CustomInput
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName((e.target as HTMLInputElement).value.replace(/[^A-Za-z\u00C0-\u017F\s'-]/g, ''))}
                placeholder="Last Name"
                icon={<PersonOutlineOutlinedIcon />}
                focusColor="#003FC7"
              />
              {lastName.length > 0 && !isLettersOnly(lastName) && (
                <Typography variant="caption" sx={{ color: 'error.main', pl: 1, mt: 0.5 }}>Use letters only for last name.</Typography>
              )}
            </Box>
          </Box>

          {/* Prefix + Phone - 1:3 ratio */}
          <Box sx={{ display: 'flex', gap: GAP, mt: GAP }}>
            <Box sx={{ flex: 1 }}>
              <CustomAutocomplete
                options={phonePrefixOptions}
                value={phonePrefix}
                onChange={(v) => setPhonePrefix(v)}
                label="Prefix"
                icon={<AddOutlinedIcon />}
                focusColor="#003FC7"
                selectedColor="#003FC7"
              />
            </Box>
            <Box sx={{ flex: 3 }}>
              <CustomInput
                label="Phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber((e.target as HTMLInputElement).value.replace(/\D/g, ''))}
                placeholder="Phone Number"
                icon={<PhoneIphoneOutlinedIcon />}
                focusColor="#003FC7"
              />
              {phoneNumber.length > 0 && !isDigits(phoneNumber) && (
                <Typography variant="caption" sx={{ color: 'error.main', pl: 1, mt: 0.5 }}>Digits only for phone number.</Typography>
              )}
            </Box>
          </Box>

          {/* Country */}
          <Box sx={{ mt: GAP }}>
            <CustomAutocomplete
              options={[...countries].sort(compareByName).map((c) => ({ value: c.id, label: c.name }))}
              value={selectedCountryId ?? ''}
              onChange={(v) => setSelectedCountryById(typeof v === 'number' ? v : '')}
              label="Country"
              icon={<PublicOutlinedIcon />}
              focusColor="#003FC7"
              selectedColor="#003FC7"
            />
          </Box>

          {/* State / City */}
          <Box sx={{ display: 'flex', gap: GAP, mt: GAP }}>
            <Box sx={{ flex: 1 }}>
              <CustomAutocomplete
                options={[{ value: 0, label: 'No state' }, ...[...states].sort(compareByName).map((s) => ({ value: s.id, label: s.name }))]}
                value={selectedStateId ?? ''}
                onChange={(v) => setSelectedStateById(typeof v === 'number' ? v : '')}
                label="State"
                icon={<PublicOutlinedIcon />}
                focusColor="#003FC7"
                selectedColor="#003FC7"
                disabled={selectedCountryId === ''}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <CustomAutocomplete
                options={[...cities].sort(compareByName).map((c) => ({ value: c.id, label: c.name }))}
                value={selectedCityId ?? ''}
                onChange={(v) => setSelectedCityById(typeof v === 'number' ? v : '')}
                label="City"
                icon={<PublicOutlinedIcon />}
                focusColor="#003FC7"
                selectedColor="#003FC7"
                disabled={selectedCountryId === '' || selectedStateId === ''}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Footer pinned near bottom with 80px padding */}
      <Box sx={{ mt: 1, pt: GAP, pb: { xs: 6, md: 10 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: { xs: 'stretch', md: 'center' } }}>
          <CustomButton label="Create Account" onClick={onSubmit} color="primary" disabled={!isFormComplete} sx={{ maxWidth: 320, fontWeight: 700, whiteSpace: 'nowrap' }} />
        </Box>
        <Typography sx={{ mt: GAP, textAlign: 'center', color: 'text.secondary' }}>
          Already have an Investor account?{' '}
          <Link href="/login" style={{ fontWeight: 700, color: '#003FC7', textDecoration: 'none' }}>Log in</Link>
        </Typography>
  </Box>
    </Box>
  );
}
