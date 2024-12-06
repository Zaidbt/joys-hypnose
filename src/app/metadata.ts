import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Joy's Hypnose | Hypnothérapie à Casablanca",
  description: "Découvrez l'hypnothérapie à Casablanca avec Joy's Hypnose. Séances personnalisées pour stress, anxiété, confiance en soi et plus encore.",
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
      {
        url: '/favicon-16x16.png',
        type: 'image/png',
        sizes: '16x16',
      },
      {
        url: '/favicon-32x32.png',
        type: 'image/png',
        sizes: '32x32',
      },
      {
        url: '/apple-touch-icon.png',
        type: 'image/png',
        sizes: '180x180',
      },
    ],
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
      },
    ],
  },
  manifest: '/site.webmanifest',
}; 