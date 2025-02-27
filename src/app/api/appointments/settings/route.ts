import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';
import clientPromise from '@/lib/mongodb';
import type { AppointmentSettings } from '@/types/appointment';

const DEFAULT_PRICES = {
  firstSession: 700,
  followUpSession: 700
};

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('joyshypnose');
    const settingsCollection = db.collection('appointment_settings');

    const settings = await settingsCollection.findOne({});
    console.log('Retrieved settings:', settings);

    if (!settings) {
      const defaultSettings: AppointmentSettings = {
        workingHours: { start: '09:00', end: '18:00' },
        workingDays: [1, 2, 3, 4, 5],
        slotDuration: 60,
        breakDuration: 15,
        maxAdvanceBooking: 30,
        fictionalBookingPercentage: 30,
        blockedDateRanges: [],
        prices: DEFAULT_PRICES
      };
      
      await settingsCollection.insertOne(defaultSettings);
      return NextResponse.json(defaultSettings);
    }

    // Ensure prices exist in settings
    if (!settings.prices) {
      const updatedSettings = {
        ...settings,
        prices: DEFAULT_PRICES
      };
      await settingsCollection.updateOne(
        { _id: settings._id },
        { $set: { prices: DEFAULT_PRICES } }
      );
      return NextResponse.json(updatedSettings);
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
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings: AppointmentSettings = await request.json();
    console.log('Received settings update:', settings);

    const client = await clientPromise;
    const db = client.db('joyshypnose');
    const settingsCollection = db.collection('appointment_settings');

    // Validate required fields
    if (!settings.workingHours || !settings.workingDays || !settings.slotDuration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

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

    // Find the existing settings document
    const existingSettings = await settingsCollection.findOne({});

    // Remove _id from settings object if it exists
    const { _id, ...settingsWithoutId } = settings as any;

    let result;
    if (existingSettings) {
      // Update existing document
      result = await settingsCollection.updateOne(
        { _id: existingSettings._id },
        { 
          $set: {
            ...settingsWithoutId,
            updatedAt: new Date()
          }
        }
      );
    } else {
      // Insert new document
      result = await settingsCollection.insertOne({
        ...settingsWithoutId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    console.log('Settings update result:', result);

    if (result.acknowledged) {
      // Fetch and return the updated settings
      const updatedSettings = await settingsCollection.findOne({});
      return NextResponse.json(updatedSettings);
    } else {
      throw new Error('Failed to update settings');
    }
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update settings' },
      { status: 500 }
    );
  }
} 