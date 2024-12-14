import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';
import clientPromise from '@/lib/mongodb';
import { sendAppointmentNotification } from '@/lib/gmail';
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
    
    // Log the session and request origin
    console.log('Request details:', {
      hasSession: !!session,
      requestOrigin: request.headers.get('origin'),
      requestReferer: request.headers.get('referer')
    });

    // Check if request is coming from the contact page
    const isContactPage = request.headers.get('referer')?.includes('/contact');
    const isAdmin = !!session && !isContactPage;

    console.log('Authorization check:', {
      isAdmin,
      isContactPage,
      hasSession: !!session
    });

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

    const appointment = {
      startTime: new Date(new Date(body.startTime).getTime() + (60 * 60 * 1000)),
      endTime: new Date(new Date(body.endTime).getTime() + (60 * 60 * 1000)),
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
    
    // Send notification email for new client bookings
    if (!isAdmin && appointment.status === 'pending') {
      try {
        console.log('Attempting to send email notification for appointment:', {
          clientName: appointment.clientName,
          clientEmail: appointment.clientEmail,
          startTime: appointment.startTime,
          isFirstTime: appointment.isFirstTime,
          status: appointment.status
        });
        
        await sendAppointmentNotification({
          ...appointment,
          _id: result.insertedId.toString()
        });
        
        console.log('Email notification sent successfully');
      } catch (error) {
        console.error('Failed to send notification email:', error);
        // Don't fail the request if email fails
      }
    } else {
      console.log('Skipping email notification:', {
        isAdmin,
        isContactPage,
        status: appointment.status
      });
    }

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