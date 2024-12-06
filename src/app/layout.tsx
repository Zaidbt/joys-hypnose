'use client';

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
import { metadata } from './metadata';

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

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPanel = pathname?.startsWith('/joyspanel');

  return (
    <html lang="fr" className={`${playfair.variable} ${quicksand.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
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