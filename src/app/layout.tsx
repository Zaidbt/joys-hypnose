import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SessionProvider from "./providers/SessionProvider";
import Header from "./components/Header";
import Footer from "./components/Footer";
import VisitTracker from "./components/VisitTracker";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Joys Hypnose - Thérapie",
  description: "Cabinet d'hypnothérapie à Genève",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <SessionProvider>
          <VisitTracker />
          <Header />
          {children}
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
} 