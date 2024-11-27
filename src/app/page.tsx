'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Testimonials from './components/Testimonials';
import Benefits from './components/Benefits';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-primary-50/40 to-rose-50/30">
      {/* Hero Section with enhanced gradient and decorative elements */}
      <section className="relative pt-32 pb-40 overflow-hidden border-b border-primary-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Retrouvez votre{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">
                  équilibre intérieur
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                Découvrez le pouvoir de l'hypnothérapie pour transformer votre vie. 
                Une approche douce et naturelle pour surmonter vos défis et révéler votre plein potentiel.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg text-base font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-300"
                >
                  Prendre rendez-vous
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/mon-approche"
                  className="inline-flex items-center justify-center px-6 py-3 border border-primary-600 rounded-lg text-base font-medium text-primary-600 hover:bg-primary-50 transition-colors duration-300"
                >
                  En savoir plus
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/hero-image.jpg"
                  alt="Séance d'hypnothérapie"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>
          </div>
        </div>

        {/* Enhanced decorative elements with warmer colors */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-amber-100/60 to-rose-100/60 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-gradient-to-tr from-primary-100/60 to-amber-100/60 rounded-full blur-3xl opacity-40" />
        <div className="absolute top-1/4 left-0 w-48 h-48 bg-gradient-to-r from-rose-100/40 to-amber-100/40 rounded-full blur-2xl opacity-30" />
      </section>

      {/* Benefits Section with enhanced visual separation */}
      <section className="relative py-32 bg-gradient-to-b from-white/80 via-amber-50/30 to-white/80 border-b border-primary-100/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-rose-50/40 via-transparent to-transparent" />
        <Benefits />
      </section>

      {/* Approach Section with sophisticated background */}
      <section className="relative py-32 bg-gradient-to-br from-white/90 via-primary-50/20 to-amber-50/30 border-b border-primary-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image container with enhanced styling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative h-[600px] rounded-2xl overflow-hidden shadow-xl"
            >
              <Image
                src="/images/approach-image.jpg"
                alt="Mon approche"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />
            </motion.div>

            {/* Content with enhanced typography */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Une approche personnalisée pour votre{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">
                  bien-être
                </span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                L'hypnothérapie est une méthode douce et naturelle qui permet d'accéder à vos ressources 
                intérieures pour surmonter les obstacles et atteindre vos objectifs. Chaque séance est 
                adaptée à vos besoins spécifiques.
              </p>
              {/* Enhanced list styling */}
              <ul className="space-y-6">
                {[
                  "Gestion du stress et de l'anxiété",
                  "Confiance en soi et estime de soi",
                  "Arrêt du tabac et addictions",
                  "Perte de poids et troubles alimentaires",
                  "Phobies et traumatismes"
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center text-gray-700 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <svg className="h-5 w-5 text-primary-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                    </svg>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section with enhanced background */}
      <section className="relative bg-gradient-to-b from-amber-50/30 via-rose-50/20 to-white/90">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary-50/40 via-transparent to-transparent" />
        <Testimonials />
      </section>
    </main>
  );
} 
