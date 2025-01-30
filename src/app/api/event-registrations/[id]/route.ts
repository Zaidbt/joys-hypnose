import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import type { EventRegistrationResponse } from '@/types/news';

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
    const registrationsCollection = db.collection('event_registrations');

    // Validate status
    if (!body.status || !['confirmed', 'cancelled'].includes(body.status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      );
    }

    const result = await registrationsCollection.findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          status: body.status,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Registration not found' },
        { status: 404 }
      );
    }

    const response: EventRegistrationResponse = {
      success: true,
      data: {
        ...result,
        _id: result._id.toString()
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating registration:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update registration' },
      { status: 500 }
    );
  }
} 