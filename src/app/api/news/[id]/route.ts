import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import type { NewsResponse } from '@/types/news';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication for admin panel
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db('joyshypnose');
    const newsCollection = db.collection('news');

    const newsItem = await newsCollection.findOne({
      _id: new ObjectId(params.id)
    });

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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // If this is just a status update
    if (Object.keys(body).length === 1 && body.status) {
      const updateData = {
        status: body.status,
        updatedAt: new Date(),
        ...(body.status === 'published' && { publishedAt: new Date() })
      };

      const result = await newsCollection.findOneAndUpdate(
        { _id: new ObjectId(params.id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      if (!result) {
        return NextResponse.json(
          { success: false, error: 'News item not found' },
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
    }

    // For full updates, validate required fields
    if (!body.title || !body.content || !body.type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const updateData = {
      ...body,
      updatedAt: new Date(),
      publishedAt: body.status === 'published' ? 
        (body.publishedAt || new Date()) : 
        body.publishedAt
    };

    const result = await newsCollection.findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'News item not found' },
        { status: 404 }
      );
    }

    const response: NewsResponse = {
      success: true,
      data: {
        ...result,
        _id: result._id.toString()
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating news item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update news item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db('joyshypnose');
    const newsCollection = db.collection('news');

    const result = await newsCollection.deleteOne({
      _id: new ObjectId(params.id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'News item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'News item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting news item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete news item' },
      { status: 500 }
    );
  }
} 