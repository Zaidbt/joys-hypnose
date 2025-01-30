'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Editor } from '@/components/Editor';
import {
  ArrowLeftIcon,
  CalendarIcon,
  NewspaperIcon,
  MegaphoneIcon,
} from '@heroicons/react/24/outline';
import type { NewsItem } from '@/types/news';

const newsTypes = [
  { id: 'press', label: 'Presse', icon: NewspaperIcon },
  { id: 'event', label: 'Événement', icon: CalendarIcon },
  { id: 'general', label: 'Actualité', icon: MegaphoneIcon },
];

export default function EditNewsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);

  useEffect(() => {
    fetchNewsItem();
  }, [params.id]);

  const fetchNewsItem = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/news/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch news item');
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to load news item');
      }
      
      setNewsItem(data.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load news item');
      console.error('Error fetching news item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsItem) return;

    try {
      setIsSaving(true);
      const response = await fetch(`/api/news/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newsItem),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update news item');
      }

      router.push('/joyspanel/news');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update news item');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article introuvable</h2>
            <p className="text-gray-600 mb-6">
              L'article que vous cherchez n'existe pas ou a été supprimé.
            </p>
            <button
              onClick={() => router.push('/joyspanel/news')}
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

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.push('/joyspanel/news')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Retour
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Modifier l'article</h1>
          <div className="w-24"></div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
          <div className="p-6">
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Titre
              </label>
              <input
                type="text"
                id="title"
                value={newsItem.title}
                onChange={(e) => setNewsItem({ ...newsItem, title: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                Extrait
              </label>
              <textarea
                id="excerpt"
                value={newsItem.excerpt || ''}
                onChange={(e) => setNewsItem({ ...newsItem, excerpt: e.target.value })}
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                id="type"
                value={newsItem.type}
                onChange={(e) => setNewsItem({ ...newsItem, type: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              >
                {newsTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                id="image"
                value={newsItem.image || ''}
                onChange={(e) => setNewsItem({ ...newsItem, image: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contenu
              </label>
              <Editor
                value={newsItem.content}
                onChange={(content) => setNewsItem({ ...newsItem, content })}
              />
            </div>

            {newsItem.type === 'event' && (
              <div className="mb-6">
                <label htmlFor="eventLocation" className="block text-sm font-medium text-gray-700 mb-1">
                  Lieu de l'événement
                </label>
                <input
                  type="text"
                  id="eventLocation"
                  value={newsItem.eventLocation || ''}
                  onChange={(e) => setNewsItem({ ...newsItem, eventLocation: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            )}
          </div>

          <div className="px-6 py-4 bg-gray-50 flex items-center justify-between rounded-b-lg">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="published"
                checked={newsItem.status === 'published'}
                onChange={(e) => setNewsItem({ 
                  ...newsItem, 
                  status: e.target.checked ? 'published' : 'draft',
                  publishedAt: e.target.checked ? new Date().toISOString() : newsItem.publishedAt
                })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                Publier cet article
              </label>
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.push('/joyspanel/news')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 