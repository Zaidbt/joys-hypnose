import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';
import clientPromise from '@/lib/mongodb';

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomTime(startHour: number, endHour: number) {
  const hour = getRandomInt(startHour + 1, endHour - 1);
  return `${hour.toString().padStart(2, '0')}:00`;
}

function getRandomAppointmentCount() {
  const rand = Math.random();
  if (rand < 1/3) return 1;
  if (rand < 2/3) return 2;
  return 3;
}

export async function POST() {
  const client = await clientPromise;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = client.db('joyshypnose');
    const appointmentsCollection = db.collection('appointments');
    const settingsCollection = db.collection('appointment_settings');

    const settings = await settingsCollection.findOne({});
    if (!settings) {
      return NextResponse.json(
        { error: 'Settings not found' },
        { status: 404 }
      );
    }

    const { workingHours, workingDays } = settings;
    const [startHour] = workingHours.start.split(':').map(Number);
    const [endHour] = workingHours.end.split(':').map(Number);

    const appointments = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(currentDate.getDate() + i);

      if (currentDate.getDay() === 0) continue;

      const existingAppointments = await appointmentsCollection.countDocuments({
        startTime: {
          $gte: new Date(currentDate.setHours(0, 0, 0, 0)),
          $lt: new Date(currentDate.setHours(23, 59, 59, 999))
        },
        isFictitious: true
      });

      if (existingAppointments >= 3) continue;

      const appointmentsToCreate = Math.min(
        getRandomAppointmentCount(),
        3 - existingAppointments
      );

      const usedTimes = new Set();

      for (let j = 0; j < appointmentsToCreate; j++) {
        let timeSlot;
        do {
          timeSlot = getRandomTime(startHour, endHour);
        } while (usedTimes.has(timeSlot));

        usedTimes.add(timeSlot);
        const [hours, minutes] = timeSlot.split(':').map(Number);
        
        const startTime = new Date(currentDate);
        startTime.setHours(hours, minutes, 0, 0);
        
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + settings.slotDuration);

        appointments.push({
          startTime,
          endTime,
          isFictitious: true,
          clientName: `Client ${Math.floor(Math.random() * 1000)}`,
          clientEmail: `client${Math.floor(Math.random() * 1000)}@example.com`,
          clientPhone: '+41 XX XXX XX XX',
          status: 'fictitious',
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    if (appointments.length > 0) {
      await appointmentsCollection.insertMany(appointments);
    }

    return NextResponse.json({
      success: true,
      message: `Generated ${appointments.length} fictitious appointments`
    });

  } catch (error) {
    console.error('Error generating fictitious appointments:', error);
    return NextResponse.json(
      { error: 'Failed to generate appointments' },
      { status: 500 }
    );
  }
} 