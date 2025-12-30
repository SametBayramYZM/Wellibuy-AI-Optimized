'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface ComparisonData {
  products: any[];
  [key: string]: any;
}

export default function ComparePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productIds = searchParams.get('products')?.split(',') || [];

  const [products, setProducts] = useState<any[]>([]);
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (productIds.length < 2) {
      alert('Lütfen karşılaştırmak için en az 2 ürün seçin');
      router.push('/');
      return;
    }

    fetchComparison();
  }, [productIds, router]);

  const fetchComparison = async (): Promise<void> => {
    try {
      const response = await fetch('http://localhost:5001/api/products/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productIds: productIds.filter((id: string) => id.trim())
        })
      });

      if (response.ok) {
        const data = await response.json();
        setComparison(data.data);
      } else {
        alert('Ürünler karşılaştırılamadı');
      }
    } catch (error) {
      console.error('Hata:', error);
      alert('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 py-12 px-4">
          <div className="text-center">
            <p className="text-xl text-gray-600">Yükleniyor...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!comparison) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 py-12 px-4">
          <div className="text-center">
            <p className="text-xl text-gray-600">Ürünler yüklenemedi</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Ürün Karşılaştırması</h1>

          {/* Product Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {comparison.products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-lg p-4 border-2 border-blue-600"
              >
                {product.images && product.images[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-600 mb-2">{product.brand}</p>

                {product.prices && product.prices[0] && (
                  <p className="text-lg font-bold text-blue-600 mb-2">
                    ₺{product.prices[0].price}
                  </p>
                )}

                <div className="flex items-center mb-2">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-sm text-gray-600 ml-1">
                    {product.rating}/5 ({product.reviewCount} yorum)
                  </span>
                </div>

                <a
                  href={`/products/${product._id}`}
                  className="text-blue-600 text-xs font-semibold hover:underline"
                >
                  Detaylar →
                </a>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Özellik
                    </th>
                    {comparison.products.map((product) => (
                      <th
                        key={product._id}
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-900 bg-blue-50"
                      >
                        {product.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Basic Info */}
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      Marka
                    </td>
                    {comparison.products.map((product) => (
                      <td
                        key={product._id}
                        className="px-6 py-4 text-sm text-gray-600"
                      >
                        {product.brand}
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      Fiyat
                    </td>
                    {comparison.products.map((product) => (
                      <td
                        key={product._id}
                        className="px-6 py-4 text-sm font-semibold text-blue-600"
                      >
                        ₺{product.prices?.[0]?.price || 'N/A'}
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      Puan
                    </td>
                    {comparison.products.map((product) => (
                      <td
                        key={product._id}
                        className="px-6 py-4 text-sm"
                      >
                        <div className="flex items-center">
                          <span className="text-yellow-400">⭐</span>
                          <span className="ml-2 font-semibold">
                            {product.rating}/5
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Specifications */}
                  {comparison.specifications.map((spec, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? 'bg-gray-50' : ''}
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {spec.name}
                      </td>
                      {spec.values.map((value, i) => (
                        <td
                          key={i}
                          className={`px-6 py-4 text-sm text-gray-600 ${
                            idx % 2 === 0 ? 'bg-gray-50' : ''
                          }`}
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            ← Geri Dön
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
