'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  HeartIcon, 
  BoltIcon, 
  SparklesIcon, 
  ArrowPathIcon 
} from '@heroicons/react/24/outline';

const benefits = [
  {
    title: "Approche Bienveillante",
    description: "Un accompagnement personnalisé dans un cadre sécurisant et respectueux",
    icon: HeartIcon,
    color: "text-rose-500",
    bgColor: "bg-rose-100"
  },
  {
    title: "Résultats Rapides",
    description: "Des changements positifs observables dès les premières séances",
    icon: BoltIcon,
    color: "text-amber-500",
    bgColor: "bg-amber-100"
  },
  {
    title: "Méthode Naturelle",
    description: "Une approche douce qui mobilise vos ressources intérieures",
    icon: SparklesIcon,
    color: "text-emerald-500",
    bgColor: "bg-emerald-100"
  },
  {
    title: "Transformation Durable",
    description: "Des outils concrets pour maintenir les changements dans le temps",
    icon: ArrowPathIcon,
    color: "text-blue-500",
    bgColor: "bg-blue-100"
  }
];

export default function Benefits() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Pourquoi choisir l'hypnothérapie ?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Découvrez les avantages d'une approche thérapeutique naturelle et efficace
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className={`inline-flex p-3 rounded-lg ${benefit.bgColor} mb-4`}>
                <benefit.icon className={`h-6 w-6 ${benefit.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 
