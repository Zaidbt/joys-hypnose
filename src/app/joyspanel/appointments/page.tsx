'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CalendarIcon,
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  SparklesIcon,
  NoSymbolIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import type { TimeSlot } from '@/types/appointment';
import { formatInTimeZone } from 'date-fns-tz';
import { fr } from 'date-fns/locale';

const formatDate = (date: Date) => {
  return formatInTimeZone(date, 'Africa/Casablanca', 'EEEE d MMMM yyyy', { locale: fr });
};

const formatTime = (date: Date) => {
  return formatInTimeZone(date, 'Africa/Casablanca', 'HH:mm');
};

const statusColors = {
  available: 'bg-green-50 text-green-700',
  booked: 'bg-blue-50 text-blue-700',
  pending: 'bg-yellow-50 text-yellow-700',
  fictitious: 'bg-purple-50 text-purple-700',
  cancelled: 'bg-red-50 text-red-700'
};

const statusLabels = {
  available: 'Disponible',
  booked: 'Réservé',
  pending: 'En attente',
  fictitious: 'À confirmer',
  cancelled: 'Annulé'
};

const statusActions = {
  pending: [
    { label: 'Confirmer', status: 'booked', icon: CheckCircleIcon, color: 'text-green-600 hover:text-green-900' },
    { label: 'Annuler', status: 'cancelled', icon: XCircleIcon, color: 'text-red-600 hover:text-red-900' }
  ],
  fictitious: [
    { label: 'Confirmer', status: 'booked', icon: CheckCircleIcon, color: 'text-green-600 hover:text-green-900' },
    { label: 'Supprimer', status: 'delete', icon: XCircleIcon, color: 'text-red-600 hover:text-red-900' }
  ],
  booked: [
    { label: 'Annuler', status: 'cancelled', icon: XCircleIcon, color: 'text-red-600 hover:text-red-900' }
  ],
  cancelled: [
    { label: 'Supprimer', status: 'delete', icon: TrashIcon, color: 'text-red-600 hover:text-red-900' }
  ]
};

