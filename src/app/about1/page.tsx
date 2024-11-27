'use client';

import React from 'react';


import { motion } from 'framer-motion';
import SessionSteps from '../components/SessionSteps';

export default function About() {
  return (
    <main className="flex min-h-screen flex-col pt-16">
      <div className="relative isolate overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
                En Savoir Plus
              </h1>
              <p className="text-lg leading-8 text-gray-600 italic">
                "Le voyage intérieur est le chemin vers la guérison"
              </p>
            </motion.div>

            {/* Mon Approche & Vision sections */}
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col gap-8"
              >
                <div>
                  <h2 className="text-2xl font-bold text-primary-600 mb-4">Mon Approche</h2>
                  <p className="text-gray-600">
                    Je propose une approche thérapeutique unique qui combine différentes méthodes pour une transformation profonde et durable. Mon travail s'appuie sur l'hypnose, la thérapie sonore, les constellations familiales et le chamanisme, créant ainsi une synergie puissante pour votre évolution personnelle.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-primary-600 mb-4">Ma Vision</h2>
                  <p className="text-gray-600">
                    Je crois profondément en la capacité de chacun à se transformer et à s'épanouir. Chaque personne possède en elle les ressources nécessaires pour surmonter ses défis et atteindre ses objectifs. Mon rôle est de vous guider vers ces ressources avec bienveillance et professionnalisme.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative h-[400px] lg:h-auto rounded-2xl overflow-hidden"
              >
                <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* SessionSteps component */}
      <SessionSteps />
    </main>
  );
} 
