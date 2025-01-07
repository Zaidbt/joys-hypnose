'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { formatInTimeZone } from 'date-fns-tz';
import { fr } from 'date-fns/locale';
import { BanknotesIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';

interface TimeSlot {
  _id: string;
  startTime: string;
  endTime: string;
  clientName: string;
  clientEmail: string;
  status: string;
  isFirstTime: boolean;
}

interface Client {
  _id: string;
  clientName: string;
  clientEmail: string;
  appointments: TimeSlot[];
  totalRevenue: number;
}

interface AppointmentSettings {
  prices: {
    firstSession: number;
    followUpSession: number;
  };
}

interface FinancialTrackingProps {
  appointments: TimeSlot[];
}

const formatDate = (date: Date) => {
  return formatInTimeZone(date, 'Africa/Casablanca', 'd MMMM yyyy', { locale: fr });
};

export default function FinancialTracking({ appointments }: FinancialTrackingProps) {
  const [settings, setSettings] = useState<AppointmentSettings | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/appointments/settings');
        if (!response.ok) throw new Error('Failed to fetch settings');
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    }

    fetchSettings();
  }, []);

  useEffect(() => {
    if (!settings) return;

    // Filter only confirmed appointments (status is 'confirmed' or 'booked')
    const confirmedAppointments = appointments.filter(app => 
      app.status === 'confirmed' || app.status === 'booked'
    );

    console.log('Confirmed appointments:', confirmedAppointments);

    // Group appointments by client
    const clientMap = new Map<string, Client>();

    confirmedAppointments.forEach(appointment => {
      const clientEmail = appointment.clientEmail;
      if (!clientEmail) return; // Skip if no email

      if (!clientMap.has(clientEmail)) {
        clientMap.set(clientEmail, {
          _id: appointment._id,
          clientName: appointment.clientName || 'Client sans nom',
          clientEmail: clientEmail,
          appointments: [],
          totalRevenue: 0
        });
      }

      const client = clientMap.get(clientEmail)!;
      client.appointments.push(appointment);
    });

    // Calculate revenue for each client
    clientMap.forEach(client => {
      client.appointments.sort((a, b) => 
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );

      client.totalRevenue = client.appointments.reduce((total, app, index) => {
        // First appointment for this client
        if (index === 0) {
          return total + settings.prices.firstSession;
        }
        return total + settings.prices.followUpSession;
      }, 0);
    });

    // Convert map to array and sort by total revenue
    const sortedClients = Array.from(clientMap.values())
      .sort((a, b) => b.totalRevenue - a.totalRevenue);

    console.log('Sorted clients:', sortedClients);
    setClients(sortedClients);
    setIsLoading(false);
  }, [appointments, settings]);

  if (isLoading || !settings) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate total revenue
  const totalRevenue = clients.reduce((total, client) => total + client.totalRevenue, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Suivi Financier</h3>
        <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full">
          <BanknotesIcon className="h-5 w-5 mr-2" />
          <span className="font-medium">{totalRevenue} DH</span>
        </div>
      </div>

      <div className="space-y-6">
        {clients.map((client) => (
          <motion.div
            key={client.clientEmail}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-b border-gray-200 pb-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                <h4 className="text-sm font-medium text-gray-900">{client.clientName}</h4>
              </div>
              <span className="text-sm font-medium text-green-600">{client.totalRevenue} DH</span>
            </div>

            <div className="space-y-3">
              {client.appointments.map((appointment, index) => (
                <div
                  key={appointment._id}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      {formatDate(new Date(appointment.startTime))}
                      {index === 0 && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          Première séance
                        </span>
                      )}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {index === 0 ? settings.prices.firstSession : settings.prices.followUpSession} DH
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {clients.length === 0 && (
          <div className="text-center py-4">
            <p className="text-gray-500">Aucun rendez-vous confirmé</p>
          </div>
        )}
      </div>
    </div>
  );
} 