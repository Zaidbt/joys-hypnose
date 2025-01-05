'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { CalendarIcon, ClockIcon, ShareIcon } from '@heroicons/react/24/outline';
import type { BlogPost } from '@/types/blog';
import { motion } from 'framer-motion';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/post/${params.slug}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError(error instanceof Error ? error.message : 'Failed to load post');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [params.slug]);

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = post?.title || '';
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          alert('Lien copié !');
        } catch (err) {
          console.error('Failed to copy:', err);
        }
        break;
    }
    setShowShareMenu(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen pt-24 flex justify-center items-center">
        <div className="text-center text-red-600">
          {error || 'Post not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-primary-50/10 to-white pt-24">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"
            >
              {post.title}
            </motion.h1>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 mb-8">
              <div className="flex items-center space-x-4">
                <div className="relative h-14 w-14 rounded-full overflow-hidden ring-2 ring-primary-100">
                  <Image
                    src="/images/Joyspfp/profile.jpg"
                    alt="Joy's profile"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">Joy</p>
                  <div className="flex items-center text-sm text-gray-500 space-x-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span>
                      {new Date(post.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
              {post.readingTime && (
                <div className="flex items-center text-gray-500 space-x-2">
                  <ClockIcon className="h-5 w-5" />
                  <span>{post.readingTime} min de lecture</span>
                </div>
              )}
            </div>
          </div>

          {/* Featured Image */}
          {post.featuredImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative aspect-[21/9] mb-12 rounded-2xl overflow-hidden shadow-lg"
            >
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>
          )}

          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="prose prose-lg md:prose-xl max-w-none mb-12 px-4 sm:px-6 text-gray-800"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 mb-12">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 bg-primary-50 text-primary-600 rounded-full text-sm font-medium hover:bg-primary-100 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Social Share Section */}
          <div className="border-t border-gray-200 pt-8 mt-12">
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <ShareIcon className="h-5 w-5 mr-2 text-gray-500" />
                Partager cet article
              </button>

              {showShareMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                >
                  <div className="py-1" role="menu">
                    <button
                      onClick={() => handleShare('facebook')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Facebook
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Twitter
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      LinkedIn
                    </button>
                    <button
                      onClick={() => handleShare('whatsapp')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      WhatsApp
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Copier le lien
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </article>
    </div>
  );
} 