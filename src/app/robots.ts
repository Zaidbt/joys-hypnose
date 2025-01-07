import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/joyspanel/', '/api/'],
    },
    sitemap: 'https://joyshypnose-therapies.com/sitemap.xml',
  };
} 