'use client';

import React from 'react';
import { motion } from 'framer-motion';

const sessions = [
  {
    title: "Les avantages des séances d'hypnose",
    content: "Imaginez une vie où le stress est géré avec facilité, où la confiance en soi prospère, et où vous avez le pouvoir de surmonter les défis avec résilience. Nos séances d'hypnose visent à vous offrir ces avantages et bien plus encore. Des témoignages réels illustrent la transformation positive que nos clients ont vécue."
  },
  {
    title: "Approche Personnelle",
    content: "Chez Joy's Hypnose, nous comprenons que chaque individu est unique. Nos séances sont conçues sur mesure pour répondre à vos besoins spécifiques. Nous croyons en une approche personnelle et confidentielle, garantissant que chaque personne se sente entendue et soutenue dans son parcours vers le bien-être."
  },
  {
    title: "L'expérience des séances",
    content: "Au cours de nos séances d'hypnose, vous vivrez une relaxation profonde et guidée. Vous serez guidé à travers un processus respectueux et non intrusif qui vous permettra d'explorer et de libérer vos ressources intérieures. Notre environnement est empreint de confidentialité et de respect."
  },
  {
    title: "Combien de temps dure une séance ?",
    content: "Une séance typique d'hypnose dure 50 ou 60 minutes. La première séance dure 2h. La plupart des personnes commencent à obtenir des résultats au bout de 5 rencontres. L'hypnose est reconnue comme une thérapie brève. Une dizaine de rencontres suffisent habituellement, du moins pour les problèmes bien circonscrits."
  }
];

export default function SessionSteps() {
  return (
    <section className="py-24 sm:py-32 bg-[#fff5f5]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl mb-4">
            Comment les séances se déroulent?
          </h2>
          <p className="text-lg leading-8 text-black">
            Découvrez notre approche thérapeutique personnalisée
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {sessions.map((session, index) => (
            <motion.div
              key={session.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="bg-white/80 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-rose-100/20">
                <h3 className="text-xl font-semibold text-black mb-4">
                  {session.title}
                </h3>
                <p className="text-black leading-relaxed">
                  {session.content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 
