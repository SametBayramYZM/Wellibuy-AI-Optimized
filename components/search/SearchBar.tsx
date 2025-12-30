/**
 * ARAMA ÇUBUĞU BİLEŞENİ
 * 
 * - Akıllı arama (AI destekli)
 * - Otomatik tamamlama
 * - Popüler aramalar
 */

'use client'

import { useState, useEffect } from 'react'
import { Search, Sparkles, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SearchBarProps {
  onSearch?: () => void
  autoFocus?: boolean
}

export default function SearchBar({ onSearch, autoFocus = false }: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isAISearch, setIsAISearch] = useState(false)

  // Popüler aramalar
  const popularSearches = [
    'NVIDIA RTX 5090',
    'MacBook Pro M5',
    'Sağlıklı atıştırmalıklar',
    '30.000 TL oyun bilgisayarı',
    'Yüksek proteinli gıdalar'
  ]

  // Arama önerileri (gerçek uygulamada API'den gelecek)
  useEffect(() => {
    if (query.length > 2) {
      // Simüle edilmiş öneriler
      const mockSuggestions = [
        `${query} fiyatları`,
        `${query} özellikleri`,
        `${query} karşılaştırma`,
        `${query} en ucuz`,
      ]
      setSuggestions(mockSuggestions)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [query])

  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return

    // AI arama mı normal arama mı
    const searchPath = isAISearch
      ? `/search?q=${encodeURIComponent(searchQuery)}&ai=true`
      : `/search?q=${encodeURIComponent(searchQuery)}`

    router.push(searchPath)
    setShowSuggestions(false)
    onSearch?.()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="relative">
      {/* Arama kutusu */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => query.length > 2 && setShowSuggestions(true)}
          placeholder="Ürün ara veya AI'ya sor... (örn: 30.000 TL oyun bilgisayarı)"
          autoFocus={autoFocus}
          className="w-full pl-12 pr-32 py-3 md:py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-base"
        />

        {/* Arama ikonu */}
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

        {/* Temizle butonu */}
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setShowSuggestions(false)
            }}
            className="absolute right-28 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}

        {/* AI arama toggle */}
        <button
          onClick={() => setIsAISearch(!isAISearch)}
          className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all ${
            isAISearch
              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title={isAISearch ? 'AI Arama Aktif' : 'AI Arama Kullan'}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-medium hidden sm:inline">AI</span>
        </button>
      </div>

      {/* Öneriler dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
          {/* Arama önerileri */}
          {suggestions.length > 0 && (
            <div className="border-b border-gray-100">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                Öneriler
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(suggestion)
                    handleSearch(suggestion)
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3 group"
                >
                  <Search className="w-4 h-4 text-gray-400 group-hover:text-primary-500" />
                  <span className="text-gray-700 group-hover:text-gray-900">
                    {suggestion}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Popüler aramalar */}
          {query.length === 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                Popüler Aramalar
              </div>
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(search)
                    handleSearch(search)
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3 group"
                >
                  <div className="text-primary-500 font-semibold text-sm">
                    {index + 1}
                  </div>
                  <span className="text-gray-700 group-hover:text-gray-900">
                    {search}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Overlay (önerileri kapatmak için) */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  )
}
