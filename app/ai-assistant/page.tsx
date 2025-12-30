'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Loader2, ShoppingBag, Cpu, Package } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Merhaba! Ben Wellibuy AI asistanınızım. Size nasıl yardımcı olabilirim? Ürün önerileri, fiyat karşılaştırmaları veya bilgisayar toplama konusunda size yardımcı olabilirim.',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input.trim(),
          context: messages.slice(-5).map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      })

      if (!response.ok) {
        throw new Error('API isteği başarısız oldu')
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response || 'Üzgünüm, bir yanıt oluşturamadım.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat hatası:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const quickActions = [
    {
      icon: ShoppingBag,
      label: 'Ürün Öner',
      prompt: 'Bana 50.000 TL bütçeyle oyun bilgisayarı öner'
    },
    {
      icon: Cpu,
      label: 'PC Topla',
      prompt: 'Video düzenleme için bilgisayar topla'
    },
    {
      icon: Package,
      label: 'Fiyat Karşılaştır',
      prompt: 'RTX 5090 fiyatlarını karşılaştır'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 pb-8">
      <div className="max-w-4xl mx-auto px-4 h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-lg p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-3 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Asistan</h1>
              <p className="text-gray-600 text-sm">Akıllı alışveriş danışmanınız</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 bg-white overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <span className={`text-xs mt-1 block ${
                  message.role === 'user' ? 'text-primary-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString('tr-TR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length === 1 && (
          <div className="bg-white px-6 py-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Hızlı Aksiyonlar:</p>
            <div className="grid grid-cols-3 gap-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => setInput(action.prompt)}
                  className="flex flex-col items-center space-y-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <action.icon className="w-5 h-5 text-primary-500" />
                  <span className="text-xs font-medium text-gray-700">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="bg-white rounded-b-2xl shadow-lg p-4">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Mesajınızı yazın..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Send className="w-6 h-6" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
