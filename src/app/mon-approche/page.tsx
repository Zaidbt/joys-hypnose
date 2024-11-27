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

export default function MonApproche() {
  return (
    <main className="flex min-h-screen flex-col pt-16">
      {/* Comment se déroulent les séances Section */}
      <section className="py-24 bg-gradient-to-b from-primary-50/30 to-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Comment se déroulent les séances
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sessions.map((session, index) => (
              <motion.div
                key={session.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl transform group-hover:scale-[1.02] transition-transform duration-300 -z-10" />
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm ring-1 ring-gray-200/50 hover:shadow-lg transition-all duration-300 h-full">
                  <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    {session.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {session.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Notre Histoire Section */}
      <section className="relative py-24 bg-gradient-to-b from-white to-primary-50/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Title Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-3"
            >
              <h1 className="text-4xl font-bold italic text-primary-600">
                Notre histoire
              </h1>
            </motion.div>

            {/* Content Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-9"
            >
              <div className="prose prose-lg max-w-none space-y-6 text-gray-600">
                <p>
                  Choisir de devenir hypnothérapeute n'est pas simplement une profession pour moi, mais plutôt une mission de vie profondément enracinée dans ma propre expérience et ma conviction profonde. Depuis toujours, j'ai été naturellement attirée par l'écoute des autres et la recherche de solutions pour les aider à surmonter les défis de la vie. Ayant moi-même traversé des périodes tumultueuses et étant dotée d'une sensibilité aiguë, d'une empathie profonde, et d'une âme ancienne, j'ai trouvé dans le voyage intérieur une boussole pour ma propre transformation.
                </p>

                <p>
                  Ce parcours personnel, parsemé d'expériences qui ont forgé ma compréhension des profondeurs de l'âme humaine, m'a conduit à comprendre que le véritable alignement et l'harmonie ne peuvent être atteints qu'en travaillant sur tous les niveaux de notre être. Pour moi, l'esprit, l'âme et le corps sont intrinsèquement liés, et la clé de l'harmonie intérieure réside dans l'équilibre holistique de ces aspects. Ainsi, ma pratique d'hypnothérapeute repose sur la conviction que l'exploration de l'inconscient, la transformation des schémas de pensée, et l'intégration de plusieurs synergies contribuent tous à créer un chemin vers l'alignement complet.
                </p>

                <p>
                  En embrassant ma propre hypersensibilité et en apprenant à canaliser cette énergie unique, j'ai découvert que ma mission est d'aider les autres à faire de même. Mon objectif est d'offrir un espace bienveillant où les individus peuvent explorer leurs propres profondeurs, libérer leurs blessures émotionnelles, et trouver un équilibre durable. En tant que maître praticienne, je m'engage à accompagner mes clients dans leur voyage vers l'harmonie, tout en partageant la conviction profonde que la transformation personnelle n'est pas seulement possible, mais aussi essentielle pour atteindre une vie pleine de sens et de bien-être.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
} 