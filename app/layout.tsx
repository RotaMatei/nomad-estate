import type { Metadata } from 'next';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import Providers from '@/app/providers';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nomad Estate',
  description: 'A platform for nomadic real estate',
  abstract:'This is a platform for nomadic real estate, providing users with access to properties and investment opportunities worldwide.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body className={montserrat.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
