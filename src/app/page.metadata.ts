import { Metadata } from 'next';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'MedicalBusiness'],
  name: "Joy's Hypnose",
  image: 'https://joyshypnose-therapies.com/images/og-image.jpg',
  '@id': 'https://joyshypnose-therapies.com',
  url: 'https://joyshypnose-therapies.com',
  telephone: '+212 123456789',
  priceRange: '700 DH',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Casablanca',
    addressLocality: 'Casablanca',
    addressRegion: 'Casablanca-Settat',
    postalCode: '20000',
    addressCountry: 'MA'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 33.5731,
    longitude: -7.5898
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00'
    }
  ],
  sameAs: [
    'https://www.instagram.com/joyshypnose',
    'https://www.facebook.com/joyshypnose'
  ]
};

export const metadata: Metadata = {
  title: "Joy's Hypnose | Hypnothérapie à Casablanca",
  description: "Découvrez l'hypnothérapie transformative à Casablanca. Séances personnalisées pour stress, anxiété, confiance en soi et développement personnel. Approche holistique combinant hypnose, thérapie sonore et constellations familiales.",
  keywords: [
    "hypnothérapie casablanca",
    "hypnose thérapeutique",
    "thérapie sonore",
    "constellation familiale",
    "développement personnel",
    "bien-être",
    "hypnose transformative",
    "thérapie holistique"
  ],
  openGraph: {
    title: "Joy's Hypnose | Hypnothérapie à Casablanca",
    description: "Découvrez l'hypnothérapie transformative à Casablanca. Séances personnalisées pour stress, anxiété, confiance en soi et développement personnel.",
    type: 'website',
    locale: 'fr_FR',
    url: 'https://joyshypnose-therapies.com',
    siteName: "Joy's Hypnose",
    images: [
      {
        url: 'https://joyshypnose-therapies.com/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: "Joy's Hypnose - Hypnothérapie à Casablanca",
      },
    ],
  },
  other: {
    'google-site-verification': '4jTYDU4kW_qD5ZkChniG6z1N7Ckjx7EBLMnVITkJKuo'
  }
};

// Add JSON-LD structured data
export const generateMetadata = () => {
  return {
    ...metadata,
    alternates: {
      canonical: 'https://joyshypnose-therapies.com'
    },
    other: {
      ...metadata.other,
      'script:ld+json': JSON.stringify(jsonLd)
    }
  };
}; 