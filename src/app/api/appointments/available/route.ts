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

    console.log('Found booked slots:', bookedSlots);

    // Generate all possible slots
    const [startHour, startMinute] = settings.workingHours.start.split(':').map(Number);
    const [endHour, endMinute] = settings.workingHours.end.split(':').map(Number);
    
    const slots = [];
    let currentHour = startHour;

    // Helper function to check if a time slot is booked
    const isTimeSlotBooked = (hour: number, duration: number) => {
      // Create fresh date objects for each check
      const slotStart = new Date(date);
      slotStart.setHours(hour, 0, 0, 0);
      
      const slotEnd = new Date(date);
      slotEnd.setHours(hour + duration, 0, 0, 0);

      return bookedSlots.some(booking => {
        const bookingStart = new Date(booking.startTime);
        const bookingEnd = new Date(booking.endTime);
        
        // Check if there's any overlap
        return (bookingStart < slotEnd && bookingEnd > slotStart);
      });
    };

    // Generate slots
    while (currentHour < endHour) {
      const timeString = `${currentHour.toString().padStart(2, '0')}:00`;
      
      // For first-time clients, check if both hours are available
      const duration = isFirstTime ? 2 : 1;
      
      // Only show slot if we have enough hours left in the day
      const hasEnoughTime = currentHour + duration <= endHour;
      
      // Check availability
      const isSlotAvailable = hasEnoughTime && !isTimeSlotBooked(currentHour, duration);

      console.log(`Checking slot ${timeString}:`, {
        isFirstTime,
        duration,
        hasEnoughTime,
        isAvailable: isSlotAvailable
      });

      slots.push({
        time: timeString,
        status: isSlotAvailable ? 'available' : 'booked',
        available: isSlotAvailable
      });

      currentHour += 1;
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