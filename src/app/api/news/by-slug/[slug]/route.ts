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

    // Build query
    const query = isAdmin ? { slug: params.slug } : { slug: params.slug, status: 'published' };

    const newsItem = await newsCollection.findOne(query);

    if (!newsItem) {
      return NextResponse.json(
        { success: false, error: 'News item not found' },
        { status: 404 }
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