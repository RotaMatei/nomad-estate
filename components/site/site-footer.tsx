import { QuietLink as Link } from '@/components/site/quiet-link';
import { Logo } from './logo';

const LINKS = [
  {
    title: 'Investors',
    items: [
      { href: '/properties', label: 'Explore the globe' },
      { href: '/register', label: 'Create an investor account' },
      { href: '/login', label: 'Sign in' },
    ],
  },
  {
    title: 'Agencies',
    items: [
      { href: '/register?as=agency', label: 'List your properties' },
      { href: '/dashboard', label: 'Agency dashboard' },
    ],
  },
  {
    title: 'Company',
    items: [
      { href: '/about', label: 'About Nomad Estate' },
      { href: '/contact', label: 'Contact' },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] sm:px-8">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Investment property from verified agencies, on one globe. Yields and scores are estimates, not financial advice.
          </p>
        </div>
        {LINKS.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h2 className="text-sm font-semibold">{group.title}</h2>
            <ul className="mt-3 space-y-2">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t">
        <p className="mx-auto max-w-[1200px] px-5 py-5 text-xs text-muted-foreground sm:px-8">
          © {new Date().getFullYear()} Nomad Estate. Map data © OpenStreetMap contributors.
        </p>
      </div>
    </footer>
  );
}
