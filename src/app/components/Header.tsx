'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'Mon Approche', href: '/mon-approche' },
  { name: 'Services', href: '/services' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-sm" role="banner">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8" aria-label="Navigation principale">
        <div className="flex h-16 items-center justify-between">
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5" aria-label="Retour à l'accueil">
              <h1 className="text-2xl font-bold logo-text">
                Joy's Hypnose
              </h1>
            </Link>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2.5 text-black"
              onClick={() => setMobileMenuOpen(true)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Menu principal"
            >
              <span className="sr-only">Ouvrir le menu principal</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12" role="navigation">
            <ul className="flex gap-x-12">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm font-semibold leading-6 text-black hover:text-rose-500 transition-colors duration-300 nav-link"
                    aria-label={`Aller à ${item.name.toLowerCase()}`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <Dialog 
        as="div" 
        className="lg:hidden" 
        open={mobileMenuOpen} 
        onClose={setMobileMenuOpen}
        id="mobile-menu"
        aria-label="Menu mobile"
      >
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5" aria-label="Retour à l'accueil">
              <span className="text-2xl font-bold logo-text">
                Joy's Hypnose
              </span>
            </Link>
            <button
              type="button"
              className="rounded-md p-2.5 text-black"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Fermer le menu"
            >
              <span className="sr-only">Fermer le menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <nav className="mt-6 flow-root" aria-label="Menu mobile">
            <ul className="-my-6 divide-y divide-gray-500/10">
              {navigation.map((item) => (
                <li key={item.name} className="py-2">
                  <Link
                    href={item.href}
                    className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-black hover:bg-rose-50 hover:text-rose-500 nav-link"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label={`Aller à ${item.name.toLowerCase()}`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
} 
