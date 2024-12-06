'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import SessionProvider from "./providers/SessionProvider";
import Header from "./components/Header";
import Footer from "./components/Footer";
import VisitTracker from "./components/VisitTracker";
import WhatsAppButton from "./components/WhatsAppButton";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPanel = pathname?.startsWith('/joyspanel');

  return (
    <SessionProvider>
      <VisitTracker />
      {!isAdminPanel && <Header />}
      {children}
      {!isAdminPanel && (
        <>
          <Footer />
          <WhatsAppButton phoneNumber="+212660826028" />
        </>
      )}
    </SessionProvider>
  );
} 