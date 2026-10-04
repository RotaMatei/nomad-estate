'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Building2, Expand, Globe, Mail, Phone, SearchX } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { PropertyGlobe } from '@/components/globe';
import { ListingFacts, ListingImage, ListingPlace, SaveButton, ScoreRing } from '@/components/properties/listing-parts';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useSession } from '@/hooks/use-session';
import { canOptimise } from '@/lib/image-hosts.mjs';
import { errorStatus } from '@/lib/auth/session';
import { CONTACT_METHODS, CONTACT_METHOD_LABEL, humanize, sendInquiry, usePropertyDetails, type PropertyDetails } from '@/lib/properties/details';
import { DEFAULT_FILTERS } from '@/lib/properties/filters';
import { formatArea, formatCoords, formatPrice, formatYield } from '@/lib/properties/format';
import { BENEFIT_LABEL, GOAL_LABEL, PROPERTY_TYPE_LABEL } from '@/lib/properties/labels';
import { usePropertySearch } from '@/lib/properties/queries';

export function PropertyDetailsView({ id }: { id: string }) {
  const { data, isLoading, isError, error, refetch } = usePropertyDetails(id);
  const notFound = errorStatus(error) === 404;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto min-h-[70vh] w-full max-w-[1200px] px-5 pt-6 pb-20 sm:px-8">
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-4 rounded-full text-muted-foreground">
          <Link href="/properties">
            <ArrowLeft aria-hidden /> Back to the globe
          </Link>
        </Button>

        {isLoading ? (
          <div aria-busy="true" aria-label="Loading property" className="space-y-6">
            <Skeleton className="aspect-[16/8] w-full rounded-xl" />
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        ) : isError || !data ? (
          <Empty className="py-24">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SearchX />
              </EmptyMedia>
              <EmptyTitle>{notFound ? 'This property is no longer listed' : 'This property did not load'}</EmptyTitle>
              <EmptyDescription>
                {notFound ? 'The agency may have sold or withdrawn it. Similar properties are on the globe.' : 'The server did not answer. Check your connection and try again.'}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="flex-row justify-center">
              {!notFound && <Button onClick={() => void refetch()}>Load the property again</Button>}
              <Button asChild variant={notFound ? 'default' : 'outline'}>
                <Link href="/properties">Explore the globe</Link>
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <Loaded details={data} />
        )}
      </main>
      <SiteFooter />
    </>
  );
}

