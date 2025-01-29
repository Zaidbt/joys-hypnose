import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';
import clientPromise from '@/lib/mongodb';
import type { NewsItem, NewsResponse } from '@/types/news';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';

// Helper function to generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function GET(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);

    // Build query
    const query: any = { status: 'published' };
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    if (type && type !== 'all') {
      query.type = type;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
      ];
    }

    // Fetch news items
    const news = await db
      .collection('news')
      .find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .toArray();

    return NextResponse.json({ data: news });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('joyshypnose');
    const newsCollection = db.collection('news');

    // Validate required fields
    if (!body.title || !body.content || !body.type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const baseSlug = generateSlug(body.title);
    let slug = baseSlug;
    let counter = 1;

    // Check for slug uniqueness
    while (await newsCollection.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newsItem: NewsItem = {
      ...body,
      slug,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: body.status || 'draft',
      publishedAt: body.status === 'published' ? new Date() : undefined
    };

    const result = await newsCollection.insertOne(newsItem);

    const response: NewsResponse = {
      success: true,
      data: {
        ...newsItem,
        _id: result.insertedId.toString()
      }
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create news' },
      { status: 500 }
    );
  }
} 