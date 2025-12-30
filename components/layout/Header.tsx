'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Menu, X, Sparkles, ShoppingCart, User, LogOut } from 'lucide-react'
import SearchBar from '@/components/search/SearchBar'

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function Header() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const [searchOpen, setSearchOpen] = useState<boolean>(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    setIsLoggedIn(!!token)
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error('User data parse error:', error)
      }
    }
  }, [])

  const handleLogout = (): void => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    setUserMenuOpen(false)
    router.push('/')
  }

  const categories = [
    { name: 'Elektronik', href: '/categories/elektronik' },
    { name: 'Bilgisayar', href: '/categories/bilgisayar' },
    { name: 'Gıda', href: '/categories/gida' },
    { name: 'İçecek', href: '/categories/icecek' },
    { name: 'Hobi', href: '/categories/hobi' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <span className="text-2xl font-bold hidden sm:block bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
                Wellibuy
              </span>
            </Link>

            <div className="hidden md:block flex-1 max-w-2xl mx-8">
              <SearchBar />
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Search className="w-6 h-6 text-gray-600" />
              </button>

              <Link
                href="/ai-assistant"
                className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:shadow-lg"
              >
                <Sparkles className="w-5 h-5" />
                <span className="font-medium text-sm">AI</span>
              </Link>

              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>

              {isLoggedIn ? (
                <div className="hidden sm:block relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <User className="w-6 h-6 text-gray-600" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                      <Link
                        href="/profile"
                        className="block px-4 py-3 hover:bg-gray-50 flex items-center space-x-2"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Profil</span>
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          href="/admin"
                          className="block px-4 py-3 hover:bg-gray-50 flex items-center space-x-2 text-purple-600 border-b"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <span>⚙️</span>
                          <span>Admin Panel</span>
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center space-x-2 text-red-600"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Çıkış Yap</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center space-x-2">
                  <Link href="/auth/login" className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg text-sm font-medium">
                    Giriş
                  </Link>
                  <Link href="/auth/register" className="px-4 py-2 bg-primary-500 text-white hover:bg-primary-600 rounded-lg text-sm font-medium">
                    Kaydol
                  </Link>
                </div>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-gray-600" /> : <Menu className="w-6 h-6 text-gray-600" />}
              </button>
            </div>
          </div>

          {searchOpen && (
            <div className="md:hidden pb-4">
              <SearchBar onSearch={() => setSearchOpen(false)} />
            </div>
          )}
        </div>
      </div>

      <div className="hidden md:block border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <nav className="flex items-center space-x-8 h-12">
            {categories.map((category) => (
              <Link key={category.name} href={category.href} className="text-gray-700 hover:text-primary-600 font-medium">
                {category.name}
              </Link>
            ))}
            <Link href="/pc-builder" className="text-primary-600 font-medium flex items-center space-x-1">
              <Sparkles className="w-4 h-4" />
              <span>PC Kur</span>
            </Link>
          </nav>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="block py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}

            <Link href="/pc-builder" className="block py-3 px-4 text-primary-600 hover:bg-primary-50 rounded-lg flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
              <Sparkles className="w-5 h-5" />
              <span>PC Kur</span>
            </Link>

            <Link href="/ai-assistant" className="block py-3 px-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
              <Sparkles className="w-5 h-5" />
              <span>AI Asistan</span>
            </Link>

            {isLoggedIn ? (
              <>
                <Link href="/profile" className="block py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg flex items-center space-x-2 border-t mt-4" onClick={() => setMobileMenuOpen(false)}>
                  <User className="w-5 h-5" />
                  <span>Profil</span>
                </Link>
                <button onClick={handleLogout} className="w-full text-left py-3 px-4 text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-2">
                  <LogOut className="w-5 h-5" />
                  <span>Çıkış Yap</span>
                </button>
              </>
            ) : (
              <div className="border-t mt-4 pt-4 space-y-2">
                <Link href="/auth/login" className="block py-3 px-4 text-primary-600 hover:bg-primary-50 rounded-lg text-center" onClick={() => setMobileMenuOpen(false)}>
                  Giriş Yap
                </Link>
                <Link href="/auth/register" className="block py-3 px-4 bg-primary-500 text-white hover:bg-primary-600 rounded-lg text-center" onClick={() => setMobileMenuOpen(false)}>
                  Kaydol
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
