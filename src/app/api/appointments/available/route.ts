import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const isFirstTime = searchParams.get('isFirstTime') === 'true';
    const isAdmin = searchParams.get('isAdmin') === 'true';
    
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

    // Check if the date is in a blocked range for non-admin users
    if (!isAdmin && settings.blockedDateRanges) {
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);  // Set to start of day for proper comparison
      
      const isBlocked = settings.blockedDateRanges.some(range => {
        const rangeStart = new Date(range.startDate);
        rangeStart.setHours(0, 0, 0, 0);
        
        const rangeEnd = new Date(range.endDate);
        rangeEnd.setHours(23, 59, 59, 999);  // Set to end of day
        
        return selectedDate >= rangeStart && selectedDate <= rangeEnd;
      });

      if (isBlocked) {
        console.log('Date is blocked:', date);
        return NextResponse.json([]);  // Return empty slots for blocked dates
      }
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
    const [startHour, startMinute] = isAdmin ? [9, 0] : settings.workingHours.start.split(':').map(Number);
    const [endHour, endMinute] = isAdmin ? [22, 0] : settings.workingHours.end.split(':').map(Number);
    
    const slots = [];
    let currentHour = startHour;
    let currentMinute = startMinute;

    const formatter = new Intl.DateTimeFormat('fr-FR', {
      timeZone: 'Africa/Casablanca',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
      const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      const slotDate = new Date(date);
      slotDate.setHours(currentHour, currentMinute, 0, 0);

      // Format the time in Casablanca timezone
      const formattedTime = formatter.format(slotDate);
      const endTime = new Date(slotDate);
      endTime.setMinutes(endTime.getMinutes() + 60);
      const formattedEndTime = formatter.format(endTime);

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
        time: formattedTime,
        endTime: formattedEndTime,
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