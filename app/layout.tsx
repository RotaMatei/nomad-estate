import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/archivo/wdth.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import './globals.css';
import Providers from '@/app/providers';
import { ErrorBoundary } from '@/components/site/error-boundary';
import { LogoMark } from '@/components/site/logo';

export const metadata: Metadata = {
  title: {
    default: 'Nomad Estate — Invest in property anywhere on Earth',
    template: '%s · Nomad Estate',
  },
  description:
    'Find investment properties worldwide on a live 3D globe. Compare yield, score and price across countries, then talk to the listing agency directly.',
  applicationName: 'Nomad Estate',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbf9fc' },
    { media: '(prefers-color-scheme: dark)', color: '#130f26' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* the loading screen plays once per tab: later page loads are marked before anything is painted */}
        <script
          dangerouslySetInnerHTML={{
            __html: "try{if(sessionStorage.getItem('nomad:seen')||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.dataset.seen='1';else sessionStorage.setItem('nomad:seen','1')}catch(e){}",
          }}
        />
      </head>
      <body>
        <div className="intro" aria-hidden="true">
          <div className="flex flex-col items-center gap-5">
            <LogoMark animated className="h-20" />
            <span className="intro-word font-display text-lg font-semibold">
              Nomad <span className="font-normal text-muted-foreground">Estate</span>
            </span>
          </div>
        </div>
        <div className="scroll-progress" aria-hidden="true" />
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
