'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  CalendarIcon,
  NewspaperIcon,
  MegaphoneIcon,
  MapPinIcon,
  ClockIcon,
  ArrowLeftIcon,
  LinkIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
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

export default function NewsDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNewsItem();
  }, [params.slug]);

  const fetchNewsItem = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/news/post/${params.slug}`);
      if (!response.ok) throw new Error('Failed to fetch news item');
      
      const data = await response.json();
      setNews(data.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load news item');
      router.push('/actualites');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!news) {
    return null;
  }

  const Icon = newsTypeIcons[news.type as NewsType];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section with Image */}
      <div className="relative h-96 bg-gray-900">
        {news.image ? (
          <img
            src={news.image}
            alt={news.title}
            className="w-full h-full object-cover opacity-70"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary-900">
            <Icon className="h-24 w-24 text-white opacity-50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <button
              onClick={() => router.back()}
              className="mb-4 text-white opacity-80 hover:opacity-100 flex items-center"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Retour aux actualités
            </button>
            <div className="flex items-center mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-primary-700">
                <Icon className="h-4 w-4 mr-1" />
                {newsTypeLabels[news.type as NewsType]}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">{news.title}</h1>
            <div className="flex items-center text-white/80 text-sm space-x-4">
              <span className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                {formatDate(new Date(news.publishedAt || news.createdAt))}
              </span>
              {news.author && (
                <span className="flex items-center">
                  <UserIcon className="h-4 w-4 mr-1" />
                  {news.author}
                </span>
              )}
              {news.type === 'event' && news.eventLocation && (
                <span className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  {news.eventLocation}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Event Details */}
          {news.type === 'event' && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Détails de l'événement</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {news.eventDate && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Date de début</span>
                    <div className="mt-1 flex items-center text-gray-900">
                      <CalendarIcon className="h-5 w-5 mr-2 text-primary-600" />
                      {formatDate(new Date(news.eventDate))}
                    </div>
                  </div>
                )}
                {news.eventEndDate && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Date de fin</span>
                    <div className="mt-1 flex items-center text-gray-900">
                      <CalendarIcon className="h-5 w-5 mr-2 text-primary-600" />
                      {formatDate(new Date(news.eventEndDate))}
                    </div>
                  </div>
                )}
                {news.eventLocation && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Lieu</span>
                    <div className="mt-1 flex items-center text-gray-900">
                      <MapPinIcon className="h-5 w-5 mr-2 text-primary-600" />
                      {news.eventLocation}
                    </div>
                  </div>
                )}
                {news.eventPrice !== undefined && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Prix</span>
                    <div className="mt-1 text-gray-900">
                      {news.eventPrice === 0 ? 'Gratuit' : `${news.eventPrice} €`}
                    </div>
                  </div>
                )}
              </div>
              {!news.isRegistrationClosed && news.registrationDeadline && new Date(news.registrationDeadline) > new Date() && (
                <div className="mt-6">
                  <button
                    onClick={() => router.push(`/actualites/${news.slug}/inscription`)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    S'inscrire à l'événement
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Press Details */}
          {news.type === 'press' && news.originalArticleUrl && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Article original</h2>
              <a
                href={news.originalArticleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary-600 hover:text-primary-700"
              >
                <LinkIcon className="h-5 w-5 mr-2" />
                Lire l'article complet sur {news.publication}
              </a>
            </div>
          )}

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {news.excerpt && (
              <div className="text-lg text-gray-600 mb-8 font-medium">
                {news.excerpt}
              </div>
            )}
            <div
              className="prose prose-primary max-w-none"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 