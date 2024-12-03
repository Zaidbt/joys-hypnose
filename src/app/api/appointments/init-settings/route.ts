import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';
import clientPromise from '@/lib/mongodb';

const defaultSettings = {
  workingHours: {
    start: "09:00",
    end: "18:00"
  },
  workingDays: [1, 2, 3, 4, 5], // Monday to Friday
  slotDuration: 60, // 60 minutes per slot
  breakDuration: 15, // 15 minutes break between slots
  maxAdvanceBooking: 30, // Book up to 30 days in advance
  fictionalBookingPercentage: 30 // 30% of slots will be shown as fictitious
};

export async function POST() {
  const client = await clientPromise;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = client.db('joyshypnose');
    const settingsCollection = db.collection('appointment_settings');

    // Check if settings already exist
    const existingSettings = await settingsCollection.findOne({});
    
    if (!existingSettings) {
      await settingsCollection.insertOne({
        ...defaultSettings,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return NextResponse.json({
        success: true,
        message: 'Settings initialized successfully'
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Settings already exist',
      settings: existingSettings
    });

  } catch (error) {
    console.error('Error initializing settings:', error);
    return NextResponse.json(
      { error: 'Failed to initialize settings' },
      { status: 500 }
    );
  }
} 