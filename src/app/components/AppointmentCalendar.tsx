'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import type { AppointmentSettings } from '@/types/appointment';
import { formatInTimeZone } from 'date-fns-tz';

interface TimeSlot {
  time: string;
  endTime: string;
  available: boolean;
  status: 'available' | 'booked' | 'pending' | 'fictitious';
  duration: number;
}

interface AppointmentCalendarProps {
  onSelectSlot: (date: string, time: string) => void;
  isAdmin?: boolean;
  isFirstTime?: boolean;
  selectedDuration?: number;
}

const slotColors = {
  available: 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100 hover:border-green-400 active:bg-green-200 cursor-pointer shadow-sm transform hover:scale-105 transition-all duration-200',
  booked: 'border-red-300 text-red-700 bg-red-50 cursor-not-allowed opacity-60 shadow-sm',
  pending: 'border-yellow-300 text-yellow-700 bg-yellow-50 cursor-not-allowed opacity-60 shadow-sm',
  fictitious: 'border-yellow-300 text-yellow-700 bg-yellow-50 cursor-not-allowed opacity-60 shadow-sm',
  selected: 'bg-primary-600 text-white border-primary-600 hover:bg-primary-700 hover:border-primary-700 active:bg-primary-800 shadow-md ring-2 ring-offset-2 ring-primary-500 transform scale-105'
};

const slotLabels = {
  available: 'Disponible',
  booked: 'Réservé',
  pending: 'En attente',
  fictitious: 'À confirmer'
};

const daysOfWeek = [
  'Dimanche',
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi'
];

const formatWorkingDays = (workingDays: number[]): string => {
  return workingDays
    .sort((a, b) => a - b)
    .map(day => daysOfWeek[day])
    .join(', ');
};

export default function AppointmentCalendar({ 
  onSelectSlot, 
  isAdmin = false,
  isFirstTime = false,
  selectedDuration = 60
}: AppointmentCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [settings, setSettings] = useState<AppointmentSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Get min and max dates in Casablanca timezone
  const now = new Date();
  const minDate = formatInTimeZone(now, 'Africa/Casablanca', 'yyyy-MM-dd');
  const maxDate = formatInTimeZone(
    new Date(now.setMonth(now.getMonth() + 3)),
    'Africa/Casablanca',
    'yyyy-MM-dd'
  );

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/appointments/settings');
        if (!response.ok) throw new Error('Failed to fetch settings');
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        setError('Failed to load settings');
      }
    }

    fetchSettings();
  }, []);

  useEffect(() => {
    async function fetchSlots() {
      if (!selectedDate) return;
      
      setIsLoading(true);
      try {
        // Convert selected date to UTC while considering Casablanca timezone
        const localDate = new Date(selectedDate);
        
        const response = await fetch(
          `/api/appointments/available?date=${localDate.toISOString()}&isFirstTime=${isFirstTime}&isAdmin=${isAdmin}&duration=${selectedDuration}`
        );
        
        if (!response.ok) throw new Error('Failed to fetch slots');
        const data = await response.json();
        
        if (data.length === 0 && !isAdmin) {
          // Check if date is in blocked range
          const dateObj = new Date(selectedDate);
          
          const isBlocked = settings?.blockedDateRanges?.some(range => {
            const rangeStart = new Date(range.startDate);
            const rangeEnd = new Date(range.endDate);
            return dateObj >= rangeStart && dateObj <= rangeEnd;
          });

          if (isBlocked) {
            const blockedRange = settings?.blockedDateRanges?.find(range => {
              const rangeStart = new Date(range.startDate);
              const rangeEnd = new Date(range.endDate);
              return dateObj >= rangeStart && dateObj <= rangeEnd;
            });

            setError(
              blockedRange?.reason
                ? `Cette période n'est pas disponible : ${blockedRange.reason}`
                : "Cette période n'est pas disponible pour les réservations."
            );
          } else {
            setError("Cette date n'est pas disponible pour les réservations.");
          }
          setSelectedTime('');
        } else {
          setError('');
          setAvailableSlots(data);
        }
      } catch (error) {
        console.error('Error fetching slots:', error);
        setError('Failed to load available slots');
      } finally {
        setIsLoading(false);
      }
    }

    if (selectedDate) {
      fetchSlots();
    }
  }, [selectedDate, isFirstTime, isAdmin, settings, selectedDuration]);

  const handleDateChange = (date: string) => {
    // Check if the selected date is a working day, but only for non-admin users
    if (settings && !isAdmin) {
      const selectedDay = new Date(date).getDay();
      if (!settings.workingDays.includes(selectedDay)) {
        const workingDaysStr = formatWorkingDays(settings.workingDays);
        setError(`Désolé, nous ne sommes ouverts que ${workingDaysStr}. Veuillez sélectionner un autre jour.`);
        return;
      }
    }
    
    setSelectedDate(date);
    setSelectedTime('');
    setAvailableSlots([]);
  };

  const handleTimeSelect = (slot: TimeSlot) => {
    if (slot.status !== 'available') return;
    
    setSelectedTime(slot.time);
    onSelectSlot(selectedDate, slot.time);
  };

  const getSlotColor = (slot: TimeSlot) => {
    if (slot.time === selectedTime) return slotColors.selected;
    return slotColors[slot.status];
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sélectionnez une date
        </label>
        <div className="relative">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            min={minDate}
            max={maxDate}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 pl-3 pr-10 py-2"
            required
          />
          <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : selectedDate && availableSlots.length > 0 ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Sélectionnez une heure
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {availableSlots.map((slot, index) => (
              <button
                key={index}
                onClick={() => handleTimeSelect(slot)}
                disabled={slot.status !== 'available'}
                className={`relative flex flex-col items-center justify-center p-3 rounded-lg border ${getSlotColor(slot)}`}
                title={slotLabels[slot.status]}
              >
                <span className="text-sm font-medium">{slot.time}</span>
                <span className="text-xs opacity-75">
                  {slot.duration} {slot.duration > 1 ? 'heures' : 'heure'}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
} 