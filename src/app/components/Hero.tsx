'use client';

import React from 'react';


import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <div ref={ref} className="relative isolate min-h-screen flex items-center pt-16">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero-image.jpg"
          alt="Séance d'hypnothérapie"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/80 via-white/50 to-white/80 backdrop-blur-[2px]" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 8,
              delay: i * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              left: `${20 + i * 30}%`,
              top: `${30 + i * 20}%`,
            }}
          >
            <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-primary-200/20 to-secondary-200/20 blur-2xl`} />
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 pt-24 sm:pt-32 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1 
              className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Retrouvez votre{' '}
              <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent inline-block">
                équilibre intérieur
              </span>
            </motion.h1>
            
            <motion.p 
              className="mt-6 text-xl leading-8 text-gray-600 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Découvrez une approche thérapeutique personnalisée pour vous accompagner vers le bien-être et l'harmonie.
            </motion.p>

            <motion.div 
              className="mt-10 flex items-center justify-center gap-x-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link
                href="/contact"
                className="relative group rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 px-8 py-4 text-base font-semibold text-white shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                <span className="relative z-10">Prendre rendez-vous</span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              <Link 
                href="/services" 
                className="text-base font-semibold leading-6 text-gray-900 hover:text-primary-500 transition-colors duration-300 flex items-center gap-2 group"
              >
                Découvrir nos services
                <span className="transform transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 
