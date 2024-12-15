'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  ClockIcon,
  ChatBubbleLeftIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import type { TimeSlot } from '@/types/appointment';

interface ClientRecord extends TimeSlot {
  visitCount?: number;
  lastVisit?: Date;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    async function fetchClients() {
      try {
        const response = await fetch('/api/clients');
        if (!response.ok) throw new Error('Failed to fetch clients');
        const data = await response.json();
        setClients(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load clients');
      } finally {
        setIsLoading(false);
      }
    }

    fetchClients();
  }, []);

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.clientEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.clientPhone?.includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleDeleteClient = async (clientId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete client');
      }

      // Remove the client from the state
      setClients(prevClients => 
        prevClients.filter(client => client._id !== clientId)
      );
    } catch (error) {
      setError('Failed to delete client');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Registre des Clients</h1>
          <p className="mt-2 text-sm text-gray-700">
            Liste complète des clients et leur historique de rendez-vous
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white shadow-sm rounded-lg overflow-hidden">
        {/* Search and Filter Bar */}
        <div className="p-4 border-b border-gray-200 bg-white space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
          <div className="w-full sm:w-96">
            <input
              type="text"
              placeholder="Rechercher un client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="booked">Confirmés</option>
              <option value="pending">En attente</option>
              <option value="cancelled">Annulés</option>
            </select>
          </div>
        </div>

        {/* Client Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {filteredClients.map((client) => (
            <motion.div
              key={client._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-primary-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{client.clientName}</h3>
                      <p className="text-sm text-gray-500">
                        {client.visitCount || 1} visite{(client.visitCount || 1) > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${client.status === 'booked' ? 'bg-green-100 text-green-800' : 
                        client.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {client.status === 'booked' ? 'Confirmé' : 
                       client.status === 'pending' ? 'En attente' : 'Annulé'}
                    </span>
                    <button
                      onClick={() => handleDeleteClient(client._id!)}
                      className="p-1 text-red-600 hover:text-red-900 transition-colors"
                      title="Supprimer le client"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <EnvelopeIcon className="h-5 w-5 mr-2 text-gray-400" />
                    {client.clientEmail}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <PhoneIcon className="h-5 w-5 mr-2 text-gray-400" />
                    {client.clientPhone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
                    {new Date(client.startTime).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="h-5 w-5 mr-2 text-gray-400" />
                    {new Date(client.startTime).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                {client.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <div className="flex items-start">
                      <ChatBubbleLeftIcon className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600">{client.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun client trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
} 