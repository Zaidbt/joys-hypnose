'use client';

import React from "react";
import { Inter } from "next/font/google";
import { usePathname } from 'next/navigation';
import SessionProvider from "./providers/SessionProvider";
import Header from "./components/Header";
import Footer from "./components/Footer";
import VisitTracker from "./components/VisitTracker";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPanel = pathname?.startsWith('/joyspanel');

  return (
    <html lang="fr">
      <body className={inter.className}>
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