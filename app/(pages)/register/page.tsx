'use client';
import { useEffect, useRef, useState } from 'react';
import { RoleEnum } from '../../enums';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import { jwtDecode } from 'jwt-decode';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CustomButton from '@/app/components/utils/button';
import ChooseAgency from '@/app/components/register/chooseAgency';
import ChooseInvestor from '@/app/components/register/chooseInvestor';
import SignUpAsAgency from '@/app/components/register/signUpAsAgency';
import SignUpAsInvestor from '@/app/components/register/signUpAsInvestor';

export default function RegisterPage() {
  const [isAgencyRegister, setIsAgencyRegister] = useState(false);
  const [mobileFormOpacity, setMobileFormOpacity] = useState(1);
  // Mobile view transitions (fade out current form, then switch, then fade in)
  const onPreSelectMobile = () => setMobileFormOpacity(0);
  const onSelectAgencyMobile = () => {
    setIsAgencyRegister(true);
    setTimeout(() => setMobileFormOpacity(1), 30);
  };
  const onSelectInvestorMobile = () => {
    setIsAgencyRegister(false);
    setTimeout(() => setMobileFormOpacity(1), 30);
  };
  const [isResizing, setIsResizing] = useState(false);
  const resizeTimerRef = useRef<number | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phonePrefix, setPhonePrefix] = useState<string | number | ''>('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState(''); // YYYY-MM-DD for investors
  const [role, setRole] = useState<RoleEnum>(RoleEnum.INVESTOR);
  const [error, setError] = useState('');
  // Inline confirm now handled inside each form

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

  // Prevent slide transition from replaying on zoom/resize by disabling it briefly
  useEffect(() => {
    const onResize = () => {
      setIsResizing(true);
      if (resizeTimerRef.current) {
        window.clearTimeout(resizeTimerRef.current);
      }
      resizeTimerRef.current = window.setTimeout(() => {
        setIsResizing(false);
        resizeTimerRef.current = null;
      }, 200);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (resizeTimerRef.current) {
        window.clearTimeout(resizeTimerRef.current);
      }
    };
  }, []);
  useEffect(() => {
    api
      .get('/countries/retrieve/get-all')
      .then((response) => setCountries(response.data as Country[]));
  }, []);

  useEffect(() => {
    if (selectedCountryId !== '') {
      // Reset dependent selections when country changes
      setSelectedStateId('');
      setSelectedCityId('');

      // Fetch states for the country
      api
        .get(`/states/retrieve/get-all/${selectedCountryId}`)
        .then((r) => setStates((r.data as State[]) || []))
        .catch(() => setStates([]));

      // Always fetch cities by country to show when no state is selected
      api
        .get(`/cities/retrieve/get-all-by-country/${selectedCountryId}`)
        .then((r) => {
          const fetched = (r.data as City[]) || [];
          const fetchedSorted = [...fetched].sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
          );
          setCitiesByCountry(fetchedSorted);
          setCities(fetchedSorted);
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
    // Treat '' or 0 ("No state") as no state selected
    const hasState = selectedStateId !== '' && selectedStateId !== 0;
    if (hasState && states.length > 0) {
      api
        .get(`/cities/retrieve/get-all-by-state/${selectedStateId}`)
        .then((r) => {
          const data = (r.data as City[]) || [];
          const sorted = [...data].sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
          );
          setCities(sorted);
        })
        .catch(() => setCities([]));
    } else {
      // When no state (or "No state") is selected, default to cities by country
      setCities(citiesByCountry);
    }
  }, [selectedStateId, states.length, citiesByCountry]);

  const handleUserRegister = async () => {
    // Combine prefix and number for a single E.164-like phone string
    const combinedPhone = `${String(phonePrefix).trim()}${String(phoneNumber).trim()}`;
    const isoBirthDate = (() => {
      if (!birthDate) return undefined;
      const m = birthDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
      if (!m) return undefined;
      const [, dd, mm, yyyy] = m;
      const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
      return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
    })();
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
      birthDate: isoBirthDate,
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

  // Investor flow: submit directly (confirm inline on the form)
  const handleInvestorSubmitRequest = () => {
    handleUserRegister();
  };

  // Generate a UUID for related records
  const genId = () =>
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  type RelatedSets = {
    primaryMarkets: string[];
    servicesProvided: string[];
    additionalPartnershipInterests: string[];
  };
  type AgencyRegisterPayload = {
    email: string;
    password: string;
    phoneNumber: string;
    firstName?: string;
    lastName?: string;
    countryId?: number;
    cityId?: number;
    stateId?: number;
    streetAddress?: string;
    postalCode?: string;
    companyName?: string;
    companyType?: string;
    licenseNumber?: string;
    companyWebsite?: string;
    establishedYear?: number;
    yearlyRange?: number;
    avgPropertyValue?: number;
    companyExperience?: string;
    notableProjects?: string;
    reasonPartner?: string;
    expectedMonthlyListings?: number;
    targetClient?: string;
    primaryMarkets?: string[];
    servicesProvided?: string[];
    additionalPartnershipInterests?: string[];
  };

  // Handle Agency register + related record creation using dedicated services
  const handleAgencyRegister = async (data: {
    payload: AgencyRegisterPayload;
    related: RelatedSets;
  }) => {
    try {
      const res = await api.post('/auth/agency/register', data.payload);
      // Persist tokens
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      if (res.data.RefreshJTI) localStorage.setItem('jti', res.data.RefreshJTI);
      if (data.payload?.firstName && data.payload?.lastName) {
        localStorage.setItem('user', `${data.payload.firstName} ${data.payload.lastName}`);
      }

      // Extract agencyId from access token (sub)
      const decoded = jwtDecode<{ sub?: string }>(res.data.accessToken);
      const agencyId: string = decoded?.sub || '';

      // Fire related creations in parallel (best-effort)
      const pmReqs = (data.related.primaryMarkets || []).map((p) =>
        api.post('/agency/primary-market/create', { id: genId(), agencyId, primaryMarket: p }),
      );
      const spReqs = (data.related.servicesProvided || []).map((s) =>
        api.post('/agency/service-provided/create', { id: genId(), agencyId, serviceProvided: s }),
      );
      const apiReqs = (data.related.additionalPartnershipInterests || []).map((a) =>
        api.post('/agency/additional-partnership-interest/create', {
          id: genId(),
          agencyId,
          additionalPartnershipInterest: a,
        }),
      );

      await Promise.allSettled([...pmReqs, ...spReqs, ...apiReqs]);

      // Navigate home
      router.push('/');
    } catch (e: unknown) {
      if (e instanceof Error) setError(e.message);
      else setError('Agency registration failed');
    }
  };

  // Agency flow: submit directly (confirm inline on the form)
  const handleAgencySubmitRequest = (data: {
    payload: AgencyRegisterPayload;
    related: RelatedSets;
  }) => {
    handleAgencyRegister(data);
  };

  return (
    <Box
      sx={{
        height: { xs: 'auto', md: '100vh' },
        overflow: { xs: 'visible', md: 'hidden' },
        bgcolor: '#fff',
      }}
    >
      {/* Mobile: opposite-role quick switch above the active form */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <Box>
          <Box sx={{ flexShrink: 0 }}>
            {isAgencyRegister ? (
              <ChooseInvestor
                onSelect={onSelectInvestorMobile}
                onPreSelect={onPreSelectMobile}
                buttonOnly
                buttonLabel="Sign up as Investor"
                paddingTop={72}
                paddingBottom={72}
              />
            ) : (
              <ChooseAgency
                onSelect={onSelectAgencyMobile}
                onPreSelect={onPreSelectMobile}
                buttonOnly
                buttonLabel="Sign up as Agency"
                paddingTop={72}
                paddingBottom={72}
              />
            )}
          </Box>
          <Box sx={{ mt: 6, opacity: mobileFormOpacity, transition: 'opacity 350ms ease' }}>
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
                onSubmit={handleAgencySubmitRequest}
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
                birthDate={birthDate}
                setBirthDate={setBirthDate}
                onSubmit={handleInvestorSubmitRequest}
              />
            )}
          </Box>
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
            transition: isResizing ? 'none' : 'transform 750ms cubic-bezier(0.16, 1, 0.3, 1)',
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
                p: 4,
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
                birthDate={birthDate}
                setBirthDate={setBirthDate}
                onSubmit={handleInvestorSubmitRequest}
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
                p: 4,
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
                onSubmit={handleAgencySubmitRequest}
              />
            </Box>
            <Box sx={{ width: '50vw', height: '100%', position: 'relative', overflow: 'hidden' }}>
              <ChooseInvestor onSelect={() => setIsAgencyRegister(false)} />
            </Box>
          </Box>
        </Box>
      </Box>
      {/* Inline confirm handled inside forms; modal removed */}
    </Box>
  );
}
