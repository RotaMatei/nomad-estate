'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { Globe2, LayoutDashboard, LogOut, Menu, UserRound } from 'lucide-react';
import { Logo } from './logo';
import { ThemeToggle } from './theme-toggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useSession } from '@/hooks/use-session';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/properties', label: 'Explore the globe' },
  { href: '/register?as=agency', label: 'For agencies' },
];

/**
 * Floating glass header. `overlay` keeps it transparent-feeling over full-bleed content (the globe);
 * the default variant sits on the page background.
 */
export function SiteHeader({ variant = 'default' }: { variant?: 'default' | 'overlay' }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, signOut } = useSession();
  const [open, setOpen] = React.useState(false);

  const nav = session?.isAgency ? [...NAV.slice(0, 1), { href: '/dashboard', label: 'Dashboard' }] : NAV;

  return (
    <header
      className={cn(
        'pointer-events-none z-50 w-full px-3 pt-3 sm:px-5 sm:pt-4',
        variant === 'overlay' ? 'fixed inset-x-0 top-0' : 'sticky top-0',
      )}
    >
      <div className="glass shadow-float pointer-events-auto mx-auto flex h-14 max-w-[1440px] items-center gap-2 rounded-full pr-2 pl-4 sm:pl-5">
        <Link href="/" className="rounded-full focus-visible:outline-offset-4" aria-label="Nomad Estate home">
          <Logo />
        </Link>

        <nav aria-label="Main" className="ml-6 hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const active = pathname === item.href.split('?')[0];
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-full px-3.5 py-2 text-sm text-foreground/70 transition-colors hover:text-foreground',
                  active && 'bg-accent text-foreground',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 gap-2 rounded-full pr-3 pl-1.5">
                  <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {(session.name ?? 'N').slice(0, 1).toUpperCase()}
                  </span>
                  <span className="hidden max-w-32 truncate text-sm sm:inline">{session.name ?? 'Account'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="text-sm font-medium">{session.name ?? 'Signed in'}</div>
                  <div className="text-xs text-muted-foreground">{session.isAgency ? 'Agency account' : 'Investor account'}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {session.isAgency && (
                  <DropdownMenuItem onSelect={() => router.push('/dashboard')}>
                    <LayoutDashboard /> Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onSelect={() => router.push('/user')}>
                  <UserRound /> Profile & saved properties
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={async () => {
                    await signOut();
                    router.push('/');
                  }}
                >
                  <LogOut /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost" className="hidden rounded-full sm:inline-flex">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild className="hidden rounded-full sm:inline-flex">
                <Link href="/register">Create account</Link>
              </Button>
            </>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full md:hidden" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile" className="flex flex-col gap-1 px-4">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-base hover:bg-accent"
                  >
                    {item.href === '/properties' && <Globe2 className="size-4 text-beacon" />}
                    {item.label}
                  </Link>
                ))}
                {!session && (
                  <div className="mt-4 flex flex-col gap-2">
                    <Button asChild variant="outline" onClick={() => setOpen(false)}>
                      <Link href="/login">Sign in</Link>
                    </Button>
                    <Button asChild onClick={() => setOpen(false)}>
                      <Link href="/register">Create account</Link>
                    </Button>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
