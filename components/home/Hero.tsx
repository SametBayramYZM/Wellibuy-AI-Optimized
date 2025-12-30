/**
 * HERO BÖLÜMÜBİLEŞENİ
 * 
 * Ana sayfanın büyük açılış bölümü:
 * - Başlık ve slogan
 * - Arama çubuğu
 * - Görsel
 */

'use client'

import { Sparkles, TrendingUp, Shield, Zap } from 'lucide-react'
import SearchBar from '@/components/search/SearchBar'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-blue-50 overflow-hidden">
      {/* Dekoratif elementler */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000" />
      </div>

      <div className="container-padding mx-auto py-12 md:py-20 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-semibold text-gray-700">
              Yapay Zeka Destekli Alışveriş
            </span>
          </div>

          {/* Ana başlık */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 animate-slide-up">
            Bilinçli Alışverişin
            <span className="block text-gradient mt-2">
              Akıllı Adresi
            </span>
          </h1>

          {/* Alt başlık */}
          <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-12 max-w-2xl mx-auto animate-fade-in">
            AI ile ürünleri analiz edin, fiyatları karşılaştırın, 
            sağlıklı seçimler yapın. Alışverişte yeni bir çağ başlıyor.
          </p>

          {/* Arama çubuğu */}
          <div className="mb-8 md:mb-12 animate-slide-up">
            <SearchBar autoFocus={false} />
          </div>

          {/* Özellikler */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8 animate-fade-in">
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Fiyat Karşılaştırma
              </h3>
              <p className="text-sm text-gray-600">
                Tüm siteleri tarayıp en uygun fiyatı buluyoruz
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 md:p-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Sağlık Analizi
              </h3>
              <p className="text-sm text-gray-600">
                Gıda ürünlerinin içeriğini AI ile değerlendiriyoruz
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 md:p-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Akıllı Öneri
              </h3>
              <p className="text-sm text-gray-600">
                Size özel AI önerileri ile doğru ürünü bulun
              </p>
            </div>
          </div>

          {/* CTA Butonlar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
            <Link
              href="/categories/bilgisayar"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:shadow-2xl transition-all hover:-translate-y-1 flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Ürünleri Keşfet</span>
            </Link>

            <Link
              href="/pc-builder"
              className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-gray-200"
            >
              PC Topla
            </Link>
          </div>

          {/* İstatistikler */}
          <div className="mt-12 pt-8 border-t border-gray-200 grid grid-cols-3 gap-4 animate-fade-in">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600">
                10K+
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Ürün
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600">
                50+
              </div>
              <div className="text-sm text-gray-600 mt-1">
                E-Ticaret Sitesi
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600">
                24/7
              </div>
              <div className="text-sm text-gray-600 mt-1">
                AI Destek
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
