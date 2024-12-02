'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon 
} from '@heroicons/react/24/outline';
import { Star, Sparkle, Flower, SpeakerHigh, NumberCircleEight, Leaf, Brain } from "@phosphor-icons/react";

const services = [
  {
    title: "Hypnose-Thérapies",
    Icon: Sparkle,
  },
  {
    title: "Constellation familiale Individuelle",
    Icon: Flower,
  },
  {
    title: "Thérapie Sonore/Sound Bath",
    Icon: SpeakerHigh,
  },
  {
    title: "Numérologie",
    Icon: NumberCircleEight,
  },
  {
    title: "Le chamanisme Sous Hypnose",
    Icon: Leaf,
  },
  {
    title: "La Neuro-programmation Quantique",
    Icon: Brain,
  }
];

const benefits = [
  "Approche personnalisée et bienveillante",
  "Techniques douces et naturelles",
  "Résultats durables",
  "Cadre apaisant et professionnel",
  "Suivi personnalisé",
  "Respect et confidentialité"
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
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black leading-tight mb-6">
                Retrouvez votre{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-500">
                  harmonie intérieure
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-black mb-8 leading-relaxed">
                Bienvenue dans mon espace d'hypnothérapie, où je vous accompagne vers un mieux-être profond et durable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
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

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/hero-image.jpg"
                  alt="Séance d'hypnothérapie"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rose-100/20 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4 section-title">
              Mes <span className="text-rose-500">Services</span>
            </h2>
            <p className="text-lg text-black">
              Une approche holistique pour votre bien-être
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="bg-white/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-rose-100/20">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="p-3 rounded-xl bg-rose-50">
                      <service.Icon 
                        className="w-8 h-8 text-rose-500" 
                        weight="duotone"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-black service-title">
                      {service.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-rose-400 hover:bg-rose-500 rounded-full transition-colors duration-300 shadow-sm hover:shadow-md group"
            >
              Découvrir tous nos services
              <ArrowRightIcon className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Thématiques Section */}
      <section className="relative py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div className="relative rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/meditation-space.webp"
                alt="Espace thérapeutique apaisant"
                width={600}
                height={400}
                className="object-cover rounded-2xl"
                priority
              />
            </motion.div>

            <motion.div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-black section-title">
                Les <span className="text-rose-500">Thématiques</span>
              </h2>
              
              <p className="text-black leading-relaxed">
                Chez Joy's Hypnose-thérapies, nous comprenons que chaque individu porte un fardeau unique. 
                Notre approche en hypnose est centrée sur vous, créant un espace sûr et bienveillant pour explorer ces enjeux. 
                Nous croyons en la puissance de la transformation personnelle et en votre capacité à réécrire l'histoire de votre bien-être mental.
              </p>

              <div className="grid grid-cols-1 gap-4 mt-8">
                {[
                  "Les blessures de l'enfant intérieur",
                  "Gestion Émotionnelle",
                  "Hypersensibilité / Empaths",
                  "Stress / Anxiété / Dépression",
                  "Transgénérationnel / Lignes Ancestrales",
                  "Harmonisation Féminin/Masculin"
                ].map((theme, index) => (
                  <motion.div
                    key={theme}
                    className="flex items-center space-x-4 group"
                  >
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-rose-100 text-rose-500 font-medium group-hover:bg-rose-200 transition-colors duration-300">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 font-medium">{theme}</span>
                  </motion.div>
                ))}
              </div>

              <Link
                href="/services"
                className="inline-flex items-center text-rose-500 hover:text-rose-600 transition-colors duration-300 mt-6 group"
              >
                Voir Plus
                <ArrowRightIcon className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Avis Vérifiés
            </h2>
            <div className="mt-4 flex flex-col items-center gap-2">
              <div className="inline-flex items-center gap-2 bg-[#00b67a] px-4 py-2 rounded">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} weight="fill" className="w-5 h-5 text-white" />
                  ))}
                </div>
                <span className="text-white font-semibold border-l border-white/30 pl-2 ml-1">
                  Excellent
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Basé sur {testimonials.length} avis
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex-1"
              >
                <div className="h-full bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <StarRating rating={testimonial.rating} />
                    <span className="text-sm text-gray-500">{testimonial.date}</span>
                  </div>
                  <blockquote className="text-base leading-relaxed text-gray-700 mb-4">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <cite className="text-sm font-semibold text-gray-900 not-italic">
                      {testimonial.author}
                    </cite>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-[#00b67a]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      <span className="ml-1 text-xs text-[#00b67a]">Vérifié</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
} 
