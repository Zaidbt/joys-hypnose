'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import type { TimeSlot } from '@/types/appointment';

const statusFilters = [
  { value: 'all', label: 'Tous les rendez-vous', color: 'gray' },
  { value: 'booked', label: 'Confirmés', color: 'green' },
  { value: 'pending', label: 'En attente', color: 'yellow' },
  { value: 'fictitious', label: 'Fictifs', color: 'purple' },
  { value: 'cancelled', label: 'Annulés', color: 'red' },
];

const statusColors = {
  booked: 'text-green-700 bg-green-50 border-green-200',
  pending: 'text-yellow-700 bg-yellow-50 border-yellow-200',
  fictitious: 'text-purple-700 bg-purple-50 border-purple-200',
  cancelled: 'text-red-700 bg-red-50 border-red-200',
};

const statusLabels = {
  booked: 'Confirmé',
  pending: 'En attente',
  fictitious: 'Fictif',
  cancelled: 'Annulé',
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments');
      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      setError('Failed to load appointments');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesStatus = selectedStatus === 'all' || appointment.status === selectedStatus;
    const matchesSearch = searchTerm === '' || 
      appointment.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.clientEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.clientPhone?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Africa/Casablanca'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Rendez-vous</h1>
            <p className="mt-2 text-sm text-gray-700">
              Liste de tous les rendez-vous planifiés
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              href="/joyspanel/appointments/new"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Nouveau rendez-vous
            </Link>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-4">
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <label htmlFor="search" className="sr-only">Rechercher</label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    placeholder="Rechercher par nom, email ou téléphone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  {statusFilters.map((filter) => (
                    <option key={filter.value} value={filter.value}>
                      {filter.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Appointments list */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {filteredAppointments.length === 0 ? (
                <li className="p-4 text-center text-gray-500">
                  Aucun rendez-vous trouvé
                </li>
              ) : (
                filteredAppointments.map((appointment) => (
                  <li
                    key={appointment._id}
                    className="p-4 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusColors[appointment.status as keyof typeof statusColors]
                          }`}>
                            {statusLabels[appointment.status as keyof typeof statusLabels]}
                          </span>
                          <h3 className="text-sm font-medium text-gray-900">
                            {appointment.clientName || 'Client sans nom'}
                          </h3>
                        </div>
                        <div className="mt-1 text-sm text-gray-500 space-y-1">
                          <p>{appointment.clientEmail}</p>
                          <p>{appointment.clientPhone}</p>
                          {appointment.notes && (
                            <p className="italic">{appointment.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">{formatDate(appointment.startTime)}</div>
                        <div>{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}</div>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 