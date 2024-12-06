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

    // Parse working hours with explicit handling of minutes
    const [startHour, startMinute] = settings.workingHours.start.split(':').map(Number);
    const [endHour, endMinute] = settings.workingHours.end.split(':').map(Number);
    
    const slots = [];
    let currentHour = startHour;
    let currentMinute = startMinute;

    // Helper function to check if a time slot is booked
    const isTimeSlotBooked = (startTime: Date, endTime: Date) => {
      return bookedSlots.some(booking => {
        const bookingStart = new Date(booking.startTime);
        const bookingEnd = new Date(booking.endTime);
        return (bookingStart < endTime && bookingEnd > startTime);
      });
    };

    // Helper function to check if a time is within working hours
    const isWithinWorkingHours = (time: Date) => {
      const hour = time.getHours();
      const minute = time.getMinutes();
      
      if (hour < startHour || hour > endHour) return false;
      if (hour === startHour && minute < startMinute) return false;
      if (hour === endHour && minute > endMinute) return false;
      
      return true;
    };

    // Generate slots
    while (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute)) {
      const slotStart = new Date(date);
      slotStart.setHours(currentHour, currentMinute, 0, 0);
      
      // Calculate slot duration and end time
      const duration = isFirstTime ? 2 : 1;
      const slotEnd = new Date(slotStart);
      slotEnd.setHours(slotStart.getHours() + duration);

      // Format time strings
      const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      const endTimeString = `${slotEnd.getHours().toString().padStart(2, '0')}:${slotEnd.getMinutes().toString().padStart(2, '0')}`;
      
      // Check if the entire slot (including end time) is within working hours
      const hasEnoughTime = isWithinWorkingHours(slotStart) && isWithinWorkingHours(slotEnd);
      
      // For 2-hour slots, check both hours are completely free
      const isSlotAvailable = hasEnoughTime && !isTimeSlotBooked(slotStart, slotEnd);

      console.log(`Checking slot ${timeString}:`, {
        isFirstTime,
        duration,
        hasEnoughTime,
        isAvailable: isSlotAvailable,
        endTime: endTimeString,
        slotStart: slotStart.toISOString(),
        slotEnd: slotEnd.toISOString()
      });

      if (hasEnoughTime) {
        slots.push({
          time: timeString,
          status: isSlotAvailable ? 'available' : 'booked',
          available: isSlotAvailable,
          duration: duration,
          endTime: endTimeString
        });
      }

      // Increment by the slot duration (usually 1 hour)
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