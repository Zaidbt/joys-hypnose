import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  const client = await clientPromise;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = client.db('joyshypnose');
    const appointmentsCollection = db.collection('appointments');

    // Get all appointments with client information
    const appointments = await appointmentsCollection
      .find({
        clientName: { $exists: true },
        status: { $in: ['booked', 'pending', 'cancelled'] }
      })
      .sort({ startTime: -1 })
      .toArray();

    // Process appointments to add visit count
    const clientVisits = appointments.reduce((acc: { [key: string]: number }, curr) => {
      const email = curr.clientEmail;
      if (email) {
        acc[email] = (acc[email] || 0) + 1;
      }
      return acc;
    }, {});

    const clientRecords = appointments.map(appointment => ({
      ...appointment,
      _id: appointment._id.toString(),
      visitCount: appointment.clientEmail ? clientVisits[appointment.clientEmail] : 1
    }));

    return NextResponse.json(clientRecords);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
} 