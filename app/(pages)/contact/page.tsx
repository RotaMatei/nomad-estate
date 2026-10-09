import type { Metadata } from 'next';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { ContactForm } from '@/components/contact/contact-form';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { COMPANY } from '@/lib/company';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Write to Nomad Estate: investors, agencies and press.',
};

export default function ContactPage() {
  const rows = [
    { icon: Mail, label: 'Email', value: COMPANY.email, href: `mailto:${COMPANY.email}` },
    { icon: Phone, label: 'Phone', value: COMPANY.phone, href: `tel:${COMPANY.phone.replace(/\s/g, '')}` },
    { icon: MapPin, label: 'Office', value: COMPANY.address.join(', ') },
    { icon: Clock, label: 'Hours', value: COMPANY.hours },
  ];
  return (
    <>
      <SiteHeader variant="overlay" />
      <main className="relative isolate overflow-hidden">
        <div className="liquid -z-10 h-[620px]" aria-hidden>
          <i />
          <i />
          <i />
        </div>
        <div className="mx-auto grid max-w-[1200px] gap-12 px-5 pt-40 pb-24 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:pt-48">
          <div>
            <p className="text-sm font-medium tracking-[0.18em] uppercase">Contact</p>
            <h1 className="font-display mt-5 text-4xl leading-[1.05] font-semibold text-balance sm:text-6xl">Talk to a person</h1>
            <p className="mt-6 max-w-md text-lg text-foreground/75">
              Questions about a listing go to its agency, from the listing’s page. For everything else, we are here.
            </p>

            <dl className="mt-12 space-y-6">
              {rows.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex gap-4">
                  <span className="glass flex size-11 shrink-0 items-center justify-center rounded-full">
                    <Icon className="size-4.5" aria-hidden />
                  </span>
                  <div>
                    <dt className="text-xs text-foreground/60">{label}</dt>
                    <dd className="font-medium">
                      {href ? (
                        <a href={href} className="underline decoration-foreground/25 underline-offset-4 hover:decoration-foreground">
                          {value}
                        </a>
                      ) : (
                        value
                      )}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            <dl className="mt-10 grid max-w-md grid-cols-2 gap-6 border-t border-foreground/10 pt-8 text-sm">
              <div>
                <dt className="text-foreground/60">Agencies</dt>
                <dd className="font-medium">{COMPANY.agencies}</dd>
              </div>
              <div>
                <dt className="text-foreground/60">Press</dt>
                <dd className="font-medium">{COMPANY.press}</dd>
              </div>
            </dl>
            <p className="mt-8 max-w-md text-xs text-muted-foreground">These contact details are placeholders for the design and are not real.</p>
          </div>

          <div className="lg:pt-6">
            <ContactForm />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
