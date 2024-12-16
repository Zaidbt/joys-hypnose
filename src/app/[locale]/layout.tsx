import React from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from 'next-intl';
import { 
  Playfair_Display,
  Cormorant_Garamond,
} from "next/font/google";
import type { Metadata } from 'next';
import ClientLayout from '../ClientLayout';
import "../globals.css";

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  preload: true,
  fallback: ['serif'],
  adjustFontFallback: true,
  weight: ['400', '500', '600', '700'],
});

const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cormorant',
  preload: true,
  weight: ['300', '400', '500', '600', '700'],
  fallback: ['serif'],
  adjustFontFallback: true,
  style: ['normal'],
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

async function getMessages(locale: string) {
  try {
    return (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
}

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages(locale);

  return (
    <html lang={locale} className={`${playfair.variable} ${cormorant.variable}`}>
      <body className={`${cormorant.className} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientLayout>{children}</ClientLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
} 