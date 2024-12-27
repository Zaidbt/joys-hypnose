'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Star, Sparkle, Flower, SpeakerHigh, NumberCircleEight, Leaf, Brain } from "@phosphor-icons/react";
import NewsletterBanner from './components/NewsletterBanner';

const services = [
  {
    key: "hypnotherapy",
    Icon: Sparkle,
    title: "Hypnothérapie"
  },
  {
    key: "familyConstellation",
    Icon: Flower,
    title: "Constellations Familiales"
  },
  {
    key: "soundTherapy",
    Icon: SpeakerHigh,
    title: "Thérapie par le Son"
  },
  {
    key: "numerology",
    Icon: NumberCircleEight,
    title: "Numérologie"
  },
  {
    key: "shamanicHypnosis",
    Icon: Leaf,
    title: "Hypnose Chamanique"
  },
  {
    key: "quantumProgramming",
    Icon: Brain,
    title: "Programmation Quantique"
  }
];

const testimonials = [
  {
    content: "Si vous êtes à un moment de votre vie, comme moi, où vous souhaitez reconnecter avec vous-même et vos ressources intérieures, un parcours d'hypnose transformatrice avec cette merveilleuse personne est exactement votre réponse.",
    author: "Solaine I.",
    rating: 5,
    date: "Il y a 2 semaines"
  },
  {
    content: "Une expérience incroyable et transformatrice. Joy a su créer un espace sûr et accueillant pour mon développement personnel. Les séances ont eu un impact profond sur mon bien-être.",
    author: "Laurent M.",
    rating: 5,
    date: "Il y a 1 mois"
  },
  {
    content: "Je recommande vivement Joy pour son professionnalisme, son écoute et sa bienveillance. Les séances m'ont permis de me libérer de certains blocages.",
    author: "Amine R.",
    rating: 5,
    date: "Il y a 2 mois"
  }
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          weight="fill"
          className={`w-5 h-5 ${i < rating ? 'text-[#00b67a]' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
};

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#fff5f5]">
      <NewsletterBanner />
      
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center pt-16 sm:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative mb-8 lg:mb-0 lg:order-2"
            >
              <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/hero-image.jpg"
                  alt="Séance d'hypnothérapie"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rose-100/20 to-transparent" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left lg:order-1"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-black leading-tight mb-4 sm:mb-6">
                Hypnothérapie à Casablanca
              </h1>
              <p className="text-base sm:text-lg text-black mb-6 sm:mb-8 leading-relaxed text-justify">
                Découvrez le pouvoir transformateur de l'hypnothérapie. Je vous accompagne dans votre voyage vers le bien-être et la guérison émotionnelle.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-full text-base font-medium text-white bg-rose-400 hover:bg-rose-500 transition-colors duration-300 shadow-md hover:shadow-lg"
                >
                  Prendre rendez-vous
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/mon-approche"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-rose-200 rounded-full text-base font-medium text-rose-500 hover:bg-rose-50 transition-colors duration-300"
                >
                  En savoir plus
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4 section-title">
              Mes Services
            </h2>
            <p className="text-base sm:text-lg text-black text-justify sm:text-center max-w-2xl mx-auto">
              Je propose une gamme complète de services thérapeutiques pour vous aider à atteindre vos objectifs de bien-être et de développement personnel.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="bg-white/80 p-4 sm:p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-rose-100/20">
                  <div className="flex flex-col items-center text-center gap-3 sm:gap-4">
                    <div className="p-3 rounded-xl bg-rose-50">
                      <service.Icon 
                        className="w-6 h-6 sm:w-8 sm:h-8 text-rose-500" 
                        weight="duotone"
                      />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-black service-title">
                      {service.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div className="mt-10 sm:mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 text-base font-medium text-white bg-rose-400 hover:bg-rose-500 rounded-full transition-colors duration-300 shadow-sm hover:shadow-md group"
            >
              Voir tous les services
              <ArrowRightIcon className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 
