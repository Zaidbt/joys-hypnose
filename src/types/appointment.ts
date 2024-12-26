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
  workingDays: number[];
  workingHours: {
    start: string;
    end: string;
  };
  slotDuration: number;
  blockedDateRanges: Array<{
    id: string;
    startDate: string;
    endDate: string;
    reason?: string;
  }>;
} 