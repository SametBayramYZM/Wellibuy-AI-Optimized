/**
 * ÜRÜN DETAY SAYFASI (Dinamik Route)
 * 
 * Tek bir ürünün tüm detaylarını gösterir
 * - Tüm özellikler
 * - Fiyat karşılaştırması
 * - İçindekiler analizi (gıda için)
 * - AI önerileri
 */

'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductComments from '@/components/ProductComments'
import { getProduct } from '@/lib/api'
import type { Product } from '@/types'
import { Star, ExternalLink, TrendingUp, Package, Shield } from 'lucide-react'

export default function ProductPage() {
  const params = useParams()
  const id = params.id as string
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    loadProduct()
  }, [id])

  async function loadProduct(): Promise<void> {
    setLoading(true)
    try {
      const response = await getProduct(id)
      if (response.success && response.data) {
        setProduct(response.data)
      }
    } catch (error) {
      console.error('Ürün yükleme hatası:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center min-h-screen">
          <div className="spinner" />
        </main>
        <Footer />
      </>
    )
  }

  if (!product) {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Ürün Bulunamadı</h1>
            <a href="/" className="text-primary-600">Ana sayfaya dön</a>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const minPrice = Math.min(...product.prices.map(p => p.price))
  const maxPrice = Math.max(...product.prices.map(p => p.price))

  return (
    <>
      <Header />
      
      <main className="flex-1 bg-gray-50">
        <div className="container-padding mx-auto py-8">
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Sol - Görseller */}
            <div>
              <div className="bg-white rounded-2xl p-8 shadow-lg mb-4">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-96 object-contain"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`flex-1 rounded-lg overflow-hidden border-2 ${
                        i === selectedImage ? 'border-primary-500' : 'border-gray-200'
                      }`}
                    >
                      <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-20 object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sağ - Bilgiler */}
            <div>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                
                {/* Puan */}
                <div className="flex items-center mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 font-semibold">{product.rating}</span>
                  <span className="ml-1 text-gray-500">({product.reviewCount} değerlendirme)</span>
                </div>

                {/* Açıklama */}
                <p className="text-gray-600 mb-6">{product.description}</p>

                {/* Fiyat */}
                <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-6 mb-6">
                  <p className="text-sm text-gray-600 mb-1">En Düşük Fiyat</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold text-primary-600">
                      {minPrice.toFixed(2)} ₺
                    </p>
                    {minPrice !== maxPrice && (
                      <p className="text-gray-500 line-through">{maxPrice.toFixed(2)} ₺</p>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {product.prices.length} farklı satıcıda mevcut
                  </p>
                </div>

                {/* Kategori ve Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="badge badge-info">{product.category}</span>
                  {product.subcategory && (
                    <span className="badge bg-gray-100 text-gray-800">{product.subcategory}</span>
                  )}
                  {product.prices.some(p => p.inStock) && (
                    <span className="badge badge-success">Stokta Var</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Fiyat Karşılaştırması */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-primary-500" />
              Fiyat Karşılaştırması
            </h2>
            <div className="space-y-4">
              {product.prices.sort((a, b) => a.price - b.price).map((price, i) => (
                <div key={i} className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl hover:border-primary-200 transition-all">
                  <div className="flex items-center gap-4">
                    {i === 0 && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">
                        EN UCUZ
                      </span>
                    )}
                    <div>
                      <p className="font-semibold">{price.siteName}</p>
                      <p className="text-sm text-gray-500">
                        {price.inStock ? '✅ Stokta var' : '❌ Stokta yok'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-2xl font-bold text-primary-600">{price.price.toFixed(2)} ₺</p>
                    <a
                      href={price.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
                    >
                      <span>Git</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Özellikler */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Package className="w-6 h-6 mr-2 text-primary-500" />
              Teknik Özellikler
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {product.specifications.map((spec, i) => (
                <div key={i} className="flex justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{spec.name}</span>
                  <span className="font-semibold">
                    {(() => {
                      // Eğer değer zaten birimi içeriyorsa tekrar eklemiyoruz
                      if (spec.unit) {
                        const lowerValue = String(spec.value).toLowerCase()
                        const lowerUnit = spec.unit.toLowerCase()
                        if (lowerValue.includes(lowerUnit)) return spec.value
                        return `${spec.value} ${spec.unit}`
                      }
                      return spec.value
                    })()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* İçindekiler (Gıda ürünleri için) */}
          {product.ingredients && product.ingredients.length > 0 && (
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-primary-500" />
                İçindekiler Analizi
              </h2>
              <div className="space-y-4">
                {product.ingredients.map((ing, i) => (
                  <div key={i} className={`p-4 rounded-xl border-2 ${
                    ing.status === 'yararlı' ? 'border-green-200 bg-green-50' :
                    ing.status === 'zararlı' ? 'border-red-200 bg-red-50' :
                    'border-yellow-200 bg-yellow-50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold mb-1">
                          {ing.status === 'yararlı' && '✅'}
                          {ing.status === 'zararlı' && '❌'}
                          {ing.status === 'şüpheli' && '⚠️'}
                          {' '}{ing.name}
                        </p>
                        <p className="text-sm text-gray-700">{ing.description}</p>
                      </div>
                      <div className="ml-4 text-right">
                        <p className="text-xs text-gray-500 mb-1">Sağlık Skoru</p>
                        <p className="text-2xl font-bold">{ing.healthScore}/10</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ProductComments productId={id} />
        </div>
      </main>

      <Footer />
    </>
  )
}
