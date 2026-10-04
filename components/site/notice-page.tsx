import Link from 'next/link';
import { SiteFooter } from './site-footer';
import { SiteHeader } from './site-header';
import { Button } from '@/components/ui/button';

/** Full-page notice for dead ends (404, not-yet-built sections): says what happened and where to go next. */
export function NoticePage({ code, title, body }: { code: string; title: string; body: string }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex min-h-[70vh] w-full max-w-[1200px] flex-col justify-center px-5 py-20 sm:px-8">
        <p className="font-display tabular text-7xl font-semibold text-beacon sm:text-8xl" aria-hidden>
          {code}
        </p>
        <h1 className="font-display mt-6 max-w-2xl text-3xl font-semibold text-balance sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">{body}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className="rounded-full">
            <Link href="/properties">Explore the globe</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/">Go to the home page</Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
