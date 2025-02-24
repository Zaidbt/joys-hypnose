import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  const baseUrl = 'https://www.joyshypnose-therapies.com';
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/mon-approche`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/actualites`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/carte`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.7,
    },
  ];

  try {
    const client = await clientPromise;
    const db = client.db('joyshypnose');

    // Fetch blog posts
    const posts = await db.collection('posts')
      .find({ status: 'published' })
      .toArray();

    const blogPages = posts.map(post => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastmod: (post.updatedAt || post.createdAt).toISOString(),
      changefreq: 'weekly',
      priority: 0.7,
    }));

    // Fetch news items
    const news = await db.collection('news')
      .find({ status: 'published' })
      .toArray();

    const newsPages = news.map(item => ({
      url: `${baseUrl}/actualites/${item.slug}`,
      lastmod: (item.updatedAt || item.createdAt).toISOString(),
      changefreq: 'weekly',
      priority: 0.7,
    }));

    // Generate XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${[...staticPages, ...blogPages, ...newsPages]
    .map(
      page => `
    <url>
      <loc>${page.url}</loc>
      <lastmod>${page.lastmod}</lastmod>
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority}</priority>
    </url>`
    )
    .join('')}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
} 