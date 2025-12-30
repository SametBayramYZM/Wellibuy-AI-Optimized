/**
 * FOOTER BİLEŞENİ
 * 
 * Alt bilgi:
 * - Hakkımızda
 * - Bağlantılar
 * - Sosyal medya
 * - İletişim
 */

import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { name: 'Hakkımızda', href: '/about' },
      { name: 'Kariyer', href: '/careers' },
      { name: 'Basın', href: '/press' },
      { name: 'Blog', href: '/blog' },
    ],
    support: [
      { name: 'Yardım Merkezi', href: '/help' },
      { name: 'İletişim', href: '/contact' },
      { name: 'Sipariş Takibi', href: '/track-order' },
      { name: 'SSS', href: '/faq' },
    ],
    legal: [
      { name: 'Gizlilik Politikası', href: '/privacy' },
      { name: 'Kullanım Koşulları', href: '/terms' },
      { name: 'Çerez Politikası', href: '/cookies' },
      { name: 'KVKK', href: '/kvkk' },
    ],
    categories: [
      { name: 'Elektronik', href: '/categories/elektronik' },
      { name: 'Bilgisayar', href: '/categories/bilgisayar' },
      { name: 'Gıda', href: '/categories/gida' },
      { name: 'İçecek', href: '/categories/icecek' },
    ],
  }

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Ana footer içeriği */}
      <div className="container-padding mx-auto py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
          {/* Logo ve açıklama */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <span className="text-2xl font-bold text-white">
                Wellibuy
              </span>
            </Link>
            
            <p className="text-gray-400 mb-6 max-w-md">
              Yapay zeka destekli akıllı alışveriş platformu. 
              En iyi fiyatları bulun, sağlıklı seçimler yapın, 
              bilinçli tüketici olun.
            </p>

            {/* İletişim bilgileri */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-400" />
                <a href="mailto:info@wellibuy.com" className="hover:text-white transition-colors">
                  info@wellibuy.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-400" />
                <a href="tel:+908501234567" className="hover:text-white transition-colors">
                  0850 123 45 67
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                <span>İstanbul, Türkiye</span>
              </div>
            </div>
          </div>

          {/* Şirket */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Şirket
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destek */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Destek
            </h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Yasal */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Yasal
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Alt bar */}
      <div className="border-t border-gray-800">
        <div className="container-padding mx-auto py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Telif hakkı */}
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Wellibuy. Tüm hakları saklıdır.
            </p>

            {/* Sosyal medya */}
            <div className="flex items-center space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
