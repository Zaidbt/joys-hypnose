'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, TrashIcon, ClockIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
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

const DEFAULT_SETTINGS: AppointmentSettings = {
  workingHours: { start: '09:00', end: '18:00' },
  workingDays: [1, 2, 3, 4, 5],
  slotDuration: 60,
  breakDuration: 15,
  maxAdvanceBooking: 30,
  fictionalBookingPercentage: 30,
  blockedDateRanges: [],
  prices: {
    firstSession: 700,
    followUpSession: 500
  }
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppointmentSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [newBlockedRange, setNewBlockedRange] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/appointments/settings');
        if (!response.ok) throw new Error('Failed to fetch settings');
        const data = await response.json();
        setSettings({
          ...DEFAULT_SETTINGS,
          ...data,
          blockedDateRanges: data.blockedDateRanges || []
        });
      } catch (error) {
        setError('Failed to load settings');
      }
    }

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update settings');
      }

      setSettings(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating settings:', error);
      setError(error instanceof Error ? error.message : 'Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDayToggle = (dayId: number) => {
    if (!settings) return;
    
    setSettings(prev => ({
      ...prev!,
      workingDays: prev!.workingDays.includes(dayId)
        ? prev!.workingDays.filter(d => d !== dayId)
        : [...prev!.workingDays, dayId].sort()
    }));
  };

  const addBlockedRange = async () => {
    if (!settings || !newBlockedRange.startDate || !newBlockedRange.endDate) return;

    const updatedSettings = {
      ...settings,
      blockedDateRanges: [
        ...settings.blockedDateRanges,
        {
          id: Date.now().toString(),
          ...newBlockedRange
        }
      ]
    };

    setSettings(updatedSettings);

    // Save changes immediately
    try {
      const response = await fetch('/api/appointments/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSettings),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update settings');
      }

      setSettings(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating settings:', error);
      setError(error instanceof Error ? error.message : 'Failed to update settings');
    }

    setNewBlockedRange({
      startDate: '',
      endDate: '',
      reason: ''
    });
  };

  const removeBlockedRange = async (id: string) => {
    if (!settings) return;

    const updatedSettings = {
      ...settings,
      blockedDateRanges: settings.blockedDateRanges.filter(range => range.id !== id)
    };

    setSettings(updatedSettings);

    // Save changes immediately
    try {
      const response = await fetch('/api/appointments/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSettings),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update settings');
      }

      setSettings(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating settings:', error);
      setError(error instanceof Error ? error.message : 'Failed to update settings');
    }
  };

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Paramètres des rendez-vous</h1>
          <p className="mt-1 text-sm text-gray-600">
            Configurez les horaires de travail et les périodes bloquées
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-600 rounded-md">
            Paramètres mis à jour avec succès
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow">
          {/* Working Hours */}
          <div>
            <h3 className="text-lg font-medium text-gray-900">Horaires de travail</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Heure de début
                </label>
                <div className="mt-1 relative">
                  <input
                    type="time"
                    value={settings.workingHours.start}
                    onChange={(e) => setSettings(prev => ({
                      ...prev!,
                      workingHours: { ...prev!.workingHours, start: e.target.value }
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
                      ...prev!,
                      workingHours: { ...prev!.workingHours, end: e.target.value }
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
            <h3 className="text-lg font-medium text-gray-900">Jours de travail</h3>
            <p className="mt-1 text-sm text-gray-500">
              Sélectionnez les jours où vous acceptez les rendez-vous
            </p>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
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
            <h3 className="text-lg font-medium text-gray-900">Durée des séances</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Durée des créneaux (minutes)
                </label>
                <input
                  type="number"
                  value={settings.slotDuration}
                  onChange={(e) => setSettings(prev => ({
                    ...prev!,
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
                    ...prev!,
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
            <h3 className="text-lg font-medium text-gray-900">Règles de réservation</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Réservation maximum à l'avance (jours)
                </label>
                <input
                  type="number"
                  value={settings.maxAdvanceBooking}
                  onChange={(e) => setSettings(prev => ({
                    ...prev!,
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
                    ...prev!,
                    fictionalBookingPercentage: parseInt(e.target.value)
                  }))}
                  min="0"
                  max="100"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Price Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900">Tarifs des séances</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Première séance (DH)
                </label>
                <input
                  type="number"
                  value={settings.prices?.firstSession || 700}
                  onChange={(e) => setSettings(prev => ({
                    ...prev!,
                    prices: {
                      ...prev!.prices,
                      firstSession: parseInt(e.target.value)
                    }
                  }))}
                  min="0"
                  step="50"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Séance de suivi (DH)
                </label>
                <input
                  type="number"
                  value={settings.prices?.followUpSession || 500}
                  onChange={(e) => setSettings(prev => ({
                    ...prev!,
                    prices: {
                      ...prev!.prices,
                      followUpSession: parseInt(e.target.value)
                    }
                  }))}
                  min="0"
                  step="50"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Blocked Date Ranges */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Périodes bloquées</h3>
            <p className="text-sm text-gray-500">
              Définissez les périodes où les clients ne peuvent pas réserver (ex: vacances, congés)
            </p>

            <div className="space-y-4">
              {settings.blockedDateRanges.map((range) => (
                <div key={range.id} className="flex items-center space-x-4 bg-gray-50 p-3 rounded-md">
                  <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Du</p>
                      <p className="text-sm text-gray-900">{new Date(range.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Au</p>
                      <p className="text-sm text-gray-900">{new Date(range.endDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Raison</p>
                      <p className="text-sm text-gray-900">{range.reason || 'Non spécifiée'}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeBlockedRange(range.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end bg-gray-50 p-4 rounded-md">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date de début</label>
                <input
                  type="date"
                  value={newBlockedRange.startDate}
                  onChange={(e) => setNewBlockedRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date de fin</label>
                <input
                  type="date"
                  value={newBlockedRange.endDate}
                  onChange={(e) => setNewBlockedRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Raison (optionnelle)</label>
                <input
                  type="text"
                  value={newBlockedRange.reason}
                  onChange={(e) => setNewBlockedRange(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Ex: Vacances"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={addBlockedRange}
              disabled={!newBlockedRange.startDate || !newBlockedRange.endDate}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Ajouter une période bloquée
            </button>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
} 