'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ImagePlus, Star, Trash2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm, type Path, type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import type { PropertyFormData } from '@/app/lib/property/types';
import { createProperty, updateProperty } from '@/app/lib/propertyApi';
import { INVESTMENT_GOAL_TAGS, LOCATION_BENEFIT_TAGS } from '@/app/enums';
import { LocationFields } from '@/components/auth/location-fields';
import { PropertyGlobe } from '@/components/globe';
import Stepper, { Step } from '@/components/reactbits/stepper';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useSession } from '@/hooks/use-session';
import { errorMessage } from '@/lib/auth/session';
import { useAgents } from '@/lib/dashboard/queries';
import { humanize, usePropertyDetails, type PropertyDetails } from '@/lib/properties/details';
import { BENEFIT_LABEL, GOAL_LABEL, PROPERTY_TYPES, PROPERTY_TYPE_LABEL } from '@/lib/properties/labels';
import type { Listing } from '@/lib/properties/types';
import { cn } from '@/lib/utils';

// Feature enums mirror prisma/schema.prisma (see app/components/createPropertyComponents/Enums.ts).
const FEATURES = {
  heatingSystem: ['Heating', ['CENTRAL', 'UNDERFLOOR', 'GAS', 'ELECTRIC']],
  coolingSystem: ['Cooling', ['AC', 'VENTILATION']],
  kitchen: ['Kitchen', ['FURNISHED', 'APPLIENCES']],
  security: ['Security', ['ALARM_SYSTEM', 'CAMERAS', 'GATED_ACCESS']],
  utility: ['Utilities', ['FIBER', 'CABLE', 'WATER', 'GAS', 'ELECTRICITY']],
  smartHomeFeature: ['Smart home', ['THERMOSTAT', 'LIGHTING', 'LOCKS']],
  otherFeature: ['Other', ['SWIMMING_POOL', 'SAUNA', 'JACUZZI', 'FIREPLACE', 'BBQ_AREA', 'OUTDOOR_KITCHEN']],
} as const;
type FeatureKey = keyof typeof FEATURES;
const FEATURE_KEYS = Object.keys(FEATURES) as FeatureKey[];
const FEATURE_LABEL: Record<string, string> = { AC: 'Air conditioning', APPLIENCES: 'Appliances included', BBQ_AREA: 'BBQ area' };
const featureLabel = (v: string) => FEATURE_LABEL[v] ?? humanize(v);

