import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    const client = await clientPromise;
    const db = client.db('joys_db');
    
    // Get all appointments
    const appointments = await db.collection('appointments').find({}).toArray();
    
    // Calculate stats
    const stats = {
      appointments: {
        total: appointments.length,
        confirmed: appointments.filter(a => a.status === 'confirmed').length,
        pending: appointments.filter(a => a.status === 'pending').length,
        cancelled: appointments.filter(a => a.status === 'cancelled').length,
      },
      clients: {
        total: new Set(appointments.map(a => a.clientEmail)).size,
        firstTime: appointments.filter(a => a.isFirstTime).length,
        returning: appointments.filter(a => !a.isFirstTime).length,
      },
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

export async function POST() {
  // Handle POST the same way as GET for now
  return GET();
} 