import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/archivo/wdth.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import 'leaflet/dist/leaflet.css';
import './globals.css';
import Providers from '@/app/providers';
import { ErrorBoundary } from '@/app/components/ErrorBoundary';

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
    { media: '(prefers-color-scheme: light)', color: '#eef2f6' },
    { media: '(prefers-color-scheme: dark)', color: '#0a1222' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
