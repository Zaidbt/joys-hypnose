import { Metadata } from 'next';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MedicalBusiness',
  name: "Joy's Hypnose - Services d'Hypnothérapie",
  '@id': 'https://joyshypnose-therapies.com/services',
  url: 'https://joyshypnose-therapies.com/services',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: "Services d'hypnothérapie",
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Hypnose-Thérapies',
          description: 'Séances personnalisées d\'hypnothérapie transformative',
          provider: {
            '@type': 'LocalBusiness',
            name: "Joy's Hypnose"
          }
        },
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: '700',
          priceCurrency: 'MAD'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Constellation familiale Individuelle',
          description: 'Séances de constellation familiale pour résoudre les problématiques transgénérationnelles'
        },
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: '700',
          priceCurrency: 'MAD'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Thérapie Sonore/Sound Bath',
          description: 'Séances de thérapie par le son pour la relaxation profonde'
        },
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: '700',
          priceCurrency: 'MAD'
        }
      }
    ]
  }
};

export const metadata: Metadata = {
  title: "Services d'Hypnothérapie | Joy's Hypnose Casablanca",
  description: "Explorez nos services d'hypnothérapie à Casablanca : hypnose transformative, constellations familiales, thérapie sonore, et plus. Solutions personnalisées pour votre bien-être et développement personnel.",
  keywords: [
    "services hypnothérapie",
    "hypnose transformative",
    "constellation familiale",
    "thérapie sonore",
    "sound bath",
    "numérologie",
    "chamanisme",
    "neuro-programmation quantique"
  ],
  openGraph: {
    title: "Services d'Hypnothérapie | Joy's Hypnose Casablanca",
    description: "Explorez nos services d'hypnothérapie à Casablanca : hypnose transformative, constellations familiales, thérapie sonore, et plus.",
    type: 'website',
    locale: 'fr_FR',
    url: 'https://joyshypnose-therapies.com/services',
    siteName: "Joy's Hypnose",
    images: [
      {
        url: 'https://joyshypnose-therapies.com/images/services-og.jpg',
        width: 1200,
        height: 630,
        alt: "Services d'hypnothérapie à Casablanca",
      },
    ],
  },
};

// Add JSON-LD structured data
export const generateMetadata = () => {
  return {
    ...metadata,
    alternates: {
      canonical: 'https://joyshypnose-therapies.com/services'
    },
    other: {
      'script:ld+json': JSON.stringify(jsonLd)
    }
  };
}; 