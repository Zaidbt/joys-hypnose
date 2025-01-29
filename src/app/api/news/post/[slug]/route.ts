import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const { slug } = params;

    const news = await db.collection('news').findOne({ slug });

    if (!news) {
      return NextResponse.json(
        { error: 'News item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: news });
  } catch (error) {
    console.error('Error fetching news item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 