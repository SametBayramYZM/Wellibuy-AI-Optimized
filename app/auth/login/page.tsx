'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.email.includes('@')) {
      setError('Geçerli bir email girin')
      return
    }
    if (!formData.password) {
      setError('Şifre boş olamaz')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      let data: any = null

      try {
        data = await response.json()
      } catch (parseError) {
        console.error('Login response parse error:', parseError)
      }

      if (!response.ok) {
        setError(data?.message || data?.error || 'Giriş başarısız')
        return
      }

      // Token'ı localStorage'e kaydet
      if (data?.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      // Admin ise admin paneline, yoksa anasayfaya git
      if (data?.user?.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/')
      }
    } catch (err) {
      console.error('Login request failed:', err)
      setError('Sunucuya bağlanılamadı. Lütfen API çalışıyor mu kontrol edin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          {/* Başlık */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Giriş Yap</h1>
            <p className="text-gray-600">Wellibuy hesabınıza giriş yapın</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            {/* Error Mesajı */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Şifre */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Şifre
                  </label>
                  <Link href="/auth/forgot-password" className="text-xs text-primary-600 hover:underline">
                    Şifremi Unuttum
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Şifrenizi girin"
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Beni Hatırla */}
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Beni hatırla</span>
              </label>

              {/* Giriş Butonu */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </button>
            </form>

            {/* Kayıt Linki */}
            <p className="text-center text-gray-600">
              Hesabın yok mu?{' '}
              <Link href="/auth/register" className="text-primary-600 font-semibold hover:underline">
                Kaydol
              </Link>
            </p>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">veya</span>
              </div>
            </div>

            {/* OAuth Butonları */}
            <div className="space-y-3">
              <button
                type="button"
                className="w-full flex items-center justify-center space-x-2 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <text>G</text>
                </svg>
                <span>Google ile giriş yap</span>
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center space-x-2 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <text>Gh</text>
                </svg>
                <span>GitHub ile giriş yap</span>
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
