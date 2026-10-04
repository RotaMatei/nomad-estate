'use client';

import { useQuery } from '@tanstack/react-query';
import { BadgeCheck, Heart, UserRound } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { toast } from 'sonner';
import { env } from '@/app/config/env';
import { getAgencyDetails, getUserProfile } from '@/app/lib/propertyApi';
import { ListingFacts, ListingImage, ListingPlace, SaveButton } from '@/components/properties/listing-parts';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession, type Session } from '@/hooks/use-session';
import { errorStatus, sendVerificationEmail } from '@/lib/auth/session';
import { formatPrice, formatYield } from '@/lib/properties/format';
import { useListingsByIds } from '@/lib/properties/queries';
import { useSavedProperties } from '@/lib/properties/saved';

export function ProfileView() {
  const { session } = useSession();
  return (
    <>
      <SiteHeader />
      <main className="mx-auto min-h-[70vh] w-full max-w-[1200px] px-5 pt-8 pb-20 sm:px-8">
        {!session ? (
          <Empty className="py-24">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <UserRound />
              </EmptyMedia>
              <EmptyTitle>Sign in to see your profile</EmptyTitle>
              <EmptyDescription>Your saved properties and account settings are kept with your account.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="flex-row justify-center">
              <Button asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/register">Create an account</Link>
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <Profile session={session} />
        )}
      </main>
      <SiteFooter />
    </>
  );
}

function ConfirmEmailButton() {
  const [state, setState] = React.useState<'idle' | 'sending' | 'sent'>('idle');
  if (state === 'sent') return <p className="mt-1 text-xs text-muted-foreground">Confirmation link sent. Check your inbox.</p>;
  return (
    <Button
      variant="link"
      size="sm"
      className="h-auto p-0 text-xs"
      disabled={state === 'sending'}
      onClick={async () => {
        setState('sending');
        try {
          await sendVerificationEmail();
          setState('sent');
        } catch (e) {
          const status = errorStatus(e);
          setState(status === 429 ? 'sent' : 'idle');
          if (status === 400) toast.success('This address is already confirmed.');
          else if (status === 503) toast.error('Confirmation emails are not available right now.');
          else if (status !== 429) toast.error('The email was not sent. Try again in a moment.');
        }
      }}
    >
      {state === 'sending' ? 'Sending the link' : 'Not confirmed yet. Send a confirmation link'}
    </Button>
  );
}

