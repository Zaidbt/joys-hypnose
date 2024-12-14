'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkle,
  Flower,
  SpeakerHigh,
  NumberCircleEight,
  Leaf,
  Brain
} from "@phosphor-icons/react";

const services = [
  {
    title: "Hypnose-Thérapies",
    Icon: Sparkle,
    description: "L'hypnose est un outil puissant pour favoriser le bien-être à plusieurs niveaux. Cette technique permet d'accéder à l'inconscient et de transformer les schémas mentaux. Elle aide à soulager le stress, l'anxiété, et facilite la gestion de la douleur. C'est une ressource naturelle qui mobilise vos capacités intérieures pour créer des changements positifs et durables.",
  },
  {
    title: "Constellation familiale Individuelle",
    Icon: Flower,
    description: "Une méthode qui offre une perspective éclairante sur les défis personnels et les relations interpersonnelles. Elle permet de visualiser et résoudre les connexions émotionnelles complexes, favorisant la compréhension profonde des causes sous-jacentes. Cette approche facilite la libération des charges émotionnelles et l'alignement intérieur.",
  },
  {
    title: "Thérapie Sonore/Sound Bath",
    Icon: SpeakerHigh,
    description: "Les effets apaisants de la thérapie sonore résident dans sa capacité à réduire le stress et améliorer la qualité du sommeil. Les fréquences sonores agissent comme un baume pour l'esprit, favorisant l'équilibre émotionnel et la clarté mentale. Cette méthode unique facilite la méditation et permet une libération émotionnelle profonde.",
  },
  {
    title: "Numérologie",
    Icon: NumberCircleEight,
    description: "Une discipline ancestrale qui offre des insights profonds pour éclairer et orienter votre vie. Elle permet de comprendre les cycles de vie et schémas récurrents, offrant une perspective unique sur votre parcours personnel. Cette méthode aide à prendre des décisions éclairées et à mieux comprendre votre chemin de vie.",
  },
  {
    title: "Le chamanisme Sous Hypnose",
    Icon: Leaf,
    description: "L'union du chamanisme et de l'hypnose forme une synergie puissante, offrant une approche holistique pour atteindre des transformations profondes. Cette pratique intègre les traditions ancestrales et les techniques modernes, permettant d'explorer les voyages intérieurs et de renforcer la connexion spirituelle.",
  },
  {
    title: "La Neuro-programmation Quantique",
    Icon: Brain,
    description: "Une approche innovante qui va au-delà des simples affirmations positives. Elle permet de reprogrammer profondément les schémas limitants et d'accéder à de nouvelles possibilités. Cette méthode combine neuroscience et principes quantiques pour faciliter une transformation profonde et durable.",
  }
];

export default function ServicesGrid() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl mb-4">
            Nos Services Thérapeutiques
          </h2>
          <p className="mt-6 text-lg leading-8 text-black">
            Une approche holistique pour votre bien-être et votre développement personnel.
          </p>
        </motion.div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-rose-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-2 rounded-xl bg-rose-50">
                    <service.Icon 
                      className="w-8 h-8 text-rose-500" 
                      weight="duotone"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-black">
                    {service.title}
                  </h3>
                </div>
                <p className="text-black leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 
