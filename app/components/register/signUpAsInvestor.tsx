import React, { useEffect, useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
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
import Glare from '@/app/reactDevBits/Glare/Glare';
import DateInput from '@/app/components/utils/dateInput';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import { alpha, useTheme } from '@mui/material/styles';

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
  birthDate: string;
  setBirthDate: (v: string) => void;
  onSubmit: () => void;
};

export default function SignUpAsInvestor(props: Props) {
  const {
    countries,
    states,
    cities,
    selectedCountryId,
    selectedStateId,
    selectedCityId,
    setSelectedCountryById,
    setSelectedStateById,
    setSelectedCityById,
    email,
    setEmail,
    password,
    setPassword,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phonePrefix,
    setPhonePrefix,
    phoneNumber,
    setPhoneNumber,
    birthDate,
    setBirthDate,
    onSubmit,
  } = props;
  const theme = useTheme();

  const phonePrefixOptions = [
    '+1',
    '+7',
    '+20',
    '+27',
    '+30',
    '+31',
    '+32',
    '+33',
    '+34',
    '+36',
    '+39',
    '+40',
    '+41',
    '+43',
    '+44',
    '+45',
    '+46',
    '+47',
    '+48',
    '+49',
    '+52',
    '+55',
    '+57',
    '+60',
    '+61',
    '+62',
    '+63',
    '+64',
    '+65',
    '+66',
    '+81',
    '+82',
    '+84',
    '+86',
    '+90',
    '+91',
    '+92',
    '+94',
    '+351',
    '+352',
    '+353',
    '+354',
    '+355',
    '+356',
    '+358',
    '+359',
    '+370',
    '+371',
    '+372',
    '+380',
    '+386',
    '+420',
    '+421',
  ].map((p) => ({ value: p, label: p }));

  const GAP = 2;
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [pwFocused, setPwFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [firstFocused, setFirstFocused] = useState(false);
  const [lastFocused, setLastFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [birthFocused, setBirthFocused] = useState(false);
  const hiddenNativeDateRef = useRef<HTMLInputElement | null>(null);

  const isLettersOnly = (s: string) => /^[A-Za-z\u00C0-\u017F\s'-]+$/.test(s);
  const isEmail = (s: string) => /.+@.+\..+/.test(s);
  const isDigits = (s: string) => /^\d+$/.test(s);
  const isNineDigits = (s: string) => /^\d{9}$/.test(s);
  const formatDob = (input: string) => {
    const d = input.replace(/\D/g, '').slice(0, 8);
    if (d.length <= 2) return d;
    if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
    return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
  };
  const isAdult = (dateStr: string) => {
    if (!dateStr) return false;
    const matchParts = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!matchParts) return false;
    const [, dd, mm, yyyy] = matchParts;
    const dob = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    if (Number.isNaN(dob.getTime())) return false;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDelta = today.getMonth() - dob.getMonth();
    if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < dob.getDate())) age--;
    return age >= 18;
  };

  const compareByName = <T extends { name: string }>(a: T, b: T) => {
    const an = a.name.toUpperCase();
    const bn = b.name.toUpperCase();
    if (an < bn) return -1;
    if (an > bn) return 1;
    return 0;
  };

  const completion = useMemo(() => {
    const step1 =
      email.includes('@') &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password) &&
      password.length >= 8 &&
      confirmPassword.length > 0 &&
      confirmPassword === password;
    const step2 = firstName.trim().length > 0 && lastName.trim().length > 0 && isAdult(birthDate);
    const step3 = String(phonePrefix).trim().length > 0 && isNineDigits(phoneNumber.trim());
    const step4 = selectedCountryId !== '' && selectedCityId !== '';
    const done = [step1, step2, step3, step4].filter(Boolean).length;
    return done * 25;
  }, [
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    birthDate,
    phonePrefix,
    phoneNumber,
    selectedCountryId,
    selectedCityId,
  ]);

  // Progress bar animation trigger when completion increases
  const [lastCompletion, setLastCompletion] = useState(completion);
  const [barAnimate, setBarAnimate] = useState(false);
  useEffect(() => {
    if (completion > lastCompletion) {
      setBarAnimate(true);
      const t = setTimeout(() => setBarAnimate(false), 700);
      setLastCompletion(completion);
      return () => clearTimeout(t);
    }
    if (completion !== lastCompletion) setLastCompletion(completion);
  }, [completion, lastCompletion]);

  const isFormComplete = useMemo(() => {
    return (
      email.includes('@') &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password) &&
      password.length >= 8 &&
      confirmPassword.length > 0 &&
      confirmPassword === password &&
      firstName.trim().length > 0 &&
      lastName.trim().length > 0 &&
      isAdult(birthDate) &&
      String(phonePrefix).trim().length > 0 &&
      isNineDigits(phoneNumber.trim()) &&
      selectedCountryId !== '' &&
      selectedCityId !== ''
    );
  }, [
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    birthDate,
    phonePrefix,
    phoneNumber,
    selectedCountryId,
    selectedCityId,
  ]);
  const pwRules = useMemo(
    () => ({
      len: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    }),
    [password],
  );

  const invalidEmail = !isEmail(email) && !emailFocused && email.length > 0;
  const invalidPassword =
    !(pwRules.len && pwRules.upper && pwRules.lower && pwRules.number && pwRules.special) &&
    !pwFocused &&
    password.length > 0;
  const invalidConfirm =
    confirmPassword.length > 0 && confirmPassword !== password && !confirmFocused;
  const invalidFirst = firstName.length > 0 && !isLettersOnly(firstName) && !firstFocused;
  const invalidLast = lastName.length > 0 && !isLettersOnly(lastName) && !lastFocused;
  const invalidPhone =
    phoneNumber.length > 0 &&
    (!isDigits(phoneNumber) || !isNineDigits(phoneNumber)) &&
    !phoneFocused;
  const invalidBirth = birthDate.length > 0 && !isAdult(birthDate) && !birthFocused;

  return (
    // UPDATED: Root box now takes full viewport height and hides any overflow
    <Box
      sx={{
        pt: { xs: '24px', md: '80px' },
        px: { xs: 3, md: 4 },
        width: '100%',
        maxWidth: { xs: '100%', md: '100%' },
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        height: { xs: 'auto', md: '100vh' },
        overflow: { xs: 'visible', md: 'hidden' },
      }}
    >
      {/* UPDATED: Title won't shrink */}
      <Typography
        variant="h4"
        sx={{
          mb: 0,
          fontWeight: 700,
          textAlign: 'center',
          flexShrink: 0,
          fontSize: { xs: '1.5rem', md: '2rem' },
        }}
      >
        <Box component="span" sx={{ color: theme.palette.secondary.main, fontWeight: 700 }}>
          Sign up as
        </Box>{' '}
        <Box
          component="span"
          sx={{ color: theme.palette.secondary.main, textDecoration: 'none', fontWeight: 800 }}
        >
          Investor
        </Box>
      </Typography>

      {/* Progress bar moved outside scrollable content to remain always visible */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 4, mb: GAP, flexShrink: 0 }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ height: 8, bgcolor: 'grey.300', borderRadius: 5, overflow: 'hidden' }}>
            <Box
              sx={{
                width: `${completion}%`,
                height: '100%',
                bgcolor: theme.palette.secondary.main,
                borderRadius: 5,
                transition: 'width 600ms cubic-bezier(0.16,1,0.3,1), background-color 300ms ease',
                boxShadow: barAnimate
                  ? `0 0 12px ${alpha(theme.palette.secondary.main, 0.5)}, 0 0 24px ${alpha(theme.palette.secondary.main, 0.35)}`
                  : 'none',
              }}
            />
          </Box>
        </Box>
        <Typography
          sx={{
            minWidth: 48,
            textAlign: 'right',
            fontWeight: 600,
            color: theme.palette.secondary.main,
          }}
        >
          {completion}%
        </Typography>
      </Box>

      {/* UPDATED: This middle content box now scrolls vertically, aligns content to the top, and has padding */}
      <Box
        sx={{
          flex: { xs: '0 0 auto', md: '1 1 auto' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          overflowY: { xs: 'visible', md: 'auto' },
          overflowX: 'hidden',
          p: GAP,
        }}
      >
        {/* Entries */}
        <Box>
          {/* Email */}
          <CustomInput
            label="Email"
            value={email}
            onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            placeholder="Email"
            icon={<EmailOutlinedIcon />}
            focusColor={theme.palette.secondary.main}
            invalid={invalidEmail}
          />
          <Collapse
            in={emailFocused && !isEmail(email) && email.length > 0}
            timeout={200}
            unmountOnExit
          >
            <Typography variant="caption" sx={{ color: 'error.main', pl: 1, mt: 0.5 }}>
              Please enter a valid email address.
            </Typography>
          </Collapse>

          {/* Password */}
          <Box sx={{ mt: 2 }}>
            <CustomInput
              label="Password"
              value={password}
              onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
              onFocus={() => setPwFocused(true)}
              onBlur={() => setPwFocused(false)}
              placeholder="Password"
              icon={<LockOutlinedIcon />}
              focusColor={theme.palette.secondary.main}
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />
              }
              onEndAdornmentClick={() => setShowPassword((v) => !v)}
              invalid={invalidPassword}
            />
            <Collapse in={pwFocused} timeout={200} unmountOnExit>
              <Box sx={{ mt: 1, pl: 1 }}>
                <Typography
                  variant="caption"
                  sx={{ display: 'block', color: pwRules.len ? 'success.main' : 'error.main' }}
                >
                  • At least 8 characters
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ display: 'block', color: pwRules.upper ? 'success.main' : 'error.main' }}
                >
                  • At least one uppercase letter
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ display: 'block', color: pwRules.lower ? 'success.main' : 'error.main' }}
                >
                  • At least one lowercase letter
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ display: 'block', color: pwRules.number ? 'success.main' : 'error.main' }}
                >
                  • At least one number
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ display: 'block', color: pwRules.special ? 'success.main' : 'error.main' }}
                >
                  • At least one special symbol
                </Typography>
              </Box>
            </Collapse>
            <Box sx={{ mt: 2 }}>
              <CustomInput
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword((e.target as HTMLInputElement).value)}
                onFocus={() => setConfirmFocused(true)}
                onBlur={() => setConfirmFocused(false)}
                placeholder="Re-enter password"
                icon={<LockOutlinedIcon />}
                focusColor={theme.palette.secondary.main}
                type={showConfirmPw ? 'text' : 'password'}
                endAdornment={
                  showConfirmPw ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />
                }
                onEndAdornmentClick={() => setShowConfirmPw((v) => !v)}
                invalid={invalidConfirm}
              />
              <Collapse
                in={confirmFocused && confirmPassword.length > 0 && confirmPassword !== password}
                timeout={200}
                unmountOnExit
              >
                <Typography variant="caption" sx={{ color: 'error.main', pl: 1, mt: 0.5 }}>
                  Passwords do not match.
                </Typography>
              </Collapse>
            </Box>
          </Box>

          {/* First / Last Name */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: GAP,
              mt: GAP,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <CustomInput
                label="First Name"
                value={firstName}
                onChange={(e) =>
                  setFirstName(
                    (e.target as HTMLInputElement).value.replace(/[^A-Za-z\u00C0-\u017F\s'-]/g, ''),
                  )
                }
                onFocus={() => setFirstFocused(true)}
                onBlur={() => setFirstFocused(false)}
                placeholder="First Name"
                icon={<PersonOutlineOutlinedIcon />}
                focusColor={theme.palette.secondary.main}
                invalid={invalidFirst}
              />
              <Collapse
                in={firstFocused && firstName.length > 0 && !isLettersOnly(firstName)}
                timeout={200}
                unmountOnExit
              >
                <Typography variant="caption" sx={{ color: 'error.main', pl: 1, mt: 0.5 }}>
                  Use letters only for first name.
                </Typography>
              </Collapse>
            </Box>
            <Box sx={{ flex: 1 }}>
              <CustomInput
                label="Last Name"
                value={lastName}
                onChange={(e) =>
                  setLastName(
                    (e.target as HTMLInputElement).value.replace(/[^A-Za-z\u00C0-\u017F\s'-]/g, ''),
                  )
                }
                onFocus={() => setLastFocused(true)}
                onBlur={() => setLastFocused(false)}
                placeholder="Last Name"
                icon={<PersonOutlineOutlinedIcon />}
                focusColor={theme.palette.secondary.main}
                invalid={invalidLast}
              />
              <Collapse
                in={lastFocused && lastName.length > 0 && !isLettersOnly(lastName)}
                timeout={200}
                unmountOnExit
              >
                <Typography variant="caption" sx={{ color: 'error.main', pl: 1, mt: 0.5 }}>
                  Use letters only for last name.
                </Typography>
              </Collapse>
            </Box>
          </Box>

          {/* Birth Date before Phone */}
          <Box sx={{ mt: GAP }}>
            <DateInput
              value={birthDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBirthDate(formatDob(e.target.value))
              }
              onFocus={() => setBirthFocused(true)}
              onBlur={() => setBirthFocused(false)}
              placeholder="Birth Date (DD/MM/YYYY)"
              focusColor={theme.palette.secondary.main}
              invalid={invalidBirth}
              icon={<EventOutlinedIcon sx={{ color: theme.palette.secondary.main }} />}
              endAdornment={<EventOutlinedIcon sx={{ color: theme.palette.secondary.main }} />}
              onEndAdornmentClick={() => {
                const el = hiddenNativeDateRef.current;
                if (!el) return;
                const picker = (el as HTMLInputElement & { showPicker?: () => void }).showPicker;
                if (typeof picker === 'function') {
                  picker.call(el);
                } else {
                  el.focus();
                  el.click();
                }
              }}
            />
            <input
              ref={hiddenNativeDateRef}
              type="date"
              style={{
                position: 'absolute',
                opacity: 0,
                width: 0,
                height: 0,
                pointerEvents: 'none',
              }}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => {
                const val = (e.target as HTMLInputElement).value; // yyyy-mm-dd
                if (val) {
                  const [y, m, d] = val.split('-');
                  setBirthDate(`${d}/${m}/${y}`);
                }
              }}
            />
            <Collapse
              in={birthFocused && birthDate.length > 0 && !isAdult(birthDate)}
              timeout={200}
              unmountOnExit
            >
              <Typography variant="caption" sx={{ color: 'error.main', pl: 1, mt: 0.5 }}>
                You must be at least 18 years old.
              </Typography>
            </Collapse>
          </Box>

          {/* Prefix + Phone - match State/City alignment and size (1:1) */}
          <Box sx={{ display: 'flex', gap: GAP, mt: GAP }}>
            <Box sx={{ flex: 1 }}>
              <CustomAutocomplete
                options={phonePrefixOptions}
                value={phonePrefix}
                onChange={(v) => setPhonePrefix(v)}
                label="Prefix"
                icon={<AddOutlinedIcon />}
                focusColor={theme.palette.secondary.main}
                selectedColor={theme.palette.secondary.light}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <CustomInput
                label="Phone"
                value={phoneNumber}
                onChange={(e) =>
                  setPhoneNumber((e.target as HTMLInputElement).value.replace(/\D/g, ''))
                }
                onFocus={() => setPhoneFocused(true)}
                onBlur={() => setPhoneFocused(false)}
                placeholder="Phone Number"
                icon={<PhoneIphoneOutlinedIcon />}
                focusColor={theme.palette.secondary.main}
                invalid={invalidPhone}
              />
              <Collapse
                in={
                  phoneFocused &&
                  phoneNumber.length > 0 &&
                  (!isDigits(phoneNumber) || !isNineDigits(phoneNumber))
                }
                timeout={200}
                unmountOnExit
              >
                {!isDigits(phoneNumber) ? (
                  <Typography variant="caption" sx={{ color: 'error.main', pl: 1, mt: 0.5 }}>
                    Digits only for phone number.
                  </Typography>
                ) : (
                  <Typography variant="caption" sx={{ color: 'error.main', pl: 1, mt: 0.5 }}>
                    Enter exactly 9 digits.
                  </Typography>
                )}
              </Collapse>
            </Box>
          </Box>

          {/* Country */}
          <Box sx={{ mt: GAP }}>
            <CustomAutocomplete
              options={[...countries]
                .sort(compareByName)
                .map((c) => ({ value: c.id, label: c.name }))}
              value={selectedCountryId ?? ''}
              onChange={(v) => setSelectedCountryById(typeof v === 'number' ? v : '')}
              label="Country"
              icon={<PublicOutlinedIcon />}
              focusColor={theme.palette.secondary.main}
              selectedColor={theme.palette.secondary.light}
            />
          </Box>

          {/* State / City */}
          <Box sx={{ display: 'flex', gap: GAP, mt: GAP }}>
            <Box sx={{ flex: 1 }}>
              <CustomAutocomplete
                options={[
                  { value: 0, label: 'No state' },
                  ...[...states].sort(compareByName).map((s) => ({ value: s.id, label: s.name })),
                ]}
                value={selectedStateId ?? ''}
                onChange={(v) => setSelectedStateById(typeof v === 'number' ? v : '')}
                label="State"
                icon={<PublicOutlinedIcon />}
                focusColor={theme.palette.secondary.main}
                selectedColor={theme.palette.secondary.light}
                disabled={selectedCountryId === ''}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <CustomAutocomplete
                options={[...cities]
                  .sort(compareByName)
                  .map((c) => ({ value: c.id, label: c.name }))}
                value={selectedCityId ?? ''}
                onChange={(v) => setSelectedCityById(typeof v === 'number' ? v : '')}
                label="City"
                icon={<PublicOutlinedIcon />}
                focusColor="#003FC7"
                selectedColor="#6FA8FF"
                disabled={selectedCountryId === ''}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* UPDATED: Footer won't shrink */}
      <Box
        sx={{
          mt: 1,
          pt: GAP,
          pb: { xs: 12, md: 10 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flexShrink: 0,
          maxWidth: 640,
          mx: 'auto',
        }}
      >
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Glare
            shouldPlay={isFormComplete}
            glareColor={theme.palette.common.white}
            glareOpacity={0.5}
            glareAngle={-30}
            glareSize={380}
            transitionDuration={900}
            style={{ flex: 1, minWidth: 240 }}
          >
            <CustomButton
              label="Create Account"
              onClick={onSubmit}
              color="secondary"
              disabled={!isFormComplete}
              sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}
            />
          </Glare>
        </Box>
        <Typography
          sx={{
            mt: GAP,
            textAlign: 'center',
            color: 'text.secondary',
            fontSize: { xs: '14px', lg: '18px' },
          }}
        >
          Already have an Investor account?{' '}
          <Link
            href="/login"
            style={{ fontWeight: 700, color: theme.palette.secondary.main, textDecoration: 'none' }}
          >
            Log in
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
