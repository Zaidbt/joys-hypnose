'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Star, Sparkle, Flower, SpeakerHigh, NumberCircleEight, Leaf, Brain } from "@phosphor-icons/react";
import NewsletterBanner from './components/NewsletterBanner';
import { useState } from 'react';

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
  const [isExpanded, setIsExpanded] = useState(false);

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
                Retrouvez votre{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-500">
                  harmonie intérieure
                </span>
              </h1>
              <p className="text-base sm:text-lg text-black mb-6 sm:mb-8 leading-relaxed text-justify">
                Bienvenue dans mon espace d'hypnothérapie, où je vous accompagne vers un mieux-être profond et durable. À travers une approche holistique et bienveillante, nous explorerons ensemble les chemins de votre transformation intérieure. Mon rôle est de vous guider avec douceur vers la reconnexion avec votre essence profonde, en libérant les blocages qui vous empêchent d'avancer.
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

      {/* E-pub Download Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-[#fff5f5] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative bg-white rounded-3xl shadow-xl overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left side - Image */}
              <div className="relative h-[400px] lg:h-[600px]">
                <Image
                  src="/images/epub.webp"
                  alt="L'Hypnose Transformative : Un Chemin vers la Guérison"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>

              {/* Right side - Content */}
              <div className="relative p-8 sm:p-12 lg:p-16">
                <div className="absolute top-8 sm:top-12 right-4 flex gap-2">
                  <div className="flex items-center bg-[#00b67a] text-white px-3 py-1 rounded-full text-sm font-medium">
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    Gratuit
                  </div>
                  <div className="flex items-center bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    Exclusif
                  </div>
                </div>
                
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-8 mb-4">
                  L'Hypnose Transformative : Un Chemin vers la Guérison
                </h2>

                {/* Mobile version */}
                <div className="flex sm:hidden items-center justify-between mb-6">
                  <a
                    href="/downloads/hypnose-transformative-guide.pdf"
                    download
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-rose-500 hover:bg-rose-600 transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    Télécharger
                    <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" />
                  </a>
                  
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors duration-200"
                    aria-expanded={isExpanded}
                    aria-label="Voir plus de détails"
                  >
                    <ChevronDownIcon 
                      className={`w-6 h-6 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>

                {/* Desktop version */}
                <div className="hidden sm:block">
                  <p className="text-lg text-gray-600 mb-6">
                    Découvrez comment l'hypnose transformative peut vous aider à libérer votre potentiel et à atteindre un équilibre émotionnel profond.
                  </p>

                  <ul className="space-y-3 mb-8">
                    {[
                      "Les fondements de l'hypnose transformative",
                      "Exercices pratiques guidés",
                      "Études de cas et témoignages inspirants",
                      "Techniques de visualisation et de guérison",
                      "Applications thérapeutiques concrètes",
                      "Approche intégrative unique"
                    ].map((item, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <Sparkle weight="fill" className="w-5 h-5 text-rose-500 mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="/downloads/hypnose-transformative-guide.pdf"
                    download
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-rose-500 hover:bg-rose-600 transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    Télécharger le guide gratuit
                    <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" />
                  </a>
                </div>
                
                {/* Mobile expanded content */}
                {isExpanded && (
                  <motion.div
                    className="sm:hidden"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-lg text-gray-600 mb-6">
                      Découvrez comment l'hypnose transformative peut vous aider à libérer votre potentiel et à atteindre un équilibre émotionnel profond.
                    </p>

                    <ul className="space-y-3 mb-8">
                      {[
                        "Les fondements de l'hypnose transformative",
                        "Exercices pratiques guidés",
                        "Études de cas et témoignages inspirants",
                        "Techniques de visualisation et de guérison",
                        "Applications thérapeutiques concrètes",
                        "Approche intégrative unique"
                      ].map((item, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <Sparkle weight="fill" className="w-5 h-5 text-rose-500 mr-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4 section-title">
              Mes <span className="text-rose-500">Services</span>
            </h2>
            <p className="text-base sm:text-lg text-black text-justify sm:text-center max-w-2xl mx-auto">
              Une approche holistique pour votre bien-être
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
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
              Découvrir tous nos services
              <ArrowRightIcon className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Thématiques Section */}
      <section className="relative py-20 sm:py-32 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4">
              Thématiques
            </h2>
          </motion.div>

          {/* Image - First on mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative mb-8 sm:mb-12 max-w-4xl mx-auto group"
          >
            <div className="relative w-full aspect-[16/12] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Image
                src="/images/meditation-space.webp"
                alt="Espace de méditation"
                fill
                className="object-cover"
                style={{ objectPosition: 'center 30%' }}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rose-100/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </motion.div>

          <p className="text-base sm:text-lg text-black text-justify sm:text-center max-w-2xl mx-auto mb-12">
            Découvrez les différentes thématiques que nous pouvons aborder ensemble
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              "Les blessures de l'enfant intérieur",
              "Gestion Émotionnelle",
              "Hypersensibilité/ Empaths",
              "Transgénérationnel/ Lignes Ancestrales",
              "Stress / Anxiété/ Dépression",
              "Harmonisation Féminin/Masculin"
            ].map((theme, index) => (
              <motion.div
                key={theme}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-rose-100/20">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-rose-100 flex items-center justify-center">
                        <span className="text-rose-500 font-semibold text-sm sm:text-base">
                          {index + 1}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900">
                      {theme}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Avis Vérifiés
            </h2>
            <div className="mt-4 flex flex-col items-center">
              <div className="inline-flex items-center gap-2 bg-[#00b67a] px-4 py-2 rounded">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} weight="fill" className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  ))}
                </div>
                <span className="text-sm sm:text-base text-white font-semibold border-l border-white/30 pl-2 ml-1">
                  Excellent
                </span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex-1"
              >
                <div className="h-full bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <StarRating rating={testimonial.rating} />
                    <span className="text-xs sm:text-sm text-gray-500">{testimonial.date}</span>
                  </div>
                  <blockquote className="text-sm sm:text-base leading-relaxed text-gray-700 mb-4 text-justify">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <cite className="text-sm font-semibold text-gray-900 not-italic">
                      {testimonial.author}
                    </cite>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#00b67a]" viewBox="0 0 24 24" fill="currentColor">
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
