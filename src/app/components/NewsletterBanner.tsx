'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function NewsletterBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check if user has seen the banner before
    const hasSeenBanner = localStorage.getItem('hasSeenNewsletterBanner');
    if (!hasSeenBanner) {
      // Show banner after 3 seconds
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenNewsletterBanner', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Subscription failed');
      }

      setStatus('success');
      setMessage('Merci de votre inscription !');
      localStorage.setItem('hasSeenNewsletterBanner', 'true');
      
      // Hide banner after 3 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    } catch (error) {
      setStatus('error');
      setMessage('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary-100 to-primary-50 shadow-lg"
        >
          <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between flex-wrap">
              <div className="w-0 flex-1 flex items-center">
                <div className="ml-3 font-medium text-primary-900">
                  <span className="md:hidden">Recevez nos actualités !</span>
                  <span className="hidden md:inline">
                    Restez informé(e) de nos dernières actualités et conseils bien-être !
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0 sm:ml-4">
                <form onSubmit={handleSubmit} className="flex items-center">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre email"
                    className="min-w-0 flex-1 form-input px-3 py-2 rounded-l-md border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="flex-shrink-0 px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {status === 'loading' ? 'Envoi...' : "S'inscrire"}
                  </button>
                </form>
                {message && (
                  <p className={`mt-1 text-sm ${status === 'error' ? 'text-red-600' : 'text-primary-800'}`}>
                    {message}
                  </p>
                )}
              </div>
              <div className="ml-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex p-2 rounded-md hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <span className="sr-only">Fermer</span>
                  <XMarkIcon className="h-6 w-6 text-primary-900" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 