const STATUSES = ['ACTIVE', 'DRAFT', 'PENDING', 'INACTIVE'] as const;
const STATUS_LABEL: Record<(typeof STATUSES)[number], string> = { ACTIVE: 'Live on the globe', DRAFT: 'Draft', PENDING: 'Pending', INACTIVE: 'Hidden' };
const ORIENTATIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;
const ENERGY = ['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const;
const PARKING = ['NONE', 'GARAGE', 'DRIVEWAY', 'STREET_PARKING'] as const;
const BALCONY = ['NONE', 'BALCONY', 'TERRACE', 'BOTH'] as const;

const num = (what: string, min = 0) => z.number({ error: `Enter ${what}.` }).min(min, `${what[0].toUpperCase()}${what.slice(1)} cannot be below ${min}.`);
const optionalNum = z.number().min(0, 'This cannot be negative.').optional();
const strings = z.array(z.string());

const schema = z.object({
  title: z.string().trim().min(8, 'Write a title of at least 8 characters.').max(120, 'Keep the title under 120 characters.'),
  description: z.string().trim().min(40, 'Describe the property in at least 40 characters.').max(5000),
  type: z.enum(PROPERTY_TYPES, { error: 'Choose a property type.' }),
  status: z.enum(STATUSES),
  agentId: z.string().min(1, 'Choose the agent who handles inquiries.'),

  countryId: z.number({ error: 'Choose a country.' }).int().positive(),
  stateId: z.number().optional(),
  cityId: z.number({ error: 'Choose a city.' }).int().positive(),
  streetAddress: z.string().trim().min(1, 'Enter the street address.'),
  postalCode: z.string().trim(),
  latitude: z.number({ error: 'Enter the latitude.' }).min(-90, 'Latitude runs from -90 to 90.').max(90, 'Latitude runs from -90 to 90.'),
  longitude: z.number({ error: 'Enter the longitude.' }).min(-180, 'Longitude runs from -180 to 180.').max(180, 'Longitude runs from -180 to 180.'),

  price: num('the price', 1),
  yield: z.number({ error: 'Enter the expected gross yield.' }).min(0).max(100, 'Yield is a percentage, 100 at most.'),
  totalArea: num('the total area', 1),
  builtArea: optionalNum,
  landArea: optionalNum,
  rooms: num('the number of rooms', 1),
  bedrooms: num('the number of bedrooms'),
  bathrooms: num('the number of bathrooms'),
  floorLevel: num('the floor level'),
  floors: optionalNum,
  constructionDate: z.string(),
  availabilityDateStart: z.string(),
  energyEfficiencyRating: z.enum(ENERGY),
  orientation: z.enum(ORIENTATIONS, { error: 'Choose an orientation.' }),
  parking: z.enum(PARKING),
  balconyType: z.enum(BALCONY),
  propertyTaxes: optionalNum,
  HOAFees: optionalNum,

  heatingSystem: strings,
  coolingSystem: strings,
  kitchen: strings,
  security: strings,
  utility: strings,
  smartHomeFeature: strings,
  otherFeature: strings,
  investmentGoalTag: strings,
  locationBenefitTag: strings,

  images: z.array(z.string().url()).min(1, 'Add at least one photo.').max(20, 'Twenty photos at most.'),
});
type Values = z.infer<typeof schema>;
type F = UseFormReturn<Values>;

const STEPS: Path<Values>[][] = [
  ['title', 'description', 'type', 'status', 'agentId'],
  ['countryId', 'stateId', 'cityId', 'streetAddress', 'postalCode', 'latitude', 'longitude'],
  ['price', 'yield', 'totalArea', 'builtArea', 'landArea', 'rooms', 'bedrooms', 'bathrooms', 'floorLevel', 'floors', 'constructionDate', 'availabilityDateStart', 'energyEfficiencyRating', 'orientation', 'parking', 'balconyType', 'propertyTaxes', 'HOAFees'],
  [...FEATURE_KEYS, 'investmentGoalTag', 'locationBenefitTag'],
  ['images'],
];
const STEP_TITLES = ['Basics', 'Location', 'Details and numbers', 'Features and tags', 'Photos'];

const EMPTY: Partial<Values> = {
  title: '',
  description: '',
  status: 'ACTIVE',
  agentId: '',
  streetAddress: '',
  postalCode: '',
  constructionDate: '',
  availabilityDateStart: '',
  energyEfficiencyRating: 'C',
  parking: 'NONE',
  balconyType: 'NONE',
  heatingSystem: [],
  coolingSystem: [],
  kitchen: [],
  security: [],
  utility: [],
  smartHomeFeature: [],
  otherFeature: [],
  investmentGoalTag: [],
  locationBenefitTag: [],
  images: [],
};

const toNumber = (v: unknown) => {
  const n = typeof v === 'string' ? Number(v) : typeof v === 'number' ? v : NaN;
  return Number.isFinite(n) ? n : undefined;
};
const day = (v: unknown) => (typeof v === 'string' && v ? v.slice(0, 10) : '');
const pick = <T extends string>(v: unknown, allowed: readonly T[], fallback?: T) => (allowed.includes(v as T) ? (v as T) : fallback);

/** Existing property → form values (edit mode). */
function fromDetails(d: PropertyDetails): Partial<Values> {
  const r = d.raw as unknown as Record<string, unknown>;
  const feature = (key: FeatureKey) => ((r[key] as Record<string, unknown>[] | undefined) ?? []).map((row) => row[key]).filter((v): v is string => typeof v === 'string');
  return {
    ...EMPTY,
    title: d.listing.title,
    description: (r.description as string) ?? '',
    type: d.listing.type ?? undefined,
    status: pick(r.status, STATUSES, 'ACTIVE'),
    agentId: (r.agentId as string) ?? '',
    countryId: d.listing.countryId ?? undefined,
    stateId: toNumber(r.stateId),
    cityId: d.listing.cityId ?? undefined,
    streetAddress: (r.streetAddress as string) ?? '',
    postalCode: (r.postalCode as string) ?? '',
    latitude: d.listing.lat ?? undefined,
    longitude: d.listing.lng ?? undefined,
    price: d.listing.price,
    yield: d.listing.yieldPct,
    totalArea: d.listing.area,
    builtArea: toNumber(r.builtArea),
    landArea: toNumber(r.landArea),
    rooms: toNumber(r.rooms),
    bedrooms: d.listing.bedrooms,
    bathrooms: d.listing.bathrooms,
    floorLevel: toNumber(r.floorLevel) ?? 0,
    floors: toNumber(r.floors),
    constructionDate: day(r.constructionDate),
    availabilityDateStart: day(r.availabilityDateStart),
    energyEfficiencyRating: pick(r.energyEfficiencyRating, ENERGY, 'C'),
    orientation: pick(r.orientation, ORIENTATIONS),
    parking: pick(r.parking, PARKING, 'NONE'),
    balconyType: pick(r.balconyType, BALCONY, 'NONE'),
    propertyTaxes: d.taxes ?? undefined,
    HOAFees: d.hoaFees ?? undefined,
    ...Object.fromEntries(FEATURE_KEYS.map((k) => [k, feature(k)])),
    investmentGoalTag: d.listing.goals,
    locationBenefitTag: d.listing.benefits,
    images: d.pictures.map((p) => p.imageData).filter((u) => /^https?:\/\//i.test(u)),
  };
}

// ── page shells ───────────────────────────────────────────────────────────────
function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto min-h-[70vh] w-full max-w-[820px] px-5 pt-6 pb-20 sm:px-8">
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-4 rounded-full text-muted-foreground">
          <Link href="/dashboard">
            <ArrowLeft aria-hidden /> Back to the dashboard
          </Link>
        </Button>
        <h1 className="font-display text-3xl font-semibold">{title}</h1>
        <div className="mt-8">{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}

function NotAllowed({ title, body }: { title: string; body: string }) {
  return (
    <Empty className="rounded-xl border py-16">
      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{body}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild>
          <Link href="/dashboard">Open the dashboard</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}

export function NewPropertyPage() {
  const { session } = useSession();
  return (
    <Shell title="Add a property">
      {session?.isAgency ? <PropertyForm agencyId={session.id} defaults={EMPTY} /> : <NotAllowed title="Sign in as an agency" body="Only agency accounts can add properties." />}
    </Shell>
  );
}

export function EditPropertyPage({ id }: { id: string }) {
  const { session } = useSession();
  const { data, isLoading, isError } = usePropertyDetails(id);
  const defaults = React.useMemo(() => (data ? fromDetails(data) : null), [data]);
  const owner = !!session?.isAgency && !!data && (data.raw.agencyId == null || data.raw.agencyId === session.id);

  return (
    <Shell title="Edit property">
      {!session?.isAgency ? (
        <NotAllowed title="Sign in as an agency" body="Only the agency that listed a property can edit it." />
      ) : isLoading ? (
        <Skeleton className="h-96 w-full rounded-xl" />
      ) : isError || !defaults ? (
        <NotAllowed title="This property did not load" body="It may have been deleted, or the server did not answer." />
      ) : !owner ? (
        <NotAllowed title="This property belongs to another agency" body="You can edit the properties listed by your own agency." />
      ) : (
        <PropertyForm agencyId={session.id} defaults={defaults} propertyId={id} />
      )}
    </Shell>
  );
}

// ── the form ──────────────────────────────────────────────────────────────────
function PropertyForm({ agencyId, defaults, propertyId }: { agencyId: string; defaults: Partial<Values>; propertyId?: string }) {
  const router = useRouter();
  const client = useQueryClient();
  const [busy, setBusy] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const form = useForm<Values>({ resolver: zodResolver(schema), mode: 'onTouched', defaultValues: defaults });

  const submit = async (): Promise<boolean> => {
    if (!(await form.trigger())) return false;
    const v = form.getValues();
    setBusy(true);
    try {
      const payload: PropertyFormData = { ...v, agencyId } as unknown as PropertyFormData;
      const saved = propertyId ? await updateProperty(propertyId, payload) : await createProperty(payload);
      await Promise.all([
        client.invalidateQueries({ queryKey: ['portfolio'] }),
        client.invalidateQueries({ queryKey: ['property-search'] }),
        client.invalidateQueries({ queryKey: ['property-details'] }),
      ]);
      toast.success(propertyId ? 'Changes saved' : 'Property added');
      const id = propertyId ?? (saved as { id?: string } | undefined)?.id;
      router.push(id ? `/details/${id}` : '/dashboard');
      return true;
    } catch (e) {
      toast.error(errorMessage(e, 'The property was not saved. Your entries are still in the form, so try again in a moment.'));
      return false;
    } finally {
      setBusy(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()} noValidate className="rounded-xl border bg-card p-5 sm:p-8">
        <p className="mb-5 text-sm text-muted-foreground" aria-live="polite">
          Step {Math.min(step, STEPS.length)} of {STEPS.length}: <span className="font-medium text-foreground">{STEP_TITLES[Math.min(step, STEPS.length) - 1]}</span>
        </p>
        <Stepper
          onStepChange={setStep}
          onBeforeNext={(s) => (s === STEPS.length ? submit() : form.trigger(STEPS[s - 1]))}
          completeButtonText={busy ? 'Saving' : propertyId ? 'Save changes' : 'Publish property'}
          nextButtonProps={{ disabled: busy }}
        >
          <Step>
            <Basics form={form} agencyId={agencyId} />
          </Step>
          <Step>
            <LocationStep form={form} />
          </Step>
          <Step>
            <Details form={form} />
          </Step>
          <Step>
            <FeaturesStep form={form} />
          </Step>
          <Step>
            <Photos form={form} />
          </Step>
        </Stepper>
      </form>
    </Form>
  );
}

function Text({ form, name, label, description, number, className, ...input }: { form: F; name: Path<Values>; label: string; description?: string; number?: boolean } & Omit<React.ComponentProps<typeof Input>, 'name' | 'form'>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...(number ? { type: 'number', inputMode: 'decimal' as const, step: 'any' } : {})}
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

function Choice({ form, name, label, options, labels, placeholder }: { form: F; name: Path<Values>; label: string; options: readonly string[]; labels?: (v: string) => string; placeholder?: string }) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select value={(field.value as string | undefined) ?? ''} onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o} value={o}>
                  {labels ? labels(o) : humanize(o)}
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

function Chips({ form, name, label, options, labels }: { form: F; name: Path<Values>; label: string; options: readonly string[]; labels: (v: string) => string }) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const selected = (field.value as string[]) ?? [];
        return (
          <FormItem>
            <fieldset>
              <legend className="mb-2 text-sm font-medium">{label}</legend>
              <div className="flex flex-wrap gap-2">
                {options.map((o) => {
                  const on = selected.includes(o);
                  return (
                    <button
                      key={o}
                      type="button"
                      aria-pressed={on}
                      onClick={() => field.onChange(on ? selected.filter((x) => x !== o) : [...selected, o])}
                      className={cn('h-8 rounded-full border px-3 text-sm transition-colors', on ? 'border-foreground bg-foreground text-background' : 'border-border hover:bg-accent')}
                    >
                      {labels(o)}
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

function Basics({ form, agencyId }: { form: F; agencyId: string }) {
  const { agents, isLoading } = useAgents(agencyId);
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Text form={form} name="title" label="Title" placeholder="Two-bedroom apartment near the harbour, Porto" className="sm:col-span-2" />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem className="sm:col-span-2">
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea rows={5} placeholder="Condition, rental history, what is nearby, why it suits an investor." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Choice form={form} name="type" label="Property type" options={PROPERTY_TYPES} labels={(v) => PROPERTY_TYPE_LABEL[v as keyof typeof PROPERTY_TYPE_LABEL]} placeholder="Choose a type" />
      <Choice form={form} name="status" label="Visibility" options={STATUSES} labels={(v) => STATUS_LABEL[v as keyof typeof STATUS_LABEL]} />
      <FormField
        control={form.control}
        name="agentId"
        render={({ field }) => (
          <FormItem className="sm:col-span-2">
            <FormLabel>Agent for inquiries</FormLabel>
            <Select value={field.value ?? ''} onValueChange={field.onChange} disabled={isLoading || agents.length === 0}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={isLoading ? 'Loading agents' : agents.length === 0 ? 'No agents yet' : 'Choose an agent'} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {agents.map((a) => (
                  <SelectItem key={a.userId} value={a.userId}>
                    {[a.user?.firstName, a.user?.lastName].filter(Boolean).join(' ') || a.user?.email || a.userId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!isLoading && agents.length === 0 && (
              <FormDescription>
                A property needs an agent.{' '}
                <Link href="/dashboard#agents-title" className="font-medium text-foreground underline underline-offset-4">
                  Add one on the dashboard
                </Link>{' '}
                first.
              </FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function LocationStep({ form }: { form: F }) {
  const { resolvedTheme } = useTheme();
  const lat = form.watch('latitude');
  const lng = form.watch('longitude');
  const valid = typeof lat === 'number' && typeof lng === 'number' && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
  const pin = React.useMemo<Listing[]>(
    () => (valid ? [{ id: 'draft', title: 'Draft', lat, lng } as Listing] : []),
    [valid, lat, lng],
  );
  return (
    <div className="grid gap-4">
      <LocationFields form={form} />
      <div className="grid gap-4 sm:grid-cols-[1fr_10rem]">
        <Text form={form} name="streetAddress" label="Street address" autoComplete="off" />
        <Text form={form} name="postalCode" label="Postal code" autoComplete="off" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Text form={form} name="latitude" label="Latitude" number placeholder="41.1579" description="Decimal degrees. North is positive." />
        <Text form={form} name="longitude" label="Longitude" number placeholder="-8.6291" description="Decimal degrees. East is positive." />
      </div>
      <div className="h-64 overflow-hidden rounded-lg border">
        {valid ? (
          <PropertyGlobe key={`${lat.toFixed(3)},${lng.toFixed(3)}`} listings={pin} selectedId="draft" theme={resolvedTheme === 'dark' ? 'dark' : 'light'} initialView={{ center: [lng, lat], zoom: 12 }} />
        ) : (
          <p className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">Enter the coordinates to check the pin on the map.</p>
        )}
      </div>
    </div>
  );
}

function Details({ form }: { form: F }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Text form={form} name="price" label="Price (USD)" number min={0} />
      <Text form={form} name="yield" label="Gross yield (%)" number min={0} max={100} />
      <Text form={form} name="totalArea" label="Total area (m²)" number min={0} />
      <Text form={form} name="builtArea" label="Built area (m²)" number min={0} />
      <Text form={form} name="landArea" label="Land area (m²)" number min={0} />
      <Text form={form} name="rooms" label="Rooms" number min={0} step={1} />
      <Text form={form} name="bedrooms" label="Bedrooms" number min={0} step={1} />
      <Text form={form} name="bathrooms" label="Bathrooms" number min={0} step={1} />
      <Text form={form} name="floorLevel" label="Floor level" number min={0} step={1} description="0 for ground floor." />
      <Text form={form} name="floors" label="Floors in the property" number min={0} step={1} />
      <Text form={form} name="constructionDate" label="Built on" type="date" />
      <Text form={form} name="availabilityDateStart" label="Available from" type="date" />
      <Choice form={form} name="energyEfficiencyRating" label="Energy rating" options={ENERGY} labels={(v) => v} />
      <Choice form={form} name="orientation" label="Orientation" options={ORIENTATIONS} labels={(v) => v} placeholder="Choose" />
      <Choice form={form} name="parking" label="Parking" options={PARKING} />
      <Choice form={form} name="balconyType" label="Outdoor space" options={BALCONY} />
      <Text form={form} name="propertyTaxes" label="Property tax per year (USD)" number min={0} />
      <Text form={form} name="HOAFees" label="Building fees per year (USD)" number min={0} />
    </div>
  );
}

function FeaturesStep({ form }: { form: F }) {
  return (
    <div className="grid gap-5">
      {FEATURE_KEYS.map((key) => (
        <Chips key={key} form={form} name={key} label={FEATURES[key][0]} options={FEATURES[key][1]} labels={featureLabel} />
      ))}
      <Chips form={form} name="investmentGoalTag" label="Investment goals it suits" options={INVESTMENT_GOAL_TAGS} labels={(v) => GOAL_LABEL[v as keyof typeof GOAL_LABEL] ?? humanize(v)} />
      <Chips form={form} name="locationBenefitTag" label="Location benefits" options={LOCATION_BENEFIT_TAGS} labels={(v) => BENEFIT_LABEL[v as keyof typeof BENEFIT_LABEL] ?? humanize(v)} />
    </div>
  );
}

// Uploads go to ImgBB from the browser, as before, but the key now comes from the environment instead of the source.
// Without a key the step still works with pasted image links. Server-side upload is planned for the Rust API (PROGRESS B4).
const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_KEY;

async function upload(file: File): Promise<string> {
  const body = new FormData();
  body.append('key', IMGBB_KEY ?? '');
  body.append('image', file);
  const res = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body });
  const json = (await res.json()) as { data?: { url?: string } };
  if (!res.ok || !json.data?.url) throw new Error('upload failed');
  return json.data.url;
}

function Photos({ form }: { form: F }) {
  const images = form.watch('images') ?? [];
  const [link, setLink] = React.useState('');
  const [uploading, setUploading] = React.useState(0);
  const set = (next: string[]) => form.setValue('images', next, { shouldValidate: true, shouldDirty: true });

  const addLink = () => {
    const url = link.trim();
    if (!/^https?:\/\/\S+$/i.test(url)) return void toast.error('Paste a full image link that starts with https://');
    if (!images.includes(url)) set([...images, url]);
    setLink('');
  };

  const onFiles = async (files: FileList | null) => {
    const picked = [...(files ?? [])].filter((f) => f.type.startsWith('image/'));
    if (picked.length === 0) return;
    const tooBig = picked.filter((f) => f.size > 10 * 1024 * 1024);
    if (tooBig.length) toast.error(`${tooBig.length === 1 ? 'One photo is' : `${tooBig.length} photos are`} over 10 MB and was skipped.`);
    const ok = picked.filter((f) => f.size <= 10 * 1024 * 1024);
    setUploading(ok.length);
    const results = await Promise.allSettled(ok.map(upload));
    setUploading(0);
    const urls = results.filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled').map((r) => r.value);
    const failed = results.length - urls.length;
    if (failed) toast.error(`${failed} of ${results.length} photos did not upload. Try those again.`);
    if (urls.length) set([...(form.getValues('images') ?? []), ...urls]);
  };

  return (
    <FormField
      control={form.control}
      name="images"
      render={() => (
        <FormItem>
          <FormLabel>Photos</FormLabel>
          <FormDescription>The first photo is the cover on the globe and in search results.</FormDescription>

          {images.length > 0 && (
            <ul className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {images.map((url, i) => (
                <li key={url} className="group relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted">
                  <Image src={url} alt={`Photo ${i + 1}`} fill unoptimized sizes="240px" className="object-cover" />
                  {i === 0 && <span className="absolute top-2 left-2 rounded-full bg-background/90 px-2 py-0.5 text-xs font-medium">Cover</span>}
                  <div className="absolute right-2 bottom-2 flex gap-1">
                    {i !== 0 && (
                      <Button type="button" size="icon" variant="secondary" className="size-8 rounded-full" aria-label={`Make photo ${i + 1} the cover`} onClick={() => set([url, ...images.filter((u) => u !== url)])}>
                        <Star aria-hidden />
                      </Button>
                    )}
                    <Button type="button" size="icon" variant="secondary" className="size-8 rounded-full" aria-label={`Remove photo ${i + 1}`} onClick={() => set(images.filter((u) => u !== url))}>
                      <Trash2 aria-hidden />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-3 grid gap-3">
            {IMGBB_KEY ? (
              <label className={cn('flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed p-6 text-center text-sm transition-colors hover:bg-accent/50', uploading > 0 && 'pointer-events-none opacity-60')}>
                <ImagePlus className="size-6 text-muted-foreground" aria-hidden />
                <span className="font-medium">{uploading > 0 ? `Uploading ${uploading} ${uploading === 1 ? 'photo' : 'photos'}` : 'Choose photos to upload'}</span>
                <span className="text-muted-foreground">JPEG, PNG or WebP, up to 10 MB each</span>
                <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => void onFiles(e.target.files).then(() => (e.target.value = ''))} />
              </label>
            ) : (
              <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">Photo upload is not set up on this site yet. Add photos by pasting their links below.</p>
            )}
            <div className="flex gap-2">
              <Input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addLink();
                  }
                }}
                placeholder="https://example.com/photo.jpg"
                aria-label="Image link"
              />
              <Button type="button" variant="secondary" onClick={addLink} disabled={!link.trim()}>
                Add photo link
              </Button>
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
