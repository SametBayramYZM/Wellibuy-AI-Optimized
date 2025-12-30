/**
 * ÖZELLİKLER BİLEŞENİ
 */

'use client'

import { Sparkles, Camera, TrendingUp, Shield, Cpu, Search } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: Sparkles,
      title: 'AI Asistan',
      description: 'Yapay zeka ile 7/24 alışveriş danışmanlığı'
    },
    {
      icon: Camera,
      title: 'Kamera Tarama',
      description: 'Ürünü gösterin, içindekileri öğrenin'
    },
    {
      icon: TrendingUp,
      title: 'Fiyat Takibi',
      description: 'En iyi fiyatı otomatik bulun'
    },
    {
      icon: Shield,
      title: 'Sağlık Analizi',
      description: 'Gıda içeriklerini AI ile değerlendirin'
    },
    {
      icon: Cpu,
      title: 'PC Builder',
      description: 'Bütçenize göre bilgisayar toplayın'
    },
    {
      icon: Search,
      title: 'Akıllı Filtreleme',
      description: 'Özelliklere göre hızlı arama'
    }
  ]

  return (
    <section className="py-12 bg-gray-50">
      <div className="container-padding mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all">
              <feature.icon className="w-10 h-10 text-primary-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
