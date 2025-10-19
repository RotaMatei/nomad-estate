'use client';
import { useEffect, useState } from 'react';
import { RoleEnum } from '../../enums';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import { jwtDecode } from 'jwt-decode';
import { Autocomplete, TextField } from '@mui/material';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<RoleEnum>(RoleEnum.INVESTOR);
  const [countryId, setCountryId] = useState(1);
  const [cityId, setCityId] = useState(1);
  const [stateId, setStateId] = useState(1);
  const [error, setError] = useState('');

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  type Country = {
    id: number;
    name: string;
    code: string;
    phonecode: string;
    currency: string;
    currencySymbol: string;
    timezones: string;
    emojiU: string;
  };

  type State = { id: number; name: string; countryId: number; timezone: string; type?: string };

  type City = { id: number; name: string; stateId: number; countryId: number };

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const router = useRouter();

  useEffect(() => {
    api.get('/countries/get-all').then((response) => setCountries(response.data));
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      api
        .get(`/states/get-all`, { params: { countryId: selectedCountry.id } })
        .then((response) => setStates(response.data));
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      api
        .get(`/cities/get-all-by-state`, { params: { stateId: selectedState.id } })
        .then((response) => setCities(response.data));
    }
  }, [selectedState]);

  const handleUserRegister = async () => {
    const payload = {
      email,
      password,
      phoneNumber,
      firstName,
      lastName,
      role,
      countryId: selectedCountry?.id,
      cityId: selectedCity?.id,
      stateId: selectedState?.id,
    };

    try {
      const res = await api.post('/auth/user/register', payload);
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      localStorage.setItem('jti', res.data.RefreshJTI);
      localStorage.setItem('user', res.data.firstName + ' ' + res.data.lastName);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
      />
      <input
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Phone Number"
        type="text"
      />
      <input
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="First Name"
        type="text"
      />
      <input
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Last Name"
        type="text"
      />
      <select value={role} onChange={(e) => setRole(e.target.value as RoleEnum)}>
        <option value={RoleEnum.INVESTOR}>Investor</option>
        <option value={RoleEnum.MODERATOR}>Moderator</option>
        <option value={RoleEnum.ADMIN}>Admin</option>
      </select>
      <Autocomplete
        options={countries}
        getOptionLabel={(option) => option.name}
        value={selectedCountry}
        onChange={(e, value) => setSelectedCountry(value)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Country"
            variant="outlined"
            sx={{ backgroundColor: '#f0f4ff' }} // Light blue background
          />
        )}
      />
      <Autocomplete
        options={states}
        getOptionLabel={(option) => option.name}
        value={selectedState}
        onChange={(e, value) => setSelectedState(value)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="State"
            variant="outlined"
            sx={{ backgroundColor: '#f0f4ff' }}
          />
        )}
      />
      <Autocomplete
        options={cities}
        getOptionLabel={(option) => option.name}
        value={selectedCity}
        onChange={(e, value) => setSelectedCity(value)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="City"
            variant="outlined"
            sx={{ backgroundColor: '#f0f4ff' }}
          />
        )}
      />
      <button onClick={handleUserRegister}>Register</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
