'use client';

import Link from 'next/link';
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function Footer() {
  return (
    <footer className="bg-[#ffe4e4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <p className="flex items-center text-gray-600">
                <PhoneIcon className="h-5 w-5 text-rose-400 mr-2" />
                +212 660 826 028
              </p>
              <p className="flex items-center text-gray-600">
                <EnvelopeIcon className="h-5 w-5 text-rose-400 mr-2" />
                knzjoyce@gmail.com
              </p>
              <p className="flex items-start text-gray-600">
                <MapPinIcon className="h-5 w-5 text-rose-400 mr-2 mt-1" />
                <span>
                  17 Rue Bab El Mandab,<br />
                  Residence El Prado 2,<br />
                  1er étage appart #2 Bourgogne,<br />
                  Casablanca
                </span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <nav className="space-y-3">
              <Link href="/" className="block text-gray-600 hover:text-rose-500 transition-colors">Accueil</Link>
              <Link href="/mon-approche" className="block text-gray-600 hover:text-rose-500 transition-colors">Mon Approche</Link>
              <Link href="/services" className="block text-gray-600 hover:text-rose-500 transition-colors">Services</Link>
              <Link href="/blog" className="block text-gray-600 hover:text-rose-500 transition-colors">Blog</Link>
              <Link href="/contact" className="block text-gray-600 hover:text-rose-500 transition-colors">Contact</Link>
            </nav>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Horaires</h3>
            <p className="text-gray-600 mb-4">
              Lundi - Vendredi<br />
              9:00 - 17:00
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-rose-400 hover:bg-rose-500 rounded-full transition-colors duration-300"
            >
              Prendre rendez-vous
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-rose-200/50 text-center text-gray-500">
          © {new Date().getFullYear()} Joy's Hypnose. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
} 
