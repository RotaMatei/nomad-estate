import React, { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
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
import AgencyCompanyInfoStep from '@/app/components/register/agencySteps/AgencyCompanyInfoStep';
import AgencyBusinessProfileStep from '@/app/components/register/agencySteps/AgencyBusinessProfileStep';
import AgencyPartnershipGoalsStep from '@/app/components/register/agencySteps/AgencyPartnershipGoalsStep';

type Option = { value: string | number; label: string };

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

export default function SignUpAsAgency(props: Props) {
    const { countries, states, cities, selectedCountryId, selectedStateId, selectedCityId, setSelectedCountryById, setSelectedStateById, setSelectedCityById, email, setEmail, password, setPassword, firstName, setFirstName, lastName, setLastName, phonePrefix, setPhonePrefix, phoneNumber, setPhoneNumber, onSubmit } = props;

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
    const isLettersOnly = (s: string) => /^[A-Za-z\u00C0-\u017F\s'-]+$/.test(s);
    const isEmail = (s: string) => /.+@.+\..+/.test(s);
    const isDigits = (s: string) => /^\d+$/.test(s);
    // Agency has an extra step for Office Street Address (5 steps total)
    // Step completion booleans
    const isStep0Complete = useMemo(() => {
        const step1 = email.includes('@') && password.trim().length >= 6;
        const step2 = firstName.trim().length > 0 && lastName.trim().length > 0;
        const step3 = String(phonePrefix).trim().length > 0 && phoneNumber.trim().length > 0;
        const step4 = selectedCountryId !== '' && selectedStateId !== '' && selectedCityId !== '';
        const step5 = officeStreetAddress.trim().length > 0;
        return step1 && step2 && step3 && step4 && step5;
    }, [email, password, firstName, lastName, phonePrefix, phoneNumber, selectedCountryId, selectedStateId, selectedCityId, officeStreetAddress]);

    const isStep1Complete = useMemo(() => (
        companyName.trim().length > 0 &&
        licenseNumber.trim().length > 0 &&
        establishedYear.trim().length === 4 &&
        !!companyType &&
        companyWebsite.trim().length > 0
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
            email.includes('@') && password.trim().length >= 6,
            firstName.trim().length > 0 && lastName.trim().length > 0,
            String(phonePrefix).trim().length > 0 && phoneNumber.trim().length > 0,
            selectedCountryId !== '' && selectedStateId !== '' && selectedCityId !== '',
            officeStreetAddress.trim().length > 0,
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

    return (
    <Box sx={{ p: { xs: 3, md: 4 }, width: '100%', maxWidth: { xs: '100%', md: '100%' }, mx: 'auto', display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
            {/* Header */}
            <Typography variant="h4" sx={{ mb: { xs: GAP, md: GAP * 1.5 }, fontWeight: 700, textAlign: 'center' }}>
                <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>Sign up as</Box> <Box component="span" sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 800 }}>Agency</Box>
            </Typography>

            {/* Middle content: progress + entries centered vertically */}
            <Box sx={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', overflow: 'hidden' }}>
                {/* Progress bar with percentage label */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: GAP }}>
                    <Box sx={{ flex: 1 }}>
                        <Box sx={{ height: 8, bgcolor: 'grey.300', borderRadius: 5, overflow: 'hidden' }}>
                            <Box sx={{ width: `${overallCompletion}%`, height: '100%', bgcolor: '#e93b20' }} />
                        </Box>
                    </Box>
                    <Typography sx={{ minWidth: 48, textAlign: 'right', fontWeight: 600, color: '#e93b20' }}>{overallCompletion}%</Typography>
                </Box>

                {/* Section content routes with smooth horizontal sliding between steps */}
                <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                    <Box sx={{ display: 'flex', width: '400%', transform: `translate3d(-${stepIndex * 25}%, 0, 0)`, transition: 'transform 750ms cubic-bezier(0.16, 1, 0.3, 1)', willChange: 'transform' }}>
                        {/* Step 0 */}
                        <Box sx={{ width: '25%', pr: { xs: 0, md: 2 } }}>
                            <Typography sx={{ fontWeight: 700, mb: GAP, textAlign: 'left', color: 'text.primary', fontSize: { xs: '1.1rem', md: '1.2rem' } }}>Contact & Location</Typography>

                            <CustomInput label="Email" value={email} onChange={(e) => setEmail((e.target as HTMLInputElement).value)} placeholder="Company Email" icon={<EmailOutlinedIcon />} focusColor="#e93b20" />
                            {!isEmail(email) && email.length > 0 && (
                                <Typography variant="caption" sx={{ color: 'error.main', pl: 1, mt: 0.5 }}>Please enter a valid email address.</Typography>
                            )}

                            <Box sx={{ mt: 2 }}>
                                <CustomInput label="Password" value={password} onChange={(e) => setPassword((e.target as HTMLInputElement).value)} placeholder="Password" icon={<LockOutlinedIcon />} focusColor="#e93b20" type={showPassword ? 'text' : 'password'} endAdornment={showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />} onEndAdornmentClick={() => setShowPassword((v) => !v)} />
                                {password.length > 0 && password.length < 6 && (
                                    <Typography variant="caption" sx={{ color: 'error.main', pl: 1, mt: 0.5 }}>Password must be at least 6 characters.</Typography>
                                )}
                            </Box>

                            <Box sx={{ display: 'flex', gap: GAP, mt: GAP }}>
                                <Box sx={{ flex: 1 }}>
                                    <CustomInput label="Primary Contact First Name" value={firstName} onChange={(e) => setFirstName((e.target as HTMLInputElement).value.replace(/[^A-Za-z\u00C0-\u017F\s'-]/g, ''))} placeholder="Primary Contact First Name" icon={<PersonOutlineOutlinedIcon />} focusColor="#e93b20" />
                                    {firstName.length > 0 && !isLettersOnly(firstName) && (
                                        <Typography variant="caption" sx={{ color: 'error.main', pl: 1, mt: 0.5 }}>Use letters only for first name.</Typography>
                                    )}
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <CustomInput label="Primary Contact Last Name" value={lastName} onChange={(e) => setLastName((e.target as HTMLInputElement).value.replace(/[^A-Za-z\u00C0-\u017F\s'-]/g, ''))} placeholder="Primary Contact Last Name" icon={<PersonOutlineOutlinedIcon />} focusColor="#e93b20" />
                                    {lastName.length > 0 && !isLettersOnly(lastName) && (
                                        <Typography variant="caption" sx={{ color: 'error.main', pl: 1, mt: 0.5 }}>Use letters only for last name.</Typography>
                                    )}
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', gap: GAP, mt: GAP }}>
                                <Box sx={{ flex: 1 }}>
                                    <CustomAutocomplete options={phonePrefixOptions} value={phonePrefix} onChange={(v) => setPhonePrefix(v)} label="Prefix" icon={<AddOutlinedIcon />} focusColor="#e93b20" />
                                </Box>
                                <Box sx={{ flex: 3 }}>
                                    <CustomInput label="Phone" value={phoneNumber} onChange={(e) => setPhoneNumber((e.target as HTMLInputElement).value.replace(/\D/g, ''))} placeholder="Phone Number" icon={<PhoneIphoneOutlinedIcon />} focusColor="#e93b20" />
                                    {phoneNumber.length > 0 && !isDigits(phoneNumber) && (
                                        <Typography variant="caption" sx={{ color: 'error.main', pl: 1, mt: 0.5 }}>Digits only for phone number.</Typography>
                                    )}
                                </Box>
                            </Box>

                            <Box sx={{ mt: GAP }}>
                                <CustomAutocomplete options={countries.map((c) => ({ value: c.id, label: c.name }))} value={selectedCountryId ?? ''} onChange={(v) => setSelectedCountryById(typeof v === 'number' ? v : '')} label="Country" icon={<PublicOutlinedIcon />} focusColor="#e93b20" />
                            </Box>

                            <Box sx={{ display: 'flex', gap: GAP, mt: GAP }}>
                                <Box sx={{ flex: 1 }}>
                                    <CustomAutocomplete options={states.map((s) => ({ value: s.id, label: s.name }))} value={selectedStateId ?? ''} onChange={(v) => setSelectedStateById(typeof v === 'number' ? v : '')} label="State" icon={<PublicOutlinedIcon />} focusColor="#e93b20" disabled={selectedCountryId === ''} />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <CustomAutocomplete options={cities.map((c) => ({ value: c.id, label: c.name }))} value={selectedCityId ?? ''} onChange={(v) => setSelectedCityById(typeof v === 'number' ? v : '')} label="City" icon={<PublicOutlinedIcon />} focusColor="#e93b20" disabled={selectedCountryId === ''} />
                                </Box>
                            </Box>

                            <Box sx={{ mt: GAP }}>
                                <CustomInput label="Office Street Address" value={officeStreetAddress} onChange={(e) => setOfficeStreetAddress((e.target as HTMLInputElement).value)} placeholder="Office Street Address" icon={<PersonOutlineOutlinedIcon />} focusColor="#e93b20" />
                            </Box>
                        </Box>

                        {/* Step 1 */}
                        <Box sx={{ width: '25%', pr: { xs: 0, md: 2 } }}>
                            <AgencyCompanyInfoStep companyName={companyName} setCompanyName={setCompanyName} licenseNumber={licenseNumber} setLicenseNumber={setLicenseNumber} establishedYear={establishedYear} setEstablishedYear={setEstablishedYear} companyType={companyType} setCompanyType={setCompanyType} companyWebsite={companyWebsite} setCompanyWebsite={setCompanyWebsite} />
                        </Box>

                        {/* Step 2 */}
                        <Box sx={{ width: '25%', pr: { xs: 0, md: 2 } }}>
                            <AgencyBusinessProfileStep primaryMarkets={primaryMarkets} setPrimaryMarkets={setPrimaryMarkets} yearlyTransactions={yearlyTransactions} setYearlyTransactions={setYearlyTransactions} averagePropertyValue={averagePropertyValue} setAveragePropertyValue={setAveragePropertyValue} experienceExpertise={experienceExpertise} setExperienceExpertise={setExperienceExpertise} notableProjects={notableProjects} setNotableProjects={setNotableProjects} />
                        </Box>

                        {/* Step 3 */}
                        <Box sx={{ width: '25%' }}>
                            <AgencyPartnershipGoalsStep partnershipReason={partnershipReason} setPartnershipReason={setPartnershipReason} regionPreferences={regionPreferences} setRegionPreferences={setRegionPreferences} targetClients={targetClients} setTargetClients={setTargetClients} servicesProvided={servicesProvided} setServicesProvided={setServicesProvided} additionalInterests={additionalInterests} setAdditionalInterests={setAdditionalInterests} />
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* CTA pinned near bottom with 80px padding */}
            <Box sx={{ mt: 1, pt: GAP, pb: { xs: 6, md: 10 }, maxWidth: 640, mx: { xs: 0, md: 'auto' } }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center' }}>
                    {stepIndex > 0 && (
                        <CustomButton label="Back" onClick={() => setStepIndex((s) => Math.max(0, s - 1))} color="secondary" sx={{ fontWeight: 700, px: 5, flex: 1, minWidth: 220, whiteSpace: 'nowrap' }} />
                    )}
                    {stepIndex < 3 ? (
                        <CustomButton label="Continue" onClick={() => setStepIndex((s) => Math.min(3, s + 1))} color="secondary" disabled={!isCurrentStepComplete} sx={{ fontWeight: 700, px: 5, flex: 1, minWidth: 220, whiteSpace: 'nowrap' }} />
                    ) : (
                        <CustomButton label="Create Account" onClick={onSubmit} color="secondary" disabled={!isFormComplete} sx={{ fontWeight: 700, px: 5, flex: 1, minWidth: 240, whiteSpace: 'nowrap' }} />
                    )}
                </Box>
                <Typography sx={{ mt: GAP, color: 'text.secondary', textAlign: 'center' }}>
                    Already have an Agency account?{' '}
                    <Link href="/login" style={{ fontWeight: 700, color: '#e93b20', textDecoration: 'none' }}>Log in</Link>
                </Typography>
            </Box>
        </Box>
    );
}
