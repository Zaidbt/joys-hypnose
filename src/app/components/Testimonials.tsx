'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star } from "@phosphor-icons/react";

const testimonials = [
  {
    content: "Si vous êtes à un moment de votre vie, comme moi, où vous souhaitez reconnecter avec vous-même et vos ressources intérieures, un parcours d'hypnose transformatrice avec cette merveilleuse personne est exactement votre réponse.",
    author: "Solaine I.",
    rating: 5
  },
  {
    content: "Une expérience incroyable et transformatrice. Joy a su créer un espace sûr et accueillant pour mon développement personnel. Les séances ont eu un impact profond sur mon bien-être.",
    author: "Laurent M.",
    rating: 5
  },
  {
    content: "Je recommande vivement Joy pour son professionnalisme, son écoute et sa bienveillance. Les séances m'ont permis de me libérer de certains blocages.",
    author: "Amine R.",
    rating: 5
  }
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          weight="fill"
          className={`w-4 h-4 ${i < rating ? 'text-[#00b67a]' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
};

export default function Testimonials() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Témoignages
          </h2>
          <div className="mt-4 flex justify-center">
            <div className="inline-flex items-center gap-0.5 bg-[#00b67a] px-4 py-2 rounded">
              <Star weight="fill" className="w-5 h-5 text-white" />
              <span className="ml-2 text-white font-semibold">Excellent</span>
            </div>
          </div>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Ce que nos clients disent de leur expérience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <div className="h-full bg-white p-8 rounded-2xl shadow-sm ring-1 ring-gray-200">
                <StarRating rating={testimonial.rating} />
                <blockquote className="mt-6 text-base leading-7 text-gray-700 min-h-[150px]">
                  "{testimonial.content}"
                </blockquote>
                <div className="mt-6 border-t border-gray-100 pt-4">
                  <cite className="text-sm font-semibold text-gray-900 not-italic">
                    {testimonial.author}
                  </cite>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 
