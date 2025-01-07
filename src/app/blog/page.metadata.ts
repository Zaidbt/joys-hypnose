import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Blog Hypnothérapie | Joy's Hypnose Casablanca",
  description: "Découvrez nos articles sur l'hypnothérapie, le développement personnel, la thérapie sonore et les constellations familiales. Conseils et insights pour votre bien-être.",
  keywords: [
    "blog hypnothérapie",
    "articles développement personnel",
    "conseils bien-être",
    "hypnose blog",
    "thérapie holistique",
    "santé mentale",
    "méditation",
    "croissance personnelle"
  ],
  openGraph: {
    title: "Blog Hypnothérapie | Joy's Hypnose Casablanca",
    description: "Découvrez nos articles sur l'hypnothérapie, le développement personnel, la thérapie sonore et les constellations familiales.",
    type: 'website',
    locale: 'fr_FR',
    url: 'https://joyshypnose-therapies.com/blog',
    siteName: "Joy's Hypnose",
    images: [
      {
        url: 'https://joyshypnose-therapies.com/images/blog-og.jpg',
        width: 1200,
        height: 630,
        alt: "Blog d'hypnothérapie et développement personnel",
      },
    ],
  },
}; 