export default function AppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAppointments = useCallback(async () => {
    try {
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endDate = new Date(now.getFullYear(), now.getMonth() + 6, now.getDate(), 23, 59, 59, 999);

      const response = await fetch(
        `/api/appointments?start=${startDate.toISOString()}&end=${endDate.toISOString()}&t=${Date.now()}`,
        {
          cache: 'no-store'
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch appointments');
      
      const data = await response.json();
      const sortedAppointments = data.sort((a: TimeSlot, b: TimeSlot) => 
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
      setAppointments(sortedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError(error instanceof Error ? error.message : 'Failed to load appointments');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleAction = async (appointmentId: string, action: string) => {
    try {
      if (action === 'delete') {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer définitivement ce rendez-vous ?')) {
          return;
        }
        const response = await fetch(`/api/appointments/${appointmentId}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete appointment');

        // Remove the appointment from the state and refresh the list
        setAppointments(prevAppointments => 
          prevAppointments.filter(appointment => appointment._id !== appointmentId)
        );
      } else {
        if (!window.confirm(`Êtes-vous sûr de vouloir ${action === 'booked' ? 'confirmer' : 'annuler'} ce rendez-vous ?`)) {
          return;
        }
        const response = await fetch(`/api/appointments/${appointmentId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: action }),
        });

        if (!response.ok) throw new Error('Failed to update appointment');

        // Refresh the appointments list after update
        await fetchAppointments();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to process action');
    }
  };

  const generateFictitiousAppointments = async () => {
    try {
      const response = await fetch('/api/appointments/generate-fictitious', {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Failed to generate appointments');

      // Refresh the appointments list
      await fetchAppointments();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate appointments');
    }
  };

  const deleteFictitiousAppointments = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer tous les rendez-vous fictifs ?')) {
      return;
    }

    try {
      const response = await fetch('/api/appointments/delete-fictitious', {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete fictitious appointments');

      // Refresh the appointments list
      await fetchAppointments();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete fictitious appointments');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>;
  }

  // Filter appointments based on status and search term
  const filteredAppointments = appointments.filter(appointment => {
    const matchesStatus = selectedStatus === 'all' || appointment.status === selectedStatus;
    const matchesSearch = searchTerm === '' || 
      appointment.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.clientEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.clientPhone?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Group appointments by date in Casablanca timezone
  const appointmentsByDate = filteredAppointments.reduce((acc: { [key: string]: TimeSlot[] }, appointment) => {
    const dateKey = formatInTimeZone(new Date(appointment.startTime), 'Africa/Casablanca', 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(appointment);
    return acc;
  }, {});

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Rendez-vous</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gérez vos rendez-vous et créez des créneaux fictifs
          </p>
        </div>
        
        {/* Action Buttons - Stack on mobile */}
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => router.push('/joyspanel/appointments/settings')}
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <CalendarIcon className="h-5 w-5 mr-2" />
            Paramètres
          </button>
          <button
            onClick={generateFictitiousAppointments}
            className="inline-flex items-center justify-center px-4 py-2 border border-purple-300 rounded-md shadow-sm text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100"
          >
            <SparklesIcon className="h-5 w-5 mr-2" />
            Générer Fictifs
          </button>
          <button
            onClick={deleteFictitiousAppointments}
            className="inline-flex items-center justify-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100"
          >
            <NoSymbolIcon className="h-5 w-5 mr-2" />
            Supprimer Fictifs
          </button>
          <button
            onClick={() => router.push('/joyspanel/appointments/new')}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nouveau créneau
          </button>
        </div>
      </div>

      {/* Filter section - Stack on mobile */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher par nom, email ou téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 min-w-[200px]">
            <FunnelIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="all">Tous les rendez-vous</option>
              <option value="booked">Confirmés</option>
              <option value="pending">En attente</option>
              <option value="fictitious">Fictifs</option>
              <option value="cancelled">Annulés</option>
            </select>
          </div>
        </div>
      </div>

      {error ? (
        <div className="mt-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          {Object.entries(appointmentsByDate).map(([date, dateAppointments]) => (
            <div key={date} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {formatDate(new Date(date))}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Horaire
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hidden sm:table-cell">
                        Client
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Statut
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hidden sm:table-cell">
                        Type
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {dateAppointments.map((appointment) => (
                      <motion.tr
                        key={appointment._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          <div className="font-medium">{formatTime(new Date(appointment.startTime))}</div>
                          <div className="text-gray-500">{formatTime(new Date(appointment.endTime))}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 hidden sm:table-cell">
                          {appointment.clientName && (
                            <>
                              <div className="font-medium">{appointment.clientName}</div>
                              <div className="text-gray-500">{appointment.clientEmail}</div>
                              <div className="text-gray-500">{appointment.clientPhone}</div>
                            </>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[appointment.status]}`}>
                            {statusLabels[appointment.status]}
                          </span>
                          {/* Mobile-only client info */}
                          <div className="sm:hidden mt-1">
                            {appointment.clientName && (
                              <div className="text-gray-500 text-xs">
                                {appointment.clientName}<br />
                                {appointment.clientPhone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 hidden sm:table-cell">
                          {appointment.isFirstTime ? 'Première séance' : 'Séance normale'}
                          {appointment.isOnline && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              En ligne
                            </span>
                          )}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex justify-end space-x-2">
                            {statusActions[appointment.status as keyof typeof statusActions]?.map((action) => (
                              <button
                                key={action.status}
                                onClick={() => handleAction(appointment._id!, action.status)}
                                className={`${action.color} p-1 rounded-full hover:bg-gray-100`}
                                title={action.label}
                              >
                                <action.icon className="h-5 w-5" />
                                <span className="sr-only">{action.label}</span>
                              </button>
                            ))}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {filteredAppointments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun rendez-vous trouvé</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 