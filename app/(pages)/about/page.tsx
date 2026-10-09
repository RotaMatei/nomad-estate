import type { Metadata } from 'next';
import { Compass, Gauge, Handshake, ShieldCheck } from 'lucide-react';
import { QuietLink as Link } from '@/components/site/quiet-link';
import { Reveal, Tilt } from '@/components/site/reveal';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { Button } from '@/components/ui/button';
import { COMPANY, TEAM } from '@/lib/company';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'About',
  description: 'What Nomad Estate is, how its yield and investment score are worked out, and who is behind it.',
};

const PRINCIPLES = [
  {
    icon: Compass,
    title: 'One map for every market',
    body: 'A flat in Lisbon and a villa in Bali are shown the same way, with the same numbers, so they can be compared at a glance.',
  },
  {
    icon: Gauge,
    title: 'Numbers you can check',
    body: 'Gross yield is the yearly rent divided by the price. The investment score weighs yield, price against the local market, and the listing’s tags. No black box.',
  },
  {
    icon: Handshake,
    title: 'Agencies stay in charge',
    body: 'We list; the agency sells. Every inquiry goes straight to the agent on the ground, who handles viewings, paperwork and closing.',
  },
  {
    icon: ShieldCheck,
    title: 'Honest about what we do not know',
    body: 'Yields and scores are estimates. Answers about a country’s rules cite the official page they come from, or say there is none.',
  },
];

const MILESTONES = [
  ['2024', 'Nomad Estate is founded in Bucharest, with a list of listings and a spreadsheet of yields.'],
  ['2025', 'The globe replaces the list. First partner agencies in Portugal, Spain and Romania.'],
  ['2026', 'Search by description, price history and country answers arrive. Twelve countries on the map.'],
];

const TONE = {
  investor: 'bg-investor text-foreground',
  agency: 'bg-agency text-foreground',
  orchid: 'bg-orchid text-foreground',
} as const;

export default function AboutPage() {
  return (
    <>
      <SiteHeader variant="overlay" />
      <main>
        <section className="relative isolate overflow-hidden">
          <div className="liquid -z-10" aria-hidden>
            <i />
            <i />
            <i />
          </div>
          <div className="mx-auto max-w-[1200px] px-5 pt-40 pb-24 sm:px-8 lg:pt-48 lg:pb-32">
            <p className="text-sm font-medium tracking-[0.18em] uppercase">About Nomad Estate</p>
            <h1 className="font-display mt-5 max-w-4xl text-4xl leading-[1.05] font-semibold text-balance sm:text-6xl">
              Property is local. Looking for it should not be.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-foreground/75">
              Nomad Estate puts investment property from verified agencies on one globe, with the same yield and the same score on every listing,
              wherever it is.
            </p>
          </div>
        </section>

        <section aria-labelledby="principles-title" className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
          <h2 id="principles-title" className="font-display max-w-2xl text-3xl font-semibold text-balance sm:text-4xl">
            Four things we hold to
          </h2>
          <ol className="mt-12 grid gap-5 sm:grid-cols-2">
            {PRINCIPLES.map(({ icon: Icon, title, body }, i) => (
              <Reveal as="li" key={title} delay={i * 0.08}>
                <Tilt className="h-full rounded-2xl border bg-card p-7 sm:p-8">
                  <div className="flex items-center justify-between" style={{ transform: 'translateZ(28px)' }}>
                    <span className="flex size-11 items-center justify-center rounded-full bg-secondary">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="tabular text-sm text-muted-foreground">0{i + 1} / 04</span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold" style={{ transform: 'translateZ(18px)' }}>
                    {title}
                  </h3>
                  <p className="mt-2 text-muted-foreground">{body}</p>
                </Tilt>
              </Reveal>
            ))}
          </ol>
        </section>

        <section aria-labelledby="story-title" className="border-y bg-card">
          <div className="mx-auto grid max-w-[1200px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1.2fr] lg:py-28">
            <div>
              <h2 id="story-title" className="font-display text-3xl font-semibold text-balance sm:text-4xl">
                The short history
              </h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                The dates and names on this page are placeholders for the design and will be replaced with the real ones.
              </p>
            </div>
            <ol className="relative border-l pl-8">
              {MILESTONES.map(([year, text], i) => (
                <Reveal as="li" key={year} delay={i * 0.1} className="relative pb-10 last:pb-0">
                  <span aria-hidden className="absolute top-2 -left-[2.3rem] size-3 rounded-full bg-orchid-strong ring-4 ring-card" />
                  <p className="font-display tabular text-3xl font-semibold">{year}</p>
                  <p className="mt-2 max-w-lg text-muted-foreground">{text}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="team-title" className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
          <h2 id="team-title" className="font-display text-3xl font-semibold sm:text-4xl">
            The team
          </h2>
          <ul className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {TEAM.map((person, i) => (
              <Reveal as="li" key={person.name} delay={i * 0.06}>
                <div className="rounded-2xl border bg-card p-6">
                  <span className={cn('font-display flex size-14 items-center justify-center rounded-full text-lg font-semibold', TONE[person.audience])} aria-hidden>
                    {person.initials}
                  </span>
                  <p className="mt-5 font-semibold">{person.name}</p>
                  <p className="text-sm text-muted-foreground">{person.role}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </section>

        <section aria-labelledby="company-title" className="border-t bg-card">
          <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_2fr]">
            <h2 id="company-title" className="font-display text-2xl font-semibold">
              Company details
            </h2>
            <div>
              <dl className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
                {[
                  ['Legal name', COMPANY.legalName],
                  ['Founded', String(COMPANY.founded)],
                  ['Trade register', COMPANY.registration],
                  ['VAT number', COMPANY.vat],
                  ['Registered office', COMPANY.address.join(', ')],
                  ['General enquiries', COMPANY.email],
                ].map(([label, value]) => (
                  <div key={label} className="border-t pt-3">
                    <dt className="text-xs text-muted-foreground">{label}</dt>
                    <dd className="mt-0.5 font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
              <Button asChild className="mt-8 rounded-full">
                <Link href="/contact">Get in touch</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
