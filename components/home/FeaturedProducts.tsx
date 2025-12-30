/** ÖNE ÇIKAN ÜRÜNLER */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Product } from '@/types'

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:5001/api/products?limit=6')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          // API data.products veya data array şeklinde dönebilir
          const productsArray = Array.isArray(data.data) 
            ? data.data 
            : data.data.products || []
          setProducts(productsArray)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Ürünler yüklenemedi:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="container-padding mx-auto">
          <h2 className="text-3xl font-bold mb-8">🔥 Öne Çıkan Ürünler</h2>
          <div className="text-gray-500 text-center py-12">Yükleniyor...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-white">
      <div className="container-padding mx-auto">
        <h2 className="text-3xl font-bold mb-8">🔥 Öne Çıkan Ürünler</h2>
        
        {products.length === 0 ? (
          <div className="text-gray-500 text-center py-12">Henüz ürün bulunmuyor</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {products.map((product) => {
              const minPrice = Math.min(...product.prices.map(p => p.price))
              const maxPrice = Math.max(...product.prices.map(p => p.price))
              
              return (
                <Link 
                  key={product._id} 
                  href={`/products/${product._id}`}
                  className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-square bg-gray-100 flex items-center justify-center p-2">
                    {product.images?.[0] ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-gray-400 text-3xl">📦</div>
                    )}
                  </div>
                  
                  <div className="p-2">
                    <div className="text-xs text-gray-500 mb-1 truncate">{product.brand}</div>
                    <h3 className="font-semibold text-xs mb-1 line-clamp-2">{product.name}</h3>
                    
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-yellow-500 text-xs">⭐</span>
                      <span className="text-xs">{product.rating?.toFixed(1) || 'N/A'}</span>
                      <span className="text-xs text-gray-400">
                        ({product.reviewCount || 0})
                      </span>
                    </div>
                    
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-bold text-blue-600">
                        {minPrice.toLocaleString('tr-TR')} ₺
                      </span>
                      {minPrice !== maxPrice && (
                        <span className="text-xs text-gray-400">
                          - {maxPrice.toLocaleString('tr-TR')} ₺
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-1 text-xs text-gray-500">
                      {product.prices.length} site
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
