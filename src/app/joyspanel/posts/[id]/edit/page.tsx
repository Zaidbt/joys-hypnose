'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import type { BlogPost } from '@/types/blog';
import FeaturedImageUpload from '@/app/components/FeaturedImageUpload';

const RichTextEditor = dynamic(() => import('@/app/components/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
});

export default function EditPost() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const [post, setPost] = useState<BlogPost>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    tags: [],
    readingTime: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPost() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/blog/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch post');
        const data = await response.json();
        setPost({
          ...data,
          content: data.content || '',
          tags: data.tags || []
        });
      } catch (error) {
        setError('Failed to load post');
        console.error('Error fetching post:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  const handleChange = (field: keyof BlogPost, value: any) => {
    setPost(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      handleChange('featuredImage', data.url);
    } catch (error) {
      setError('Failed to upload image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/blog/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...post,
          readingTime: typeof post.readingTime === 'number' ? post.readingTime : 1
        }),
      });

      if (!response.ok) throw new Error('Failed to update post');

      router.push('/joyspanel/posts');
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update post');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Modifier l'article</h1>
            <p className="mt-1 text-sm text-gray-600">
              Modifiez votre article et publiez les changements
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5" />
            Retour
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Titre
                </label>
                <input
                  type="text"
                  id="title"
                  value={post.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                  Extrait
                </label>
                <textarea
                  id="excerpt"
                  value={post.excerpt}
                  onChange={(e) => handleChange('excerpt', e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image principale
                </label>
                <FeaturedImageUpload
                  currentImage={post.featuredImage}
                  onImageUpload={handleImageUpload}
                  onImageRemove={() => handleChange('featuredImage', undefined)}
                />
              </div>

              <div>
                <label htmlFor="readingTime" className="block text-sm font-medium text-gray-700">
                  Temps de lecture (en minutes)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    id="readingTime"
                    min="1"
                    value={post.readingTime}
                    onChange={(e) => handleChange('readingTime', parseInt(e.target.value) || 1)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <div className="prose-editor relative z-0">
                  <RichTextEditor
                    value={post.content}
                    onChange={(content) => handleChange('content', content)}
                    placeholder="Write your post content here..."
                  />
                </div>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  value={post.tags.join(', ')}
                  onChange={(e) => handleChange('tags', e.target.value.split(',').map(tag => tag.trim()))}
                  placeholder="Séparez les tags par des virgules"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
} 