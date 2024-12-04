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

    // Parse the selected time
    const selectedTime = new Date(body.startTime);
    const selectedHour = selectedTime.getHours();
    const selectedMinutes = selectedTime.getMinutes();

    // Create the next hour time
    const nextHourTime = new Date(body.startTime);
    nextHourTime.setHours(selectedHour + 1, selectedMinutes);

    // Validate if the appointment is within working hours
    const [startWorkHour, startWorkMinute] = settings.workingHours.start.split(':').map(Number);
    const [endWorkHour, endWorkMinute] = settings.workingHours.end.split(':').map(Number);
    
    const workStart = new Date(selectedTime);
    workStart.setHours(startWorkHour, startWorkMinute, 0, 0);
    
    const workEnd = new Date(selectedTime);
    workEnd.setHours(endWorkHour, endWorkMinute, 0, 0);

    // For first-time clients, we need to ensure both hours are within working hours
    if (body.isFirstTime) {
      const secondHourEnd = new Date(nextHourTime);
      secondHourEnd.setHours(selectedHour + 2, selectedMinutes);
      
      if (selectedTime < workStart || secondHourEnd > workEnd) {
        return NextResponse.json(
          { error: 'Two-hour appointment must be within working hours' },
          { status: 400 }
        );
      }
    } else {
      if (selectedTime < workStart || nextHourTime > workEnd) {
        return NextResponse.json(
          { error: 'Appointment must be within working hours' },
          { status: 400 }
        );
      }
    }

    // Check for existing appointments in the selected hour
    const existingAppointments = await appointmentsCollection.find({
      startTime: {
        $gte: new Date(selectedTime.setHours(selectedHour, 0, 0, 0)),
        $lt: new Date(selectedTime.setHours(selectedHour + (body.isFirstTime ? 2 : 1), 0, 0, 0))
      },
      status: { $in: ['booked', 'pending'] }
    }).toArray();

    if (existingAppointments.length > 0) {
      return NextResponse.json(
        { error: body.isFirstTime ? 
          'One or both hours are not available for a 2-hour appointment' : 
          'Time slot already booked' },
        { status: 409 }
      );
    }

    // Create the appointment with explicit start and end times
    const startTime = new Date(body.startTime);
    const endTime = new Date(body.startTime);
    endTime.setHours(startTime.getHours() + (body.isFirstTime ? 2 : 1));

    const appointment = {
      startTime: startTime,
      endTime: endTime,
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