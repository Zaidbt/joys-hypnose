'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckBadgeIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import WhatsAppButton from '../components/WhatsAppButton';

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
      <section className="py-24 bg-[#fff5f5]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight text-rose-500 sm:text-4xl">
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
                <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-rose-100/20 h-full">
                  <h3 className="text-xl font-semibold mb-4 text-rose-500">
                    {session.title}
                  </h3>
                  <p className="text-black leading-relaxed text-justify">
                    {session.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Diplômes & Formation Section - Moved up */}
      <section className="relative py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-rose-500 mb-6">
              Diplômes & Formation
            </h2>
            <p className="text-lg text-black max-w-2xl mx-auto">
              Mes formations spécialisées, constamment enrichies pour rester à la pointe de mon domaine, attestent de mon engagement continu envers le perfectionnement professionnel et la fourniture de services de qualité supérieure.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Hypnose Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <h3 className="text-2xl font-semibold text-rose-500 mb-6">Hypnose</h3>
              <ul className="space-y-3 text-black">
                {[
                  "Praticien en Hypnose transformatrice",
                  "Maitre praticien en hypnose Transformatrice",
                  "BQH beyond Quantum healing Hypnosis",
                  "Hypnose accompagnement dans le Deuil",
                  "Hypnose Chamanisme",
                  "Hypnose transgénérationnel",
                  "Hypnose Spirituelle",
                  "Hypnose Toc/ Anxiété",
                  "Hypnose Addiction",
                  "Hypnose soutien dans le cancer",
                  "Hypnose régressive Quantique"
                ].map((diploma) => (
                  <li key={diploma} className="flex items-center gap-2">
                    <CheckBadgeIcon className="h-5 w-5 text-rose-500 flex-shrink-0" />
                    <span>{diploma}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Énergie Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <h3 className="text-2xl font-semibold text-rose-500 mb-6">Énergie</h3>
              <ul className="space-y-3 text-black">
                {[
                  "Lahochi",
                  "Les 14 Rayons des êtres Intergalaciques",
                  "Les Rois mages",
                  "Cérémonie Cacao",
                  "Initiation à la thérapie chamanique"
                ].map((diploma) => (
                  <li key={diploma} className="flex items-center gap-2">
                    <CheckBadgeIcon className="h-5 w-5 text-rose-500 flex-shrink-0" />
                    <span>{diploma}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Autres Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <h3 className="text-2xl font-semibold text-rose-500 mb-6">Autres</h3>
              <ul className="space-y-3 text-black">
                {[
                  "Neuroprogrammation Quantique",
                  "Thérapie sonore",
                  "EFT/TPT Maitre Praticien",
                  "Facilitatrice de Constellation Familiale systémique et organisationnelle (fin Nov 2024)",
                  "The Lost Remedies praticienne (en cours)",
                  "Herboristerie (en cours)"
                ].map((diploma) => (
                  <li key={diploma} className="flex items-center gap-2">
                    <CheckBadgeIcon className="h-5 w-5 text-rose-500 flex-shrink-0" />
                    <span>{diploma}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Notre Histoire Section - Moved down */}
      <section className="relative py-24 bg-[#fff5f5]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12">
            {/* Title and Image Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold text-rose-500 mb-8">
                Notre histoire
              </h1>
              
              {/* Image */}
              <div className="max-w-3xl mx-auto">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-12">
                  <Image
                    src="/images/notrehistoire.webp"
                    alt="Notre Histoire"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw"
                    priority
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="prose prose-lg max-w-none space-y-8 text-black">
                <p className="max-w-[65ch] text-justify mx-auto">
                  Choisir de devenir hypnothérapeute n'est pas simplement une profession pour moi, mais plutôt une mission de vie profondément enracinée dans ma propre expérience et ma conviction profonde.
                </p>

                <p className="max-w-[65ch] text-justify mx-auto">
                  Depuis toujours, j'ai été naturellement attirée par l'écoute des autres et la recherche de solutions pour les aider à surmonter les défis de la vie.
                </p>

                <p className="max-w-[65ch] text-justify mx-auto">
                  Ayant moi-même traversé des périodes tumultueuses et étant dotée d'une sensibilité aiguë, d'une empathie profonde, et d'une âme ancienne, j'ai trouvé dans le voyage intérieur une boussole pour ma propre transformation.
                </p>

                <p className="max-w-[65ch] text-justify mx-auto">
                  Ce parcours personnel, parsemé d'expériences qui ont forgé ma compréhension des profondeurs de l'âme humaine, m'a conduit à comprendre que le véritable alignement et l'harmonie ne peuvent être atteints qu'en travaillant sur tous les niveaux de notre être.
                </p>

                <p className="max-w-[65ch] text-justify mx-auto">
                  Pour moi, l'esprit, l'âme et le corps sont intrinsèquement liés, et la clé de l'harmonie intérieure réside dans l'équilibre holistique de ces aspects.
                </p>

                <p className="max-w-[65ch] text-justify mx-auto">
                  En embrassant ma propre hypersensibilité et en apprenant à canaliser cette énergie unique, j'ai découvert que ma mission est d'aider les autres à faire de même.
                </p>

                <p className="max-w-[65ch] text-justify mx-auto">
                  Mon objectif est d'offrir un espace bienveillant où les individus peuvent explorer leurs propres profondeurs, libérer leurs blessures émotionnelles, et trouver un équilibre durable.
                </p>

                <p className="max-w-[65ch] text-justify mx-auto">
                  En tant que maître praticienne, je m'engage à accompagner mes clients dans leur voyage vers l'harmonie, tout en partageant la conviction profonde que la transformation personnelle n'est pas seulement possible, mais aussi essentielle pour atteindre une vie pleine de sens et de bien-être.
                </p>
              </div>

              {/* WhatsApp Button */}
              <div className="mt-12 text-center">
                <WhatsAppButton 
                  phoneNumber="+212660826028"
                  message="Bonjour Joy, j'ai visité votre site et j'aimerais en savoir plus sur vos séances d'hypnose. Pouvez-vous me donner plus d'informations ?"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
} 