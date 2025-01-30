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
  ArrowLongRightIcon,
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

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function NewsPage() {
  const router = useRouter();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<NewsType | 'all'>('all');

  useEffect(() => {
    fetchNews();
  }, [selectedType]);

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams();
      
      if (selectedType !== 'all') {
        queryParams.set('type', selectedType);
      }
      // Always filter for published articles on the public page
      queryParams.set('status', 'published');

      console.log('Fetching news with params:', queryParams.toString());
      const response = await fetch(`/api/news?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch news');
      
      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.success === false) {
        throw new Error(data.error || 'Failed to load news');
      }
      
      // Ensure all news items have slugs
      const newsWithSlugs = data.data.map((item: NewsItem) => ({
        ...item,
        slug: item.slug || generateSlug(item.title)
      }));
      
      console.log('Processed news items:', newsWithSlugs);
      setNews(newsWithSlugs || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load news');
      console.error('Error fetching news:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9-\s]/g, '') // Keep only alphanumeric, hyphens and spaces
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with single hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/(^-|-$)/g, ''); // Remove leading/trailing hyphens
  };

  const filteredNews = selectedType === 'all'
    ? news
    : news.filter(item => item.type === selectedType);

  console.log('Filtered news items:', filteredNews);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-5rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6"
          >
            Actualités
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 leading-relaxed"
          >
            Découvrez les dernières actualités, événements et articles de presse concernant l'hypnose et nos activités.
          </motion.p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-3 mb-12"
        >
          <button
            onClick={() => setSelectedType('all')}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
              selectedType === 'all'
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                : 'bg-white text-gray-600 hover:bg-gray-100 shadow-md hover:shadow-lg'
            }`}
          >
            Tout voir
          </button>
          {Object.entries(newsTypeLabels).map(([type, label]) => {
            const Icon = newsTypeIcons[type as NewsType];
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type as NewsType)}
                className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                  selectedType === type
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                    : 'bg-white text-gray-600 hover:bg-gray-100 shadow-md hover:shadow-lg'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </button>
            );
          })}
        </motion.div>

        {/* News Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredNews.map((item) => {
            const Icon = newsTypeIcons[item.type as NewsType];
            return (
              <motion.div
                key={item._id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={() => {
                  console.log('Navigating to news item:', item);
                  router.push(`/actualites/${encodeURIComponent(item.slug)}`);
                }}
              >
                <div className="relative h-56 bg-gray-200">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
                      <Icon className="h-16 w-16 text-primary-600" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/90 backdrop-blur-sm text-primary-700 shadow-lg">
                      <Icon className="h-4 w-4 mr-2" />
                      {newsTypeLabels[item.type as NewsType]}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {item.title}
                  </h2>
                  {item.excerpt && (
                    <p className="text-gray-600 mb-6 line-clamp-2">{item.excerpt}</p>
                  )}
                  <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4 mb-6">
                    <span className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      {formatDate(new Date(item.publishedAt || item.createdAt))}
                    </span>
                    {item.author && (
                      <span className="flex items-center">
                        <UserIcon className="h-4 w-4 mr-2" />
                        {item.author}
                      </span>
                    )}
                    {item.type === 'event' && item.eventLocation && (
                      <span className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        {item.eventLocation}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-primary-600 font-medium group-hover:text-primary-700 transition-colors">
                    Lire la suite
                    <ArrowLongRightIcon className="h-5 w-5 ml-2 transform group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {filteredNews.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white rounded-2xl shadow-sm"
          >
            <MegaphoneIcon className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Aucune actualité trouvée
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Il n'y a pas encore d'actualités dans cette catégorie. Revenez bientôt pour découvrir nos nouveaux contenus.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
} 