function Profile({ session }: { session: Session }) {
  const router = useRouter();
  const { signOut } = useSession();
  const kind = session.isAgency ? 'agency' : 'user';
  const profile = useQuery({
    queryKey: ['profile', kind, session.id],
    queryFn: async () => {
      if (session.isAgency) {
        const a = await getAgencyDetails(session.id);
        return a ? { name: a.companyName, email: a.email, phone: a.phoneNumber, extra: a.establishedYear ? `Founded in ${a.establishedYear}` : undefined, verified: (a as { emailVerified?: boolean }).emailVerified } : null;
      }
      const u = await getUserProfile(session.id);
      return u ? { name: [u.firstName, u.lastName].filter(Boolean).join(' '), email: u.email, phone: u.phoneNumber, extra: undefined, verified: u.emailVerified as boolean | undefined } : null;
    },
  });
  const name = profile.data?.name || session.name || 'Your account';

  return (
    <div className="grid gap-12 lg:grid-cols-[320px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-xl border bg-card p-6">
          <span className="flex size-14 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground" aria-hidden>
            {name.slice(0, 1).toUpperCase()}
          </span>
          <h1 className="font-display mt-4 text-2xl font-semibold break-words">{name}</h1>
          <p className="text-sm text-muted-foreground">{session.isAgency ? 'Agency account' : 'Investor account'}</p>

          {profile.isLoading ? (
            <Skeleton className="mt-5 h-12 w-full" />
          ) : (
            profile.data && (
              <dl className="mt-5 space-y-3 text-sm">
                {profile.data.email && (
                  <div>
                    <dt className="text-xs text-muted-foreground">Email</dt>
                    <dd className="flex items-center gap-1.5 break-all">
                      {profile.data.email}
                      {profile.data.verified && (
                        <>
                          <BadgeCheck className="size-4 shrink-0 text-positive" aria-hidden />
                          <span className="sr-only">confirmed</span>
                        </>
                      )}
                    </dd>
                    {env.apiFlavor === 'rust' && profile.data.verified === false && <ConfirmEmailButton />}
                  </div>
                )}
                {profile.data.phone && (
                  <div>
                    <dt className="text-xs text-muted-foreground">Phone</dt>
                    <dd className="tabular">{profile.data.phone}</dd>
                  </div>
                )}
                {profile.data.extra && <p className="text-muted-foreground">{profile.data.extra}</p>}
              </dl>
            )
          )}

          <div className="mt-6 flex flex-col gap-2 border-t pt-5">
            {session.isAgency && (
              <Button asChild className="rounded-full">
                <Link href="/dashboard">Open the dashboard</Link>
              </Button>
            )}
            <Button asChild variant="outline" className="rounded-full">
              <Link href={`/${kind}/changePassword`}>Change password</Link>
            </Button>
            <Button
              variant="ghost"
              className="rounded-full"
              onClick={async () => {
                await signOut();
                router.push('/');
              }}
            >
              Sign out
            </Button>
          </div>
        </div>
      </aside>

      {session.isAgency ? (
        <section aria-labelledby="agency-title">
          <h2 id="agency-title" className="font-display text-2xl font-semibold">
            Your listings live on the dashboard
          </h2>
          <p className="mt-2 max-w-prose text-muted-foreground">Add properties, manage agents and see how the portfolio is doing.</p>
          <Button asChild className="mt-5 rounded-full">
            <Link href="/dashboard">Open the dashboard</Link>
          </Button>
        </section>
      ) : (
        <SavedProperties />
      )}
    </div>
  );
}

function SavedProperties() {
  const { savedIds } = useSavedProperties();
  const { listings: saved, isLoading } = useListingsByIds(savedIds);

  return (
    <section aria-labelledby="saved-title" className="min-w-0">
      <h2 id="saved-title" className="font-display text-2xl font-semibold">
        Saved properties
        {saved.length > 0 && <span className="tabular ml-2 text-base font-normal text-muted-foreground">{saved.length}</span>}
      </h2>

      {isLoading ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      ) : saved.length === 0 ? (
        <Empty className="mt-6 rounded-xl border py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Heart />
            </EmptyMedia>
            <EmptyTitle>Nothing saved yet</EmptyTitle>
            <EmptyDescription>Save a property from the globe or its page and it is kept here for comparison.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/properties">Explore the globe</Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <ul className="mt-6 grid gap-5 sm:grid-cols-2">
          {saved.map((l) => (
            <li key={l.id} className="relative overflow-hidden rounded-lg border bg-card">
              <Link href={`/details/${l.id}`} className="group block">
                <ListingImage listing={l} sizes="(max-width: 640px) 100vw, 420px" className="aspect-[16/10] w-full" />
                <div className="p-4">
                  <h3 className="truncate font-medium group-hover:underline">{l.title}</h3>
                  <ListingPlace listing={l} className="text-sm" />
                  <div className="mt-3 flex items-end justify-between gap-3">
                    <div>
                      <span className="tabular block text-lg font-semibold">{formatPrice(l.price)}</span>
                      <ListingFacts listing={l} className="mt-1 text-xs" />
                    </div>
                    <span className="tabular text-sm font-semibold text-positive">{formatYield(l.yieldPct)} yield</span>
                  </div>
                </div>
              </Link>
              <SaveButton listing={l} className="absolute top-2 right-2 bg-background/85 backdrop-blur hover:bg-background" />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
