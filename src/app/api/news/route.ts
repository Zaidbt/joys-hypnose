import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';
import clientPromise from '@/lib/mongodb';
import type { NewsItem, NewsResponse } from '@/types/news';
import { ObjectId } from 'mongodb';

// Helper function to generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const client = await clientPromise;
    const db = client.db('joyshypnose');
    const newsCollection = db.collection('news');

    // Build query
    const query: any = {};
    if (type) query.type = type;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count for pagination
    const total = await newsCollection.countDocuments(query);

    // Fetch news items with pagination
    const news = await newsCollection
      .find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const response: NewsResponse = {
      success: true,
      data: news.map(item => ({
        ...item,
        _id: item._id.toString()
      })),
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
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