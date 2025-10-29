import React, { useEffect, useMemo, useState } from 'react';
// API calls are handled in the parent register page after submission
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import Link from 'next/link';
import Button from '@mui/material/Button';
import CustomInput from '@/app/components/utils/input';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import CustomAutocomplete from '@/app/components/utils/autocomplete';
import CustomButton from '@/app/components/utils/button';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import AgencyCompanyInfoStep from '@/app/components/register/agencySteps/AgencyCompanyInfoStep';
import AgencyBusinessProfileStep from '@/app/components/register/agencySteps/AgencyBusinessProfileStep';
import AgencyPartnershipGoalsStep from '@/app/components/register/agencySteps/AgencyPartnershipGoalsStep';
import Glare from '@/app/reactDevBits/Glare/Glare';
import { alpha, useTheme } from '@mui/material/styles';

type Option = { value: string | number; label: string };

type RelatedSets = { primaryMarkets: string[]; servicesProvided: string[]; additionalPartnershipInterests: string[] };
type AgencyRegisterPayload = {
    email: string;
    password: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    countryId: number;
    cityId: number;
    streetAddress: string;
    stateId: number;
    postalCode: string;
    companyName: string;
    companyType: string;
    licenseNumber: string;
    companyWebsite: string;
    establishedYear: number;
    yearlyRange: number;
    avgPropertyValue: number;
    companyExperience: string;
    notableProjects: string;
    reasonPartner: string;
    expectedMonthlyListings: number;
    targetClient: string;
    primaryMarkets: string[];
    servicesProvided: string[];
    additionalPartnershipInterests: string[];
};

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
        onSubmit: (data: { payload: AgencyRegisterPayload; related: RelatedSets }) => void;
};

