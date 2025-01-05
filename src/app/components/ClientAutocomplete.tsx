import React, { useState, useEffect, useRef } from 'react';
import { UserIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface Client {
  name: string;
  email: string;
  phone: string;
  lastVisit: string;
  visitCount: number;
}

interface Props {
  onClientSelect: (client: Client) => void;
}

export default function ClientAutocomplete({ onClientSelect }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchClients = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/clients/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Failed to search clients');
        const data = await response.json();
        setResults(data.clients);
        setIsOpen(true);
      } catch (error) {
        console.error('Error searching clients:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimeout = setTimeout(searchClients, 300);
    return () => clearTimeout(debounceTimeout);
  }, [query]);

  const handleSelect = (client: Client) => {
    onClientSelect(client);
    setQuery(client.name);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un client..."
          className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary-500 focus:ring-primary-500"
        />
        {isLoading && (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg"
          >
            <ul className="max-h-60 overflow-auto rounded-md py-1 text-base">
              {results.map((client, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(client)}
                  className="relative cursor-pointer select-none px-4 py-2 hover:bg-gray-100"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{client.name}</span>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <EnvelopeIcon className="mr-1 h-4 w-4" />
                        {client.email}
                      </span>
                      <span className="flex items-center">
                        <PhoneIcon className="mr-1 h-4 w-4" />
                        {client.phone}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-gray-400">
                      {client.visitCount} séance{client.visitCount > 1 ? 's' : ''} - 
                      Dernière visite: {new Date(client.lastVisit).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 