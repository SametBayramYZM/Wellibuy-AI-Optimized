/**
 * KATEGORİ SAYFASI (Dinamik Route)
 * 
 * Belirli bir kategorideki ürünleri listeler
 */

'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getCategoryProducts } from '@/lib/api'
import type { Product } from '@/types'
import Link from 'next/link'

export default function CategoryPage() {
  const params = useParams()
  const categoryName = params.name as string
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  // Kategori ismini capitalize et (ilk harf büyük)
  const formattedCategory = categoryName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  useEffect(() => {
    loadProducts()
  }, [categoryName, page])

  async function loadProducts(): Promise<void> {
    setLoading(true)
    try {
      const response = await getCategoryProducts(formattedCategory, page)
      if (response.success && response.data) {
        setProducts(response.data.products || [])
      }
    } catch (error) {
      console.error('Kategori yükleme hatası:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      
      <main className="flex-1 bg-gray-50">
        <div className="container-padding mx-auto py-8">
          <h1 className="text-3xl font-bold mb-8 capitalize">{formattedCategory}</h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">Yükleniyor...</div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {products.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product._id}`}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-2">
                    <h3 className="font-semibold text-xs mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-sm font-bold text-primary-600">
                      {Math.min(...product.prices.map(p => p.price)).toFixed(2)} ₺
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Bu kategoride ürün bulunamadı</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
