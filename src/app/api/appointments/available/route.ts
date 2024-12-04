import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const isFirstTime = searchParams.get('isFirstTime') === 'true';
    
    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('joyshypnose');
    const appointmentsCollection = db.collection('appointments');
    const settingsCollection = db.collection('appointment_settings');

    // Get settings
    const settings = await settingsCollection.findOne({});
    console.log('Using settings in available slots:', settings);

    if (!settings) {
      return NextResponse.json(
        { error: 'Settings not found' },
        { status: 404 }
      );
    }

    // Get booked slots for the date
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // Check if the requested date is a working day
    const requestedDay = startDate.getDay();
    if (!settings.workingDays.includes(requestedDay)) {
      return NextResponse.json(
        { error: 'The requested date is not a working day' },
        { status: 400 }
      );
    }

    // Get all appointments for the day
    const bookedSlots = await appointmentsCollection
      .find({
        startTime: {
          $gte: startDate,
          $lte: endDate
        },
        status: { 
          $in: ['booked', 'pending', 'fictitious']
        }
      })
      .toArray();

    // Generate all possible slots
    const [startHour, startMinute] = settings.workingHours.start.split(':').map(Number);
    const [endHour, endMinute] = settings.workingHours.end.split(':').map(Number);
    
    const slots = [];
    let currentHour = startHour;
    let currentMinute = startMinute;

    // Calculate end time in hours for comparison
    const endTimeInHours = endHour + (endMinute / 60);

    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
      const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      
      // Calculate current time in hours for comparison
      const currentTimeInHours = currentHour + (currentMinute / 60);
      
      // For first-time clients, check if there's enough time for a 2-hour slot
      const slotDurationHours = isFirstTime ? 2 : 1;
      if (currentTimeInHours + slotDurationHours <= endTimeInHours) {
        const slotStart = new Date(date);
        slotStart.setHours(currentHour, currentMinute, 0, 0);
        
        const slotEnd = new Date(date);
        slotEnd.setHours(currentHour + slotDurationHours, currentMinute, 0, 0);

        // Check if slot is available
        let isSlotAvailable = true;
        for (const booking of bookedSlots) {
          const bookingStart = new Date(booking.startTime);
          const bookingEnd = new Date(booking.endTime);
          
          // Check if there's any overlap between the slot and the booking
          if (!(slotEnd <= bookingStart || slotStart >= bookingEnd)) {
            isSlotAvailable = false;
            break;
          }
        }

        slots.push({
          time: timeString,
          status: isSlotAvailable ? 'available' : 'booked',
          available: isSlotAvailable
        });
      }

      // Increment by standard slot duration (1 hour)
      currentMinute += settings.slotDuration;
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60);
        currentMinute = currentMinute % 60;
      }
    }

    return NextResponse.json(slots);
  } catch (error) {
    console.error('Error fetching available slots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available slots' },
      { status: 500 }
    );
  }
} 