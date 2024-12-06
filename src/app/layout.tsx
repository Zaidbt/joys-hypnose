import React from "react";
import { 
  Playfair_Display, 
  Quicksand,
} from "next/font/google";
import { usePathname } from 'next/navigation';
import SessionProvider from "./providers/SessionProvider";
import Header from "./components/Header";
import Footer from "./components/Footer";
import VisitTracker from "./components/VisitTracker";
import "./globals.css";
import type { Metadata } from 'next';

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
        url: '/favicon-32x32.png',
        type: 'image/png',
        sizes: '32x32',
      },
      {
        url: '/apple-touch-icon.png',
        type: 'image/png',
        sizes: '180x180',
      },
    ],
    apple: [
      {
        url: '/apple-touch-icon.png',
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
  const pathname = usePathname();
  const isAdminPanel = pathname?.startsWith('/joyspanel');

  return (
    <html lang="fr" className={`${playfair.variable} ${quicksand.variable}`}>
      <body className={quicksand.className}>
        <SessionProvider>
          <VisitTracker />
          {!isAdminPanel && <Header />}
          {children}
          {!isAdminPanel && <Footer />}
        </SessionProvider>
      </body>
    </html>
  );
} 