'use client';

import React from 'react';


import { motion } from 'framer-motion';
import { 
  HeartIcon, 
  BoltIcon, 
  SparklesIcon 
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Approche personnalisée',
    description: 'Une thérapie adaptée à vos besoins spécifiques et à votre rythme personnel.',
    icon: HeartIcon,
  },
  {
    name: 'Résultats durables',
    description: 'Des techniques efficaces pour des changements positifs et durables dans votre vie.',
    icon: BoltIcon,
  },
  {
    name: 'Environnement apaisant',
    description: 'Un espace serein et bienveillant pour votre développement personnel.',
    icon: SparklesIcon,
  },
];

export default function Features() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-base font-semibold leading-7 text-primary-600">Pourquoi nous choisir</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Une approche holistique du bien-être
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Découvrez comment notre approche thérapeutique peut vous aider à retrouver harmonie et équilibre dans votre vie.
            </p>
          </motion.div>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col"
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon className="h-5 w-5 flex-none text-primary-600" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
} 
