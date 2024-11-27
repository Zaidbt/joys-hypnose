import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import type { ClientRecord } from '@/types/appointment';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

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
        email: { $exists: true },
        status: { $in: ['booked', 'pending', 'cancelled'] }
      })
      .sort({ date: -1, time: -1 })
      .toArray();

    // Process appointments to add visit count
    const clientVisits = appointments.reduce((acc: { [key: string]: number }, curr) => {
      const email = curr.email;
      if (email) {
        acc[email] = (acc[email] || 0) + 1;
      }
      return acc;
    }, {});

    const clientRecords = appointments.map(appointment => ({
      ...appointment,
      _id: appointment._id.toString(),
      visitCount: appointment.email ? clientVisits[appointment.email] : 1,
      lastVisit: new Date(`${appointment.date}T${appointment.time}`)
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