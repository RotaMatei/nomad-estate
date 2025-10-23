'use client';
import { useEffect, useState } from 'react';
import { RoleEnum } from '../../enums';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import Box from '@mui/material/Box';
import ChooseAgency from '@/app/components/register/chooseAgency';
import ChooseInvestor from '@/app/components/register/chooseInvestor';
import SignUpAsAgency from '@/app/components/register/signUpAsAgency';
import SignUpAsInvestor from '@/app/components/register/signUpAsInvestor';

export default function RegisterPage() {
  const [isAgencyRegister, setIsAgencyRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phonePrefix, setPhonePrefix] = useState<string | number | ''>('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<RoleEnum>(RoleEnum.INVESTOR);
  const [error, setError] = useState('');

  type Country = { id: number; name: string };
  type State = { id: number; name: string };
  type City = { id: number; name: string; stateId?: number };

  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [citiesByCountry, setCitiesByCountry] = useState<City[]>([]);

  const [selectedCountryId, setSelectedCountryId] = useState<number | ''>('');
  const [selectedStateId, setSelectedStateId] = useState<number | ''>('');
  const [selectedCityId, setSelectedCityId] = useState<number | ''>('');

  const router = useRouter();

  useEffect(() => {
    api.get('/countries/retrieve/get-all').then((response) => setCountries(response.data as Country[]));
  }, []);

  useEffect(() => {
    if (selectedCountryId !== '') {
      // Reset dependent selections when country changes
      setSelectedStateId('');
      setSelectedCityId('');

      // Fetch states for the country
      api.get(`/states/retrieve/get-all/${selectedCountryId}`)
        .then((r) => setStates(((r.data as State[]) || [])))
        .catch(() => setStates([]));

      // Always fetch cities by country to show when no state is selected
      api.get(`/cities/retrieve/get-all-by-country/${selectedCountryId}`)
        .then((r) => {
          const fetched = (r.data as City[]) || [];
          setCitiesByCountry(fetched);
          setCities(fetched);
        })
        .catch(() => {
          setCitiesByCountry([]);
          setCities([]);
        });
    } else {
      setStates([]);
      setCitiesByCountry([]);
      setCities([]);
    }
  }, [selectedCountryId]);

  useEffect(() => {
    if (selectedStateId !== '' && states.length > 0) {
      api
        .get(`/cities/retrieve/get-all-by-state/${selectedStateId}`)
        .then((r) => setCities((r.data as City[]) || []))
        .catch(() => setCities([]));
    } else {
      // When no state is selected, default to cities by country
      setCities(citiesByCountry);
    }
  }, [selectedStateId, states.length, citiesByCountry]);

  const handleUserRegister = async () => {
    // Combine prefix and number for a single E.164-like phone string
    const combinedPhone = `${String(phonePrefix).trim()}${String(phoneNumber).trim()}`;
    const payload = {
      email,
      password,
      phoneNumber: combinedPhone,
      firstName,
      lastName,
      role,
      countryId: selectedCountryId || undefined,
      cityId: selectedCityId || undefined,
      stateId: selectedStateId || undefined,
    };

    try {
      const res = await api.post('/auth/user/register', payload);
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      localStorage.setItem('jti', res.data.RefreshJTI);
      localStorage.setItem('user', res.data.firstName + ' ' + res.data.lastName);
      router.push('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Registration failed');
      }
    }
  };

  return (
    <Box sx={{ height: '100vh', overflow: 'hidden', bgcolor: '#fff' }}>
      {/* Mobile: keep simple switch (no slide) */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, height: '100%' }}>
        <Box sx={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
          {isAgencyRegister ? (
            <SignUpAsAgency
              countries={countries}
              states={states}
              cities={cities}
              selectedCountryId={selectedCountryId}
              selectedStateId={selectedStateId}
              selectedCityId={selectedCityId}
              setSelectedCountryById={setSelectedCountryId}
              setSelectedStateById={setSelectedStateId}
              setSelectedCityById={setSelectedCityId}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
              phonePrefix={phonePrefix}
              setPhonePrefix={setPhonePrefix}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              onSubmit={handleUserRegister}
            />
          ) : (
            <SignUpAsInvestor
              countries={countries}
              states={states}
              cities={cities}
              selectedCountryId={selectedCountryId}
              selectedStateId={selectedStateId}
              selectedCityId={selectedCityId}
              setSelectedCountryById={setSelectedCountryId}
              setSelectedStateById={setSelectedStateId}
              setSelectedCityById={setSelectedCityId}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
              phonePrefix={phonePrefix}
              setPhonePrefix={setPhonePrefix}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              onSubmit={handleUserRegister}
            />
          )}
        </Box>
      </Box>

      {/* Desktop: two slides side-by-side, slide horizontally */}
      <Box sx={{ display: { xs: 'none', md: 'block' }, height: '100%', overflow: 'hidden' }}>
        <Box
          sx={{
            display: 'flex',
            width: '200vw',
            height: '100%',
            transform: `translate3d(${isAgencyRegister ? '-100vw' : '0'}, 0, 0)`,
            transition: 'transform 750ms cubic-bezier(0.16, 1, 0.3, 1)',
            willChange: 'transform',
          }}
        >
          {/* Slide 0: ChooseAgency (left) | SignUpAsInvestor (right) */}
          <Box sx={{ display: 'flex', width: '100vw', height: '100%' }}>
            <Box sx={{ width: '50vw', height: '100%', position: 'relative', overflow: 'hidden' }}>
              <ChooseAgency onSelect={() => setIsAgencyRegister(true)} />
            </Box>
            <Box
              sx={{
                width: '50vw',
                height: '100%',
                bgcolor: '#ffffff',
                p: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SignUpAsInvestor
                countries={countries}
                states={states}
                cities={cities}
                selectedCountryId={selectedCountryId}
                selectedStateId={selectedStateId}
                selectedCityId={selectedCityId}
                setSelectedCountryById={setSelectedCountryId}
                setSelectedStateById={setSelectedStateId}
                setSelectedCityById={setSelectedCityId}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                phonePrefix={phonePrefix}
                setPhonePrefix={setPhonePrefix}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                onSubmit={handleUserRegister}
              />
            </Box>
          </Box>

          {/* Slide 1: SignUpAsAgency (left) | ChooseInvestor (right) */}
          <Box sx={{ display: 'flex', width: '100vw', height: '100%' }}>
            <Box
              sx={{
                width: '50vw',
                height: '100%',
                bgcolor: '#ffffff',
                p: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SignUpAsAgency
                countries={countries}
                states={states}
                cities={cities}
                selectedCountryId={selectedCountryId}
                selectedStateId={selectedStateId}
                selectedCityId={selectedCityId}
                setSelectedCountryById={setSelectedCountryId}
                setSelectedStateById={setSelectedStateId}
                setSelectedCityById={setSelectedCityId}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                phonePrefix={phonePrefix}
                setPhonePrefix={setPhonePrefix}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                onSubmit={handleUserRegister}
              />
            </Box>
            <Box sx={{ width: '50vw', height: '100%', position: 'relative', overflow: 'hidden' }}>
              <ChooseInvestor onSelect={() => setIsAgencyRegister(false)} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
