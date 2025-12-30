'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    setSuccess('')

    // Validasyon
    if (!formData.firstName.trim()) {
      setError('Ad zorunludur')
      return
    }
    if (!formData.lastName.trim()) {
      setError('Soyad zorunludur')
      return
    }
    if (!formData.email.includes('@')) {
      setError('Geçerli bir email girin')
      return
    }
    if (formData.password.length < 8) {
      setError('Şifre en az 8 karakter olmalıdır')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || data.error || 'Kayıt başarısız')
        return
      }

      // Token'ı localStorage'e kaydet
      if (data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      setSuccess('Kayıt başarılı! Yönlendiriliyorsunuz...')
      setTimeout(() => {
        // Eğer admin ise admin paneline, yoksa anasayfaya git
        if (data.user.role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/')
        }
      }, 1500)
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Kayıt Ol</h1>
            <p className="text-gray-600">Wellibuy'a katılın ve akıllı alışveriş yapın</p>
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

            {/* Success Mesajı */}
            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <p className="text-green-800 text-sm">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Ad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ad
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Adınız"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Soyad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Soyad
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Soyadınız"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şifre
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Şifre (min. 8 karakter)"
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

              {/* Şifre Tekrar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şifre (Tekrar)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Şifre (Tekrar)"
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Kayıt Butonu */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
              </button>
            </form>

            {/* Giriş Linki */}
            <p className="text-center text-gray-600">
              Zaten hesabın var mı?{' '}
              <Link href="/auth/login" className="text-primary-600 font-semibold hover:underline">
                Giriş Yap
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
