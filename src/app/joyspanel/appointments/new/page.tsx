'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AppointmentCalendar from '@/app/components/AppointmentCalendar';
import ClientAutocomplete from '@/app/components/ClientAutocomplete';
import { useRouter } from 'next/navigation';
import { formatInTimeZone } from 'date-fns-tz';

const durations = [
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 heure' },
  { value: 75, label: '1 heure 15' },
  { value: 90, label: '1 heure 30' },
  { value: 105, label: '1 heure 45' },
  { value: 120, label: '2 heures' },
  { value: 150, label: '2 heures 30' },
  { value: 180, label: '3 heures' },
  { value: 210, label: '3 heures 30' },
  { value: 240, label: '4 heures' },
];

export default function NewAppointmentPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(60); // Default 1 hour
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleClientSelect = (client: { name: string; email: string; phone: string }) => {
    setClientName(client.name);
    setClientEmail(client.email);
    setClientPhone(client.phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!selectedDate || !selectedTime || !clientName || !clientEmail) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setIsLoading(true);

      // Create the appointment date
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const appointmentDate = new Date(selectedDate);
      appointmentDate.setHours(hours, minutes, 0, 0);

      // Create end time based on appointment type
      const endDate = new Date(appointmentDate);
      endDate.setMinutes(endDate.getMinutes() + (isFirstTime ? 120 : 90));

      // Ensure we're working with valid date objects
      if (isNaN(appointmentDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('Date invalide');
      }

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startTime: appointmentDate.toISOString(),
          endTime: endDate.toISOString(),
          clientName,
          clientEmail,
          clientPhone,
          notes,
          isFirstTime,
          isOnline,
          status: 'booked',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create appointment');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/joyspanel/appointments');
      }, 2000);
    } catch (error) {
      console.error('Error creating appointment:', error);
      setError(error instanceof Error ? error.message : 'Failed to create appointment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSlotSelect = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  // Get min and max dates in Casablanca timezone
  const now = new Date();
  const minDate = formatInTimeZone(now, 'Africa/Casablanca', 'yyyy-MM-dd');
  const maxDate = formatInTimeZone(
    new Date(now.setMonth(now.getMonth() + 3)),
    'Africa/Casablanca',
    'yyyy-MM-dd'
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Nouveau rendez-vous</h1>
          <p className="mt-1 text-sm text-gray-600">
            Créez un nouveau rendez-vous manuellement
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-600 rounded-md">
            Rendez-vous créé avec succès
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-4 sm:p-6 rounded-lg shadow">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Durée de la séance
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            >
              {durations.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <AppointmentCalendar
            onSelectSlot={handleSlotSelect}
            isAdmin={true}
            selectedDuration={duration}
          />

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client
              </label>
              <ClientAutocomplete onClientSelect={handleClientSelect} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du client
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email du client
              </label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone du client
              </label>
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optionnel)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Options
                </label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isFirstTime"
                      checked={isFirstTime}
                      onChange={(e) => setIsFirstTime(e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isFirstTime" className="ml-2 text-sm text-gray-700">
                      Première séance (2 heures)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isOnline"
                      checked={isOnline}
                      onChange={(e) => setIsOnline(e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isOnline" className="ml-2 text-sm text-gray-700">
                      Séance en ligne via Zoom
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4 space-y-4 space-y-reverse sm:space-y-0">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading || !selectedDate || !selectedTime}
              className="w-full sm:w-auto inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {isLoading ? 'Création...' : 'Créer le rendez-vous'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
} 