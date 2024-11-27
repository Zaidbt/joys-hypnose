'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  DocumentTextIcon,
  ChartBarIcon,
  EyeIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

interface Stats {
  totalPosts: number;
  totalVisits: number;
  todayVisits: number;
  totalAppointments: number;
  pendingAppointments: number;
  todayAppointments: number;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalPosts: 0,
    totalVisits: 0,
    todayVisits: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    todayAppointments: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      // Fetch both stats endpoints
      const [generalStats, appointmentStats] = await Promise.all([
        fetch('/api/stats').then(res => res.json()),
        fetch('/api/appointments/stats').then(res => res.json())
      ]);

      console.log('General Stats:', generalStats);
      console.log('Appointment Stats:', appointmentStats);

      // Combine the stats
      setStats({
        totalPosts: generalStats.totalPosts || 0,
        totalVisits: generalStats.totalVisits || 0,
        todayVisits: generalStats.todayVisits || 0,
        totalAppointments: appointmentStats.totalAppointments || 0,
        pendingAppointments: appointmentStats.pendingAppointments || 0,
        todayAppointments: appointmentStats.todayAppointments || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/joyspanel/login');
      return;
    }

    if (session) {
      fetchStats();
    }
  }, [session, status, router, fetchStats]);

  if (status === 'loading' || isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>;
  }

  const statItems = [
    {
      name: 'Articles',
      value: stats.totalPosts,
      icon: DocumentTextIcon,
      description: 'Total des articles publiés',
      onClick: () => router.push('/joyspanel/posts')
    },
    {
      name: 'Rendez-vous',
      value: stats.totalAppointments,
      icon: CalendarIcon,
      description: 'Rendez-vous confirmés',
      onClick: () => router.push('/joyspanel/appointments?filter=booked')
    },
    {
      name: 'À confirmer',
      value: stats.pendingAppointments,
      icon: ClockIcon,
      description: 'En attente de confirmation',
      onClick: () => router.push('/joyspanel/appointments?filter=pending')
    },
    {
      name: "Aujourd'hui",
      value: stats.todayAppointments,
      icon: EyeIcon,
      description: "Rendez-vous confirmés aujourd'hui",
      onClick: () => router.push('/joyspanel/appointments')
    }
  ];

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Bienvenue dans votre espace d'administration
        </p>
      </motion.div>

      <div className="mt-4">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={item.onClick}
            >
              <dt>
                <div className="absolute rounded-md bg-primary-500 p-3">
                  <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">
                  {item.name}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {item.value}
                </p>
              </dd>
              <p className="ml-16 text-sm text-gray-500">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Activité Récente</h2>
        <div className="mt-4 bg-white shadow rounded-lg p-6">
          <div className="space-y-4">
            {/* Recent appointments */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-primary-600 mr-2" />
                <span className="text-sm text-gray-600">
                  {stats.pendingAppointments} nouveaux rendez-vous en attente
                </span>
              </div>
              <button
                onClick={() => router.push('/joyspanel/appointments?filter=pending')}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Voir tout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 