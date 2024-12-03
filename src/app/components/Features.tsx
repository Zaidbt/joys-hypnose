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
    <section className="py-24 sm:py-32 bg-[#fff5f5]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl mb-4">
            Pourquoi choisir Joy's Hypnose ?
          </h2>
          <p className="text-lg leading-8 text-black">
            Une approche unique et personnalisée pour votre bien-être
          </p>
        </motion.div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
            {features.map((feature) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative pl-16"
              >
                <dt className="text-base font-semibold leading-7 text-black">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100">
                    <feature.icon className="h-6 w-6 text-rose-500" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-black">
                  {feature.description}
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
} 
