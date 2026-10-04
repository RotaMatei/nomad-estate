'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { MailCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { useForm, type FieldValues, type Path, type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { AuthShell } from './auth-shell';
import { LocationFields } from './location-fields';
import api from '@/app/lib/api';
import Stepper, { Step } from '@/components/reactbits/stepper';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { errorMessage, errorStatus, persistSession, type AuthResponse } from '@/lib/auth/session';
import { humanize } from '@/lib/properties/details';
import { cn } from '@/lib/utils';

// ── shared rules ──────────────────────────────────────────────────────────────
const email = z.string().trim().toLowerCase().email('Enter a valid email address.');
const password = z.string().min(8, 'Use at least 8 characters.').max(128, 'Use 128 characters or fewer.');
const phone = z
  .string()
  .trim()
  .regex(/^\+?[0-9 ()-]{7,20}$/, 'Enter a phone number with its country code, for example +40 712 345 678.');
const required = (what: string) => z.string().trim().min(1, `Enter ${what}.`);
const id = (what: string) => z.number({ error: `Choose ${what}.` }).int().positive(`Choose ${what}.`);

const account = { email, password, confirmPassword: z.string() };
const passwordsMatch = (v: { password: string; confirmPassword: string }) => v.password === v.confirmPassword;
const mismatch = { message: 'The two passwords are different.', path: ['confirmPassword'] };

const investorSchema = z
  .object({
    ...account,
    firstName: required('your first name'),
    lastName: required('your last name'),
    phoneNumber: phone,
    birthDate: z
      .string()
      .min(1, 'Enter your date of birth.')
      .refine((v) => {
        const d = new Date(v);
        const adult = new Date();
        adult.setFullYear(adult.getFullYear() - 18);
        return !Number.isNaN(d.getTime()) && d <= adult;
      }, 'You need to be at least 18 to invest.'),
    countryId: id('a country'),
    stateId: z.number().optional(),
    cityId: id('a city'),
  })
  .refine(passwordsMatch, mismatch);
type InvestorValues = z.infer<typeof investorSchema>;

const COMPANY_TYPES = ['REAL_ESTATE_AGENCY', 'BROKERAGE_FIRM', 'PROPERTY_DEVELOPER', 'INVESTMENT_COMPANY', 'REAL_ESTATE_CONSULTANT'] as const;
const TARGET_CLIENTS = ['ALL_TYPES', 'INTERNATIONAL_INVESTORS', 'GOLDEN_VISA_SEEKERS', 'LUXURY_PROPERTY_BUYERS', 'INVESTMENT_GROUPS'] as const;
const PRIMARY_MARKETS = ['RESIDENTIAL', 'COMMERCIAL', 'LUXURY', 'INVESTMENT', 'VACATION_RENTALS', 'LAND_DEVELOPMENT'] as const;
const SERVICES = [
  'PROPERTY_VALUATION',
  'LEGAL_ASSISTANCE',
  'TAX_ADVISORY',
  'PROPERTY_MANAGEMENT',
  'INVESTMENT_ANALYSIS',
  'VISA_RESIDENCY_SUPPORT',
  'BANKING_CONNECTIONS',
  'LOCAL_MARKET_EXPERTISE',
] as const;
const INTERESTS = ['MARKETING_PROMOTIONAL_SUPPORT', 'EXCLUSIVE_PROPERTY_DEALS'] as const;
// The API stores these three as bucket indexes.
const YEARLY_RANGE = ['1 to 10', '11 to 50', '51 to 100', 'More than 100'];
const AVG_VALUE = ['Under $200K', '$200K to $500K', '$500K to $1M', '$1M to $5M', 'Over $5M'];
const MONTHLY_LISTINGS = ['1 to 5', '6 to 15', '16 to 30', 'More than 30'];
const LABEL_OVERRIDES: Record<string, string> = { ALL_TYPES: 'All types of client', VISA_RESIDENCY_SUPPORT: 'Visa and residency support' };
const label = (v: string) => LABEL_OVERRIDES[v] ?? humanize(v);

