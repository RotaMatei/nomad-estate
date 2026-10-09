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
      {/* the gradient runs behind the whole page and thins out towards the footer, so every line of the contact
          details sits on the same ground */}
      <main className="relative isolate overflow-hidden">
        <div className="liquid -z-10 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]" aria-hidden>
          <i />
          <i />
          <i />
        </div>
        <div className="mx-auto grid max-w-[1200px] gap-x-16 gap-y-14 px-5 pt-40 pb-28 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:pt-48 lg:pb-40">
          <div>
            <p className="text-sm font-medium tracking-[0.18em] uppercase">Contact</p>
            <h1 className="font-display mt-5 text-4xl leading-[1.05] font-semibold text-balance sm:text-6xl">Talk to a person</h1>
            <p className="mt-6 max-w-md text-lg text-foreground/75">
              Questions about a listing go to its agency, from the listing’s page. For everything else, we are here.
            </p>

            <dl className="glass mt-12 space-y-6 rounded-2xl p-6 sm:p-7">
              {rows.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary">
                    <Icon className="size-4.5" aria-hidden />
                  </span>
                  <div>
                    <dt className="text-xs text-muted-foreground">{label}</dt>
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

            <dl className="glass mt-5 grid gap-6 rounded-2xl p-6 text-sm sm:grid-cols-2 sm:p-7">
              <div>
                <dt className="text-xs text-muted-foreground">Agencies</dt>
                <dd className="font-medium">{COMPANY.agencies}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Press</dt>
                <dd className="font-medium">{COMPANY.press}</dd>
              </div>
            </dl>
            <p className="mt-6 max-w-md text-xs text-muted-foreground">These contact details are placeholders for the design and are not real.</p>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start lg:pt-6">
            <ContactForm />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
