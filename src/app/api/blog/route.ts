import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';
import clientPromise from '@/lib/mongodb';
import type { BlogPost } from '@/types/blog';

// Cache for blog posts
let postsCache: any = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60000; // 1 minute cache

function generateSlug(title: string, id: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') + '-' + id.substring(0, 6);
}

async function getPosts(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && postsCache && (now - lastFetchTime) < CACHE_DURATION) {
    return postsCache;
  }

  const client = await clientPromise;
  const db = client.db('joyshypnose');
  const blogCollection = db.collection('blog_posts');

  console.log('Fetching posts from database...');

  const posts = await blogCollection
    .find({})
    .sort({ createdAt: -1 })
    .project({
      title: 1,
      slug: 1,
      excerpt: 1,
      featuredImage: 1,
      tags: 1,
      createdAt: 1,
      author: 1,
      content: 1
    })
    .toArray();

  console.log('Found posts:', posts.length);

  postsCache = posts.map(post => {
    const postId = post._id.toString();
    return {
      ...post,
      _id: postId,
      slug: post.slug || generateSlug(post.title, postId)
    };
  });
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
        { error: 'Missing required fields (title, excerpt, content)' },
        { status: 400 }
      );
    }

    const db = client.db('joyshypnose');
    const blogCollection = db.collection('blog_posts');

    // Generate slug from title
    const tempId = new Date().getTime().toString();
    const slug = generateSlug(title, tempId);

    // Check if slug already exists
    const existingPost = await blogCollection.findOne({ slug });
    if (existingPost) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 400 }
      );
    }

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
      slug
    };

    const result = await blogCollection.insertOne(newPost);
    
    // Invalidate cache after new post
    postsCache = null;

    return NextResponse.json({
      success: true,
      data: {
        ...newPost,
        _id: result.insertedId.toString()
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
    
    console.log('GET /api/blog - Fetching posts...');
    const posts = await getPosts(forceRefresh);
    console.log('Returning posts:', posts.length);
    
    return new NextResponse(JSON.stringify(posts), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
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