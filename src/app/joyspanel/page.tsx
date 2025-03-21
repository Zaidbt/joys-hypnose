'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CalendarIcon,
  UsersIcon,
  EnvelopeIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import FinancialTracking from '@/app/components/FinancialTracking';

interface DashboardStats {
  appointments: {
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
    todayCount: number;
    weekCount: number;
    monthCount: number;
  };
  clients: {
    total: number;
    new: number;
    returning: number;
    firstTime: number;
  };
  newsletter: {
    total: number;
    active: number;
    unsubscribed: number;
    recentSubscribers: number;
  };
}

const StatCard = ({ title, value, icon: Icon, trend, color = "primary" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="mt-2 text-3xl font-semibold text-gray-900">
          {typeof value === 'number' && title.toLowerCase().includes('taux') ? `${value}%` : value}
        </p>
        {trend && (
          <div className="mt-2 flex items-center text-sm">
            {trend > 0 ? (
              <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={trend > 0 ? "text-green-600" : "text-red-600"}>
              {Math.abs(trend)}% vs dernier mois
            </span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-lg bg-${color}-50`}>
        <Icon className={`h-6 w-6 text-${color}-600`} />
      </div>
    </div>
  </motion.div>
);

const AppointmentTimeline = ({ appointments }) => {
  const formatter = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Africa/Casablanca',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Rendez-vous à venir</h3>
      <div className="flow-root">
        <ul className="-mb-8">
          {appointments.map((appointment, idx) => (
            <li key={appointment._id}>
              <div className="relative pb-8">
                {idx !== appointments.length - 1 && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                      appointment.status === 'confirmed' ? 'bg-green-500' : 
                      appointment.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}>
                      <ClockIcon className="h-5 w-5 text-white" />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-900">
                        {appointment.clientName} 
                        {appointment.isFirstTime && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Première séance
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <time dateTime={appointment.startTime}>
                        {formatter.format(new Date(appointment.startTime))}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const ClientActivity = ({ clients }) => {
  const formatter = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Africa/Casablanca',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Activité récente</h3>
      <div className="flow-root">
        <ul className="-mb-8">
          {clients.map((client, idx) => (
            <li key={client._id}>
              <div className="relative pb-8">
                {idx !== clients.length - 1 && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                      <UsersIcon className="h-5 w-5 text-white" />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-900">{client.clientName}</p>
                      <p className="text-sm text-gray-500">{client.action}</p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <time dateTime={client.date}>
                        {formatter.format(new Date(client.date))}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/joyspanel/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all appointments (no date filtering)
        const now = new Date();
        const startDate = new Date(2024, 0, 1); // Start from January 1, 2024
        const endDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());

        const appointmentsResponse = await fetch(
          `/api/appointments?start=${startDate.toISOString()}&end=${endDate.toISOString()}`
        );
        const statsResponse = await fetch('/api/stats');

        if (!appointmentsResponse.ok || !statsResponse.ok) {
          console.error('API Error:', {
            appointments: appointmentsResponse.statusText,
            stats: statsResponse.statusText
          });
          throw new Error('Failed to fetch data');
        }

        const [appointmentsData, statsData] = await Promise.all([
          appointmentsResponse.json(),
          statsResponse.json()
        ]);

        // Store all appointments for financial tracking
        setAllAppointments(appointmentsData);

        // Calculate dates for filtering recent appointments
        const todayStart = new Date(now.getTime());
        todayStart.setHours(0, 0, 0, 0);
        
        const weekStart = new Date(todayStart.getTime());
        weekStart.setDate(weekStart.getDate() - 7);
        
        const monthStart = new Date(todayStart.getTime());
        monthStart.setMonth(monthStart.getMonth() - 1);

        const stats: DashboardStats = {
          appointments: {
            total: statsData.appointments.total || 0,
            pending: statsData.appointments.pending || 0,
            confirmed: statsData.appointments.confirmed || 0,
            cancelled: statsData.appointments.cancelled || 0,
            todayCount: statsData.appointments.today || 0,
            weekCount: appointmentsData.filter(a => new Date(a.startTime) >= weekStart).length,
            monthCount: appointmentsData.filter(a => new Date(a.startTime) >= monthStart).length,
          },
          clients: {
            total: statsData.clients.total || 0,
            new: statsData.clients.firstTime || 0,
            returning: statsData.clients.returning || 0,
            firstTime: statsData.clients.firstTime || 0,
          },
          newsletter: {
            total: statsData.newsletter.total || 0,
            active: statsData.newsletter.active || 0,
            unsubscribed: statsData.newsletter.unsubscribed || 0,
            recentSubscribers: statsData.newsletter.active || 0,
          },
        };

        setStats(stats);

        // Get upcoming appointments (filter out past appointments)
        const upcomingAppointments = appointmentsData
          .filter(a => new Date(a.startTime) >= now)
          .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
          .slice(0, 5);
        
        setRecentAppointments(upcomingAppointments);

        // Generate recent activity
        const recentActivity = appointmentsData
          .map(a => ({
            _id: a._id,
            clientName: a.clientName,
            date: a.createdAt || a.startTime,
            action: `${a.status === 'booked' ? 'a confirmé' : 'a pris'} rendez-vous`
          }))
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);
        setRecentActivity(recentActivity);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [router, status]);

  if (status === 'loading' || isLoading || !stats) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/90">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
          <p className="mt-1 text-sm text-gray-500">
            Bienvenue dans votre espace d'administration
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Rendez-vous aujourd'hui"
            value={stats.appointments.todayCount}
            icon={CalendarIcon}
            trend={10}
          />
          <StatCard
            title="Nouveaux clients"
            value={stats.clients.new}
            icon={UsersIcon}
            trend={5}
            color="blue"
          />
          <StatCard
            title="Abonnés newsletter"
            value={stats.newsletter.active}
            icon={EnvelopeIcon}
            trend={-2}
            color="green"
          />
          <StatCard
            title="Taux de confirmation"
            value={Math.round((stats.appointments.confirmed / stats.appointments.total) * 100)}
            icon={CheckCircleIcon}
            trend={3}
            color="indigo"
          />
        </div>

        {/* Two-column layout for timeline and activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
              <AppointmentTimeline appointments={recentAppointments} />
            </div>
            <FinancialTracking appointments={allAppointments} />
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
            <ClientActivity clients={recentActivity} />
          </div>
        </div>
      </div>
    </div>
  );
} 