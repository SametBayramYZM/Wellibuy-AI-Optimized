/**
 * ANA LAYOUT BİLEŞENİ
 * 
 * Tüm sayfaları saran ana düzen
 * Header, Footer ve genel yapıyı içerir
 */

import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Wellibuy - Akıllı Alışveriş Platformu',
  description: 'Yapay zeka destekli akıllı alışveriş deneyimi. Ürünleri karşılaştırın, en iyi fiyatları bulun, sağlıklı seçimler yapın.',
  keywords: 'e-ticaret, online alışveriş, fiyat karşılaştırma, yapay zeka, ürün analizi',
  authors: [{ name: 'Wellibuy' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: '#0ea5e9',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://wellibuy.com',
    siteName: 'Wellibuy',
    title: 'Wellibuy - Akıllı Alışveriş Platformu',
    description: 'Yapay zeka destekli akıllı alışveriş deneyimi',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        {/* Ana içerik */}
        <div className="min-h-screen flex flex-col">
          {children}
        </div>

        {/* Global AI Asistan (Tüm sayfalarda mevcut) */}
        <div id="ai-assistant-portal" />
      </body>
    </html>
  )
}
