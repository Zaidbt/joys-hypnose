import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import type { BlogPost } from '@/types/blog';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const client = await clientPromise;
  try {
    const db = client.db('joyshypnose');
    const blogCollection = db.collection('blog_posts');

    const post = await blogCollection.findOne({
      _id: new ObjectId(params.id)
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const result = await blogCollection.findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          title,
          excerpt,
          content,
          featuredImage,
          readingTime: body.readingTime || 1,
          tags: tags || [],
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        _id: result._id.toString()
      }
    });

  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const client = await clientPromise;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = client.db('joyshypnose');
    const blogCollection = db.collection('blog_posts');

    const result = await blogCollection.deleteOne({
      _id: new ObjectId(params.id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
} 