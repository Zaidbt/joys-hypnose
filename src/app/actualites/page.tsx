'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CalendarIcon,
  NewspaperIcon,
  MegaphoneIcon,
  MapPinIcon,
  ClockIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import type { NewsItem, NewsType } from '@/types/news';
import { formatInTimeZone } from 'date-fns-tz';
import { fr } from 'date-fns/locale';

const newsTypeIcons = {
  press: NewspaperIcon,
  event: CalendarIcon,
  general: MegaphoneIcon,
};

const newsTypeLabels = {
  press: 'Presse',
  event: 'Événement',
  general: 'Actualité',
};

const formatDate = (date: Date) => {
  return formatInTimeZone(date, 'Africa/Casablanca', 'd MMMM yyyy', { locale: fr });
};

export default function NewsPage() {
  const router = useRouter();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<NewsType | 'all'>('all');

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/news');
      if (!response.ok) throw new Error('Failed to fetch news');
      
      const data = await response.json();
      setNews(data.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load news');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredNews = selectedType === 'all'
    ? news
    : news.filter(item => item.type === selectedType);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-primary-700 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-4">Actualités</h1>
          <p className="text-primary-100 text-lg max-w-2xl">
            Découvrez les dernières actualités, événements et articles de presse concernant l'hypnose et nos activités.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedType === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Tout
          </button>
          {Object.entries(newsTypeLabels).map(([type, label]) => {
            const Icon = newsTypeIcons[type as NewsType];
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type as NewsType)}
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedType === type
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </button>
            );
          })}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item, index) => {
            const Icon = newsTypeIcons[item.type as NewsType];
            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/actualites/${item.slug}`)}
              >
                <div className="relative h-48 bg-gray-200">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary-100">
                      <Icon className="h-12 w-12 text-primary-600" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-primary-700 shadow-sm">
                      <Icon className="h-4 w-4 mr-1" />
                      {newsTypeLabels[item.type as NewsType]}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {item.title}
                  </h2>
                  {item.excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-2">{item.excerpt}</p>
                  )}
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <span className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {formatDate(new Date(item.publishedAt || item.createdAt))}
                    </span>
                    {item.author && (
                      <span className="flex items-center">
                        <UserIcon className="h-4 w-4 mr-1" />
                        {item.author}
                      </span>
                    )}
                    {item.type === 'event' && item.eventLocation && (
                      <span className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {item.eventLocation}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <MegaphoneIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune actualité trouvée
            </h3>
            <p className="text-gray-600">
              Il n'y a pas encore d'actualités dans cette catégorie.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 
