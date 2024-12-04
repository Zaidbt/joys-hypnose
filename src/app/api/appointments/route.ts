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
    if (!body.startTime || !body.endTime) {
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

    const startTime = new Date(body.startTime);
    const endTime = new Date(body.endTime);

    // Validate if the appointment is within working hours
    const [startHour, startMinute] = settings.workingHours.start.split(':').map(Number);
    const [endHour, endMinute] = settings.workingHours.end.split(':').map(Number);
    const workStart = new Date(startTime);
    workStart.setHours(startHour, startMinute, 0, 0);
    const workEnd = new Date(startTime);
    workEnd.setHours(endHour, endMinute, 0, 0);

    if (startTime < workStart || endTime > workEnd) {
      return NextResponse.json(
        { error: 'Appointment must be within working hours' },
        { status: 400 }
      );
    }

    // For first-time clients, validate that both hours are available
    if (body.isFirstTime) {
      const firstHourStart = new Date(startTime);
      const secondHourStart = new Date(startTime);
      secondHourStart.setTime(secondHourStart.getTime() + 60 * 60 * 1000); // Add 1 hour
      const slotEnd = new Date(startTime);
      slotEnd.setTime(slotEnd.getTime() + 120 * 60 * 1000); // Add 2 hours

      const existingAppointments = await appointmentsCollection.find({
        startTime: {
          $lt: slotEnd
        },
        endTime: {
          $gt: firstHourStart
        },
        status: { $in: ['booked', 'pending'] }
      }).toArray();

      if (existingAppointments.length > 0) {
        return NextResponse.json(
          { error: 'One or both hours are not available for a 2-hour appointment' },
          { status: 409 }
        );
      }
    } else {
      // Check for existing appointments in the time slot
      const existingAppointment = await appointmentsCollection.findOne({
        startTime: new Date(body.startTime),
        status: { $in: ['booked', 'pending'] }
      });

      if (existingAppointment) {
        return NextResponse.json(
          { error: 'Time slot already booked' },
          { status: 409 }
        );
      }
    }

    const appointment = {
      startTime: new Date(body.startTime),
      endTime: new Date(body.endTime),
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