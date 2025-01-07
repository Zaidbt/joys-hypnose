import React from "react";
import { 
  Playfair_Display,
  Cormorant_Garamond,
} from "next/font/google";
import type { Metadata } from 'next';
import ClientLayout from './ClientLayout';
import "./globals.css";

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  preload: false,
  fallback: ['serif'],
  adjustFontFallback: true,
});

const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cormorant',
  preload: false,
  weight: ['300', '400', '500', '600', '700'],
  fallback: ['serif'],
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
    <html lang="fr" className={`${playfair.variable} ${cormorant.variable}`}>
      <body className={cormorant.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
} 