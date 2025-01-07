'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { formatInTimeZone } from 'date-fns-tz';
import { fr } from 'date-fns/locale';
import { BanknotesIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface TimeSlot {
  _id: string;
  startTime: string;
  endTime: string;
  clientName: string;
  status: string;
  isFirstTime: boolean;
}

interface FinancialTrackingProps {
  appointments: TimeSlot[];
}

const formatDate = (date: Date) => {
  return formatInTimeZone(date, 'Africa/Casablanca', 'd MMMM yyyy', { locale: fr });
};

export default function FinancialTracking({ appointments }: FinancialTrackingProps) {
  // Filter only confirmed appointments
  const confirmedAppointments = appointments.filter(app => app.status === 'booked');

  // Calculate total revenue
  const totalRevenue = confirmedAppointments.reduce((total, app) => {
    return total + (app.isFirstTime ? 700 : 500);
  }, 0);

  // Group appointments by month
  const appointmentsByMonth = confirmedAppointments.reduce((acc: { [key: string]: TimeSlot[] }, appointment) => {
    const monthKey = formatInTimeZone(new Date(appointment.startTime), 'Africa/Casablanca', 'yyyy-MM');
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(appointment);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Suivi Financier</h3>
        <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full">
          <BanknotesIcon className="h-5 w-5 mr-2" />
          <span className="font-medium">{totalRevenue} DH</span>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(appointmentsByMonth).map(([month, monthAppointments]) => {
          const monthRevenue = monthAppointments.reduce((total, app) => {
            return total + (app.isFirstTime ? 700 : 500);
          }, 0);

          const [year, monthNum] = month.split('-');
          const monthDate = new Date(parseInt(year), parseInt(monthNum) - 1);
          const monthName = formatInTimeZone(monthDate, 'Africa/Casablanca', 'MMMM yyyy', { locale: fr });

          return (
            <motion.div
              key={month}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-b border-gray-200 pb-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-900 capitalize">{monthName}</h4>
                <span className="text-sm font-medium text-green-600">{monthRevenue} DH</span>
              </div>

              <div className="space-y-3">
                {monthAppointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">
                        {formatDate(new Date(appointment.startTime))} - {appointment.clientName}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {appointment.isFirstTime ? '700' : '500'} DH
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}

        {confirmedAppointments.length === 0 && (
          <div className="text-center py-4">
            <p className="text-gray-500">Aucun rendez-vous confirmé</p>
          </div>
        )}
      </div>
    </div>
  );
} 