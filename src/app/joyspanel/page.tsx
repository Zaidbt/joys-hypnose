'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  DocumentTextIcon, 
  CalendarIcon, 
  ClockIcon,
  EnvelopeIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  articles: number;
  appointments: {
    confirmed: number;
    pending: number;
    today: number;
  };
  newsletter: {
    total: number;
    active: number;
  };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    articles: 0,
    appointments: {
      confirmed: 0,
      pending: 0,
      today: 0
    },
    newsletter: {
      total: 0,
      active: 0
    }
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Articles',
      value: stats.articles,
      description: 'Total des articles publiés',
      icon: DocumentTextIcon,
      href: '/joyspanel/posts',
      iconBackground: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Rendez-vous',
      value: stats.appointments.confirmed,
      description: 'Rendez-vous confirmés',
      icon: CalendarIcon,
      href: '/joyspanel/appointments',
      iconBackground: 'bg-green-100 text-green-600'
    },
    {
      title: 'À confirmer',
      value: stats.appointments.pending,
      description: 'En attente de confirmation',
      icon: ClockIcon,
      href: '/joyspanel/appointments',
      iconBackground: 'bg-yellow-100 text-yellow-600'
    },
    {
      title: 'Newsletter',
      value: stats.newsletter.active,
      description: 'Abonnés actifs',
      icon: EnvelopeIcon,
      href: '/joyspanel/newsletter',
      iconBackground: 'bg-pink-100 text-pink-600'
    }
  ];

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Bienvenue dans votre espace d'administration
        </p>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <dt>
                <div className={`absolute rounded-md p-3 ${card.iconBackground}`}>
                  <card.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                  {card.title}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {card.value}
                </p>
                <div className="absolute bottom-0 inset-x-0 bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <div className="font-medium text-primary-600 hover:text-primary-700 inline-flex items-center">
                      {card.description}
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </dd>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900">Activité Récente</h2>
          <div className="mt-4 bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              {stats.appointments.pending > 0 && (
                <Link 
                  href="/joyspanel/appointments"
                  className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                >
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  {stats.appointments.pending} nouveaux rendez-vous en attente
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 