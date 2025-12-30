/**
 * ANA SAYFA
 * 
 * Wellibuy'ın ana sayfası
 * - Hero bölümü
 * - Öne çıkan kategoriler
 * - AI önerileri
 * - Popüler ürünler
 */

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/home/Hero'
import Categories from '@/components/home/Categories'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import AIRecommendations from '@/components/home/AIRecommendations'
import Features from '@/components/home/Features'

export default function Home() {
  return (
    <>
      <Header />
      
      <main className="flex-1">
        {/* Hero bölümü - Büyük başlık ve arama */}
        <Hero />

        {/* Özellikler - Neden Wellibuy? */}
        <Features />

        {/* Kategoriler */}
        <Categories />

        {/* AI Önerileri */}
        <AIRecommendations />

        {/* Öne çıkan ürünler */}
        <FeaturedProducts />
      </main>

      <Footer />
    </>
  )
}
