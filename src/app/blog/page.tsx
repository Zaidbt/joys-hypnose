'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { BlogPost } from '@/types/blog';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarIcon } from '@heroicons/react/24/outline';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      console.log('Fetching blog posts...');
      const response = await fetch('/api/blog', {
        cache: 'no-store'
      });
      
      if (!response.ok) throw new Error('Failed to fetch posts');
      
      const data = await response.json();
      console.log('Fetched posts:', data);
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError(error instanceof Error ? error.message : 'Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-primary-50/30 to-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez nos articles sur l'hypnothérapie, le développement personnel et le bien-être
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">
            {error}
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => {
                // Ensure post has a slug
                const postSlug = post.slug || `post-${post._id}`;
                console.log('Post slug:', postSlug);
                
                return (
                  <Link href={`/blog/${postSlug}`} key={post._id}>
                    <motion.article
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full border border-gray-100 hover:border-primary-100 transform hover:-translate-y-1"
                    >
                      {post.featuredImage && (
                        <div className="relative h-64 w-full overflow-hidden">
                          <Image
                            src={post.featuredImage}
                            alt={post.title}
                            fill
                            className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={index < 6}
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
                        </div>
                      )}

                      <div className="p-8">
                        <div className="flex items-center space-x-4 mb-6">
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

                        <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors line-clamp-2">
                          {post.title}
                        </h2>

                        <p className="text-gray-600 mb-6 line-clamp-3 text-base leading-relaxed">
                          {post.excerpt}
                        </p>

                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-6">
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm font-medium hover:bg-primary-100 transition-colors"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center text-primary-600 font-medium group/link">
                          <span className="text-base">Lire l'article</span>
                          <svg 
                            className="w-5 h-5 ml-2 transform group-hover/link:translate-x-1 transition-transform" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </motion.article>
                  </Link>
                );
              })}
            </div>
          </AnimatePresence>
        )}

        {!isLoading && !error && posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Aucun article pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
} 