const thisYear = new Date().getFullYear();
const agencySchema = z
  .object({
    ...account,
    firstName: required('the contact person’s first name'),
    lastName: required('the contact person’s last name'),
    phoneNumber: phone,
    companyName: required('the company name'),
    companyType: z.enum(COMPANY_TYPES, { error: 'Choose a company type.' }),
    licenseNumber: required('the licence number'),
    companyWebsite: z.string().trim().url('Enter the full address, starting with https://'),
    establishedYear: z
      .number({ error: 'Enter the year the company was founded.' })
      .int()
      .min(1800, 'Enter a year after 1800.')
      .max(thisYear, 'The year cannot be in the future.'),
    countryId: id('a country'),
    stateId: z.number().optional(),
    cityId: id('a city'),
    streetAddress: required('the street address'),
    postalCode: required('the postal code'),
    yearlyRange: z.number().int().min(0),
    avgPropertyValue: z.number().int().min(0),
    expectedMonthlyListings: z.number().int().min(0),
    targetClient: z.enum(TARGET_CLIENTS),
    primaryMarkets: z.array(z.enum(PRIMARY_MARKETS)).min(1, 'Choose at least one market.'),
    servicesProvided: z.array(z.enum(SERVICES)),
    additionalPartnershipInterests: z.array(z.enum(INTERESTS)),
    companyExperience: required('a short description of your experience').pipe(z.string().max(2000)),
    notableProjects: z.string().trim().max(2000),
    reasonPartner: required('why you want to list on Nomad Estate').pipe(z.string().max(2000)),
  })
  .refine(passwordsMatch, mismatch);
type AgencyValues = z.infer<typeof agencySchema>;

