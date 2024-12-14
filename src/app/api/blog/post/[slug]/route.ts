import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const client = await clientPromise;
  try {
    const db = client.db('joyshypnose');
    const blogCollection = db.collection('blog_posts');

    console.log('Fetching post with slug:', params.slug);

    const post = await blogCollection.findOne({
      slug: params.slug
    });

    if (!post) {
      console.log('Post not found for slug:', params.slug);
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    console.log('Found post:', post.title);

    return NextResponse.json({
      ...post,
      _id: post._id.toString()
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
} 