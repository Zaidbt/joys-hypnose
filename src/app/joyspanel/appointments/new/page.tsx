'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ClockIcon, UserIcon, CalendarIcon } from '@heroicons/react/24/outline';
import type { AppointmentSettings } from '@/types/appointment';
import AppointmentCalendar from '@/app/components/AppointmentCalendar';

export default function NewAppointment() {
  const router = useRouter();
  const [settings, setSettings] = useState<AppointmentSettings | null>(null);
  const [date, setDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [isFictitious, setIsFictitious] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

  const generateTimeSlots = () => {
    if (!settings) return [];
    
    const slots = [];
    const [startHour, startMinute] = settings.workingHours.start.split(':').map(Number);
    const [endHour, endMinute] = settings.workingHours.end.split(':').map(Number);
    
    let currentHour = startHour;
    let currentMinute = startMinute;

    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
      slots.push(
        `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`
      );

      currentMinute += settings.slotDuration;
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60);
        currentMinute = currentMinute % 60;
      }
    }

    return slots;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const appointmentDate = new Date(date);
      const [hours, minutes] = startTime.split(':').map(Number);
      appointmentDate.setHours(hours, minutes, 0, 0);

      const endDate = new Date(appointmentDate);
      endDate.setMinutes(endDate.getMinutes() + (settings?.slotDuration || 60));

      const appointmentData = {
        startTime: appointmentDate,
        endTime: endDate,
        isFictitious,
        clientName: isFictitious ? `Client ${Math.floor(Math.random() * 1000)}` : clientName,
        clientEmail: isFictitious ? `client${Math.floor(Math.random() * 1000)}@example.com` : clientEmail,
        clientPhone: isFictitious ? '+41 XX XXX XX XX' : clientPhone,
        notes,
        status: isFictitious ? 'fictitious' : 'booked'
      };

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) throw new Error('Failed to create appointment');

      router.push('/joyspanel/appointments');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create appointment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSlotSelect = (date: string, time: string) => {
    setDate(date);
    setStartTime(time);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Nouveau Rendez-vous</h1>
            <p className="mt-1 text-sm text-gray-600">
              Créez un nouveau rendez-vous réel ou fictif
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900"
          >
            Retour
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <div className="mt-1 relative">
                <AppointmentCalendar onSelectSlot={handleSlotSelect} isAdmin={true} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Heure
              </label>
              <div className="mt-1 relative">
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="">Sélectionnez une heure</option>
                  {generateTimeSlots().map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                <ClockIcon className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isFictitious"
              checked={isFictitious}
              onChange={(e) => setIsFictitious(e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isFictitious" className="ml-2 block text-sm text-gray-900">
              Rendez-vous fictif
            </label>
          </div>

          {!isFictitious && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nom du client
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required={!isFictitious}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    required={!isFictitious}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Téléphone
                </label>
                <div className="mt-1">
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <div className="mt-1">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
            >
              {isLoading ? 'Création...' : 'Créer le rendez-vous'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
} 