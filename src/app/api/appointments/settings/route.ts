import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import type { AppointmentSettings } from '@/types/appointment';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('joyshypnose');
    const settingsCollection = db.collection('appointment_settings');

    const settings = await settingsCollection.findOne({});
    if (!settings) {
      const defaultSettings: AppointmentSettings = {
        workingHours: { start: '09:00', end: '18:00' },
        workingDays: [1, 2, 3, 4, 5],
        slotDuration: 60,
        breakDuration: 15,
        maxAdvanceBooking: 30,
        fictionalBookingPercentage: 30,
        blockedDateRanges: []
      };
      
      await settingsCollection.insertOne(defaultSettings);
      return NextResponse.json(defaultSettings);
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
  try {
    const settings: AppointmentSettings = await request.json();
    const client = await clientPromise;
    const db = client.db('joyshypnose');
    const settingsCollection = db.collection('appointment_settings');

    // Ensure blockedDateRanges is an array
    if (!Array.isArray(settings.blockedDateRanges)) {
      settings.blockedDateRanges = [];
    }

    // Convert date strings to Date objects for proper storage
    settings.blockedDateRanges = settings.blockedDateRanges.map(range => ({
      ...range,
      startDate: new Date(range.startDate).toISOString(),
      endDate: new Date(range.endDate).toISOString()
    }));

    const result = await settingsCollection.updateOne(
      {},
      { $set: settings },
      { upsert: true }
    );

    if (result.acknowledged) {
      return NextResponse.json({ message: 'Settings updated successfully' });
    } else {
      throw new Error('Failed to update settings');
    }
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
} 