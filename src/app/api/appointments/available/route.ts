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

    // Only get active appointments (not cancelled ones)
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
    
    // Convert end time to minutes for easier comparison
    const endTimeInMinutes = endHour * 60 + endMinute;
    
    const slots = [];
    let currentHour = startHour;
    let currentMinute = startMinute;

    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
      // Calculate if this slot would end after working hours
      const currentTimeInMinutes = currentHour * 60 + currentMinute;
      const slotEndTimeInMinutes = currentTimeInMinutes + (isFirstTime ? 120 : settings.slotDuration);
      
      // Only create slot if it ends within working hours
      if (slotEndTimeInMinutes <= endTimeInMinutes) {
        const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
        const slotDate = new Date(date);
        slotDate.setHours(currentHour, currentMinute, 0, 0);

        // For first-time clients, check if both hours are available
        let isSlotAvailable = true;
        if (isFirstTime) {
          // Check current hour and next hour
          for (let i = 0; i < 2; i++) {
            const checkTime = new Date(slotDate);
            checkTime.setHours(currentHour, currentMinute + (i * 60), 0, 0);
            
            const conflictingBooking = bookedSlots.find(booking => {
              const bookingStart = new Date(booking.startTime);
              const bookingEnd = new Date(booking.endTime);
              return checkTime >= bookingStart && checkTime < bookingEnd;
            });
            
            if (conflictingBooking) {
              isSlotAvailable = false;
              break;
            }
          }
        } else {
          // Regular 1-hour booking check
          const conflictingBooking = bookedSlots.find(booking => {
            const bookingStart = new Date(booking.startTime);
            const bookingEnd = new Date(booking.endTime);
            return slotDate >= bookingStart && slotDate < bookingEnd;
          });
          isSlotAvailable = !conflictingBooking;
        }

        slots.push({
          time: timeString,
          status: isSlotAvailable ? 'available' : 'booked',
          available: isSlotAvailable
        });
      }

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