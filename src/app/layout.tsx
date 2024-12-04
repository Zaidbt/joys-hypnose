'use client';

import React from "react";
import { Playfair_Display, Quicksand } from "next/font/google";
import { usePathname } from 'next/navigation';
import SessionProvider from "./providers/SessionProvider";
import Header from "./components/Header";
import Footer from "./components/Footer";
import VisitTracker from "./components/VisitTracker";
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