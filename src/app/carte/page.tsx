'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon, 
  CalendarIcon,
  ArrowRightIcon,
  ShareIcon
} from '@heroicons/react/24/outline';

export default function BusinessCardPage() {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Joy's Hypnose - Hypnothérapie à Casablanca",
          text: 'Découvrez l\'hypnothérapie transformative à Casablanca',
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-rose-100">
            <Image
              src="/images/joys.webp"
              alt="Joy's Hypnose"
              fill
              className="object-cover"
            />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Joy's Hypnose</h1>
          <p className="text-rose-600 font-medium mb-4">Hypnothérapeute certifiée 🇲🇦🇨🇦<br/>Hypnose Transformatrice, régressive quantique spirituelle<br/>Chamane, sound healer, numérologie</p>
          
          <button
            onClick={handleShare}
            className="inline-flex items-center text-sm text-gray-600 hover:text-rose-500"
          >
            <ShareIcon className="h-4 w-4 mr-1" />
            Partager
          </button>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-rose-100 p-6 mb-6"
        >
          <div className="space-y-4">
            <a
              href="tel:+212660826028"
              className="flex items-center text-gray-600 hover:text-rose-500 transition-colors"
            >
              <PhoneIcon className="h-5 w-5 text-rose-400 mr-3" />
              +212 660 826 028
            </a>
            <a
              href="mailto:knzjoyce@gmail.com"
              className="flex items-center text-gray-600 hover:text-rose-500 transition-colors"
            >
              <EnvelopeIcon className="h-5 w-5 text-rose-400 mr-3" />
              knzjoyce@gmail.com
            </a>
            <div className="flex items-start text-gray-600">
              <MapPinIcon className="h-5 w-5 text-rose-400 mr-3 mt-1" />
              <span>
                17 Rue Bab El Mandab,<br />
                Residence El Prado 2,<br />
                1er étage appart #2 Bourgogne,<br />
                Casablanca
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <CalendarIcon className="h-5 w-5 text-rose-400 mr-3" />
              <span>Lundi - Vendredi, 10:00 - 17:00</span>
            </div>
          </div>
        </motion.div>

        {/* Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-rose-100 p-6 mb-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Mes Services</h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-rose-400 rounded-full mr-3"></span>
              Hypnose Transformative
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-rose-400 rounded-full mr-3"></span>
              Constellation Familiale
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-rose-400 rounded-full mr-3"></span>
              Thérapie Sonore
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-rose-400 rounded-full mr-3"></span>
              Développement Personnel
            </li>
          </ul>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <Link
            href="/contact"
            className="flex items-center justify-center w-full px-6 py-3 text-white bg-rose-500 rounded-full hover:bg-rose-600 transition-colors shadow-sm hover:shadow-md"
          >
            Prendre rendez-vous
            <ArrowRightIcon className="h-5 w-5 ml-2" />
          </Link>
          
          <Link
            href="/services"
            className="flex items-center justify-center w-full px-6 py-3 text-rose-600 bg-rose-50 rounded-full hover:bg-rose-100 transition-colors"
          >
            Découvrir mes services
          </Link>
        </motion.div>
      </div>
    </main>
  );
} 