export default function SignUpAsAgency(props: Props) {
    const { countries, states, cities, selectedCountryId, selectedStateId, selectedCityId, setSelectedCountryById, setSelectedStateById, setSelectedCityById, email, setEmail, password, setPassword, firstName, setFirstName, lastName, setLastName, phonePrefix, setPhonePrefix, phoneNumber, setPhoneNumber, onSubmit } = props;
    const theme = useTheme();

    // simple phone prefix options (can be extended)
    const phonePrefixOptions = [
        '+1', '+7', '+20', '+27', '+30', '+31', '+32', '+33', '+34', '+36', '+39',
        '+40', '+41', '+43', '+44', '+45', '+46', '+47', '+48', '+49', '+52', '+55', '+57', '+60', '+61', '+62', '+63', '+64', '+65', '+66', '+81', '+82', '+84', '+86', '+90', '+91', '+92', '+94', '+351', '+352', '+353', '+354', '+355', '+356', '+358', '+359', '+370', '+371', '+372', '+380', '+386', '+420', '+421'
    ].map((p) => ({ value: p, label: p }));

    // phonePrefix is lifted to parent via props
    const [officeStreetAddress, setOfficeStreetAddress] = useState<string>('');

    // New multi-page wizard states
    const [stepIndex, setStepIndex] = useState<number>(0); // 0: Contact & Location (existing), 1: Company Info, 2: Business Profile, 3: Partnership Goals

    // Company Info
    const [companyName, setCompanyName] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [establishedYear, setEstablishedYear] = useState('');
    const [companyType, setCompanyType] = useState<string | number | ''>('');
    const [companyWebsite, setCompanyWebsite] = useState('');

    // Business Profile
    const [primaryMarkets, setPrimaryMarkets] = useState<string[]>([]);
    const [yearlyTransactions, setYearlyTransactions] = useState('');
    const [averagePropertyValue, setAveragePropertyValue] = useState('');
    const [avgCurrency, setAvgCurrency] = useState<'EUR' | 'USD' | 'GBP' | 'JPY' | 'CHF'>('EUR');
    const [experienceExpertise, setExperienceExpertise] = useState('');
    const [notableProjects, setNotableProjects] = useState('');

    // Partnership Goals
    const [partnershipReason, setPartnershipReason] = useState('');
    const [regionPreferences, setRegionPreferences] = useState<string[]>([]);
    const [targetClients, setTargetClients] = useState<string[]>([]);
    const [servicesProvided, setServicesProvided] = useState<string[]>([]);
    const [additionalInterests, setAdditionalInterests] = useState<string[]>([]);

    const GAP = 2;
    const [showPassword, setShowPassword] = useState(false);
    const [pwFocused, setPwFocused] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfirmPw, setShowConfirmPw] = useState(false);
    const [confirmFocused, setConfirmFocused] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [firstFocused, setFirstFocused] = useState(false);
    const [lastFocused, setLastFocused] = useState(false);
    const [phoneFocused, setPhoneFocused] = useState(false);
    const [streetFocused, setStreetFocused] = useState(false);
    const isLettersOnly = (s: string) => /^[A-Za-z\u00C0-\u017F\s'-]+$/.test(s);
    const isEmail = (s: string) => /.+@.+\..+/.test(s);
    const isDigits = (s: string) => /^\d+$/.test(s);
    const isNineDigits = (s: string) => /^\d{9}$/.test(s);
    // Agency has an extra step for Office Street Address (5 steps total)
    // Step completion booleans
    const isStep0Complete = useMemo(() => {
        const strong = /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password) && password.length >= 8;
        const step1 = email.includes('@') && strong;
        const step2 = firstName.trim().length > 0 && lastName.trim().length > 0;
    const step3 = String(phonePrefix).trim().length > 0 && isNineDigits(phoneNumber.trim());
        // Align with Investor: require Country + City (State may be optional)
        const step4 = selectedCountryId !== '' && selectedCityId !== '';
        const step5 = officeStreetAddress.trim().length > 15;
        const pwMatch = confirmPassword.length > 0 && confirmPassword === password;
        return step1 && step2 && step3 && step4 && step5 && strong && pwMatch;
    }, [email, password, confirmPassword, firstName, lastName, phonePrefix, phoneNumber, selectedCountryId, selectedStateId, selectedCityId, officeStreetAddress]);

    const isUrl = (s: string) => /^https?:\/\/.+\..+/.test(s);
    const isStep1Complete = useMemo(() => (
        companyName.trim().length > 0 &&
        licenseNumber.trim().length > 0 &&
        establishedYear.trim().length === 4 &&
        !!companyType &&
        isUrl(companyWebsite)
    ), [companyName, licenseNumber, establishedYear, companyType, companyWebsite]);

    const isStep2Complete = useMemo(() => (
        primaryMarkets.length > 0 &&
        yearlyTransactions.trim().length > 0 &&
        averagePropertyValue.trim().length > 0 &&
        experienceExpertise.trim().length > 0 &&
        notableProjects.trim().length > 0
    ), [primaryMarkets, yearlyTransactions, averagePropertyValue, experienceExpertise, notableProjects]);

    const isStep3Complete = useMemo(() => (
        partnershipReason.trim().length > 0 &&
        regionPreferences.length > 0 &&
        targetClients.length > 0 &&
        servicesProvided.length > 0 &&
        additionalInterests.length > 0
    ), [partnershipReason, regionPreferences, targetClients, servicesProvided, additionalInterests]);

    // Overall form completion (single progress for the entire form)
    const overallCompletion = useMemo(() => {
        // 20 checks (5 per step)
        const checks: boolean[] = [
            // Step 0
            email.includes('@') && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password) && password.length >= 8 && confirmPassword.length > 0 && confirmPassword === password,
            firstName.trim().length > 0 && lastName.trim().length > 0,
            String(phonePrefix).trim().length > 0 && isNineDigits(phoneNumber.trim()),
            // Align with Investor: require Country + City (State may be optional)
            selectedCountryId !== '' && selectedCityId !== '',
            officeStreetAddress.trim().length > 15,
            // Step 1
            companyName.trim().length > 0,
            licenseNumber.trim().length > 0,
            establishedYear.trim().length === 4,
            !!companyType,
            companyWebsite.trim().length > 0,
            // Step 2
            primaryMarkets.length > 0,
            yearlyTransactions.trim().length > 0,
            averagePropertyValue.trim().length > 0,
            experienceExpertise.trim().length > 0,
            notableProjects.trim().length > 0,
            // Step 3
            partnershipReason.trim().length > 0,
            regionPreferences.length > 0,
            targetClients.length > 0,
            servicesProvided.length > 0,
            additionalInterests.length > 0,
        ];
        const done = checks.filter(Boolean).length;
        return Math.round((done / checks.length) * 100);
    }, [email, password, firstName, lastName, phonePrefix, phoneNumber, selectedCountryId, selectedStateId, selectedCityId, officeStreetAddress, companyName, licenseNumber, establishedYear, companyType, companyWebsite, primaryMarkets, yearlyTransactions, averagePropertyValue, experienceExpertise, notableProjects, partnershipReason, regionPreferences, targetClients, servicesProvided, additionalInterests]);

    const isCurrentStepComplete = useMemo(() => {
        if (stepIndex === 0) return isStep0Complete;
        if (stepIndex === 1) return isStep1Complete;
        if (stepIndex === 2) return isStep2Complete;
        if (stepIndex === 3) return isStep3Complete;
        return false;
    }, [stepIndex, isStep0Complete, isStep1Complete, isStep2Complete, isStep3Complete]);

    const isFormComplete = isStep0Complete && isStep1Complete && isStep2Complete && isStep3Complete;
    const pwRules = useMemo(() => ({
        len: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    }), [password]);

    const invalidEmail = !isEmail(email) && !emailFocused && email.length > 0;
    const invalidPassword = !(pwRules.len && pwRules.upper && pwRules.lower && pwRules.number && pwRules.special) && !pwFocused && password.length > 0;
    const invalidFirst = firstName.length > 0 && !isLettersOnly(firstName) && !firstFocused;
    const invalidLast = lastName.length > 0 && !isLettersOnly(lastName) && !lastFocused;
    const invalidPhone = phoneNumber.length > 0 && (!isDigits(phoneNumber) || !isNineDigits(phoneNumber)) && !phoneFocused;
    const invalidConfirm = confirmPassword.length > 0 && confirmPassword !== password && !confirmFocused;
    const invalidStreet = officeStreetAddress.length > 0 && officeStreetAddress.trim().length <= 15 && !streetFocused;

    // Progress bar animation trigger when completion increases
    const [lastCompletion, setLastCompletion] = useState(overallCompletion);
    const [barAnimate, setBarAnimate] = useState(false);
    useEffect(() => {
        if (overallCompletion > lastCompletion) {
            setBarAnimate(true);
            const t = setTimeout(() => setBarAnimate(false), 700);
            setLastCompletion(overallCompletion);
            return () => clearTimeout(t);
        }
        if (overallCompletion !== lastCompletion) setLastCompletion(overallCompletion);
    }, [overallCompletion, lastCompletion]);

    const mapCompanyType = (v: string | number | ''): string => {
        const m: Record<string, string> = {
            brokerage: 'BROKERAGE_FIRM',
            developer: 'PROPERTY_DEVELOPER',
            property_mgmt: 'REAL_ESTATE_CONSULTANT',
            investment: 'INVESTMENT_COMPANY',
            other: 'NONE',
        };
        return typeof v === 'string' ? (m[v] || 'NONE') : 'NONE';
    };

    const toInt = (s: string, fallback = 0) => {
        const n = parseInt(String(s).replace(/[^0-9]/g, ''), 10);
        return Number.isFinite(n) ? n : fallback;
    };

    const bucketTransactions = (n: number) => (n <= 10 ? 0 : n <= 50 ? 1 : n <= 100 ? 2 : 3);
    const bucketAvgValue = (n: number) => (n < 200_000 ? 0 : n <= 500_000 ? 1 : n <= 1_000_000 ? 2 : n <= 5_000_000 ? 3 : 4);
    const toEur = (amount: number, currency: 'EUR' | 'USD' | 'GBP' | 'JPY' | 'CHF'): number => {
        const rates: Record<'EUR' | 'USD' | 'GBP' | 'JPY' | 'CHF', number> = {
            EUR: 1,
            USD: 0.94, // 1 USD ≈ 0.94 EUR
            GBP: 1.17, // 1 GBP ≈ 1.17 EUR
            JPY: 0.006, // 1 JPY ≈ 0.006 EUR
            CHF: 1.03, // 1 CHF ≈ 1.03 EUR
        };
        return Math.max(0, Math.round(amount * (rates[currency] ?? 1)));
    };

    // Map UI values to backend enum strings
    const mapPrimaryMarket = (vals: string[]): string[] => {
        const m: Record<string, string> = {
            residential: 'RESIDENTIAL',
            commercial: 'COMMERCIAL',
            luxury: 'LUXURY',
            land: 'LAND_DEVELOPMENT',
        };
        return vals.map(v => m[v]).filter(Boolean);
    };
    const mapServiceProvided = (vals: string[]): string[] => {
        const m: Record<string, string> = {
            valuation: 'PROPERTY_VALUATION',
            legal: 'LEGAL_ASSISTANCE',
            management: 'PROPERTY_MANAGEMENT',
            market_analysis: 'INVESTMENT_ANALYSIS',
            mortgage: 'BANKING_CONNECTIONS',
            // unsupported: renovation, staging, exclusive
        };
        return vals.map(v => m[v]).filter(Boolean);
    };
    const mapAdditionalInterests = (vals: string[]): string[] => {
        const m: Record<string, string> = {
            networking: 'MARKETING_PROMOTIONAL_SUPPORT',
            exclusive_deals: 'EXCLUSIVE_PROPERTY_DEALS',
        };
        return vals.map(v => m[v]).filter(Boolean);
    };

    const handleSubmit = async () => {
        if (!isFormComplete) return;
        try {
            const established = toInt(establishedYear, new Date().getFullYear());
            const yearSafe = Math.min(established, new Date().getFullYear());
            const yearlyTxNum = toInt(yearlyTransactions, 0);
            const avgValInput = toInt(averagePropertyValue, 0);
            const avgValEur = toEur(avgValInput, avgCurrency);
            const payload = {
                email,
                password,
                phoneNumber: `${String(phonePrefix)} ${phoneNumber}`.trim(),
                firstName,
                lastName,
                countryId: Number(selectedCountryId) || 0,
                cityId: Number(selectedCityId) || 0,
                streetAddress: officeStreetAddress,
                stateId: Number(selectedStateId) || 0,
                postalCode: '',
                companyName,
                companyType: mapCompanyType(companyType),
                licenseNumber,
                companyWebsite,
                establishedYear: yearSafe,
                yearlyRange: bucketTransactions(yearlyTxNum),
                avgPropertyValue: bucketAvgValue(avgValEur),
                companyExperience: experienceExpertise,
                notableProjects,
                reasonPartner: partnershipReason,
                expectedMonthlyListings: 0,
                targetClient: 'ALL_TYPES',
                // new related arrays
                primaryMarkets: mapPrimaryMarket(primaryMarkets),
                servicesProvided: mapServiceProvided(servicesProvided),
                additionalPartnershipInterests: mapAdditionalInterests(additionalInterests),
            };
            // Delegate API flow to parent: send core payload + related selections (already mapped to enums)
            if (typeof onSubmit === 'function') {
                onSubmit({
                    payload: payload as AgencyRegisterPayload,
                    related: {
                        primaryMarkets: mapPrimaryMarket(primaryMarkets),
                        servicesProvided: mapServiceProvided(servicesProvided),
                        additionalPartnershipInterests: mapAdditionalInterests(additionalInterests),
                    },
                });
            }
        } catch (e) {
            console.error('Agency register failed', e);
        }
    };

    return (
    <Box sx={{ pt: { xs: '24px', md: '80px' }, px: { xs: 3, md: 4 }, width: '100%', maxWidth: { xs: '100%', md: '100%' }, mx: 'auto', display: 'flex', flexDirection: 'column', height: { xs: 'auto', md: '100vh' }, overflow: { xs: 'visible', md: 'hidden' }, minHeight: 0 }}>
            {/* Header */}
            <Typography variant="h4" sx={{ mb: 0, fontWeight: 700, textAlign: 'center', fontSize: { xs: '1.5rem', md: '2rem' } }}>
                <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>Sign up as</Box> <Box component="span" sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 800 }}>Agency</Box>
            </Typography>

            {/* Progress bar moved outside scrollable content to remain always visible */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 4, mb: GAP, flexShrink: 0 }}>
                <Box sx={{ flex: 1 }}>
                    <Box sx={{ height: 8, bgcolor: 'grey.300', borderRadius: 5, overflow: 'hidden' }}>
                        <Box sx={{ width: `${overallCompletion}%`, height: '100%', bgcolor: theme.palette.primary.main, borderRadius: 5, transition: 'width 600ms cubic-bezier(0.16,1,0.3,1), background-color 300ms ease', boxShadow: barAnimate ? `0 0 12px ${alpha(theme.palette.primary.main, 0.5)}, 0 0 24px ${alpha(theme.palette.primary.main, 0.35)}` : 'none' }} />
                    </Box>
                </Box>
                <Typography sx={{ minWidth: 48, textAlign: 'right', fontWeight: 600, color: theme.palette.primary.main }}>{overallCompletion}%</Typography>
            </Box>

            {/* Scrollable step content on md+; non-scroll on mobile */}
            <Box sx={{ position: 'relative', flex: { xs: '0 0 auto', md: '1 1 auto' }, overflowY: { xs: 'visible', md: 'auto' }, overflowX: 'hidden', height: 'auto', minHeight: 0 }}>
                {/* Step 0 */}
                <Collapse in={stepIndex === 0} timeout={300} unmountOnExit>
                    <Box sx={{ p: GAP, display: 'flex', flexDirection: 'column', position: 'relative', py: { xs: GAP, md: 1 } }}>
                        <Typography
                            sx={{
                                fontWeight: 700,
                                mb: GAP,
                                textAlign: 'left',
                                color: 'text.primary',
                                fontSize: { xs: '1.1rem', md: '1.2rem' },
                            }}
                        >
                            Contact & Location
                        </Typography>

                        <CustomInput
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
                            onFocus={() => setEmailFocused(true)}
                            onBlur={() => setEmailFocused(false)}
                            placeholder="Company Email"
                            icon={<EmailOutlinedIcon />}
                            focusColor={theme.palette.primary.main}
                            invalid={invalidEmail}
                        />
                        <Collapse in={emailFocused && !isEmail(email) && email.length > 0} timeout={200} unmountOnExit>
                            <Typography variant="caption" sx={{ color: 'error.main', pl: 1, mt: 0.5 }}>
                                Please enter a valid email address.
                            </Typography>
                        </Collapse>

                        <Box sx={{ mt: 2 }}>
                            <CustomInput
                                label="Password"
                                value={password}
                                onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
                                onFocus={() => setPwFocused(true)}
                                onBlur={() => setPwFocused(false)}
                                placeholder="Password"
                                icon={<LockOutlinedIcon />}
                                focusColor={theme.palette.primary.main}
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                                onEndAdornmentClick={() => setShowPassword((v) => !v)}
                                invalid={invalidPassword}
                            />
                            <Collapse in={pwFocused} timeout={200} unmountOnExit>
                                <Box sx={{ mt: 1, pl: 1 }}>
                                    <Typography variant="caption" sx={{ display: 'block', color: pwRules.len ? 'success.main' : 'error.main' }}>• At least 8 characters</Typography>
                                    <Typography variant="caption" sx={{ display: 'block', color: pwRules.upper ? 'success.main' : 'error.main' }}>• At least one uppercase letter</Typography>
                                    <Typography variant="caption" sx={{ display: 'block', color: pwRules.lower ? 'success.main' : 'error.main' }}>• At least one lowercase letter</Typography>
                                    <Typography variant="caption" sx={{ display: 'block', color: pwRules.number ? 'success.main' : 'error.main' }}>• At least one number</Typography>
                                    <Typography variant="caption" sx={{ display: 'block', color: pwRules.special ? 'success.main' : 'error.main' }}>• At least one special symbol</Typography>
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
                                    focusColor={theme.palette.primary.main}
                                    type={showConfirmPw ? 'text' : 'password'}
                                    endAdornment={showConfirmPw ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                                    onEndAdornmentClick={() => setShowConfirmPw((v) => !v)}
                                    invalid={invalidConfirm}
                                />
                                <Collapse in={confirmFocused && confirmPassword.length > 0 && confirmPassword !== password} timeout={200} unmountOnExit>
                                    <Typography variant="caption" sx={{ color: 'error.main', pl: 1, mt: 0.5 }}>
                                        Passwords do not match.
                                    </Typography>
                                </Collapse>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: GAP, mt: GAP, flexDirection: { xs: 'column', md: 'row' } }}>
                            <Box sx={{ flex: 1 }}>
                                <CustomInput
                                    label="Primary Contact First Name"
                                    value={firstName}
                                    onChange={(e) =>
                                        setFirstName((e.target as HTMLInputElement).value.replace(/[^A-Za-z\u00C0-\u017F\s'-]/g, ''))
                                    }
                                    onFocus={() => setFirstFocused(true)}
                                    onBlur={() => setFirstFocused(false)}
                                    placeholder="Primary Contact First Name"
                                    icon={<PersonOutlineOutlinedIcon />}
                                    focusColor={theme.palette.primary.main}
                                    invalid={invalidFirst}
                                />
                                <Collapse in={firstFocused && firstName.length > 0 && !isLettersOnly(firstName)} timeout={200} unmountOnExit>
                                    <Typography variant="caption" sx={{ color: 'error.main', pl: 1, mt: 0.5 }}>
                                        Use letters only for first name.
                                    </Typography>
                                </Collapse>
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <CustomInput
                                    label="Primary Contact Last Name"
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastName((e.target as HTMLInputElement).value.replace(/[^A-Za-z\u00C0-\u017F\s'-]/g, ''))
                                    }
                                    onFocus={() => setLastFocused(true)}
                                    onBlur={() => setLastFocused(false)}
                                    placeholder="Primary Contact Last Name"
                                    icon={<PersonOutlineOutlinedIcon />}
                                    focusColor={theme.palette.primary.main}
                                    invalid={invalidLast}
                                />
                                <Collapse in={lastFocused && lastName.length > 0 && !isLettersOnly(lastName)} timeout={200} unmountOnExit>
                                    <Typography variant="caption" sx={{ color: 'error.main', pl: 1, mt: 0.5 }}>
                                        Use letters only for last name.
                                    </Typography>
                                </Collapse>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: GAP, mt: GAP }}>
                            <Box sx={{ flex: 1 }}>
                                <CustomAutocomplete
                                    options={phonePrefixOptions}
                                    value={phonePrefix}
                                    onChange={(v) => setPhonePrefix(v)}
                                    label="Prefix"
                                    icon={<AddOutlinedIcon />}
                                    focusColor={theme.palette.primary.main}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <CustomInput
                                    label="Phone"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber((e.target as HTMLInputElement).value.replace(/\D/g, ''))}
                                    onFocus={() => setPhoneFocused(true)}
                                    onBlur={() => setPhoneFocused(false)}
                                    placeholder="Phone Number"
                                    icon={<PhoneIphoneOutlinedIcon />}
                                    focusColor={theme.palette.primary.main}
                                    invalid={invalidPhone}
                                />
                                <Collapse in={phoneFocused && phoneNumber.length > 0 && (!isDigits(phoneNumber) || !isNineDigits(phoneNumber))} timeout={200} unmountOnExit>
                                    {(!isDigits(phoneNumber)) ? (
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

                        <Box sx={{ mt: GAP }}>
                            <CustomAutocomplete
                                options={countries.map((c) => ({ value: c.id, label: c.name }))}
                                value={selectedCountryId ?? ''}
                                onChange={(v) => setSelectedCountryById(typeof v === 'number' ? v : '')}
                                label="Country"
                                icon={<PublicOutlinedIcon />}
                                focusColor={theme.palette.primary.main}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', gap: GAP, mt: GAP }}>
                            <Box sx={{ flex: 1 }}>
                                <CustomAutocomplete
                                    options={[{ value: 0, label: 'No state' }, ...states.map((s) => ({ value: s.id, label: s.name }))]}
                                    value={selectedStateId ?? ''}
                                    onChange={(v) => setSelectedStateById(typeof v === 'number' ? v : '')}
                                    label="State"
                                    icon={<PublicOutlinedIcon />}
                                    focusColor={theme.palette.primary.main}
                                    disabled={selectedCountryId === ''}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <CustomAutocomplete
                                    options={cities.map((c) => ({ value: c.id, label: c.name }))}
                                    value={selectedCityId ?? ''}
                                    onChange={(v) => setSelectedCityById(typeof v === 'number' ? v : '')}
                                    label="City"
                                    icon={<PublicOutlinedIcon />}
                                    focusColor={theme.palette.primary.main}
                                    disabled={selectedCountryId === ''}
                                />
                            </Box>
                        </Box>

                        <Box sx={{ mt: GAP }}>
                            <CustomInput
                                label="Office Street Address"
                                value={officeStreetAddress}
                                onChange={(e) => setOfficeStreetAddress((e.target as HTMLInputElement).value)}
                                onFocus={() => setStreetFocused(true)}
                                onBlur={() => setStreetFocused(false)}
                                placeholder="Office Street Address"
                                icon={<PersonOutlineOutlinedIcon />}
                                focusColor={theme.palette.primary.main}
                                invalid={invalidStreet}
                            />
                            <Collapse in={streetFocused && officeStreetAddress.length > 0 && officeStreetAddress.trim().length <= 15} timeout={200} unmountOnExit>
                                <Typography variant="caption" sx={{ color: 'error.main', pl: 1, mt: 0.5 }}>
                                    Street address must be at least 16 characters.
                                </Typography>
                            </Collapse>
                        </Box>
                    </Box>
                </Collapse>

                {/* Step 1 */}
                <Collapse in={stepIndex === 1} timeout={300} unmountOnExit>
                    <Box sx={{ p: GAP, display: 'flex', flexDirection: 'column', position: 'relative', py: { xs: GAP, md: 1 } }}>
                        <AgencyCompanyInfoStep
                            companyName={companyName}
                            setCompanyName={setCompanyName}
                            licenseNumber={licenseNumber}
                            setLicenseNumber={setLicenseNumber}
                            establishedYear={establishedYear}
                            setEstablishedYear={setEstablishedYear}
                            companyType={companyType}
                            setCompanyType={setCompanyType}
                            companyWebsite={companyWebsite}
                            setCompanyWebsite={setCompanyWebsite}
                        />
                    </Box>
                </Collapse>

                {/* Step 2 */}
                <Collapse in={stepIndex === 2} timeout={300} unmountOnExit>
                    <Box sx={{ p: GAP, display: 'flex', flexDirection: 'column', position: 'relative', py: { xs: GAP, md: 1 } }}>
                        <AgencyBusinessProfileStep
                            primaryMarkets={primaryMarkets}
                            setPrimaryMarkets={setPrimaryMarkets}
                            yearlyTransactions={yearlyTransactions}
                            setYearlyTransactions={setYearlyTransactions}
                            averagePropertyValue={averagePropertyValue}
                            setAveragePropertyValue={setAveragePropertyValue}
                            experienceExpertise={experienceExpertise}
                            setExperienceExpertise={setExperienceExpertise}
                            notableProjects={notableProjects}
                            setNotableProjects={setNotableProjects}
                            currency={avgCurrency}
                            setCurrency={setAvgCurrency}
                        />
                    </Box>
                </Collapse>

                {/* Step 3 */}
                <Collapse in={stepIndex === 3} timeout={300} unmountOnExit>
                    <Box sx={{ p: GAP, display: 'flex', flexDirection: 'column', position: 'relative', py: { xs: GAP, md: 1 } }}>
                        <AgencyPartnershipGoalsStep
                            partnershipReason={partnershipReason}
                            setPartnershipReason={setPartnershipReason}
                            regionPreferences={regionPreferences}
                            setRegionPreferences={setRegionPreferences}
                            targetClients={targetClients}
                            setTargetClients={setTargetClients}
                            servicesProvided={servicesProvided}
                            setServicesProvided={setServicesProvided}
                            additionalInterests={additionalInterests}
                            setAdditionalInterests={setAdditionalInterests}
                        />
                    </Box>
                </Collapse>
            </Box>

            {/* CTA container: match Investor gap before the button */}
            <Box sx={{ mt: 1, pt: GAP, pb: { xs: 4, md: 4 }, maxWidth: 640, mx: 'auto', flexShrink: 0 }}>
                <Box sx={{ display: 'flex', gap: { xs: 1.5, md: 2 }, alignItems: 'center', justifyContent: 'center', flexWrap: 'nowrap' }}>
                    {stepIndex > 0 && (
                        <Box sx={{ flex: 'none' }}>
                            <Button
                                aria-label="Back"
                                onClick={() => setStepIndex((s) => Math.max(0, s - 1))}
                                startIcon={<ArrowBackIosNewIcon sx={{ color: '#fff' }} />}
                                disableElevation
                                sx={{
                                    height: { xs: 42, md: 48, lg: 56 },
                                    width: { xs: 42, md: 48, lg: 56 },
                                    minWidth: 0,
                                    px: 1.25,
                                    border: 'none',
                                    outline: 'none',
                                    textTransform: 'none',
                                    fontFamily: 'Montserrat, sans-serif',
                                    fontSize: { xs: '12px', sm: '13px', md: '14px', lg: '18px' },
                                    fontWeight: 700,
                                    color: '#fff',
                                    backgroundColor: theme.palette.primary.main,
                                    borderRadius: { xs: '12px', lg: '16px' },
                                    justifyContent: 'center',
                                    '& .MuiButton-startIcon': { mr: 0 },
                                    '&:hover': { backgroundColor: theme.palette.primary.dark },
                                    '&:focus-visible': { outline: 'none' },
                                }}
                            />
                        </Box>
                    )}
                    {/* Primary CTA: flex-grow to fill remaining space; responsive minWidth to avoid overflow on mobile */}
                    <Box sx={{ flex: 1, minWidth: { xs: 0, md: 240 } }}>
                        {stepIndex < 3 ? (
                            <Glare shouldPlay={isCurrentStepComplete} glareColor={theme.palette.common.white} glareOpacity={0.5} glareAngle={-30} glareSize={380} transitionDuration={900} style={{ width: '100%' }}>
                                <CustomButton label="Continue" onClick={() => setStepIndex((s) => Math.min(3, s + 1))} color="primary" disabled={!isCurrentStepComplete} containerSx={{ width: '100%' }} sx={{ fontWeight: 700, px: 5, whiteSpace: 'nowrap' }} />
                            </Glare>
                        ) : (
                            <Glare shouldPlay={isFormComplete} glareColor={theme.palette.common.white} glareOpacity={0.5} glareAngle={-30} glareSize={380} transitionDuration={900} style={{ width: '100%' }}>
                                <CustomButton label="Create Account" onClick={handleSubmit} color="primary" disabled={!isFormComplete} containerSx={{ width: '100%' }} sx={{ fontWeight: 700, px: 5, whiteSpace: 'nowrap' }} />
                            </Glare>
                        )}
                    </Box>
                </Box>
                <Typography sx={{ mt: GAP, color: 'text.secondary', textAlign: 'center', fontSize: { xs: '14px', lg: '16px' } }}>
                    Already have an Agency account?{' '}
                    <Link href="/login" style={{ fontWeight: 700, color: theme.palette.primary.main, textDecoration: 'none' }}>Log in</Link>
                </Typography>
            </Box>
        </Box>
    );
}
