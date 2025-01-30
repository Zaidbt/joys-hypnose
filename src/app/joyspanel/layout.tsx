'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { 
  ChartBarIcon,
  DocumentTextIcon,
  CalendarIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  EnvelopeIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ClipboardDocumentCheckIcon,
  NewspaperIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/joyspanel', icon: ChartBarIcon },
  { name: 'Blog Posts', href: '/joyspanel/posts', icon: DocumentTextIcon },
  { name: 'Actualités', href: '/joyspanel/news', icon: NewspaperIcon },
  { name: 'Rendez-vous', href: '/joyspanel/appointments', icon: CalendarIcon },
  { name: 'Clients', href: '/joyspanel/clients', icon: UserGroupIcon },
  { name: 'Newsletter', href: '/joyspanel/newsletter', icon: EnvelopeIcon },
  { name: 'Inscriptions événements', href: '/joyspanel/event-registrations', icon: ClipboardDocumentCheckIcon },
  { name: 'Paramètres', href: '/joyspanel/appointments/settings', icon: Cog6ToothIcon },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Don't show the admin layout on the login page
  if (pathname === '/joyspanel/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-sm h-16 flex items-center px-4">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-500 hover:text-gray-600"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
        <div className="ml-4 text-xl font-semibold text-primary-600">
          Joy's Panel
        </div>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out z-40`}>
        <div className="hidden lg:flex h-16 items-center justify-center border-b border-gray-200">
          <Link href="/joyspanel" className="text-xl font-semibold text-primary-600">
            Joy's Panel
          </Link>
        </div>
        <nav className="mt-5 px-2 flex flex-col h-[calc(100vh-4rem)]">
          <div className="space-y-1 flex-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
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
          </div>
          
          {/* Disconnect button at bottom */}
          <div className="pb-4">
            <button
              onClick={() => signOut({ callbackUrl: '/joyspanel/login' })}
              className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50"
            >
              <ArrowLeftOnRectangleIcon
                className="mr-3 flex-shrink-0 h-5 w-5 text-red-400 group-hover:text-red-500"
              />
              Déconnexion
            </button>
          </div>
        </nav>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:pl-64 pt-16 lg:pt-0">
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 