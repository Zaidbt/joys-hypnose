'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon 
} from '@heroicons/react/24/outline';
import { Star, Sparkle, Flower, SpeakerHigh, NumberCircleEight, Leaf, Brain } from "@phosphor-icons/react";
import Hero from './components/Hero';
import MainSection from './components/MainSection';
import Features from './components/Features';
import ServicesGrid from './components/ServicesGrid';
import SessionSteps from './components/SessionSteps';
import NewsletterBanner from './components/NewsletterBanner';

const services = [
  {
    title: "Hypnose-Thérapies",
    Icon: Sparkle,
  },
  {
    title: "Constellation familiale Individuelle",
    Icon: Flower,
  },
  {
    title: "Thérapie Sonore/Sound Bath",
    Icon: SpeakerHigh,
  },
  {
    title: "Numérologie",
    Icon: NumberCircleEight,
  },
  {
    title: "Le chamanisme Sous Hypnose",
    Icon: Leaf,
  },
  {
    title: "La Neuro-programmation Quantique",
    Icon: Brain,
  }
];

const benefits = [
  "Approche personnalisée et bienveillante",
  "Techniques douces et naturelles",
  "Résultats durables",
  "Cadre apaisant et professionnel",
  "Suivi personnalisé",
  "Respect et confidentialité"
];

const testimonials = [
  {
    content: "Si vous êtes à un moment de votre vie, comme moi, où vous souhaitez reconnecter avec vous-même et vos ressources intérieures, un parcours d'hypnose transformatrice avec cette merveilleuse personne est exactement votre réponse.",
    author: "Solaine I.",
    rating: 5,
    date: "Il y a 2 semaines"
  },
  {
    content: "Une expérience incroyable et transformatrice. Joy a su créer un espace sûr et accueillant pour mon développement personnel. Les séances ont eu un impact profond sur mon bien-être.",
    author: "Laurent M.",
    rating: 5,
    date: "Il y a 1 mois"
  },
  {
    content: "Je recommande vivement Joy pour son professionnalisme, son écoute et sa bienveillance. Les séances m'ont permis de me libérer de certains blocages.",
    author: "Amine R.",
    rating: 5,
    date: "Il y a 2 mois"
  }
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          weight="fill"
          className={`w-5 h-5 ${i < rating ? 'text-[#00b67a]' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
};

export default function Home() {
  return (
    <main>
      <NewsletterBanner />
      <Hero />
      <MainSection />
      <Features />
      <ServicesGrid />
      <SessionSteps />
    </main>
  );
} 
