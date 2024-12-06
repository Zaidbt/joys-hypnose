import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';
import clientPromise from '@/lib/mongodb';
import type { TimeSlot, AppointmentSettings } from '@/types/appointment';

// Cache for appointments
let slotsCache: any = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60000; // 1 minute cache

async function getAppointments(startDate: Date, endDate: Date, forceRefresh = false) {
  const now = Date.now();
  const cacheKey = `${startDate.toISOString()}-${endDate.toISOString()}`;
  
  if (!forceRefresh && slotsCache?.[cacheKey] && (now - lastFetchTime) < CACHE_DURATION) {
    return slotsCache[cacheKey];
  }

  const client = await clientPromise;
  const db = client.db('joyshypnose');
  const appointmentsCollection = db.collection('appointments');

  const slots = await appointmentsCollection
    .find({
      startTime: { 
        $gte: startDate,
        $lte: endDate
      }
    })
    .sort({ startTime: 1 })
    .toArray();

  if (!slotsCache) slotsCache = {};
  slotsCache[cacheKey] = slots.map(slot => ({
    ...slot,
    _id: slot._id.toString()
  }));
  lastFetchTime = now;

  return slotsCache[cacheKey];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = new Date(searchParams.get('start') || new Date());
    const endDate = new Date(searchParams.get('end') || new Date());
    
    const client = await clientPromise;
    const db = client.db('joyshypnose');
    const appointmentsCollection = db.collection('appointments');

    const appointments = await appointmentsCollection
      .find({
        startTime: {
          $gte: startDate,
          $lte: endDate
        }
      })
      .sort({ startTime: 1 })
      .toArray();

    return new NextResponse(JSON.stringify(appointments.map(apt => ({
      ...apt,
      _id: apt._id.toString()
    }))), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const client = await clientPromise;
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const isAdmin = !!session;

    // Validate the request
    if (!body.startTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // If not admin, additional validation for client bookings
    if (!isAdmin) {
      if (!body.clientName || !body.clientEmail) {
        return NextResponse.json(
          { error: 'Client information required' },
          { status: 400 }
        );
      }
    }

    const db = client.db('joyshypnose');
    const appointmentsCollection = db.collection('appointments');
    const settingsCollection = db.collection('appointment_settings');

    // Get settings to validate working hours
    const settings = await settingsCollection.findOne({});
    if (!settings) {
      return NextResponse.json(
        { error: 'Settings not found' },
        { status: 404 }
      );
    }

    // Create appointment start time
    const appointmentStart = new Date(body.startTime);
    console.log('Appointment start time:', appointmentStart);

    // Calculate appointment end time based on duration
    const appointmentEnd = new Date(appointmentStart);
    appointmentEnd.setHours(appointmentStart.getHours() + (body.isFirstTime ? 2 : 1));
    console.log('Appointment end time:', appointmentEnd);

    // Create working hours boundaries for the appointment date
    const [startWorkHour, startWorkMinute] = settings.workingHours.start.split(':').map(Number);
    const [endWorkHour, endWorkMinute] = settings.workingHours.end.split(':').map(Number);
    
    const workStart = new Date(appointmentStart);
    workStart.setHours(startWorkHour, startWorkMinute, 0, 0);
    
    const workEnd = new Date(appointmentStart);
    workEnd.setHours(endWorkHour, endWorkMinute, 0, 0);

    console.log('Working hours:', {
      start: workStart,
      end: workEnd,
      appointmentStart,
      appointmentEnd
    });

    // Validate working hours with strict boundary checking
    if (appointmentStart < workStart || appointmentEnd > workEnd) {
      return NextResponse.json(
        { error: body.isFirstTime ? 
          'La séance de 2 heures doit être comprise dans les heures de travail (9h-17h)' : 
          'Le rendez-vous doit être compris dans les heures de travail (9h-17h)' },
        { status: 400 }
      );
    }

    // Check for existing appointments with precise overlap detection
    const existingAppointments = await appointmentsCollection.find({
      $and: [
        // Appointment date must be the same
        {
          startTime: {
            $gte: new Date(appointmentStart.setHours(0, 0, 0, 0)),
            $lt: new Date(appointmentStart.setHours(23, 59, 59, 999))
          }
        },
        // Check for any overlap
        {
          $or: [
            // New appointment starts during an existing one
            {
              startTime: { $lt: appointmentEnd },
              endTime: { $gt: appointmentStart }
            },
            // New appointment contains an existing one
            {
              startTime: { $gte: appointmentStart },
              endTime: { $lte: appointmentEnd }
            }
          ]
        }
      ],
      status: { $in: ['booked', 'pending'] }
    }).toArray();

    if (existingAppointments.length > 0) {
      console.log('Found conflicting appointments:', existingAppointments);
      return NextResponse.json(
        { error: body.isFirstTime ? 
          'Une ou les deux heures ne sont pas disponibles pour une séance de 2 heures' : 
          'Ce créneau est déjà réservé' },
        { status: 409 }
      );
    }

    const appointment = {
      startTime: appointmentStart,
      endTime: appointmentEnd,
      status: isAdmin ? (body.status || 'available') : 'pending',
      clientName: body.clientName,
      clientEmail: body.clientEmail,
      clientPhone: body.clientPhone,
      notes: body.notes,
      isFirstTime: body.isFirstTime || false,
      isFictitious: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('Creating appointment:', appointment);

    const result = await appointmentsCollection.insertOne(appointment);
    
    // Invalidate cache
    slotsCache = null;

    return NextResponse.json({
      success: true,
      data: {
        ...appointment,
        _id: result.insertedId.toString()
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
} 