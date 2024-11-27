import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import type { BlogPost } from '@/types/blog';

// Cache for blog posts
let postsCache: any = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60000; // 1 minute cache

async function getPosts(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && postsCache && (now - lastFetchTime) < CACHE_DURATION) {
    return postsCache;
  }

  const client = await clientPromise;
  const db = client.db('joyshypnose');
  const blogCollection = db.collection('blog_posts');

  const posts = await blogCollection
    .find({})
    .sort({ createdAt: -1 })
    .project({
      title: 1,
      excerpt: 1,
      featuredImage: 1,
      tags: 1,
      createdAt: 1,
      author: 1
    })
    .toArray();

  postsCache = posts.map(post => ({
    ...post,
    _id: post._id.toString()
  }));
  lastFetchTime = now;

  return postsCache;
}

export async function POST(request: Request) {
  const client = await clientPromise;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, excerpt, content, tags, featuredImage } = body as BlogPost;

    if (!title || !excerpt || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = client.db('joyshypnose');
    const blogCollection = db.collection('blog_posts');

    const newPost = {
      title,
      excerpt,
      content,
      featuredImage,
      readingTime: body.readingTime || 1,
      tags: tags || [],
      author: session.user.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await blogCollection.insertOne(newPost);
    
    // Invalidate cache after new post
    postsCache = null;

    return NextResponse.json({
      success: true,
      data: {
        _id: result.insertedId.toString(),
        ...newPost
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get('refresh') === 'true';
    
    const posts = await getPosts(forceRefresh);
    
    return new NextResponse(JSON.stringify(posts), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
} 