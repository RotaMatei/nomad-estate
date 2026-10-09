import { ArrowUpRight, Building2, TrendingUp } from 'lucide-react';
import { HomeHero, HomeStatsBand } from '@/components/home/home-client';
import { MarketSkyline, MarketSnapshot, PlacesMarquee } from '@/components/home/home-extras';
import { CountryGuides, FeaturedListings, Newsletter, PartnerStrip, PriceDrops, Testimonials, YieldCalculator } from '@/components/home/home-more';
import { QuietLink as Link } from '@/components/site/quiet-link';
import { Reveal, Tilt, Words } from '@/components/site/reveal';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { Button } from '@/components/ui/button';

const STEPS = [
  {
    title: 'Search the globe',
    body: 'Spin to any country or filter by price, yield, score and property type. Every match lights up on the map.',
  },
  {
    title: 'Compare the numbers',
    body: 'Each listing shows its price, gross rental yield and an investment score out of 100, worked out the same way everywhere.',
  },
  {
    title: 'Contact the agency',
    body: 'Send an inquiry from the property page. It goes to the listing agency, which handles viewings and closing.',
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader variant="overlay" />
      <main>
        <HomeHero />
        <PlacesMarquee />
        <HomeStatsBand />
        <FeaturedListings />
        <PartnerStrip />
        <MarketSkyline />
        <MarketSnapshot />
        <YieldCalculator />
        <PriceDrops />

        <section aria-labelledby="paths-title" className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
          <Reveal>
            <p className="text-sm font-medium tracking-[0.18em] text-muted-foreground uppercase">03 / Two sides of a deal</p>
            <h2 id="paths-title" className="font-display mt-4 max-w-xl text-3xl font-semibold text-balance sm:text-4xl">
              Built for the people on both sides of a deal
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <Reveal>
              <Tilt className="audience-investor relative flex h-full flex-col overflow-hidden rounded-2xl bg-investor p-7 text-[#1e1b2e] sm:p-9">
                {/* a house floating above the card: the third dimension is the hover */}
                <TrendingUp className="absolute -top-6 -right-6 size-44 opacity-15" strokeWidth={1} aria-hidden style={{ transform: 'translateZ(50px)' }} />
                <span className="flex size-12 items-center justify-center rounded-full bg-white/60" style={{ transform: 'translateZ(36px)' }}>
                  <TrendingUp className="size-5" aria-hidden />
                </span>
                <h3 className="mt-6 text-2xl font-semibold" style={{ transform: 'translateZ(24px)' }}>
                  Investors
                </h3>
                <p className="mt-2 text-[#1e1b2e]/75">Find property abroad without opening forty browser tabs.</p>
                <ul className="mt-6 space-y-2.5 text-sm">
                  <li>One search across every country on the platform</li>
                  <li>Yield and score on every listing, so markets are comparable</li>
                  <li>A shortlist of saved properties that follows your account</li>
                </ul>
                <div className="mt-auto pt-8">
                  <Button asChild className="rounded-full bg-[#1e1b2e] text-white hover:bg-[#1e1b2e]/85">
                    <Link href="/properties">
                      Find a property <ArrowUpRight className="size-4" aria-hidden />
                    </Link>
                  </Button>
                </div>
              </Tilt>
            </Reveal>
            <Reveal delay={0.1}>
              <Tilt className="audience-agency relative flex h-full flex-col overflow-hidden rounded-2xl bg-agency p-7 text-[#1e1b2e] sm:p-9">
                <Building2 className="absolute -top-6 -right-6 size-44 opacity-15" strokeWidth={1} aria-hidden style={{ transform: 'translateZ(50px)' }} />
                <span className="flex size-12 items-center justify-center rounded-full bg-white/60" style={{ transform: 'translateZ(36px)' }}>
                  <Building2 className="size-5" aria-hidden />
                </span>
                <h3 className="mt-6 text-2xl font-semibold" style={{ transform: 'translateZ(24px)' }}>
                  Agencies
                </h3>
                <p className="mt-2 text-[#1e1b2e]/75">Put your portfolio in front of investors who are already looking abroad.</p>
                <ul className="mt-6 space-y-2.5 text-sm">
                  <li>List properties with photos, features and investment tags</li>
                  <li>See views, saves and leads for each listing</li>
                  <li>Add your agents and manage inquiries in one dashboard</li>
                </ul>
                <div className="mt-auto pt-8">
                  <Button asChild className="rounded-full bg-[#1e1b2e] text-white hover:bg-[#1e1b2e]/85">
                    <Link href="/register?as=agency">
                      Register your agency <ArrowUpRight className="size-4" aria-hidden />
                    </Link>
                  </Button>
                </div>
              </Tilt>
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="how-title" className="border-y bg-card">
          <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
            <Reveal>
              <p className="text-sm font-medium tracking-[0.18em] text-muted-foreground uppercase">04 / How it works</p>
              <h2 id="how-title" className="font-display mt-4 text-3xl font-semibold sm:text-4xl">
                From the whole planet to one front door
              </h2>
            </Reveal>
            <ol className="mt-12 grid gap-5 md:grid-cols-3">
              {STEPS.map((step, i) => (
                <Reveal as="li" key={step.title} delay={i * 0.1}>
                  <Tilt className="h-full rounded-2xl border bg-background p-7">
                    <span className="font-display text-liquid tabular block text-6xl font-semibold" style={{ transform: 'translateZ(40px)' }}>
                      0{i + 1}
                    </span>
                    <h3 className="mt-6 text-xl font-semibold" style={{ transform: 'translateZ(20px)' }}>
                      {step.title}
                    </h3>
                    <p className="mt-2 text-muted-foreground">{step.body}</p>
                  </Tilt>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        <CountryGuides />

        <section className="mx-auto max-w-[1200px] px-5 py-24 sm:px-8 lg:py-36">
          <p className="font-display max-w-5xl text-3xl leading-[1.15] font-semibold text-balance sm:text-5xl lg:text-6xl">
            <Words text="A home should be judged on its numbers, wherever it stands." highlight={['numbers,', 'stands.']} />
          </p>
        </section>

        <Testimonials />

        <section aria-labelledby="cta-title" className="px-3 pb-3 sm:px-5 sm:pb-5">
          <div className="relative isolate overflow-hidden rounded-3xl border">
            <div className="liquid -z-10" aria-hidden>
              <i />
              <i />
              <i />
            </div>
            <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-8 px-6 py-20 sm:px-10 lg:flex-row lg:items-end lg:justify-between lg:py-28">
              <h2 id="cta-title" className="font-display max-w-2xl text-4xl leading-[1.05] font-semibold text-balance sm:text-6xl">
                The globe is open. Take a look around.
              </h2>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="h-12 rounded-full bg-foreground px-6 text-background hover:bg-foreground/85">
                  <Link href="/properties">Explore the globe</Link>
                </Button>
                <Button asChild variant="outline" className="glass h-12 rounded-full px-6">
                  <Link href="/contact">Talk to us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <Newsletter />
      </main>
      <SiteFooter />
    </>
  );
}
