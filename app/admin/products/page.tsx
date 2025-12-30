'use client';

import { useEffect, useState } from 'react';
import { useState as UseStateHook } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Elektronik',
    brand: '',
    images: [],
    prices: [{ siteName: 'Store', price: 0, url: '', inStock: true }],
    specifications: []
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/products?limit=100');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.data.products || []);
      }
    } catch (error) {
      console.error('Hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const url = editingId
        ? `http://localhost:5001/api/products/${editingId}`
        : 'http://localhost:5001/api/products';

      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert(editingId ? 'Ürün güncellendi' : 'Ürün eklendi');
        setShowModal(false);
        setEditingId(null);
        setFormData({
          name: '',
          description: '',
          category: 'Elektronik',
          brand: '',
          images: [],
          prices: [{ siteName: 'Store', price: 0, url: '', inStock: true }],
          specifications: []
        });
        fetchProducts();
      } else {
        alert('Hata: ' + response.statusText);
      }
    } catch (error) {
      alert('Hata: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Silmek istediğinizden emin misiniz?')) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5001/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Ürün silindi');
        fetchProducts();
      }
    } catch (error) {
      alert('Hata: ' + error.message);
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditingId(product._id);
    setShowModal(true);
  };

  if (loading) {
    return <div className="text-center py-8">Yükleniyor...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Ürün Yönetimi</h1>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              name: '',
              description: '',
              category: 'Elektronik',
              brand: '',
              images: [],
              prices: [{ siteName: 'Store', price: 0, url: '', inStock: true }],
              specifications: []
            });
            setShowModal(true);
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          + Yeni Ürün
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Adı</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Marka</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Kategori</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Fiyat</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Puan</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{product.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.brand}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {product.prices?.[0]?.price ? `₺${product.prices[0].price}` : 'N/A'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    ⭐ {product.rating || 0}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-2xl font-bold">
                {editingId ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Ürün Adı</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Marka</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option>Elektronik</option>
                  <option>Bilgisayar</option>
                  <option>Gıda</option>
                  <option>İçecek</option>
                  <option>Hobi</option>
                  <option>Diğer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Açıklama</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 h-24"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Fiyat</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.prices?.[0]?.price || 0}
                  onChange={(e) => {
                    const newPrices = [...(formData.prices || [])];
                    newPrices[0] = { ...newPrices[0], price: parseFloat(e.target.value) };
                    setFormData({ ...formData, prices: newPrices });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex gap-4 pt-6 border-t">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  {editingId ? 'Güncelle' : 'Ekle'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition font-semibold"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
