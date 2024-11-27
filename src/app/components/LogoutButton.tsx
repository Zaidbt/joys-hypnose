'use client';

import { signOut } from 'next-auth/react';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function LogoutButton() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/joyspanel/login' });
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    >
      <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
      Déconnexion
    </button>
  );
} 