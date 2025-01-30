import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { sendEventEmails } from '@/lib/eventEmails';
import type { EventRegistration, EventRegistrationResponse, EventRegistrationsListResponse } from '@/types/news';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('joyshypnose');
    const registrationsCollection = db.collection('event_registrations');
    const eventsCollection = db.collection('news');

    // Validate required fields
    if (!body.eventId || !body.firstName || !body.lastName || !body.email || !body.phone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the event details
    const event = await eventsCollection.findOne({ _id: new ObjectId(body.eventId) });
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    const registration: EventRegistration = {
      ...body,
      createdAt: new Date(),
      status: 'pending',
      participantName: `${body.firstName} ${body.lastName}`,
      participantEmail: body.email,
      participantPhone: body.phone,
      notes: body.message || ''
    };

    const result = await registrationsCollection.insertOne(registration);
    const registrationWithId = {
      ...registration,
      _id: result.insertedId.toString()
    };

    // Send confirmation emails
    await sendEventEmails(registrationWithId, event);

    const response: EventRegistrationResponse = {
      success: true,
      data: registrationWithId
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating registration:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create registration' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // Check authentication for admin panel
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const status = searchParams.get('status');

    const client = await clientPromise;
    const db = client.db('joyshypnose');
    const registrationsCollection = db.collection('event_registrations');

    // Build query
    const query: any = {};
    if (eventId) query.eventId = eventId;
    if (status) query.status = status;

    // Get total count for pagination
    const total = await registrationsCollection.countDocuments(query);

    // Fetch registrations
    const registrations = await registrationsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const response: EventRegistrationsListResponse = {
      success: true,
      data: registrations.map(reg => ({
        ...reg,
        _id: reg._id.toString()
      })),
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
} 