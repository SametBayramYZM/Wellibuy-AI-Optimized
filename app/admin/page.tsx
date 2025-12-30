'use client';

import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Hata:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-gray-600 text-sm">Toplam Kullanıcı</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.users?.total || 0}</p>
            </div>
            <div className="text-4xl text-blue-600">👥</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-gray-600 text-sm">Admin Kullanıcı</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.users?.admin || 0}</p>
            </div>
            <div className="text-4xl text-purple-600">⚙️</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-gray-600 text-sm">Aktif Kullanıcı</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.users?.active || 0}</p>
            </div>
            <div className="text-4xl text-green-600">✅</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-gray-600 text-sm">Toplam Ürün</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.products?.total || 0}</p>
            </div>
            <div className="text-4xl text-orange-600">📦</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Hızlı İşlemler</h2>
        <div className="grid grid-cols-2 gap-4">
          <a
            href="/admin/products"
            className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition text-blue-600 font-semibold"
          >
            Ürün Yönetimi →
          </a>
          <a
            href="/admin/users"
            className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition text-green-600 font-semibold"
          >
            Kullanıcı Yönetimi →
          </a>
        </div>
      </div>
    </div>
  );
}
