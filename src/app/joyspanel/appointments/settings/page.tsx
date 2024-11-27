'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ClockIcon, 
  CalendarDaysIcon,
  ArrowPathIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import type { AppointmentSettings } from '@/types/appointment';

const daysOfWeek = [
  { id: 0, name: 'Dimanche' },
  { id: 1, name: 'Lundi' },
  { id: 2, name: 'Mardi' },
  { id: 3, name: 'Mercredi' },
  { id: 4, name: 'Jeudi' },
  { id: 5, name: 'Vendredi' },
  { id: 6, name: 'Samedi' },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppointmentSettings>({
    workingHours: { start: '09:00', end: '18:00' },
    workingDays: [1, 2, 3, 4, 5],
    slotDuration: 60,
    breakDuration: 15,
    maxAdvanceBooking: 30,
    fictionalBookingPercentage: 30
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/appointments/settings');
        if (!response.ok) throw new Error('Failed to fetch settings');
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        setError('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    }

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/appointments/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error('Failed to update settings');

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDayToggle = (dayId: number) => {
    setSettings(prev => ({
      ...prev,
      workingDays: prev.workingDays.includes(dayId)
        ? prev.workingDays.filter(d => d !== dayId)
        : [...prev.workingDays, dayId].sort()
    }));
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Paramètres des rendez-vous</h1>
            <p className="mt-1 text-sm text-gray-600">
              Configurez les horaires et les règles de prise de rendez-vous
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-600 rounded-md flex items-center">
            <CheckIcon className="h-5 w-5 mr-2" />
            Paramètres mis à jour avec succès
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow-sm">
          {/* Working Hours */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Horaires de travail</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Heure de début
                </label>
                <div className="mt-1 relative">
                  <input
                    type="time"
                    value={settings.workingHours.start}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      workingHours: { ...prev.workingHours, start: e.target.value }
                    }))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                  <ClockIcon className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Heure de fin
                </label>
                <div className="mt-1 relative">
                  <input
                    type="time"
                    value={settings.workingHours.end}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      workingHours: { ...prev.workingHours, end: e.target.value }
                    }))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                  <ClockIcon className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Working Days */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Jours de travail</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {daysOfWeek.map((day) => (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => handleDayToggle(day.id)}
                  className={`flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
                    ${settings.workingDays.includes(day.id)
                      ? 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                >
                  {day.name}
                </button>
              ))}
            </div>
          </div>

          {/* Duration Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Durée des séances</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Durée des créneaux (minutes)
                </label>
                <input
                  type="number"
                  value={settings.slotDuration}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    slotDuration: parseInt(e.target.value)
                  }))}
                  min="15"
                  step="15"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pause entre les rendez-vous (minutes)
                </label>
                <input
                  type="number"
                  value={settings.breakDuration}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    breakDuration: parseInt(e.target.value)
                  }))}
                  min="0"
                  step="5"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Booking Rules */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Règles de réservation</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Réservation maximum à l'avance (jours)
                </label>
                <input
                  type="number"
                  value={settings.maxAdvanceBooking}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    maxAdvanceBooking: parseInt(e.target.value)
                  }))}
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pourcentage de créneaux fictifs (%)
                </label>
                <input
                  type="number"
                  value={settings.fictionalBookingPercentage}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    fictionalBookingPercentage: parseInt(e.target.value)
                  }))}
                  min="0"
                  max="100"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Réinitialiser
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <CheckIcon className="h-5 w-5 mr-2" />
                  Enregistrer
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
} 