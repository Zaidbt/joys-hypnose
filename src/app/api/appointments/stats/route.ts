import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  const client = await clientPromise;
  try {
    const db = client.db('joyshypnose');
    const appointmentsCollection = db.collection('appointments');

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get confirmed appointments (booked)
    const totalConfirmedAppointments = await appointmentsCollection.countDocuments({
      status: 'booked'
    });

    // Get pending appointments (both real and fictitious that need confirmation)
    const pendingAppointments = await appointmentsCollection.countDocuments({
      status: { $in: ['pending', 'fictitious'] }
    });

    // Get today's appointments (only confirmed ones)
    const todayAppointments = await appointmentsCollection.countDocuments({
      startTime: {
        $gte: today,
        $lt: tomorrow
      },
      status: 'booked'
    });

    return NextResponse.json({
      totalAppointments: totalConfirmedAppointments,
      pendingAppointments,
      todayAppointments
    });
  } catch (error) {
    console.error('Error fetching appointment stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointment stats' },
      { status: 500 }
    );
  }
} 