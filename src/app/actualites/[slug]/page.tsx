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
  ShareIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import type { NewsItem, NewsType } from '@/types/news';
import { formatInTimeZone } from 'date-fns-tz';
import { fr } from 'date-fns/locale';
import dynamic from 'next/dynamic';

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

const EventRegistrationForm = dynamic(() => import('@/components/EventRegistrationForm'), {
  ssr: false,
});

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
      console.log('Fetching news item with slug:', params.slug);
      const response = await fetch(`/api/news/by-slug/${encodeURIComponent(params.slug)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Failed to fetch news item');
      }
      
      const data = await response.json();
      console.log('Received news item data:', data);
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to load news item');
      }
      
      // Only show published items on the public page
      if (data.data.status !== 'published') {
        throw new Error('Article non disponible');
      }
      
      setNewsItem(data.data);
    } catch (error) {
      console.error('Error details:', error);
      setError(error instanceof Error ? error.message : 'Failed to load news item');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: newsItem?.title,
        text: newsItem?.excerpt,
        url: window.location.href,
      });
    } catch (error) {
      console.error('Error sharing:', error);
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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg z-10 border-b border-gray-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => router.push('/actualites')}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Retour aux actualités
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
          >
            <ShareIcon className="h-4 w-4 mr-2" />
            Partager
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm overflow-hidden"
          >
            {/* Article Header */}
            <div className="p-8 pb-0">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary-50 text-primary-700 mb-6">
                <Icon className="h-4 w-4 mr-2" />
                {newsTypeLabels[newsItem.type as NewsType]}
              </span>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {newsItem.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8">
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
            </div>

            {/* Featured Image */}
            {newsItem.image && (
              <div className="relative w-full h-[400px] mb-8">
                <img
                  src={newsItem.image}
                  alt={newsItem.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="px-8 pb-8">
              {/* Event Details (if type is event) */}
              {newsItem.type === 'event' && (
                <div className="mb-8 p-6 bg-primary-50 rounded-xl">
                  <h3 className="text-lg font-semibold text-primary-700 mb-4">Détails de l'événement</h3>
                  <div className="space-y-3">
                    {newsItem.eventDate && (
                      <div className="flex items-center text-gray-700">
                        <CalendarIcon className="h-5 w-5 mr-3 text-primary-600" />
                        <div>
                          <span className="font-medium">Date : </span>
                          {formatDate(new Date(newsItem.eventDate))}
                          {newsItem.eventEndDate && (
                            <> - {formatDate(new Date(newsItem.eventEndDate))}</>
                          )}
                        </div>
                      </div>
                    )}
                    {newsItem.eventLocation && (
                      <div className="flex items-center text-gray-700">
                        <MapPinIcon className="h-5 w-5 mr-3 text-primary-600" />
                        <div>
                          <span className="font-medium">Lieu : </span>
                          {newsItem.eventLocation}
                        </div>
                      </div>
                    )}
                    {newsItem.eventPrice && (
                      <div className="flex items-center text-gray-700">
                        <span className="mr-3 text-primary-600">Prix :</span>
                        {newsItem.eventPrice} DH
                      </div>
                    )}
                    {newsItem.isOnline && (
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Événement en ligne
                      </div>
                    )}
                  </div>
                </div>
              )}

              {newsItem.excerpt && (
                <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                  <p className="text-lg text-gray-600 leading-relaxed italic">
                    {newsItem.excerpt}
                  </p>
                </div>
              )}
              
              <div 
                className="prose prose-lg max-w-none prose-primary prose-headings:font-bold prose-p:leading-relaxed prose-img:rounded-xl"
                dangerouslySetInnerHTML={{ __html: newsItem.content }}
              />

              {/* Press Details (if type is press) */}
              {newsItem.type === 'press' && (
                <div className="mt-8 p-6 bg-primary-50 rounded-xl">
                  <h3 className="text-lg font-semibold text-primary-700 mb-4">Détails de la publication</h3>
                  <div className="space-y-3">
                    {newsItem.publication && (
                      <div className="flex items-center text-gray-700">
                        <NewspaperIcon className="h-5 w-5 mr-3 text-primary-600" />
                        <div>
                          <span className="font-medium">Publication : </span>
                          {newsItem.publication}
                        </div>
                      </div>
                    )}
                    {newsItem.originalArticleUrl && (
                      <div className="mt-4">
                        <a
                          href={newsItem.originalArticleUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 border border-primary-600 rounded-md shadow-sm text-sm font-medium text-primary-600 bg-white hover:bg-primary-50"
                        >
                          Lire l'article original
                          <ArrowLeftIcon className="ml-2 h-4 w-4" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tags */}
              {newsItem.tags && newsItem.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {newsItem.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Registration Form for events */}
              {newsItem.type === 'event' && (
                <div className="mt-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Inscription à l'événement</h3>
                  <EventRegistrationForm event={newsItem} />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 