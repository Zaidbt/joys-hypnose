import React from "react";
import { 
  Playfair_Display, 
  Raleway,
} from "next/font/google";
import type { Metadata } from 'next';
import ClientLayout from './ClientLayout';
import "./globals.css";

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  preload: true,
  fallback: ['serif'],
  adjustFontFallback: true,
});

const raleway = Raleway({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-raleway',
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "Joy's Hypnose | Hypnothérapie à Casablanca",
  description: "Découvrez l'hypnothérapie à Casablanca avec Joy's Hypnose. Séances personnalisées pour stress, anxiété, confiance en soi et plus encore.",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-icon.png',
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: "Joy's Hypnose",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${playfair.variable} ${raleway.variable}`}>
      <body className={raleway.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
} 