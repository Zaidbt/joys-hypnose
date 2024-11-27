'use client';

import React from 'react';
import Link from 'next/link';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon 
} from '@heroicons/react/24/outline';

export default function Footer() {
  return (
    <footer className="bg-[#ffa5b0]/20 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <PhoneIcon className="h-6 w-6 text-primary-600 flex-shrink-0" />
                <span>+212 660 826 028</span>
              </li>
              <li className="flex items-start space-x-3">
                <EnvelopeIcon className="h-6 w-6 text-primary-600 flex-shrink-0" />
                <span>knzjoyce@gmail.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPinIcon className="h-6 w-6 text-primary-600 flex-shrink-0" />
                <span>
                  17 Rue Bab El Mandab,<br />
                  Residence El Prado 2,<br />
                  1er étage appart #2 Bourgogne,<br />
                  Casablanca
                </span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-primary-600 transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/mon-approche" className="hover:text-primary-600 transition-colors">
                  Mon Approche
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary-600 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary-600 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary-600 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Horaires</h3>
            <p className="text-gray-700">
              Lundi - Vendredi<br />
              9:00 - 17:00
            </p>
            <Link 
              href="/contact" 
              className="inline-block mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Prendre rendez-vous
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Joy's Hypnose. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
} 
