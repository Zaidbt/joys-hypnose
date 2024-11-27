import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import type { TimeSlot } from '@/types/appointment';

// Cache for appointments
let slotsCache: any = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60000; // 1 minute cache

async function getAppointments(startDate: string, endDate: string, forceRefresh = false) {
  const now = Date.now();
  const cacheKey = `${startDate}-${endDate}`;
  
  if (!forceRefresh && slotsCache?.[cacheKey] && (now - lastFetchTime) < CACHE_DURATION) {
    return slotsCache[cacheKey];
  }

  const client = await clientPromise;
  const db = client.db('joyshypnose');
  const appointmentsCollection = db.collection('appointments');

  const slots = await appointmentsCollection
    .find({
      date: { 
        $gte: startDate,
        $lte: endDate
      }
    })
    .sort({ date: 1, time: 1 })
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
    const startDate = searchParams.get('start') || new Date().toISOString().split('T')[0];
    const endDate = searchParams.get('end') || startDate;
    
    const client = await clientPromise;
    const db = client.db('joyshypnose');
    const appointmentsCollection = db.collection('appointments');

    const appointments = await appointmentsCollection
      .find({
        date: {
          $gte: startDate,
          $lte: endDate
        }
      })
      .sort({ date: 1, time: 1 })
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
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { date, time, name, email, phone, notes, status = 'pending', isFictitious = false } = body;

    if (!date || !time || !name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = client.db('joyshypnose');
    const appointmentsCollection = db.collection('appointments');

    // Check if slot is available
    const existingAppointment = await appointmentsCollection.findOne({
      date,
      time,
    });

    if (existingAppointment) {
      return NextResponse.json(
        { error: 'This time slot is already booked' },
        { status: 400 }
      );
    }

    const appointment: TimeSlot & { _id?: ObjectId } = {
      date,
      time,
      name,
      email,
      phone,
      notes,
      status,
      isFictitious,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await appointmentsCollection.insertOne(appointment);
    
    // Invalidate cache
    slotsCache = null;

    return NextResponse.json({
      success: true,
      data: {
        _id: result.insertedId.toString(),
        ...appointment
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