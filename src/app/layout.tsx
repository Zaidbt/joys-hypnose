'use client';

import React from "react";
import { 
  Playfair_Display, 
  Quicksand,
  Roboto,
  Lora,
  Montserrat,
  Open_Sans,
  Raleway,
  Merriweather,
  Poppins,
  Nunito,
  Source_Sans_Pro,
  PT_Serif,
  Dancing_Script,
  Oswald,
  Ubuntu,
  Rubik,
  Mulish,
  Crimson_Text,
  Work_Sans,
  Inter
} from "next/font/google";
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

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lora',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
});

const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-raleway',
});

const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-merriweather',
});

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito',
});

const sourceSansPro = Source_Sans_Pro({
  weight: ['300', '400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-sans-pro',
});

const ptSerif = PT_Serif({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pt-serif',
});

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dancing-script',
});

const oswald = Oswald({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-oswald',
});

const ubuntu = Ubuntu({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ubuntu',
});

const rubik = Rubik({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-rubik',
});

const mulish = Mulish({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mulish',
});

const crimsonText = Crimson_Text({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-crimson-text',
});

const workSans = Work_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-work-sans',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPanel = pathname?.startsWith('/joyspanel');

  return (
    <html lang="fr" className={`
      ${playfair.variable} 
      ${quicksand.variable}
      ${roboto.variable}
      ${lora.variable}
      ${montserrat.variable}
      ${openSans.variable}
      ${raleway.variable}
      ${merriweather.variable}
      ${poppins.variable}
      ${nunito.variable}
      ${sourceSansPro.variable}
      ${ptSerif.variable}
      ${dancingScript.variable}
      ${oswald.variable}
      ${ubuntu.variable}
      ${rubik.variable}
      ${mulish.variable}
      ${crimsonText.variable}
      ${workSans.variable}
      ${inter.variable}
    `}>
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