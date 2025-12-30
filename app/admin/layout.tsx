'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      router.push('/');
      return;
    }

    setUser(parsedUser);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-2">Wellibuy AI</p>
        </div>

        <nav className="mt-8">
          <Link
            href="/admin"
            className="block px-6 py-3 hover:bg-gray-800 border-l-4 border-transparent hover:border-blue-600 transition"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="block px-6 py-3 hover:bg-gray-800 border-l-4 border-transparent hover:border-blue-600 transition"
          >
            Ürünler
          </Link>
          <Link
            href="/admin/users"
            className="block px-6 py-3 hover:bg-gray-800 border-l-4 border-transparent hover:border-blue-600 transition"
          >
            Kullanıcılar
          </Link>
          <Link
            href="/admin/comments"
            className="block px-6 py-3 hover:bg-gray-800 border-l-4 border-transparent hover:border-blue-600 transition"
          >
            Yorumlar
          </Link>
        </nav>

        <div className="absolute bottom-0 w-64 p-6 border-t border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-white">{user.firstName} {user.lastName}</p>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
          >
            Çıkış Yap
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="px-8 py-4">
            <h2 className="text-2xl font-bold text-gray-900">Wellibuy Yönetim Paneli</h2>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
