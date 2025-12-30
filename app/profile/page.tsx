'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { User, Mail, Phone, MapPin, LogOut, Settings, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react'

interface UserProfile {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  city?: string
  country?: string
  avatar?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const [formData, setFormData] = useState<UserProfile | null>(null)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    loadUserProfile()
  }, [])

  async function loadUserProfile() {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth/login')
        return
      }

      const response = await fetch('http://localhost:5001/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.ok) {
        throw new Error('Profil yüklenemedi')
      }

      const data = await response.json()
      setUser(data.user)
      setFormData(data.user)
    } catch (err) {
      setError('Profil yüklenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => prev ? { ...prev, [name]: value } : null)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5001/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Güncelleme başarısız')
      }

      const data = await response.json()
      setUser(data.user)
      setSuccess('Profil başarıyla güncellendi')
      setEditing(false)
    } catch (err) {
      setError('Profil güncellenirken bir hata oluştu')
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Yeni şifreler eşleşmiyor')
      return
    }

    if (passwordData.newPassword.length < 8) {
      setError('Yeni şifre en az 8 karakter olmalıdır')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5001/api/users/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      if (!response.ok) {
        throw new Error('Şifre değiştirme başarısız')
      }

      setSuccess('Şifre başarıyla değiştirildi')
      setShowPasswordModal(false)
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setError('Şifre değiştirilirken bir hata oluştu')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-2xl mx-auto px-4">
            <div className="animate-pulse space-y-4">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!user) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <p className="text-gray-600">Profil bulunamadı</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Başlık */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Profil Ayarları</h1>
            <p className="text-gray-600">Hesap bilgilerinizi yönetin ve güncelleyin</p>
          </div>

          {/* Error/Success Mesajları */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-green-800">{success}</p>
            </div>
          )}

          {/* Profil Kartı */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            {/* Başlık ve Butonlar */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
                  <p className="text-white/80">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => setEditing(!editing)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span>{editing ? 'İptal' : 'Düzenle'}</span>
              </button>
            </div>

            {/* İçerik */}
            <div className="p-6 space-y-6">
              {editing ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  {/* Ad */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ad</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData?.firstName || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    {/* Soyad */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Soyad</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData?.lastName || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  {/* Telefon */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData?.phone || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  {/* Adres */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Şehir</label>
                      <input
                        type="text"
                        name="city"
                        value={formData?.city || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ülke</label>
                      <input
                        type="text"
                        name="country"
                        value={formData?.country || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  {/* Butonlar */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      Kaydet
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  {/* Email */}
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold text-gray-900">{user.email}</p>
                    </div>
                  </div>

                  {/* Telefon */}
                  {user.phone && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Telefon</p>
                        <p className="font-semibold text-gray-900">{user.phone}</p>
                      </div>
                    </div>
                  )}

                  {/* Adres */}
                  {(user.city || user.country) && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Adres</p>
                        <p className="font-semibold text-gray-900">
                          {user.city && `${user.city}, `}{user.country}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Şifre ve Çıkış */}
              <div className="border-t pt-6 space-y-3">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full py-2 border-2 border-primary-500 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-semibold"
                >
                  Şifre Değiştir
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 flex items-center justify-center space-x-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Çıkış Yap</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Şifre Değiştir Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">Şifre Değiştir</h3>

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              {/* Mevcut Şifre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mevcut Şifre</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Yeni Şifre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Yeni Şifre (Tekrar) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre (Tekrar)</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Butonlar */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  Güncelle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
