'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CalendarIcon, 
  ClockIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  UserIcon,
  InformationCircleIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import type { AppointmentSettings } from '@/types/appointment';
import AppointmentCalendar from '@/app/components/AppointmentCalendar';
import BookingConfirmationModal from '@/app/components/BookingConfirmationModal';
import { formatInTimeZone } from 'date-fns-tz';

export default function ContactPage() {
  const [settings, setSettings] = useState<AppointmentSettings | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/appointments/settings');
        if (!response.ok) throw new Error('Failed to fetch settings');
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        setError('Failed to load available time slots');
      }
    }

    fetchSettings();
  }, []);

  useEffect(() => {
    async function fetchAvailableSlots() {
      if (!selectedDate) return;

      try {
        const response = await fetch(`/api/appointments/available?date=${selectedDate}&isFirstTime=${isFirstTime}`);
        if (!response.ok) throw new Error('Failed to fetch available slots');
        const data = await response.json();
        setAvailableSlots(data);
      } catch (error) {
        setError('Failed to load available time slots');
      }
    }

    fetchAvailableSlots();
  }, [selectedDate, isFirstTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!selectedDate || !selectedTime) {
        throw new Error('Veuillez sélectionner une date et une heure');
      }

      // Create the appointment date
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const appointmentDate = new Date(selectedDate);
      appointmentDate.setHours(hours, minutes, 0, 0);

      // Create end time based on appointment type
      const endDate = new Date(appointmentDate);
      endDate.setMinutes(endDate.getMinutes() + (isFirstTime ? 120 : 60)); // 2 hours for first time, 1 hour for regular

      // Ensure we're working with valid date objects
      if (isNaN(appointmentDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('Date invalide');
      }

      console.log('Submitting appointment:', {
        date: selectedDate,
        time: selectedTime,
        isFirstTime,
        appointmentDate: appointmentDate.toISOString(),
        endDate: endDate.toISOString()
      });

      const appointmentData = {
        startTime: appointmentDate.toISOString(),
        endTime: endDate.toISOString(),
        clientName: name,
        clientEmail: email,
        clientPhone: phone,
        notes: message,
        isFirstTime,
        isOnline,
        status: 'pending'
      };

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Server response error:', {
          status: response.status,
          data
        });
        throw new Error(data.error || 'Erreur lors de la création du rendez-vous');
      }

      setSuccess(true);
      setIsModalOpen(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setSelectedDate('');
      setSelectedTime('');
      setIsFirstTime(false);
    } catch (error) {
      console.error('Form submission error:', error);
      setError(
        error instanceof Error 
          ? error.message 
          : 'Une erreur est survenue lors de la création du rendez-vous'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSlotSelect = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-primary-50/30 to-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact & Rendez-vous</h1>
          <p className="text-lg text-gray-600">
            Prenez rendez-vous pour une séance d'hypnothérapie
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Informations de contact</h2>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <PhoneIcon className="h-6 w-6 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900">Téléphone</p>
                    <p className="text-gray-600">+212 660 826 028</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <EnvelopeIcon className="h-6 w-6 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">knzjoyce@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <MapPinIcon className="h-6 w-6 text-primary-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Adresse</p>
                    <p className="text-gray-600">
                      17 Rue Bab El Mandab, Residence El Prado 2,<br />
                      1er étage appart #2 Bourgogne,<br />
                      Casablanca
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <InformationCircleIcon className="h-6 w-6 text-primary-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">À propos des rendez-vous</p>
                    <p className="text-gray-600">
                      Les séances durent environ {settings?.slotDuration || 60} minutes. 
                      Certains créneaux affichés peuvent être en attente de confirmation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div>
            <motion.form
              onSubmit={handleSubmit}
              className="bg-white p-8 rounded-lg shadow-sm space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Prendre rendez-vous</h2>

                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    id="isFirstTime"
                    checked={isFirstTime}
                    onChange={(e) => setIsFirstTime(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isFirstTime" className="text-sm text-gray-700">
                    C'est ma première séance (durée 2 heures)
                  </label>
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    id="isOnline"
                    checked={isOnline}
                    onChange={(e) => setIsOnline(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isOnline" className="text-sm text-gray-700">
                    Je souhaite une séance en ligne via Zoom
                  </label>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-4 bg-green-50 border border-green-200 text-green-600 rounded-md">
                    Votre demande de rendez-vous a été envoyée avec succès. Nous vous contacterons rapidement pour confirmer.
                  </div>
                )}

                <AppointmentCalendar onSelectSlot={handleSlotSelect} />

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nom complet
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                    <UserIcon className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                    <EnvelopeIcon className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Téléphone
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                    <PhoneIcon className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Message (optionnel)
                  </label>
                  <div className="mt-1">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="Décrivez brièvement la raison de votre consultation..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !selectedDate || !selectedTime}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed active:bg-primary-800 transition-all duration-200 transform hover:scale-105 ${isLoading ? 'cursor-wait' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <span className="flex items-center">
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      Demander un rendez-vous
                    </span>
                  )}
                </button>
              </div>
            </motion.form>
          </div>
        </div>
      </div>
      
      <BookingConfirmationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
} 
