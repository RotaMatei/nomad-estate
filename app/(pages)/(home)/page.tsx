import { Building2, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { FeaturedMarkets, HomeHero, HomeStatsBand } from '@/components/home/home-client';
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
        <HomeStatsBand />

        <section aria-labelledby="paths-title" className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
          <h2 id="paths-title" className="font-display max-w-xl text-3xl font-semibold text-balance sm:text-4xl">
            Built for the people on both sides of a deal
          </h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <article className="flex flex-col rounded-xl border bg-card p-7 sm:p-9">
              <TrendingUp className="size-6 text-beacon" aria-hidden />
              <h3 className="mt-5 text-2xl font-semibold">Investors</h3>
              <p className="mt-2 text-muted-foreground">Find property abroad without opening forty browser tabs.</p>
              <ul className="mt-6 space-y-2.5 text-sm">
                <li>One search across every country on the platform</li>
                <li>Yield and score on every listing, so markets are comparable</li>
                <li>A shortlist of saved properties that follows your account</li>
              </ul>
              <div className="mt-auto pt-8">
                <Button asChild className="rounded-full">
                  <Link href="/properties">Find a property</Link>
                </Button>
              </div>
            </article>
            <article className="flex flex-col rounded-xl border bg-foreground p-7 text-background sm:p-9">
              <Building2 className="size-6 text-primary" aria-hidden />
              <h3 className="mt-5 text-2xl font-semibold">Agencies</h3>
              <p className="mt-2 text-background/70">Put your portfolio in front of investors who are already looking abroad.</p>
              <ul className="mt-6 space-y-2.5 text-sm">
                <li>List properties with photos, features and investment tags</li>
                <li>See views, saves and leads for each listing</li>
                <li>Add your agents and manage inquiries in one dashboard</li>
              </ul>
              <div className="mt-auto pt-8">
                <Button asChild className="rounded-full">
                  <Link href="/register?as=agency">Register your agency</Link>
                </Button>
              </div>
            </article>
          </div>
        </section>

        <section aria-labelledby="how-title" className="border-y bg-card">
          <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
            <h2 id="how-title" className="font-display text-3xl font-semibold sm:text-4xl">
              How it works
            </h2>
            <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
              {STEPS.map((step, i) => (
                <li key={step.title} className="border-t pt-6">
                  <span className="font-display tabular text-5xl font-semibold text-beacon">{i + 1}</span>
                  <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-muted-foreground">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <FeaturedMarkets />
      </main>
      <SiteFooter />
    </>
  );
}
