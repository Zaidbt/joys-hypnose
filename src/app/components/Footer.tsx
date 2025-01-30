'use client';

import Link from 'next/link';
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function Footer() {
  return (
    <footer className="bg-[#ffe4e4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Contact Info */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Contact</h3>
            <div className="space-y-4">
              <a 
                href="tel:+212660826028" 
                className="flex items-center justify-center md:justify-start text-gray-600 hover:text-rose-500 transition-colors"
              >
                <PhoneIcon className="h-5 w-5 text-rose-400 mr-2 flex-shrink-0" />
                +212 660 826 028
              </a>
              <a 
                href="mailto:knzjoyce@gmail.com" 
                className="flex items-center justify-center md:justify-start text-gray-600 hover:text-rose-500 transition-colors"
              >
                <EnvelopeIcon className="h-5 w-5 text-rose-400 mr-2 flex-shrink-0" />
                knzjoyce@gmail.com
              </a>
              <div className="flex items-start justify-center md:justify-start text-gray-600">
                <MapPinIcon className="h-5 w-5 text-rose-400 mr-2 mt-1 flex-shrink-0" />
                <span className="text-center md:text-left">
                  17 Rue Bab El Mandab,<br />
                  Residence El Prado 2,<br />
                  1er étage appart #2 Bourgogne,<br />
                  Casablanca
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Liens rapides</h3>
            <nav className="space-y-3">
              <Link href="/" className="block text-gray-600 hover:text-rose-500 transition-colors">Accueil</Link>
              <Link href="/mon-approche" className="block text-gray-600 hover:text-rose-500 transition-colors">Mon Approche</Link>
              <Link href="/services" className="block text-gray-600 hover:text-rose-500 transition-colors">Services</Link>
              <Link href="/actualites" className="block text-gray-600 hover:text-rose-500 transition-colors">Actualités</Link>
              <Link href="/blog" className="block text-gray-600 hover:text-rose-500 transition-colors">Blog</Link>
              <Link href="/contact" className="block text-gray-600 hover:text-rose-500 transition-colors">Contact</Link>
            </nav>
          </div>

          {/* Hours */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Horaires</h3>
            <p className="text-gray-600 mb-6">
              Lundi - Vendredi<br />
              9:00 - 17:00
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-rose-400 hover:bg-rose-500 rounded-full transition-colors duration-300 shadow-sm hover:shadow-md"
            >
              Prendre rendez-vous
            </Link>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-rose-200/50 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Joy's Hypnose. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
} 
