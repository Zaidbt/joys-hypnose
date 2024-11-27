export type AppointmentStatus = 'available' | 'booked' | 'pending' | 'fictitious';

export interface TimeSlot {
  _id?: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  status?: AppointmentStatus;
  isFictitious?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientRecord {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  visitCount?: number;
  lastVisit?: Date;
  notes?: string;
  status?: AppointmentStatus;
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