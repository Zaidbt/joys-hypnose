import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get search query from URL
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ clients: [] });
    }

    const client = await clientPromise;
    const db = client.db('joyshypnose');
    const appointmentsCollection = db.collection('appointments');

    // Search for clients with name, email, or phone matching the query
    const clients = await appointmentsCollection.aggregate([
      {
        $match: {
          $or: [
            { clientName: { $regex: query, $options: 'i' } },
            { clientEmail: { $regex: query, $options: 'i' } },
            { clientPhone: { $regex: query, $options: 'i' } }
          ]
        }
      },
      {
        $group: {
          _id: {
            name: '$clientName',
            email: '$clientEmail',
            phone: '$clientPhone'
          },
          lastVisit: { $max: '$startTime' },
          visitCount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          name: '$_id.name',
          email: '$_id.email',
          phone: '$_id.phone',
          lastVisit: 1,
          visitCount: 1
        }
      },
      {
        $sort: { lastVisit: -1 }
      },
      {
        $limit: 5
      }
    ]).toArray();

    return NextResponse.json({ clients });
  } catch (error) {
    console.error('Error searching clients:', error);
    return NextResponse.json(
      { error: 'Failed to search clients' },
      { status: 500 }
    );
  }
} 