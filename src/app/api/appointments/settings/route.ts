import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';
import clientPromise from '@/lib/mongodb';
import type { AppointmentSettings } from '@/types/appointment';

export async function GET() {
  const client = await clientPromise;
  try {
    const db = client.db('joyshypnose');
    const settingsCollection = db.collection('appointment_settings');

    const settings = await settingsCollection.findOne({});
    if (!settings) {
      return NextResponse.json(
        { error: 'Settings not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const client = await clientPromise;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Updating settings with:', body);

    const {
      workingHours,
      workingDays,
      slotDuration,
      breakDuration,
      maxAdvanceBooking,
      fictionalBookingPercentage
    } = body as AppointmentSettings;

    // Validate settings
    if (!workingHours || !workingDays || !slotDuration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = client.db('joyshypnose');
    const settingsCollection = db.collection('appointment_settings');

    const result = await settingsCollection.findOneAndUpdate(
      {},
      {
        $set: {
          workingHours,
          workingDays,
          slotDuration,
          breakDuration,
          maxAdvanceBooking,
          fictionalBookingPercentage,
          updatedAt: new Date()
        }
      },
      { upsert: true, returnDocument: 'after' }
    );

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
} 