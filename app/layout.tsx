import type { Metadata } from "next";
import '@fontsource/montserrat';
import "./globals.css";

export const metadata: Metadata = {
  title: 'Nomad Estate',
  description: 'A platform for nomadic real estate',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style>
          @import url({"https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"});
        </style>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}