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
    const db = client.db('joyshypnose');
    
    // Get all appointments with debug logging
    console.log('Fetching appointments from database...');
    const appointments = await db.collection('appointments').find({}).toArray();
    console.log('Total appointments found:', appointments.length);
    console.log('Appointment statuses:', appointments.map(a => a.status));
    
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

    console.log('Calculated stats:', stats);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return new NextResponse(JSON.stringify({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
    });
  }
}

// Handle both GET and POST methods
export async function POST() {
  return GET();
} 