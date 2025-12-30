/**
 * PC BUILDER SAYFASI
 * 
 * Kullanıcının bütçe ve ihtiyaçlarına göre bilgisayar konfigürasyonu önerir
 */

'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { buildPC } from '@/lib/api'
import type { PCBuilderRequest, PCBuilderResponse } from '@/types'
import { Cpu, DollarSign, Gamepad2, Briefcase, Palette, Sparkles } from 'lucide-react'

export default function PCBuilderPage() {
  const [budget, setBudget] = useState(30000)
  const [purpose, setPurpose] = useState<'oyun' | 'iş' | 'grafik' | 'genel'>('oyun')
  const [games, setGames] = useState<string[]>([])
  const [includePeripherals, setIncludePeripherals] = useState(true)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PCBuilderResponse | null>(null)

  const popularGames = [
    'Cyberpunk 2077',
    'GTA 6',
    'Call of Duty',
    'Valorant',
    'League of Legends',
    'Counter-Strike 2'
  ]

  async function handleBuild() {
    setLoading(true)
    try {
      const request: PCBuilderRequest = {
        budget,
        purpose,
        games: purpose === 'oyun' ? games : undefined,
        includePeripherals
      }

      const response = await buildPC(request)
      if (response.success && response.data) {
        setResult(response.data)
      }
    } catch (error) {
      console.error('PC Builder hatası:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      
      <main className="flex-1 bg-gradient-to-br from-primary-50 via-white to-blue-50">
        <div className="container-padding mx-auto py-12">
          {/* Başlık */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md mb-4">
              <Sparkles className="w-5 h-5 text-primary-500" />
              <span className="font-semibold text-gray-700">AI PC Builder</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Hayalindeki <span className="text-gradient">Bilgisayarı</span> Kur
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Yapay zeka ile bütçene ve ihtiyaçlarına göre en iyi bilgisayar konfigürasyonunu oluştur
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Sol - Ayarlar */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6">Konfigürasyon Ayarları</h2>

              {/* Bütçe */}
              <div className="mb-6">
                <label className="block font-semibold mb-2">
                  <DollarSign className="inline w-5 h-5 mr-2" />
                  Bütçen Ne Kadar?
                </label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-400 focus:ring-4 focus:ring-primary-100 outline-none"
                  placeholder="30000"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Önerilen minimum: 20.000 ₺
                </p>
              </div>

              {/* Çevresel Ekipman */}
              <div className="mb-6">
                <label className="block font-semibold mb-3">
                  🖥️ Konfigürasyon Kapsamı
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 rounded-xl cursor-pointer hover:border-primary-300 transition-all">
                    <input
                      type="radio"
                      checked={includePeripherals}
                      onChange={() => setIncludePeripherals(true)}
                      className="mr-3 w-5 h-5 text-primary-500"
                    />
                    <div>
                      <div className="font-medium">Tam Kurulum</div>
                      <div className="text-sm text-gray-500">Kasa + Çevresel ekipman (Monitör, Klavye, Mouse, Kulaklık)</div>
                    </div>
                  </label>
                  <label className="flex items-center p-4 border-2 rounded-xl cursor-pointer hover:border-primary-300 transition-all">
                    <input
                      type="radio"
                      checked={!includePeripherals}
                      onChange={() => setIncludePeripherals(false)}
                      className="mr-3 w-5 h-5 text-primary-500"
                    />
                    <div>
                      <div className="font-medium">Sadece Kasa</div>
                      <div className="text-sm text-gray-500">CPU, GPU, RAM, Anakart, PSU, Soğutma vb.</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Kullanım Amacı */}
              <div className="mb-6">
                <label className="block font-semibold mb-3">
                  <Cpu className="inline w-5 h-5 mr-2" />
                  Kullanım Amacı
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'oyun', label: 'Oyun', icon: Gamepad2, color: 'primary' },
                    { value: 'iş', label: 'İş/Ofis', icon: Briefcase, color: 'blue' },
                    { value: 'grafik', label: 'Grafik/Video', icon: Palette, color: 'purple' },
                    { value: 'genel', label: 'Genel Kullanım', icon: Cpu, color: 'gray' }
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => setPurpose(item.value as any)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        purpose === item.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <item.icon className={`w-6 h-6 mx-auto mb-2 ${
                        purpose === item.value ? 'text-primary-600' : 'text-gray-400'
                      }`} />
                      <p className="font-medium text-sm">{item.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Oyunlar (sadece oyun seçiliyse) */}
              {purpose === 'oyun' && (
                <div className="mb-6">
                  <label className="block font-semibold mb-3">
                    Hangi Oyunları Oynayacaksın?
                  </label>
                  <div className="space-y-2">
                    {popularGames.map((game) => (
                      <label key={game} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={games.includes(game)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setGames([...games, game])
                            } else {
                              setGames(games.filter(g => g !== game))
                            }
                          }}
                          className="mr-3 w-5 h-5"
                        />
                        <span>{game}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Oluştur Butonu */}
              <button
                onClick={handleBuild}
                disabled={loading || budget < 10000}
                className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="spinner w-5 h-5 border-2" />
                    <span>Oluşturuluyor...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Konfigürasyon Oluştur</span>
                  </>
                )}
              </button>
            </div>

            {/* Sağ - Sonuçlar */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6">Önerilen Konfigürasyon</h2>

              {result ? (
                <div>
                  {/* Özet */}
                  <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Toplam Fiyat</p>
                        <p className="text-3xl font-bold text-primary-600">
                          {result.totalPrice.toFixed(2)} ₺
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Performans Skoru</p>
                        <p className="text-3xl font-bold text-green-600">
                          {result.performanceScore}/100
                        </p>
                      </div>
                    </div>
                    {result.totalPrice > budget && (
                      <p className="text-sm text-orange-600">
                        ⚠️ Bütçeyi {(result.totalPrice - budget).toFixed(2)} ₺ aşıyor
                      </p>
                    )}
                  </div>

                  {/* Parçalar */}
                  <div className="space-y-4 mb-6">
                    {result.components.map((component, index) => (
                      <div key={index} className="border-2 border-gray-100 rounded-xl p-4 hover:border-primary-200 transition-all">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-xs text-gray-500 font-medium">{component.type}</p>
                            <h3 className="font-semibold">{component.product.name}</h3>
                          </div>
                          <p className="font-bold text-primary-600">
                            {component.product.prices[0]?.price.toFixed(2)} ₺
                          </p>
                        </div>
                        <p className="text-sm text-gray-600">{component.reason}</p>
                      </div>
                    ))}
                  </div>

                  {/* Oyun Performansı */}
                  {result.gamePerformance && result.gamePerformance.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">🎮 Oyun Performansı</h3>
                      <div className="space-y-2">
                        {result.gamePerformance.map((perf, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                            <span className="font-medium">{perf.game}</span>
                            <div className="text-right">
                              <p className="font-bold text-green-600">{perf.expectedFPS} FPS</p>
                              <p className="text-xs text-gray-500">{perf.settings}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <Cpu className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>Ayarları yapın ve konfigürasyonu oluşturun</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
