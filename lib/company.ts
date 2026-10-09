// Company details shown on the About and Contact pages.
// PLACEHOLDERS: every value below is invented for the design. Replace all of it before the site goes public.
export const COMPANY = {
  legalName: 'Nomad Estate Hub S.R.L.',
  founded: 2024,
  registration: 'J40/00000/2024',
  vat: 'RO00000000',
  email: 'hello@nomadestate.example',
  press: 'press@nomadestate.example',
  agencies: 'partners@nomadestate.example',
  phone: '+40 21 555 01 42',
  hours: 'Monday to Friday, 09:00 to 18:00 (Bucharest time)',
  address: ['Strada Exemplu 12, etaj 3', '010101 București', 'Romania'],
  /** Longitude, latitude of the office pin on the contact page's globe */
  location: [26.0963, 44.4396] as [number, number],
  social: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/example' },
    { label: 'Instagram', href: 'https://www.instagram.com/example' },
    { label: 'X', href: 'https://x.com/example' },
  ],
} as const;

export const TEAM = [
  { name: 'Ana Ionescu', role: 'Co-founder, product', initials: 'AI', audience: 'investor' },
  { name: 'Mihai Dobre', role: 'Co-founder, engineering', initials: 'MD', audience: 'orchid' },
  { name: 'Sofia Marques', role: 'Agency partnerships', initials: 'SM', audience: 'agency' },
  { name: 'Daniel Okafor', role: 'Market data', initials: 'DO', audience: 'investor' },
] as const;
