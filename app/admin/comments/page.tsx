'use client';

import { useEffect, useState } from 'react';

interface Comment {
  _id: string;
  userName: string;
  title: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ApiResponse {
  data?: Comment[];
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchAllComments();
  }, []);

  const fetchAllComments = async (): Promise<void> => {
    try {
      const response = await fetch('http://localhost:5001/api/comments');
      if (response.ok) {
        const data: ApiResponse = await response.json();
        setComments(data.data || []);
      }
    } catch (error) {
      console.error('Hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string): Promise<void> => {
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
        await fetchAllComments();
      } else {
        alert('Hata: ' + response.statusText);
      }
    } catch (error) {
      alert('Hata: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
    }
  };

  if (loading) {
    return <div className="text-center py-8">Yükleniyor...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Yorum Yönetimi</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {comments.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            Henüz yorum yok
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Yazar
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Başlık
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Puan
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Yorum
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment) => (
                <tr key={comment._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {comment.userName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {comment.title}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      ⭐ {comment.rating}/5
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    {comment.comment}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(comment.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-red-600 hover:text-red-900 font-semibold"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
