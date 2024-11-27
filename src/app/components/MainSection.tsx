'use client';

import React from 'react';


import { motion } from 'framer-motion';
import Image from 'next/image';

export default function MainSection() {
  return (
    <section className="py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-12 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-center lg:gap-y-0">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:pr-8 lg:pt-4"
          >
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold leading-7 text-primary-500">
                Thérapie holistique
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Une approche complète pour votre bien-être
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                L'hypnothérapie est une méthode douce et naturelle qui permet de communiquer avec votre inconscient pour résoudre divers problèmes et atteindre vos objectifs.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-tr from-primary-100 to-secondary-100">
              <Image
                src="/images/services/services.webp"
                alt="Thérapie holistique"
                fill
                className="object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-8 -left-8 bottom-0 z-10 rounded-2xl bg-gradient-to-tr from-primary-50 to-secondary-50 opacity-50 blur-2xl" />
            <div className="absolute -top-8 -right-4 -left-4 bottom-0 z-10 rounded-2xl bg-gradient-to-tr from-primary-50 to-secondary-50 opacity-50 blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
} 
