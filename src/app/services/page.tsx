'use client';

import React, { useEffect } from "react";
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import ServicesGrid from '../components/ServicesGrid';
import { Metadata } from 'next';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MedicalBusiness',
  name: "Joy's Hypnose - Services d'Hypnothérapie",
  '@id': 'https://joyshypnose-therapies.com/services',
  url: 'https://joyshypnose-therapies.com/services',
  image: 'https://joyshypnose-therapies.com/images/hero-image.jpg',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: "Services d'hypnothérapie",
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Hypnose-Thérapies',
          description: 'Séances personnalisées d\'hypnothérapie transformative',
          provider: {
            '@type': 'LocalBusiness',
            name: "Joy's Hypnose"
          }
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Constellation familiale Individuelle',
          description: 'Séances de constellation familiale pour résoudre les problématiques transgénérationnelles'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Thérapie Sonore/Sound Bath',
          description: 'Séances de thérapie par le son pour la relaxation profonde'
        }
      }
    ]
  }
};

export default function Services() {
  useEffect(() => {
    console.log('Services page mounted');
  }, []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex min-h-screen flex-col pt-16 bg-gradient-to-b from-white via-primary-50/30 to-white">
        <ServicesGrid />
        
        {/* À propos Section */}
        <section className="py-24 sm:py-32 bg-white/80">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mx-auto max-w-3xl text-center mb-16"
            >
              <h2 className="text-3xl font-bold tracking-tight text-rose-500 sm:text-4xl mb-6">
                À propos
              </h2>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative mb-8 sm:mb-12 max-w-4xl mx-auto group"
              >
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <Image
                    src="/images/joys.webp"
                    alt="Joy's Hypnose"
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-rose-100/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            </motion.div>

            <div className="mx-auto max-w-3xl space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="prose prose-lg max-w-none"
              >
                <p className="text-black leading-relaxed text-justify">
                  Je te vois. Je ressens ta fatigue, ce poids invisible que tu portes, ces blessures que personne ne devine. Peut-être te sens-tu perdu(e), déconnecté(e) de toi-même, ou prisonnier(ère) de schémas qui se répètent encore et encore. Je le sais, parce que moi aussi, j'ai été là. Mais laisse-moi te dire ceci : tu n'es pas seul(e), et il existe un chemin vers la guérison.
                </p>

                <p className="text-black leading-relaxed text-justify mt-6">
                  Je suis Kenza, Maitre praticien(ne) en hypnose transformative. Mon approche unique combine des outils puissants comme l'hypnose Ericksonienne, humaniste, nouvelle hypnose et PNL avec une dimension spirituelle et chamanique pour aller chercher, au plus profond de toi, tes propres ressources. Ensemble, nous allons dénouer les fils du passé, libérer tes blocages émotionnels et révéler la version la plus alignée de toi-même.
                </p>

                <p className="text-black leading-relaxed text-justify mt-6">
                  Si j'ai choisi ce chemin, c'est parce que la vie m'a moi-même mise à l'épreuve. Un passé difficile, la perte d'un être cher, et ce moment où l'on touche le fond pour mieux renaître. J'ai trouvé dans l'hypnose et le travail sur moi-même une voie de guérison et de transformation. Aujourd'hui, c'est ce chemin que je t'invite à parcourir, avec bienveillance et douceur.
                </p>

                <p className="text-black leading-relaxed text-justify mt-6">
                  Tu n'as pas besoin d'être "parfait(e)" pour commencer. Le premier pas suffit pour changer ta vie : reprendre confiance, retrouver ton calme intérieur, et avancer enfin libre et aligné(e).
                </p>

                <div className="mt-8 bg-rose-50/50 p-8 rounded-2xl">
                  <h3 className="text-xl font-semibold text-rose-500 mb-4">
                    Mon approche s'adresse à toi si tu souhaites :
                  </h3>
                  <ul className="space-y-3 text-black list-none pl-0">
                    <li className="flex items-center gap-2">
                      <span className="text-rose-500">•</span>
                      Te libérer de tes traumatismes et blocages émotionnels
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-rose-500">•</span>
                      Guérir des blessures transgénérationnelles ou de l'enfance
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-rose-500">•</span>
                      Surmonter phobies, addictions, anxiété ou dépression
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-rose-500">•</span>
                      Reconnecter avec toi-même, dans la paix et l'amour
                    </li>
                  </ul>
                </div>

                <p className="text-black leading-relaxed text-justify mt-6">
                  Ensemble, nous créerons un espace où ta voix sera entendue, tes émotions accueillies, et où tu pourras enfin te réapproprier ta lumière.
                </p>

                <p className="text-black leading-relaxed text-justify mt-6">
                  Parce que tu mérites de guérir. Et surtout, tu mérites d'être pleinement toi.
                </p>

                <div className="mt-10 flex justify-center">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-rose-400 hover:bg-rose-500 rounded-full transition-colors duration-300 shadow-md hover:shadow-lg group no-underline"
                  >
                    Prends rendez-vous aujourd'hui
                    <ArrowRightIcon className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
} 