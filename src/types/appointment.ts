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
  isOnline?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppointmentSettings {
  workingHours: {
    start: string;
    end: string;
  };
  workingDays: number[];
  slotDuration: number;
  breakDuration: number;
  maxAdvanceBooking: number;
  fictionalBookingPercentage: number;
  blockedDateRanges: Array<{
    id: string;
    startDate: string;
    endDate: string;
    reason?: string;
  }>;
  prices: {
    firstSession: number;
    followUpSession: number;
  };
} 