function Loaded({ details }: { details: PropertyDetails }) {
  const { listing, raw, features, agency } = details;
  const { resolvedTheme } = useTheme();
  const coords = formatCoords(listing.lat, listing.lng);
  const tags = [...listing.goals.map((g) => GOAL_LABEL[g] ?? humanize(g)), ...listing.benefits.map((b) => BENEFIT_LABEL[b] ?? humanize(b))];

  const facts: [string, string | null][] = [
    ['Type', listing.type ? PROPERTY_TYPE_LABEL[listing.type] : null],
    ['Total area', formatArea(listing.area)],
    ['Rooms', raw.rooms != null ? String(raw.rooms) : null],
    ['Floor', raw.floorLevel != null ? String(raw.floorLevel) : null],
    ['Floors', raw.floors != null ? String(raw.floors) : null],
    ['Built', raw.constructionDate ? String(new Date(raw.constructionDate).getFullYear()) : null],
    ['Energy rating', raw.energyEfficiencyRating ?? null],
    ['Orientation', raw.orientation ? humanize(raw.orientation) : null],
    ['Parking', raw.parking && raw.parking !== 'NONE' ? humanize(raw.parking) : null],
    ['Outdoor space', raw.balconyType && raw.balconyType !== 'NONE' ? humanize(raw.balconyType) : null],
  ];

  return (
    <article className="overflow-x-clip">
      <Gallery details={details} />

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0 space-y-12">
          <header>
            <h1 className="font-display text-3xl leading-tight font-semibold text-balance sm:text-4xl">{listing.title}</h1>
            <ListingPlace listing={listing} className="mt-2 text-base" />
            <ListingFacts listing={listing} className="mt-4 text-sm" />
            {/* On phones the investment panel sits below the long content, so the two headline numbers are repeated here. */}
            <p className="tabular mt-5 flex items-baseline gap-4 lg:hidden">
              <span className="font-display text-3xl font-semibold">{formatPrice(listing.price)}</span>
              <span className="font-semibold text-positive">{formatYield(listing.yieldPct)} gross yield</span>
            </p>
          </header>

          {raw.description && (
            <section aria-labelledby="about-title">
              <h2 id="about-title" className="text-xl font-semibold">
                About this property
              </h2>
              <p className="mt-3 max-w-prose whitespace-pre-line text-muted-foreground">{raw.description}</p>
            </section>
          )}

          <section aria-labelledby="facts-title">
            <h2 id="facts-title" className="text-xl font-semibold">
              Key facts
            </h2>
            <dl className="mt-4 grid grid-cols-2 gap-x-8 border-t sm:grid-cols-3">
              {facts
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="border-b py-3">
                    <dt className="text-xs text-muted-foreground">{k}</dt>
                    <dd className="tabular mt-0.5 font-medium">{v}</dd>
                  </div>
                ))}
            </dl>
          </section>

          {features.length > 0 && (
            <section aria-labelledby="features-title">
              <h2 id="features-title" className="text-xl font-semibold">
                Features
              </h2>
              <dl className="mt-4 divide-y border-y">
                {features.map((group) => (
                  <div key={group.label} className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr]">
                    <dt className="text-sm text-muted-foreground">{group.label}</dt>
                    <dd>{group.items.join(', ')}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {tags.length > 0 && (
            <section aria-labelledby="tags-title">
              <h2 id="tags-title" className="text-xl font-semibold">
                Why investors look at it
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {tags.map((t) => (
                  <li key={t}>
                    <Badge variant="secondary" className="h-8 rounded-full px-3 text-sm font-normal">
                      {t}
                    </Badge>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {listing.lat != null && listing.lng != null && (
            <section aria-labelledby="location-title">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 id="location-title" className="text-xl font-semibold">
                  Location
                </h2>
                {coords && <span className="tabular text-sm text-muted-foreground">{coords}</span>}
              </div>
              {raw.streetAddress && <p className="mt-1 text-muted-foreground">{[raw.streetAddress, raw.postalCode, listing.cityName].filter(Boolean).join(', ')}</p>}
              <div className="mt-4 h-[360px] overflow-hidden rounded-xl border">
                <PropertyGlobe
                  listings={[listing]}
                  selectedId={listing.id}
                  theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
                  initialView={{ center: [listing.lng, listing.lat], zoom: 11 }}
                />
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <InvestmentPanel details={details} />
          <AgencyCard details={details} agencyName={agency?.companyName} />
        </aside>
      </div>

      <Similar details={details} />
    </article>
  );
}

function Gallery({ details }: { details: PropertyDetails }) {
  const { pictures, listing } = details;
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const [api, setApi] = React.useState<CarouselApi>();
  React.useEffect(() => {
    if (!api) return;
    const onSelect = () => setIndex(api.selectedScrollSnap());
    api.on('select', onSelect);
    return () => void api.off('select', onSelect);
  }, [api]);

  if (pictures.length === 0) return <ListingImage listing={listing} sizes="100vw" className="aspect-[16/8] w-full rounded-xl" />;

  const slides = (lightbox: boolean) =>
    pictures.map((p, i) => (
      <CarouselItem key={p.id}>
        <div className={lightbox ? 'relative h-[80vh] w-full' : 'relative aspect-[4/3] w-full sm:aspect-[16/8]'}>
          <Image
            src={p.imageData}
            alt={p.altText || `${listing.title}, photo ${i + 1} of ${pictures.length}`}
            fill
            unoptimized={!canOptimise(p.imageData)}
            priority={i === 0 && !lightbox}
            sizes={lightbox ? '100vw' : '(max-width: 1200px) 100vw, 1200px'}
            className={lightbox ? 'object-contain' : 'object-cover'}
          />
        </div>
      </CarouselItem>
    ));

  return (
    <div className="relative">
      <Carousel setApi={setApi} opts={{ loop: pictures.length > 1 }} aria-label="Property photos" className="overflow-hidden rounded-xl bg-muted">
        <CarouselContent className="ml-0 [&>*]:pl-0">{slides(false)}</CarouselContent>
        {pictures.length > 1 && (
          <>
            <CarouselPrevious className="left-3 bg-background/85 backdrop-blur" />
            <CarouselNext className="right-3 bg-background/85 backdrop-blur" />
          </>
        )}
      </Carousel>
      <div className="absolute right-3 bottom-3 flex items-center gap-2">
        <span className="tabular rounded-full bg-background/85 px-2.5 py-1 text-xs backdrop-blur" aria-live="polite">
          {index + 1} / {pictures.length}
        </span>
        <Button variant="secondary" size="sm" className="rounded-full bg-background/85 backdrop-blur hover:bg-background" onClick={() => setOpen(true)}>
          <Expand aria-hidden /> View full screen
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[min(96vw,1400px)] border-0 bg-background p-2 sm:max-w-[min(96vw,1400px)]">
          <DialogTitle className="sr-only">Photos of {listing.title}</DialogTitle>
          <DialogDescription className="sr-only">Use the arrow buttons or arrow keys to move between photos.</DialogDescription>
          <Carousel opts={{ loop: pictures.length > 1, startIndex: index }} className="overflow-hidden rounded-lg">
            <CarouselContent className="ml-0 [&>*]:pl-0">{slides(true)}</CarouselContent>
            {pictures.length > 1 && (
              <>
                <CarouselPrevious className="left-3" />
                <CarouselNext className="right-3" />
              </>
            )}
          </Carousel>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InvestmentPanel({ details }: { details: PropertyDetails }) {
  const { listing, taxes, hoaFees, pricePerM2 } = details;
  const grossRent = (listing.price * listing.yieldPct) / 100;
  const rows: [string, string][] = [
    ...(pricePerM2 ? [['Price per m²', formatPrice(pricePerM2)] as [string, string]] : []),
    ['Estimated rent per year', formatPrice(grossRent)],
    ...(taxes != null ? [['Property tax per year', formatPrice(taxes)] as [string, string]] : []),
    ...(hoaFees != null ? [['Building fees per year', formatPrice(hoaFees)] as [string, string]] : []),
  ];
  return (
    <section aria-label="Investment summary" className="rounded-xl border bg-card p-6">
      <p className="text-sm text-muted-foreground">Asking price</p>
      <p className="font-display tabular mt-1 text-4xl font-semibold">{formatPrice(listing.price)}</p>

      <div className="mt-5 flex items-center gap-5 border-y py-4">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">Gross yield</p>
          <p className="tabular text-2xl font-semibold text-positive">{formatYield(listing.yieldPct)}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Investment score</p>
            <p className="text-sm">out of 100</p>
          </div>
          <ScoreRing score={listing.score} className="size-12" />
        </div>
      </div>

      <dl className="mt-4 space-y-2.5 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="tabular font-medium">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-xs text-muted-foreground">Yield and score are estimates from the listing agency&apos;s figures. They are not financial advice.</p>

      <SaveButton listing={listing} withLabel className="mt-5 w-full" />
    </section>
  );
}

const inquirySchema = z.object({
  message: z.string().trim().min(20, 'Write at least 20 characters so the agency knows what you need.').max(2000, 'Keep the message under 2,000 characters.'),
  contactMethod: z.enum(CONTACT_METHODS),
});
type InquiryValues = z.infer<typeof inquirySchema>;

function AgencyCard({ details, agencyName }: { details: PropertyDetails; agencyName?: string }) {
  const { agency, raw, listing } = details;
  const { session } = useSession();
  const [sent, setSent] = React.useState(false);
  const form = useForm<InquiryValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { message: '', contactMethod: 'EMAIL' },
  });

  const onSubmit = async (values: InquiryValues) => {
    if (!session || !raw.agentId) return;
    try {
      await sendInquiry({ userId: session.id, propertyId: listing.id, agentId: raw.agentId, ...values });
      setSent(true);
      toast.success('Inquiry sent to the agency');
    } catch (e) {
      const status = errorStatus(e);
      toast.error(status === 409 ? 'You already sent an inquiry for this property. The agency will reply to that one.' : 'The inquiry was not sent. Try again in a moment.');
    }
  };

  return (
    <section aria-labelledby="agency-title" className="rounded-xl border bg-card p-6">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-full bg-secondary">
          <Building2 className="size-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">Listed by</p>
          <h2 id="agency-title" className="truncate font-semibold">
            {agencyName ?? 'Listing agency'}
          </h2>
        </div>
      </div>

      {agency && (
        <ul className="mt-4 space-y-2 text-sm">
          {agency.phoneNumber && (
            <li>
              <a href={`tel:${agency.phoneNumber}`} className="inline-flex items-center gap-2 hover:underline">
                <Phone className="size-4 text-muted-foreground" aria-hidden /> {agency.phoneNumber}
              </a>
            </li>
          )}
          {agency.email && (
            <li>
              <a href={`mailto:${agency.email}`} className="inline-flex items-center gap-2 break-all hover:underline">
                <Mail className="size-4 shrink-0 text-muted-foreground" aria-hidden /> {agency.email}
              </a>
            </li>
          )}
          {agency.companyWebsite && (
            <li>
              <a href={agency.companyWebsite} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 break-all hover:underline">
                <Globe className="size-4 shrink-0 text-muted-foreground" aria-hidden /> {agency.companyWebsite.replace(/^https?:\/\//, '')}
              </a>
            </li>
          )}
        </ul>
      )}

      <div className="mt-5 border-t pt-5">
        {sent ? (
          <p role="status" className="text-sm">
            Your inquiry is with the agency. They reply through your preferred contact method.
          </p>
        ) : !session ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Sign in to send this agency a message about the property.</p>
            <Button asChild className="w-full rounded-full">
              <Link href="/login">Sign in to contact the agency</Link>
            </Button>
          </div>
        ) : session.isAgency ? (
          <p className="text-sm text-muted-foreground">Inquiries are sent from investor accounts.</p>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message to the agency</FormLabel>
                    <FormControl>
                      <Textarea rows={4} placeholder="I would like to know about the rental history and arrange a viewing." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How should they reply?</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CONTACT_METHODS.map((m) => (
                          <SelectItem key={m} value={m}>
                            {CONTACT_METHOD_LABEL[m]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full rounded-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Sending' : 'Contact agency'}
              </Button>
            </form>
          </Form>
        )}
      </div>
    </section>
  );
}

function Similar({ details }: { details: PropertyDetails }) {
  const { listing } = details;
  const filters = React.useMemo(() => ({ ...DEFAULT_FILTERS, countries: listing.countryId != null ? [listing.countryId] : [], sort: 'score' as const }), [listing.countryId]);
  const { listings } = usePropertySearch(filters, { pins: false, enabled: listing.countryId != null });
  const similar = React.useMemo(
    () =>
      listings
        .filter((l) => l.id !== listing.id && l.countryId === listing.countryId)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3),
    [listings, listing.id, listing.countryId],
  );
  if (similar.length === 0) return null;

  return (
    <section aria-labelledby="similar-title" className="mt-20">
      <h2 id="similar-title" className="font-display text-2xl font-semibold">
        More in {listing.countryName ?? 'this country'}
      </h2>
      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {similar.map((l) => (
          <li key={l.id}>
            <Link href={`/details/${l.id}`} className="group block overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-float">
              <ListingImage listing={l} sizes="(max-width: 640px) 100vw, 380px" className="aspect-[16/10] w-full" />
              <div className="p-4">
                <h3 className="truncate font-medium group-hover:underline">{l.title}</h3>
                <ListingPlace listing={l} className="text-sm" />
                <div className="mt-3 flex items-end justify-between">
                  <span className="tabular text-lg font-semibold">{formatPrice(l.price)}</span>
                  <span className="tabular text-sm font-semibold text-positive">{formatYield(l.yieldPct)} yield</span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
