'use client';

import { useEffect, useState } from 'react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.data || []);
      }
    } catch (error) {
      console.error('Hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5001/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Kullanıcı silindi');
        fetchUsers();
      } else {
        alert('Hata: ' + response.statusText);
      }
    } catch (error) {
      alert('Hata: ' + error.message);
    }
  };

  const handleToggleActive = async (userId, isActive) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5001/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !isActive })
      });

      if (response.ok) {
        alert(isActive ? 'Kullanıcı deaktif edildi' : 'Kullanıcı aktifleştirildi');
        fetchUsers();
      } else {
        alert('Hata: ' + response.statusText);
      }
    } catch (error) {
      alert('Hata: ' + error.message);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Yükleniyor...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Kullanıcı Yönetimi</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ad Soyad</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Rol</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Durum</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Kayıt Tarihi</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'admin' ? '⚙️ Admin' : '👤 Kullanıcı'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    user.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? '✅ Aktif' : '❌ Pasif'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                </td>
                <td className="px-6 py-4 text-sm space-x-3">
                  <button
                    onClick={() => handleToggleActive(user._id, user.isActive)}
                    className={`${
                      user.isActive
                        ? 'text-orange-600 hover:text-orange-900'
                        : 'text-green-600 hover:text-green-900'
                    }`}
                  >
                    {user.isActive ? 'Deaktif Et' : 'Aktifleştir'}
                  </button>
                  {user.role !== 'admin' && (
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Sil
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
