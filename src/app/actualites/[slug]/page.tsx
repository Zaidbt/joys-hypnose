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
  ArrowLeftIcon,
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

export default function NewsItemPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNewsItem();
  }, [params.slug]);

  const fetchNewsItem = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/news/by-slug/${params.slug}`);
      if (!response.ok) throw new Error('Failed to fetch news item');
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to load news item');
      }
      
      // Only show published items on the public page
      if (data.data.status !== 'published') {
        throw new Error('Article non disponible');
      }
      
      setNewsItem(data.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load news item');
      console.error('Error fetching news item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-5rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!newsItem || error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article non trouvé</h2>
            <p className="text-gray-600 mb-6">
              L'article que vous cherchez n'existe pas ou n'est pas disponible.
            </p>
            <button
              onClick={() => router.push('/actualites')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Retour aux actualités
            </button>
          </div>
        </div>
      </div>
    );
  }

  const Icon = newsTypeIcons[newsItem.type as NewsType];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-700 to-primary-900">
        {newsItem.image ? (
          <div className="absolute inset-0">
            <img
              src={newsItem.image}
              alt={newsItem.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black opacity-50"></div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
        )}

        <div className="relative container mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center mb-6">
              <button
                onClick={() => router.push('/actualites')}
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Retour aux actualités
              </button>
            </div>

            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/90 backdrop-blur-sm text-primary-700 shadow-lg mb-6">
              <Icon className="h-4 w-4 mr-2" />
              {newsTypeLabels[newsItem.type as NewsType]}
            </span>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {newsItem.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-primary-100">
              <span className="flex items-center">
                <ClockIcon className="h-5 w-5 mr-2" />
                {formatDate(new Date(newsItem.publishedAt || newsItem.createdAt))}
              </span>
              {newsItem.author && (
                <span className="flex items-center">
                  <UserIcon className="h-5 w-5 mr-2" />
                  {newsItem.author}
                </span>
              )}
              {newsItem.type === 'event' && newsItem.eventLocation && (
                <span className="flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  {newsItem.eventLocation}
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="container mx-auto px-4 py-12"
      >
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8">
          {newsItem.excerpt && (
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {newsItem.excerpt}
            </p>
          )}
          <div 
            className="prose prose-lg max-w-none prose-primary"
            dangerouslySetInnerHTML={{ __html: newsItem.content }}
          />
        </div>
      </motion.div>
    </div>
  );
} 