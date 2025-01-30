'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  CalendarIcon,
  NewspaperIcon,
  MegaphoneIcon,
  PhotoIcon,
  LinkIcon,
  DocumentIcon,
  MapPinIcon,
  CurrencyEuroIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import type { NewsItem, NewsType } from '@/types/news';

// Dynamic import of the rich text editor to avoid SSR issues
const Editor = dynamic(() => import('@/components/Editor'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

const newsTypeIcons = {
  press: NewspaperIcon,
  event: CalendarIcon,
  general: MegaphoneIcon,
};

const newsTypeLabels = {
  press: 'Article de presse',
  event: 'Événement',
  general: 'Actualité générale',
};

const newsTypeDescriptions = {
  press: 'Créez un article pour partager une couverture médiatique',
  event: 'Organisez un événement avec inscription',
  general: 'Partagez une actualité générale',
};

export default function CreateNewsPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<NewsType | null>(null);
  const [formData, setFormData] = useState<Partial<NewsItem>>({
    title: '',
    content: '',
    excerpt: '',
    status: 'draft',
    type: 'general',
    metaTitle: '',
    metaDescription: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload image');

      const data = await response.json();
      setFormData((prev) => ({ ...prev, image: data.url }));
    } catch (error) {
      setError('Failed to upload image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create news item');

      router.push('/joyspanel/news');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create news item');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Retour
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">Nouvelle actualité</h1>
      </div>

      {/* Type Selection */}
      {!selectedType ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Object.entries(newsTypeLabels).map(([type, label]) => {
            const Icon = newsTypeIcons[type as NewsType];
            return (
              <motion.button
                key={type}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedType(type as NewsType);
                  setFormData((prev) => ({ ...prev, type: type as NewsType }));
                }}
                className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex flex-col items-center space-y-3 hover:border-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Icon className="h-8 w-8 text-primary-600" />
                <div className="text-center">
                  <h3 className="text-gray-900 font-medium">{label}</h3>
                  <p className="text-sm text-gray-500">{newsTypeDescriptions[type as NewsType]}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200 bg-white p-6 rounded-lg shadow">
          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6 sm:space-y-5">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Informations générales</h3>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Titre
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="title"
                      id="title"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                    Extrait
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="excerpt"
                      name="excerpt"
                      rows={3}
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700">Contenu</label>
                  <div className="mt-1">
                    <Editor
                      value={formData.content}
                      onChange={handleEditorChange}
                      className="min-h-[400px]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700">Image principale</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {formData.image ? (
                        <div>
                          <img
                            src={formData.image}
                            alt="Preview"
                            className="mx-auto h-32 w-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, image: undefined }))}
                            className="mt-2 text-sm text-red-600 hover:text-red-500"
                          >
                            Supprimer
                          </button>
                        </div>
                      ) : (
                        <div>
                          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label htmlFor="image-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:text-primary-500">
                              <span>Télécharger une image</span>
                              <input
                                id="image-upload"
                                name="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="sr-only"
                              />
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Type-specific fields */}
            {selectedType === 'press' && (
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="publication" className="block text-sm font-medium text-gray-700">
                    Publication
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="publication"
                      id="publication"
                      value={formData.publication || ''}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="originalArticleUrl" className="block text-sm font-medium text-gray-700">
                    URL de l'article original
                  </label>
                  <div className="mt-1">
                    <input
                      type="url"
                      name="originalArticleUrl"
                      id="originalArticleUrl"
                      value={formData.originalArticleUrl || ''}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedType === 'event' && (
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">
                    Date de l'événement
                  </label>
                  <div className="mt-1">
                    <input
                      type="datetime-local"
                      name="eventDate"
                      id="eventDate"
                      value={formData.eventDate?.toString().slice(0, 16) || ''}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="eventEndDate" className="block text-sm font-medium text-gray-700">
                    Date de fin
                  </label>
                  <div className="mt-1">
                    <input
                      type="datetime-local"
                      name="eventEndDate"
                      id="eventEndDate"
                      value={formData.eventEndDate?.toString().slice(0, 16) || ''}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="eventLocation" className="block text-sm font-medium text-gray-700">
                    Lieu
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="eventLocation"
                      id="eventLocation"
                      value={formData.eventLocation || ''}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="eventPrice" className="block text-sm font-medium text-gray-700">
                    Prix
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="eventPrice"
                      id="eventPrice"
                      min="0"
                      step="0.01"
                      value={formData.eventPrice || ''}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="eventCapacity" className="block text-sm font-medium text-gray-700">
                    Capacité
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="eventCapacity"
                      id="eventCapacity"
                      min="1"
                      value={formData.eventCapacity || ''}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="registrationDeadline" className="block text-sm font-medium text-gray-700">
                    Date limite d'inscription
                  </label>
                  <div className="mt-1">
                    <input
                      type="datetime-local"
                      name="registrationDeadline"
                      id="registrationDeadline"
                      value={formData.registrationDeadline?.toString().slice(0, 16) || ''}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <div className="flex items-center h-full">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isOnline"
                        checked={formData.isOnline || false}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, isOnline: e.target.checked }))
                        }
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Événement en ligne</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* SEO Fields */}
            <div className="mt-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">SEO</h3>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700">
                    Titre SEO
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="metaTitle"
                      id="metaTitle"
                      value={formData.metaTitle || ''}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700">
                    Description SEO
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="metaDescription"
                      name="metaDescription"
                      rows={3}
                      value={formData.metaDescription || ''}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-5">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
} 