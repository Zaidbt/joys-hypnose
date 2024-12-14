export type AppointmentStatus = 'available' | 'booked' | 'pending' | 'fictitious' | 'cancelled';

export interface TimeSlot {
  _id?: string;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  notes?: string;
  isFictitious: boolean;
  isFirstTime: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppointmentSettings {
  _id?: string;
  workingHours: {
    start: string; // Format: "HH:mm"
    end: string;   // Format: "HH:mm"
  };
  workingDays: number[]; // 0-6 (Sunday-Saturday)
  slotDuration: number;  // in minutes
  breakDuration: number; // in minutes
  maxAdvanceBooking: number; // in days
  fictionalBookingPercentage: number; // 0-100
} 