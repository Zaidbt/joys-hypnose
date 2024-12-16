'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  ChartBarIcon,
  UsersIcon,
  CalendarIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';

interface Stats {
  appointments: {
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
    today: number;
    upcoming: number;
    confirmationRate: number;
  };
  clients: {
    total: number;
    firstTime: number;
    returning: number;
  };
  newsletter: {
    total: number;
    active: number;
    unsubscribed: number;
  };
}

export default function StatsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/joyspanel/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [status, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Statistiques détaillées</h1>

        <div className="grid grid-cols-1 gap-8">
          {/* Appointments Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <CalendarIcon className="h-6 w-6 text-primary-600 mr-2" />
              <h2 className="text-lg font-medium">Rendez-vous</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-semibold">{stats.appointments.total}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Confirmés</p>
                <p className="text-2xl font-semibold text-green-600">{stats.appointments.confirmed}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">En attente</p>
                <p className="text-2xl font-semibold text-yellow-600">{stats.appointments.pending}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Annulés</p>
                <p className="text-2xl font-semibold text-red-600">{stats.appointments.cancelled}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Aujourd'hui</p>
                <p className="text-2xl font-semibold">{stats.appointments.today}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">À venir</p>
                <p className="text-2xl font-semibold">{stats.appointments.upcoming}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Taux de confirmation</p>
                <p className="text-2xl font-semibold">{stats.appointments.confirmationRate}%</p>
              </div>
            </div>
          </div>

          {/* Clients Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <UsersIcon className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-lg font-medium">Clients</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-semibold">{stats.clients.total}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Première séance</p>
                <p className="text-2xl font-semibold">{stats.clients.firstTime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Clients fidèles</p>
                <p className="text-2xl font-semibold">{stats.clients.returning}</p>
              </div>
            </div>
          </div>

          {/* Newsletter Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <EnvelopeIcon className="h-6 w-6 text-green-600 mr-2" />
              <h2 className="text-lg font-medium">Newsletter</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total abonnés</p>
                <p className="text-2xl font-semibold">{stats.newsletter.total}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Actifs</p>
                <p className="text-2xl font-semibold text-green-600">{stats.newsletter.active}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Désabonnés</p>
                <p className="text-2xl font-semibold text-gray-600">{stats.newsletter.unsubscribed}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 