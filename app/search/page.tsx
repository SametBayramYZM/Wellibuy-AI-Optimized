/**
 * ARAMA SONUÇLARI SAYFASI
 * 
 * Kullanıcının arama yaptığı sonuçları gösterir
 * - Filtreleme
 * - Sıralama
 * - AI önerileri
 */

'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { searchProducts, smartSearch } from '@/lib/api'
import type { Product, SearchResults as SearchResultsType } from '@/types'
import { Filter, Sparkles, ChevronDown, Grid, List, Send, X, Loader2 } from 'lucide-react'

// Force dynamic rendering for useSearchParams
export const dynamic = 'force-dynamic';

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

function SearchPageContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const isAI = searchParams.get('ai') === 'true'

  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<SearchResultsType | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [showAIChat, setShowAIChat] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `"${query}" konusunda size yardımcı olabilirim. Başka hangi ürünü arıyorsunuz veya ne hakkında bilgi istiyorsunuz?`,
      timestamp: new Date()
    }
  ])
  const [chatInput, setChatInput] = useState('')
  const [isChatLoading, setIsChatLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  useEffect(() => {
    loadResults()
  }, [query, isAI])

  async function loadResults(): Promise<void> {
    setLoading(true)
    try {
      let criteria: any = { query }

      // AI arama ise önce query'yi parse et
      if (isAI) {
        const aiResult = await smartSearch(query)
        if (aiResult.success && aiResult.data) {
          criteria = { ...criteria, ...aiResult.data }
        }
      }

      const response = await searchProducts(criteria)
      if (response.success && response.data) {
        setResults(response.data)
      }
    } catch (error) {
      console.error('Arama hatası:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim() || isChatLoading) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: chatInput.trim(),
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, userMessage])
    setChatInput('')
    setIsChatLoading(true)

    try {
      const response = await fetch('http://localhost:5001/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: chatInput.trim(),
          context: chatMessages.slice(-5).map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      })

      if (!response.ok) {
        throw new Error('API isteği başarısız oldu')
      }

      const data = await response.json()
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response || 'Üzgünüm, bir yanıt oluşturamadım.',
        timestamp: new Date()
      }

      setChatMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat hatası:', error)
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, errorMessage])
    } finally {
      setIsChatLoading(false)
    }
  }

  return (
    <>
      <Header />
      
      <main className="flex-1 bg-gray-50">
        <div className="container-padding mx-auto py-8">
          {/* Başlık */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold">
                {isAI && <Sparkles className="inline w-8 h-8 text-primary-500 mr-2" />}
                Arama Sonuçları
              </h1>
              
              {/* Görünüm seçici */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowAIChat(!showAIChat)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>AI Asistan</span>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'bg-white'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'bg-white'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            <p className="text-gray-600">
              &quot;{query}&quot; için {results?.total || 0} sonuç bulundu
              {isAI && <span className="ml-2 text-primary-600 font-medium">(AI Analizi Aktif)</span>}
            </p>
          </div>

          {/* Filtreler ve Sonuçlar */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filtreler (Sol) */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl p-6 shadow-md sticky top-24">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center justify-between w-full lg:hidden mb-4"
                >
                  <span className="font-semibold">Filtreler</span>
                  <ChevronDown className="w-5 h-5" />
                </button>

                <div className={`${showFilters ? 'block' : 'hidden lg:block'}`}>
                  <h3 className="font-semibold text-lg mb-4">Filtrele</h3>
                  
                  {/* Kategoriler */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-2">Kategori</h4>
                    <div className="space-y-2">
                      {['Elektronik', 'Bilgisayar', 'Gıda', 'İçecek', 'Hobi'].map(cat => (
                        <label key={cat} className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-sm">{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Fiyat Aralığı */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-2">Fiyat</h4>
                    <div className="space-y-2">
                      <input
                        type="number"
                        placeholder="Min"
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Puan */}
                  <div>
                    <h4 className="font-medium mb-2">Minimum Puan</h4>
                    <select className="w-full px-3 py-2 border rounded-lg">
                      <option value="">Tümü</option>
                      <option value="4">4+ Yıldız</option>
                      <option value="3">3+ Yıldız</option>
                    </select>
                  </div>
                </div>
              </div>
            </aside>

            {/* Sonuçlar (Sağ) */}
            <div className="flex-1">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="spinner" />
                </div>
              ) : results && results.products.length > 0 ? (
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3'
                  : 'space-y-4'
                }>
                  {results.products.map((product) => (
                    <ProductCard key={product._id} product={product} viewMode={viewMode} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">Sonuç bulunamadı</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* AI Asistan Modal */}
      {showAIChat && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-end md:justify-center p-4">
          <div className="bg-white rounded-t-2xl md:rounded-2xl w-full md:w-2xl max-w-2xl h-[80vh] md:h-[600px] flex flex-col shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <Sparkles className="w-6 h-6" />
                <div>
                  <h3 className="font-bold">AI Asistan</h3>
                  <p className="text-xs opacity-90">Arama yardımcınız</p>
                </div>
              </div>
              <button
                onClick={() => setShowAIChat(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-4 py-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleChatSubmit} className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Mesaj yazın..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={isChatLoading}
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isChatLoading}
                  className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-5 h-5" />
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

function ProductCard({ product, viewMode }: { product: Product, viewMode: 'grid' | 'list' }) {
  const minPrice = Math.min(...product.prices.map(p => p.price))

  if (viewMode === 'list') {
    return (
      <Link href={`/products/${product._id}`}>
        <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all flex gap-4 cursor-pointer">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-32 h-32 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2 hover:text-primary-600">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary-600">{minPrice.toFixed(2)} ₺</p>
                <p className="text-sm text-gray-500">{product.prices.length} satıcı</p>
              </div>
              <div className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                İncele
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/products/${product._id}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-48 object-cover hover:scale-105 transition-transform"
        />
        <div className="p-4">
          <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
          <h3 className="font-semibold mb-2 line-clamp-2 hover:text-primary-600">{product.name}</h3>
          <div className="flex items-center mb-2">
            <span className="text-yellow-400">★</span>
            <span className="ml-1 text-sm">{product.rating}</span>
            <span className="ml-1 text-xs text-gray-500">({product.reviewCount})</span>
          </div>
          <p className="text-2xl font-bold text-primary-600 mb-3">{minPrice.toFixed(2)} ₺</p>
          <div className="w-full py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-center">
            Detayları Gör
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <>
        <Header />
        <main className="flex-1 bg-gradient-to-br from-primary-50 to-blue-50">
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Yükleniyor...</p>
          </div>
        </main>
        <Footer />
      </>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
