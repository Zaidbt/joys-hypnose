import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';
import clientPromise from '@/lib/mongodb';
import type { NewsResponse } from '@/types/news';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db('joyshypnose');
    const newsCollection = db.collection('news');

    // Check if request is from admin panel
    const session = await getServerSession(authOptions);
    const isAdmin = !!session;

    // Decode the slug
    const decodedSlug = decodeURIComponent(params.slug);
    console.log('Looking for news item with decoded slug:', decodedSlug);

    // First find the news item regardless of status
    const newsItem = await newsCollection.findOne({ slug: decodedSlug });
    console.log('Found news item:', newsItem);

    if (!newsItem) {
      console.log('No news item found for slug:', decodedSlug);
      return NextResponse.json(
        { success: false, error: 'News item not found' },
        { status: 404 }
      );
    }

    // Then check status if not admin
    if (!isAdmin && newsItem.status !== 'published') {
      console.log('News item exists but is not published:', newsItem.status);
      return NextResponse.json(
        { success: false, error: 'Article non disponible' },
        { status: 403 }
      );
    }

    const response: NewsResponse = {
      success: true,
      data: {
        ...newsItem,
        _id: newsItem._id.toString()
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching news item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news item' },
      { status: 500 }
    );
  }
} 