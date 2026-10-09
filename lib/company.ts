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

/** PLACEHOLDERS: invented agency names for the partner strip, until real partners have agreed to be shown. */
export const PARTNERS = ['Atlântico Homes', 'Carpathia Realty', 'Costa Blanca Living', 'Aegean Keys', 'Marina Gate Properties', 'Table Bay Estates', 'Siam Urban', 'Riviera Maya Casas'] as const;

/** PLACEHOLDERS: invented quotes for the design. Replace with real, attributed ones or remove the section. */
export const TESTIMONIALS = [
  {
    quote: 'I compared a flat in Valencia with one in Cluj in ten minutes. Same numbers, same layout, no spreadsheets.',
    name: 'Elena P.',
    role: 'Private investor',
    audience: 'investor',
  },
  {
    quote: 'The inquiries we get are from people who already know the yield and the price. The first call is about viewing dates.',
    name: 'Rui M.',
    role: 'Agency owner, Porto',
    audience: 'agency',
  },
  {
    quote: 'Asking about the tax rules and getting the official page back, with the paragraph marked, saved me a week.',
    name: 'Jonas K.',
    role: 'Private investor',
    audience: 'investor',
  },
] as const;
