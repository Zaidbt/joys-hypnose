'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  DocumentTextIcon,
  CalendarIcon,
  UserGroupIcon,
  EnvelopeIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { signOut } from 'next-auth/react';

const menuItems = [
  { name: 'Dashboard', href: '/joyspanel', icon: ChartBarIcon },
  { name: 'Blog Posts', href: '/joyspanel/blog', icon: DocumentTextIcon },
  { name: 'Rendez-vous', href: '/joyspanel/appointments', icon: CalendarIcon },
  { name: 'Clients', href: '/joyspanel/clients', icon: UserGroupIcon },
  { name: 'Newsletter', href: '/joyspanel/newsletter', icon: EnvelopeIcon },
  { name: 'Paramètres', href: '/joyspanel/appointments/settings', icon: Cog6ToothIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="fixed top-4 right-4 z-50 lg:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-white shadow-lg text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white pt-5 pb-4 overflow-y-auto border-r border-gray-200">
          <div className="flex items-center flex-shrink-0 px-4">
            <Link href="/joyspanel" className="text-xl font-semibold text-primary-600">
              Joy&apos;s Panel
            </Link>
          </div>
          <nav className="mt-8 flex-1 flex flex-col space-y-1 px-2">
            {menuItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
            <button
              onClick={() => signOut()}
              className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
            >
              <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              Déconnexion
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile menu */}
      <motion.div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white transform lg:hidden transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        initial={false}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-5 border-b border-gray-200">
            <Link href="/joyspanel" className="text-xl font-semibold text-primary-600" onClick={() => setIsMobileMenuOpen(false)}>
              Joy&apos;s Panel
            </Link>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`group flex items-center px-3 py-3 text-base font-medium rounded-md transition-colors duration-150 ease-in-out ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-4 h-6 w-6 flex-shrink-0 ${
                      isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
            <button
              onClick={() => signOut()}
              className="w-full group flex items-center px-3 py-3 text-base font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
            >
              <ArrowLeftOnRectangleIcon className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
              Déconnexion
            </button>
          </nav>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
} 