'use client';
import { useEffect, useState } from "react";
import { RoleEnum } from "../../enums";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import { Autocomplete, TextField } from "@mui/material";

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<RoleEnum>(RoleEnum.INVESTOR);
  const [error, setError] = useState('');

  type Country = { id: number; name: string };
  type State = { id: number; name: string };
  type City = { id: number; name: string };

  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const router = useRouter();

  useEffect(() => {
    api.get('/countries/get-all')
      .then(response => setCountries(response.data))
      .catch(() => setCountries([]))
      .finally(() => setLoadingCountries(false));
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      setLoadingStates(true);
      api.get('/states/get-all', { params: { countryId: selectedCountry.id } })
        .then(response => setStates(response.data))
        .catch(() => setStates([]))
        .finally(() => setLoadingStates(false));
    } else {
      setStates([]);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      setLoadingCities(true);
      api.get('/cities/get-all-by-state', { params: { stateId: selectedState.id } })
        .then(response => setCities(response.data))
        .catch(() => setCities([]))
        .finally(() => setLoadingCities(false));
    } else {
      setCities([]);
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
      stateId: selectedState?.id
    };

    try {
      const res = await api.post('/auth/user/register', payload);
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      localStorage.setItem('jti', res.data.RefreshJTI);
      localStorage.setItem('user', res.data.firstName + " " + res.data.lastName);
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
    <div>
      <h1>Register</h1>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
      <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number" type="text" />
      <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" type="text" />
      <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" type="text" />

      <select value={role} onChange={(e) => setRole(e.target.value as RoleEnum)}>
        <option value={RoleEnum.INVESTOR}>Investor</option>
        <option value={RoleEnum.MODERATOR}>Moderator</option>
        <option value={RoleEnum.ADMIN}>Admin</option>
      </select>

      {!loadingCountries ? (
        <Autocomplete
          options={countries}
          getOptionLabel={(option) => option.name}
          value={selectedCountry}
          onChange={(e, value) => setSelectedCountry(value)}
          renderInput={(params) => (
            <TextField {...params} label="Country" variant="outlined" sx={{ backgroundColor: '#f0f4ff' }} />
          )}
        />
      ) : (
        <TextField label="Loading countries..." variant="outlined" disabled sx={{ backgroundColor: '#f0f4ff' }} />
      )}

      {!loadingStates ? (
        <Autocomplete
          options={states}
          getOptionLabel={(option) => option.name}
          value={selectedState}
          onChange={(e, value) => setSelectedState(value)}
          renderInput={(params) => (
            <TextField {...params} label="State" variant="outlined" sx={{ backgroundColor: '#f0f4ff' }} />
          )}
        />
      ) : (
        <TextField label="Loading states..." variant="outlined" disabled sx={{ backgroundColor: '#f0f4ff' }} />
      )}

      {!loadingCities ? (
        <Autocomplete
          options={cities}
          getOptionLabel={(option) => option.name}
          value={selectedCity}
          onChange={(e, value) => setSelectedCity(value)}
          renderInput={(params) => (
            <TextField {...params} label="City" variant="outlined" sx={{ backgroundColor: '#f0f4ff' }} />
          )}
        />
      ) : (
        <TextField label="Loading cities..." variant="outlined" disabled sx={{ backgroundColor: '#f0f4ff' }} />
      )}

      <button onClick={handleUserRegister}>Register</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}