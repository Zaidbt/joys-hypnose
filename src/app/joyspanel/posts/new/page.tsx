'use client';

import React, { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { 
  PhotoIcon, 
  TagIcon, 
  DocumentTextIcon,
  XMarkIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import FeaturedImageUpload from '@/app/components/FeaturedImageUpload';
import { CreateBlogPost } from '@/types/blog';

// Import ReactQuill dynamically to avoid SSR issues
const RichTextEditor = dynamic(() => import('@/app/components/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
});

export default function NewPost() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [post, setPost] = useState<CreateBlogPost>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    tags: [],
    readingTime: 1,
    featuredImage: ''
  });
  const [currentTag, setCurrentTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleChange = (field: keyof CreateBlogPost, value: any) => {
    setPost(prev => {
      const updates = { [field]: value };
      // If title is being updated, also update the slug
      if (field === 'title') {
        updates.slug = generateSlug(value);
      }
      return { ...prev, ...updates };
    });
    setIsDirty(true);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!post.tags.includes(currentTag.trim())) {
        handleChange('tags', [...post.tags, currentTag.trim()]);
      }
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleChange('tags', post.tags.filter(tag => tag !== tagToRemove));
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

  const handleSave = async (status: 'draft' | 'published') => {
    try {
      setIsLoading(true);
      setError('');

      if (!post.title || !post.content) {
        throw new Error('Title and content are required');
      }

      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...post,
          readingTime: post.readingTime ?? 1,
          status
        }),
      });

      if (!response.ok) throw new Error('Failed to save post');

      router.push('/joyspanel/posts');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-save functionality
  React.useEffect(() => {
    const saveTimeout = setTimeout(() => {
      if (isDirty && post.title && post.content) {
        handleSave('draft');
        setIsDirty(false);
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearTimeout(saveTimeout);
  }, [post, isDirty]);

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {previewMode ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={() => handleSave('draft')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isLoading}
            >
              Save Draft
            </button>
            <button
              onClick={() => handleSave('published')}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
              disabled={isLoading}
            >
              Publish
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
            {error}
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Editor */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <input
                type="text"
                placeholder="Post Title"
                value={post.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full text-4xl font-bold border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-primary-500 bg-transparent"
              />
            </div>

            <div>
              <textarea
                placeholder="Short excerpt"
                value={post.excerpt}
                onChange={(e) => handleChange('excerpt', e.target.value)}
                rows={3}
                className="w-full border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Image */}
            <FeaturedImageUpload
              currentImage={post.featuredImage}
              onImageUpload={handleImageUpload}
              onImageRemove={() => handleChange('featuredImage', undefined)}
            />

            {/* Tags */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-4">Tags</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <TagIcon className="h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Add a tag"
                    className="flex-1 border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 inline-flex items-center"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 