// ── small field helpers ───────────────────────────────────────────────────────
function TextField<T extends FieldValues>({
  form,
  name,
  label: text,
  description,
  className,
  number,
  ...input
}: { form: UseFormReturn<T>; name: Path<T>; label: string; description?: string; number?: boolean } & Omit<React.ComponentProps<typeof Input>, 'name' | 'form'>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{text}</FormLabel>
          <FormControl>
            <Input
              {...input}
              {...field}
              value={(field.value as string | number | undefined) ?? ''}
              onChange={(e) => field.onChange(number ? (e.target.value === '' ? undefined : Number(e.target.value)) : e.target.value)}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function AreaField<T extends FieldValues>({ form, name, label: text, placeholder }: { form: UseFormReturn<T>; name: Path<T>; label: string; placeholder?: string }) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{text}</FormLabel>
          <FormControl>
            <Textarea rows={3} placeholder={placeholder} {...field} value={(field.value as string) ?? ''} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function BucketField<T extends FieldValues>({ form, name, label: text, options }: { form: UseFormReturn<T>; name: Path<T>; label: string; options: readonly string[] }) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{text}</FormLabel>
          <Select value={String(field.value)} onValueChange={(v) => field.onChange(Number(v))}>
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((o, i) => (
                <SelectItem key={o} value={String(i)}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function EnumField<T extends FieldValues>({ form, name, label: text, options, placeholder }: { form: UseFormReturn<T>; name: Path<T>; label: string; options: readonly string[]; placeholder?: string }) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{text}</FormLabel>
          <Select value={(field.value as string | undefined) ?? ''} onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o} value={o}>
                  {label(o)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function ChipsField<T extends FieldValues>({ form, name, label: text, options }: { form: UseFormReturn<T>; name: Path<T>; label: string; options: readonly string[] }) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const selected = (field.value as string[]) ?? [];
        return (
          <FormItem>
            <fieldset>
              <legend className="mb-2 text-sm font-medium">{text}</legend>
              <div className="flex flex-wrap gap-2">
                {options.map((o) => {
                  const on = selected.includes(o);
                  return (
                    <button
                      key={o}
                      type="button"
                      aria-pressed={on}
                      onClick={() => field.onChange(on ? selected.filter((x) => x !== o) : [...selected, o])}
                      className={cn(
                        'h-8 rounded-full border px-3 text-sm transition-colors',
                        on ? 'border-foreground bg-foreground text-background' : 'border-border hover:bg-accent',
                      )}
                    >
                      {label(o)}
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

function AccountFields<T extends FieldValues>({ form }: { form: UseFormReturn<T> }) {
  return (
    <div className="grid gap-4">
      <TextField form={form} name={'email' as Path<T>} label="Email" type="email" autoComplete="email" inputMode="email" />
      <TextField form={form} name={'password' as Path<T>} label="Password" type="password" autoComplete="new-password" description="At least 8 characters." />
      <TextField form={form} name={'confirmPassword' as Path<T>} label="Repeat the password" type="password" autoComplete="new-password" />
    </div>
  );
}

function registrationError(e: unknown) {
  const status = errorStatus(e);
  if (status === 409) return 'An account with this email already exists. Sign in instead.';
  if (status == null || status >= 500) return 'The server did not answer. Your details are still in the form, so try again in a moment.';
  return errorMessage(e, 'Some details were not accepted. Check the form and try again.');
}

function CheckEmail({ address }: { address: string }) {
  return (
    <div className="flex flex-col items-center py-4 text-center">
      <MailCheck className="size-10 text-positive" aria-hidden />
      <h2 className="mt-4 text-xl font-semibold">Confirm your email</h2>
      <p className="mt-2 max-w-sm text-muted-foreground">
        We sent a link to <span className="font-medium text-foreground">{address}</span>. Open it to finish setting up your account.
      </p>
      <Button asChild className="mt-6 rounded-full">
        <Link href="/properties">Explore the globe</Link>
      </Button>
    </div>
  );
}

// ── investor ──────────────────────────────────────────────────────────────────
const INVESTOR_STEPS: Path<InvestorValues>[][] = [
  ['email', 'password', 'confirmPassword'],
  ['firstName', 'lastName', 'phoneNumber', 'birthDate'],
  ['countryId', 'stateId', 'cityId'],
];

function InvestorRegister() {
  const router = useRouter();
  const [done, setDone] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const form = useForm<InvestorValues>({
    resolver: zodResolver(investorSchema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '', confirmPassword: '', firstName: '', lastName: '', phoneNumber: '', birthDate: '' },
  });

  const submit = async (): Promise<boolean> => {
    if (!(await form.trigger())) return false;
    const { confirmPassword: _confirm, birthDate, ...values } = form.getValues();
    void _confirm;
    setBusy(true);
    try {
      const { data } = await api.post<AuthResponse>('/auth/user/register', { ...values, role: 'INVESTOR', birthDate: new Date(birthDate).toISOString() });
      if (data?.accessToken) {
        persistSession(data, 'user', `${values.firstName} ${values.lastName}`);
        toast.success('Account created');
        router.push('/properties');
      } else {
        setDone(values.email);
      }
      return true;
    } catch (e) {
      toast.error(registrationError(e));
      return false;
    } finally {
      setBusy(false);
    }
  };

  if (done) return <CheckEmail address={done} />;
  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()} noValidate>
        <Stepper
          onBeforeNext={(step) => (step === INVESTOR_STEPS.length ? submit() : form.trigger(INVESTOR_STEPS[step - 1]))}
          completeButtonText={busy ? 'Creating account' : 'Create account'}
          nextButtonProps={{ disabled: busy }}
        >
          <Step>
            <AccountFields form={form} />
          </Step>
          <Step>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField form={form} name="firstName" label="First name" autoComplete="given-name" />
              <TextField form={form} name="lastName" label="Last name" autoComplete="family-name" />
              <TextField form={form} name="phoneNumber" label="Phone" type="tel" autoComplete="tel" placeholder="+40 712 345 678" />
              <TextField form={form} name="birthDate" label="Date of birth" type="date" autoComplete="bday" />
            </div>
          </Step>
          <Step>
            <LocationFields form={form} />
          </Step>
        </Stepper>
      </form>
    </Form>
  );
}

// ── agency ────────────────────────────────────────────────────────────────────
const AGENCY_STEPS: Path<AgencyValues>[][] = [
  ['email', 'password', 'confirmPassword', 'firstName', 'lastName', 'phoneNumber'],
  ['companyName', 'companyType', 'licenseNumber', 'companyWebsite', 'establishedYear'],
  ['countryId', 'stateId', 'cityId', 'streetAddress', 'postalCode'],
  ['yearlyRange', 'avgPropertyValue', 'expectedMonthlyListings', 'targetClient', 'primaryMarkets', 'servicesProvided', 'additionalPartnershipInterests', 'companyExperience', 'notableProjects', 'reasonPartner'],
];

function AgencyRegister() {
  const router = useRouter();
  const [done, setDone] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const form = useForm<AgencyValues>({
    resolver: zodResolver(agencySchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      companyName: '',
      licenseNumber: '',
      companyWebsite: '',
      streetAddress: '',
      postalCode: '',
      yearlyRange: 0,
      avgPropertyValue: 0,
      expectedMonthlyListings: 0,
      targetClient: 'ALL_TYPES',
      primaryMarkets: [],
      servicesProvided: [],
      additionalPartnershipInterests: [],
      companyExperience: '',
      notableProjects: '',
      reasonPartner: '',
    },
  });

  const submit = async (): Promise<boolean> => {
    if (!(await form.trigger())) return false;
    const { confirmPassword: _confirm, primaryMarkets, servicesProvided, additionalPartnershipInterests, ...payload } = form.getValues();
    void _confirm;
    setBusy(true);
    try {
      const { data } = await api.post<AuthResponse>('/auth/agency/register', payload);
      if (!data?.accessToken) {
        setDone(payload.email);
        return true;
      }
      persistSession(data, 'agency', payload.companyName);
      // Markets, services and interests are separate tables with their own endpoints until the Rust API
      // accepts them in the registration call (PROGRESS B2). A failure here must not undo the registration.
      const agencyId = localStorage.getItem('userId') ?? '';
      const related = await Promise.allSettled([
        ...primaryMarkets.map((primaryMarket) => api.post('/agency/primary-market/create', { id: crypto.randomUUID(), agencyId, primaryMarket })),
        ...servicesProvided.map((serviceProvided) => api.post('/agency/service-provided/create', { id: crypto.randomUUID(), agencyId, serviceProvided })),
        ...additionalPartnershipInterests.map((additionalPartnershipInterest) =>
          api.post('/agency/additional-partnership-interest/create', { id: crypto.randomUUID(), agencyId, additionalPartnershipInterest }),
        ),
      ]);
      if (related.some((r) => r.status === 'rejected')) {
        toast.warning('Your agency is registered, but some markets or services were not saved. Add them again from your profile.');
      } else {
        toast.success('Agency registered');
      }
      router.push('/dashboard');
      return true;
    } catch (e) {
      toast.error(registrationError(e));
      return false;
    } finally {
      setBusy(false);
    }
  };

  if (done) return <CheckEmail address={done} />;
  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()} noValidate>
        <Stepper
          onBeforeNext={(step) => (step === AGENCY_STEPS.length ? submit() : form.trigger(AGENCY_STEPS[step - 1]))}
          completeButtonText={busy ? 'Registering agency' : 'Register agency'}
          nextButtonProps={{ disabled: busy }}
        >
          <Step>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <AccountFields form={form} />
              </div>
              <TextField form={form} name="firstName" label="Contact first name" autoComplete="given-name" />
              <TextField form={form} name="lastName" label="Contact last name" autoComplete="family-name" />
              <TextField form={form} name="phoneNumber" label="Phone" type="tel" autoComplete="tel" placeholder="+40 21 555 0100" className="sm:col-span-2" />
            </div>
          </Step>
          <Step>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField form={form} name="companyName" label="Company name" autoComplete="organization" className="sm:col-span-2" />
              <EnumField form={form} name="companyType" label="Company type" options={COMPANY_TYPES} placeholder="Choose a type" />
              <TextField form={form} name="establishedYear" label="Founded in" type="number" inputMode="numeric" number placeholder="2012" />
              <TextField form={form} name="licenseNumber" label="Licence number" />
              <TextField form={form} name="companyWebsite" label="Website" type="url" autoComplete="url" placeholder="https://" />
            </div>
          </Step>
          <Step>
            <div className="grid gap-4">
              <LocationFields form={form} />
              <div className="grid gap-4 sm:grid-cols-[1fr_10rem]">
                <TextField form={form} name="streetAddress" label="Street address" autoComplete="street-address" />
                <TextField form={form} name="postalCode" label="Postal code" autoComplete="postal-code" />
              </div>
            </div>
          </Step>
          <Step>
            <div className="grid gap-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <BucketField form={form} name="yearlyRange" label="Properties sold per year" options={YEARLY_RANGE} />
                <BucketField form={form} name="avgPropertyValue" label="Average property value" options={AVG_VALUE} />
                <BucketField form={form} name="expectedMonthlyListings" label="Listings you expect to add per month" options={MONTHLY_LISTINGS} />
                <EnumField form={form} name="targetClient" label="Clients you mainly work with" options={TARGET_CLIENTS} />
              </div>
              <ChipsField form={form} name="primaryMarkets" label="Markets you work in" options={PRIMARY_MARKETS} />
              <ChipsField form={form} name="servicesProvided" label="Services you offer (optional)" options={SERVICES} />
              <ChipsField form={form} name="additionalPartnershipInterests" label="Also interested in (optional)" options={INTERESTS} />
              <AreaField form={form} name="companyExperience" label="Your experience" placeholder="Years in the market, typical deals, team size." />
              <AreaField form={form} name="notableProjects" label="Notable projects (optional)" />
              <AreaField form={form} name="reasonPartner" label="Why do you want to list on Nomad Estate?" />
            </div>
          </Step>
        </Stepper>
      </form>
    </Form>
  );
}

export function RegisterForm() {
  const params = useSearchParams();
  const router = useRouter();
  const kind = params.get('as') === 'agency' ? 'agency' : 'investor';

  return (
    <AuthShell
      wide
      title={kind === 'agency' ? 'Register your agency' : 'Create an investor account'}
      description={
        kind === 'agency'
          ? 'List your properties in front of investors worldwide. Four short steps.'
          : 'Save properties and contact agencies. Three short steps.'
      }
      footer={
        <>
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
            Sign in
          </Link>
        </>
      }
    >
      <Tabs value={kind} onValueChange={(v) => router.replace(v === 'agency' ? '/register?as=agency' : '/register')} className="mb-7">
        <TabsList className="w-full">
          <TabsTrigger value="investor">I invest</TabsTrigger>
          <TabsTrigger value="agency">I represent an agency</TabsTrigger>
        </TabsList>
      </Tabs>
      {/* Separate components so switching account type starts a clean form */}
      {kind === 'agency' ? <AgencyRegister key="agency" /> : <InvestorRegister key="investor" />}
    </AuthShell>
  );
}
