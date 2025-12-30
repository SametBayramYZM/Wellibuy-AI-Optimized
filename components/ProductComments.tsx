'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

interface Comment {
  _id: string;
  userName: string;
  title: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface ProductCommentsProps {
  productId: string;
}

export default function ProductComments({ productId }: ProductCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('User data parse error:', error);
      }
    }
    fetchComments();
  }, [productId]);

  const fetchComments = async (): Promise<void> => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/comments/${productId}`
      );
      if (response.ok) {
        const data = await response.json();
        setComments(data.data || []);
      }
    } catch (error) {
      console.error('Hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Yorum yapmak için lütfen giriş yapın');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId,
          ...formData
        })
      });

      if (response.ok) {
        alert('Yorumunuz başarıyla eklendi');
        setFormData({ rating: 5, title: '', comment: '' });
        setShowForm(false);
        await fetchComments();
      } else {
        const data = await response.json();
        alert('Hata: ' + (data.error || response.statusText));
      }
    } catch (error) {
      alert('Hata: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
    }
  };

  const handleDelete = async (commentId: string): Promise<void> => {
    if (!confirm('Yorum silinecek, devam etmek istediğinizden emin misiniz?')) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(
        `http://localhost:5001/api/comments/${commentId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token || ''}`
          }
        }
      );

      if (response.ok) {
        alert('Yorum silindi');
        await fetchComments();
      }
    } catch (error) {
      alert('Hata: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
    }
  };

  if (loading) {
    return <div className="text-center py-8">Yorumlar yükleniyor...</div>;
  }

  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold mb-6">Müşteri Yorumları ({comments.length})</h2>

      {user && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          + Yorum Yaz
        </button>
      )}

      {!user && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-600">
          Yorum yapmak için{' '}
          <a href="/auth/login" className="font-semibold underline">
            giriş yapmanız
          </a>{' '}
          gerekir.
        </div>
      )}

      {/* Comment Form */}
      {showForm && user && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Puan (1-5)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating })}
                    className={`text-3xl transition ${
                      formData.rating >= rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Başlık</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Ürün hakkında kısa başlık"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Yorum</label>
              <textarea
                required
                value={formData.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 h-24"
                placeholder="Ürün hakkındaki düşüncelerinizi yazın..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Gönder
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-600 text-center py-8">Henüz yorum yok</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900">{comment.userName}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < comment.rating ? 'text-yellow-400' : 'text-gray-300'
                      }
                    >
                      ⭐
                    </span>
                  ))}
                </div>
              </div>

              <h4 className="font-semibold text-gray-900 mb-2">{comment.title}</h4>
              <p className="text-gray-700 mb-4">{comment.comment}</p>

              {user && (user._id === comment.userId || user.role === 'admin') && (
                <button
                  onClick={() => handleDelete(comment._id)}
                  className="text-red-600 hover:text-red-900 text-sm font-semibold"
                >
                  Sil
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
