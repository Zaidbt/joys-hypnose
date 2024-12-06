import React from "react";
import { 
  Playfair_Display, 
  Quicksand,
} from "next/font/google";
import type { Metadata } from 'next';
import ClientLayout from './ClientLayout';
import "./globals.css";

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

const quicksand = Quicksand({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-quicksand',
});

export const metadata: Metadata = {
  title: "Joy's Hypnose | Hypnothérapie à Casablanca",
  description: "Découvrez l'hypnothérapie à Casablanca avec Joy's Hypnose. Séances personnalisées pour stress, anxiété, confiance en soi et plus encore.",
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
      {
        url: '/favicon-16x16.png',
        type: 'image/png',
        sizes: '16x16',
      },
      {
        url: '/icon.png',
        type: 'image/png',
        sizes: '32x32',
      },
    ],
    apple: [
      {
        url: '/apple-icon.png',
        type: 'image/png',
        sizes: '180x180',
      },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${playfair.variable} ${quicksand.variable}`}>
      <body className={quicksand.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
} 