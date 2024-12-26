import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingConfirmationModal({ isOpen, onClose }: BookingConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4 text-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-30 transition-opacity"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
          >
            {/* Close button */}
            <div className="absolute right-0 top-0 pr-4 pt-4">
              <button
                type="button"
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={onClose}
              >
                <span className="sr-only">Fermer</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                <CheckCircleIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-xl font-semibold leading-6 text-gray-900">
                  Demande de rendez-vous envoyée !
                </h3>
                <div className="mt-4">
                  <p className="text-gray-600">
                    Votre demande de rendez-vous a été envoyée avec succès. Vous recevrez bientôt un email de confirmation.
                  </p>
                  <p className="mt-2 text-gray-600">
                    Je vous contacterai dans les plus brefs délais pour confirmer votre rendez-vous.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 sm:ml-3 sm:w-auto"
                onClick={onClose}
              >
                Compris
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
} 