'use client';

import React from 'react';


import { motion } from 'framer-motion';
import Link from 'next/link';
import { SparklesIcon } from '@heroicons/react/24/outline';

export default function CallToAction() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-50/50 via-secondary-50/30 to-primary-50/50 transform -skew-y-6" />
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
          >
            <SparklesIcon className="h-12 w-12 mx-auto text-primary-500 mb-6" />
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
              Prêt à Commencer Votre Voyage?
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 mb-8">
              Faites le premier pas vers votre transformation personnelle. Ensemble, découvrons le chemin vers votre harmonie intérieure.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/contact"
                className="rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 px-10 py-4 text-base font-semibold text-white shadow-sm hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
              >
                Prendre Rendez-vous
              </Link>
              <Link
                href="/about"
                className="text-base font-semibold leading-6 text-gray-900 hover:text-primary-600 transition-colors duration-300 flex items-center gap-2"
              >
                En savoir plus sur nos thérapies
                <span aria-hidden="true" className="transform transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 
