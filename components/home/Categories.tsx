/**
 * KATEGORİLER BİLEŞENİ - Ana sayfada görünen kategoriler
 */

'use client'

import Link from 'next/link'
import { Laptop, Apple, ShoppingBag, Coffee, Palette, Cpu } from 'lucide-react'

export default function Categories() {
  const categories = [
    { name: 'Elektronik', icon: Laptop, href: '/categories/elektronik', color: 'bg-blue-500' },
    { name: 'Bilgisayar', icon: Cpu, href: '/categories/bilgisayar', color: 'bg-purple-500' },
    { name: 'Gıda', icon: Apple, href: '/categories/gida', color: 'bg-green-500' },
    { name: 'İçecek', icon: Coffee, href: '/categories/icecek', color: 'bg-orange-500' },
    { name: 'Hobi', icon: Palette, href: '/categories/hobi', color: 'bg-pink-500' },
    { name: 'Diğer', icon: ShoppingBag, href: '/categories/diger', color: 'bg-gray-500' },
  ]

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container-padding mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Kategoriler
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group bg-gray-50 rounded-xl p-6 hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className={`w-16 h-16 ${category.color} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <category.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-center font-semibold text-gray-900">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
