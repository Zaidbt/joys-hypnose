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
    
    // Get all data in parallel
    const [appointments, subscribers] = await Promise.all([
      db.collection('appointments').find({}).toArray(),
      db.collection('newsletter').find({}).toArray()
    ]);

    console.log('Fetching data from database...');
    console.log('Total appointments found:', appointments.length);
    console.log('Total subscribers found:', subscribers.length);
    
    // Calculate today's appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayAppointments = appointments.filter(a => {
      const appointmentDate = new Date(a.startTime);
      return appointmentDate >= today && appointmentDate < tomorrow;
    });

    // Calculate stats
    const stats = {
      appointments: {
        total: appointments.length,
        confirmed: appointments.filter(a => a.status === 'confirmed').length,
        pending: appointments.filter(a => a.status === 'pending').length,
        cancelled: appointments.filter(a => a.status === 'cancelled').length,
        today: todayAppointments.length,
        upcoming: appointments.filter(a => new Date(a.startTime) >= today).length
      },
      clients: {
        total: new Set(appointments.map(a => a.clientEmail)).size,
        firstTime: appointments.filter(a => a.isFirstTime).length,
        returning: appointments.filter(a => !a.isFirstTime).length,
      },
      newsletter: {
        total: subscribers.length,
        active: subscribers.filter(s => s.status === 'Actif').length,
        unsubscribed: subscribers.filter(s => s.status !== 'Actif').length,
      }
    };

    // Calculate confirmation rate
    const totalNonCancelled = stats.appointments.confirmed + stats.appointments.pending;
    stats.appointments.confirmationRate = totalNonCancelled > 0 
      ? Math.round((stats.appointments.confirmed / totalNonCancelled) * 100)
      : 0;

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

export async function POST() {
  return GET();
} 