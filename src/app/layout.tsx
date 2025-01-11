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
  preload: true,
  fallback: ['serif'],
  adjustFontFallback: true,
});

const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cormorant',
  preload: true,
  weight: ['300', '400', '500', '600', '700'],
  fallback: ['serif'],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://joys-hypnose.com'),
  title: {
    default: "Joy's Hypnose | Hypnothérapie à Casablanca",
    template: "%s | Joy's Hypnose"
  },
  description: "Découvrez l'hypnothérapie à Casablanca avec Joy's Hypnose. Séances personnalisées pour stress, anxiété, confiance en soi et développement personnel.",
  keywords: ["hypnothérapie", "casablanca", "hypnose", "thérapie", "bien-être", "développement personnel", "stress", "anxiété"],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://joys-hypnose.com',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://joys-hypnose.com',
    title: "Joy's Hypnose | Hypnothérapie à Casablanca",
    description: "Découvrez l'hypnothérapie à Casablanca avec Joy's Hypnose. Séances personnalisées pour stress, anxiété, confiance en soi et développement personnel.",
    siteName: "Joy's Hypnose",
  },
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
      <head>
        <meta name="google-site-verification" content="4jTYDU4kW_qD5ZkChniG6z1N7Ckjx7EBLMnVITkJKuo" />
      </head>
      <body className={cormorant.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
} 