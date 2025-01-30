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
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9-\s]/g, '') // Keep only alphanumeric, hyphens and spaces
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with single hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/(^-|-$)/g, ''); // Remove leading/trailing hyphens
}

export async function GET(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);

    // Check if request is from admin panel
    const session = await getServerSession(authOptions);
    const isAdmin = !!session;

    // Build query
    const query: any = isAdmin ? {} : { status: 'published' };
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    if (type && type !== 'all') {
      query.type = type;
    }

    if (status && status !== 'all' && isAdmin) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
      ];
    }

    // Get total count for pagination
    const total = await db.collection('news').countDocuments(query);

    // Fetch news items
    const news = await db
      .collection('news')
      .find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(isAdmin ? (page - 1) * pageSize : 0)
      .limit(isAdmin ? pageSize : 100) // Allow up to 100 items for public page
      .toArray();

    // Prepare response
    const response: NewsResponse = {
      success: true,
      data: news,
      ...(isAdmin && {
        pagination: {
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize)
        }
      })
    };

    return NextResponse.json(response);
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