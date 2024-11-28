import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAllPosts, createPost } from '@/lib/blog-service';
import type { BlogPost } from '@/types/blog';

// Cache for blog posts
let postsCache: any = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60000; // 1 minute cache

async function getPosts(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && postsCache && (now - lastFetchTime) < CACHE_DURATION) {
    console.log('Returning cached posts:', postsCache);
    return postsCache;
  }

  try {
    console.log('Fetching posts from MongoDB...');
    const posts = await getAllPosts();
    console.log('Raw posts from MongoDB:', posts);
    console.log('Number of posts found:', posts.length);

    postsCache = posts;
    lastFetchTime = now;

    return postsCache;
  } catch (error) {
    console.error('Error in getPosts:', error);
    throw error;
  }
}

export async function POST(request: Request) {
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

    const newPost = await createPost({
      title,
      excerpt,
      content,
      featuredImage,
      readingTime: body.readingTime || 1,
      tags: tags || [],
    });
    
    // Invalidate cache after new post
    postsCache = null;

    return NextResponse.json({
      success: true,
      data: newPost
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
    
    return NextResponse.json({
      success: true,
      data: posts
    }, {
      headers: {
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