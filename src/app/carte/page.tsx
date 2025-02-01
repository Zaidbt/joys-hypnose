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

const socialLinks = [
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/joys_hypnose',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@joyshypnose',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/Joyshypnose/',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    name: 'TikTok',
    url: 'https://www.tiktok.com/@hypnojs',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    ),
  },
];

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
              style={{ objectPosition: 'center 30%' }}
              sizes="(max-width: 128px) 100vw, 128px"
            />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Joy's Hypnose</h1>
          <p className="text-rose-600 font-medium mb-4">Hypnothérapeute certifiée 🇲🇦🇨🇦<br/>Hypnose Transformatrice, régressive quantique spirituelle<br/>Chamane, sound healer, numérologie</p>
          
          <div className="flex items-center justify-center space-x-4 mb-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-rose-500 transition-colors"
                aria-label={link.name}
              >
                {link.icon}
              </a>
            ))}
          </div>

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
              <MapPinIcon className="h-5 w-5 text-rose-400 mr-3 mt-1 flex-shrink-0" />
              <a
                href="geo:0,0?q=17+Rue+Bab+El+Mandab+Residence+El+Prado+2+Bourgogne+Casablanca"
                className="hover:text-rose-500 transition-colors"
              >
                17 Rue Bab El Mandab,<br />
                Residence El Prado 2,<br />
                1er étage appart #2 Bourgogne,<br />
                Casablanca
              </a>
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