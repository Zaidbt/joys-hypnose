'use client';

import React from 'react';


import { motion } from 'framer-motion';
import { 
  SparklesIcon, 
  HeartIcon, 
  MoonIcon,
  SunIcon,
  CloudIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const services = [
  {
    name: 'Hypnose Thérapeutique',
    description: 'Une approche douce pour accéder à vos ressources intérieures et transformer positivement votre vie.',
    icon: SparklesIcon,
    benefits: ['Gestion du stress', 'Confiance en soi', 'Arrêt du tabac']
  },
  {
    name: 'Sound Healing',
    description: 'Harmonisez votre corps et votre esprit grâce aux vibrations thérapeutiques des bols tibétains.',
    icon: CloudIcon,
    benefits: ['Relaxation profonde', 'Équilibre énergétique', 'Bien-être mental']
  },
  {
    name: 'Méditation Guidée',
    description: 'Découvrez la paix intérieure à travers des séances de méditation personnalisées.',
    icon: MoonIcon,
    benefits: ['Calme mental', 'Présence consciente', 'Harmonie intérieure']
  },
  {
    name: 'Thérapie Énergétique',
    description: 'Rééquilibrez vos énergies pour retrouver harmonie et vitalité.',
    icon: SunIcon,
    benefits: ['Équilibre chakras', 'Vitalité', 'Purification énergétique']
  }
];

export default function Services() {
  return (
    <section className="py-24 sm:py-32 bg-gradient-to-b from-white via-primary-50/20 to-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Nos Services Thérapeutiques
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Découvrez nos approches holistiques pour votre bien-être physique, mental et émotionnel.
          </p>
        </motion.div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <dt className="flex items-center gap-x-3 text-xl font-semibold leading-7 text-gray-900">
                  <service.icon className="h-6 w-6 flex-none text-primary-600" aria-hidden="true" />
                  {service.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{service.description}</p>
                  <ul className="mt-4 space-y-2">
                    {service.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center">
                        <StarIcon className="h-4 w-4 text-primary-400 mr-2" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
} 
