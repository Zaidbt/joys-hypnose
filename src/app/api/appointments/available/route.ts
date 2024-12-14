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

    // Only get active appointments (not cancelled ones)
    const bookedSlots = await appointmentsCollection
      .find({
        startTime: {
          $gte: startDate,
          $lte: endDate
        },
        status: { 
          $in: ['booked', 'pending', 'fictitious'] // Include fictitious appointments
        }
      })
      .toArray();
    
    // Generate all possible slots
    const [startHour, startMinute] = settings.workingHours.start.split(':').map(Number);
    const [endHour, endMinute] = settings.workingHours.end.split(':').map(Number);
    
    const slots = [];
    let currentHour = startHour;
    let currentMinute = startMinute;

    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
      const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      const slotDate = new Date(date);
      slotDate.setHours(currentHour, currentMinute, 0, 0);

      // Calculate end time - always 1 hour regardless of isFirstTime
      const endTime = new Date(slotDate);
      endTime.setMinutes(endTime.getMinutes() + 60);
      const endTimeString = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;

      // Check if slot overlaps with any booking
      let isAvailable = true;
      let slotStatus = 'available';
      
      const slotEnd = new Date(slotDate);
      slotEnd.setMinutes(slotEnd.getMinutes() + 60);
      
      const overlappingBooking = bookedSlots.find(booking => {
        const bookingStart = new Date(booking.startTime);
        const bookingEnd = new Date(booking.endTime);
        
        // A slot overlaps if it starts before the booking ends AND ends after the booking starts
        return (slotDate < bookingEnd && slotEnd > bookingStart);
      });

      if (overlappingBooking) {
        isAvailable = false;
        slotStatus = overlappingBooking.status;
      }

      slots.push({
        time: timeString,
        endTime: endTimeString,
        available: isAvailable,
        status: isAvailable ? 'available' : slotStatus,
        duration: 1  // Always 1 hour
      });

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