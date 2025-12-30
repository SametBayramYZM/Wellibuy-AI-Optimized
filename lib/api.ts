/**
 * API YARDIMCI FONKSİYONLARI
 * 
 * Backend API'leri ile iletişim için yardımcı fonksiyonlar
 */

import type { 
  Product, 
  SearchCriteria, 
  SearchResults,
  APIResponse,
  PCBuilderRequest,
  PCBuilderResponse,
  CameraScanResult,
  AIRecommendation,
  IngredientAnalysis
} from '@/types'

// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'

/**
 * API isteği yapmak için genel fonksiyon
 */
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<APIResponse<T>> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('API Hatası:', error)
    return {
      success: false,
      error: 'Bağlantı hatası',
    }
  }
}

// ============================================
// ÜRÜN API'LARI
// ============================================

/**
 * Tüm ürünleri listele
 */
export async function getProducts(params?: {
  page?: number
  limit?: number
  category?: string
  sort?: string
}): Promise<APIResponse<{ products: Product[], pagination: any }>> {
  const queryParams = new URLSearchParams(params as any).toString()
  return fetchAPI(`/products?${queryParams}`)
}

/**
 * Ürün ara ve filtrele
 */
export async function searchProducts(
  criteria: SearchCriteria
): Promise<APIResponse<SearchResults>> {
  const params: any = {
    q: criteria.query,
    category: criteria.category,
    minPrice: criteria.priceRange?.min,
    maxPrice: criteria.priceRange?.max,
    minRating: criteria.rating,
    page: criteria.page || 1,
    limit: criteria.limit || 20,
  }

  if (criteria.specifications) {
    params.specifications = JSON.stringify(criteria.specifications)
  }

  const queryParams = new URLSearchParams(
    Object.entries(params).filter(([_, v]) => v != null) as any
  ).toString()

  return fetchAPI(`/products/search?${queryParams}`)
}

/**
 * Tek bir ürünü getir
 */
export async function getProduct(id: string): Promise<APIResponse<Product>> {
  return fetchAPI(`/products/${id}`)
}

// ============================================
// AI API'LARI
// ============================================

/**
 * AI ürün önerileri al
 */
export async function getAIRecommendations(
  criteria: Partial<SearchCriteria>
): Promise<APIResponse<AIRecommendation[]>> {
  return fetchAPI('/ai/recommendations', {
    method: 'POST',
    body: JSON.stringify(criteria),
  })
}

/**
 * PC Builder - Bilgisayar konfigürasyonu öner
 */
export async function buildPC(
  request: PCBuilderRequest
): Promise<APIResponse<PCBuilderResponse>> {
  return fetchAPI('/ai/pc-builder', {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

/**
 * Kamera ile ürün tara
 */
export async function scanProduct(
  imageBase64: string
): Promise<APIResponse<CameraScanResult>> {
  return fetchAPI('/ai/scan-product', {
    method: 'POST',
    body: JSON.stringify({ imageBase64 }),
  })
}

/**
 * Gıda içeriklerini analiz et
 */
export async function analyzeIngredients(
  productName: string,
  ingredients: string[]
): Promise<APIResponse<IngredientAnalysis[]>> {
  return fetchAPI('/ai/ingredients', {
    method: 'POST',
    body: JSON.stringify({ productName, ingredients }),
  })
}

/**
 * Akıllı arama - Doğal dil ile arama
 */
export async function smartSearch(
  query: string
): Promise<APIResponse<SearchCriteria>> {
  return fetchAPI('/ai/smart-search', {
    method: 'POST',
    body: JSON.stringify({ query }),
  })
}

// ============================================
// KATEGORİ API'LARI
// ============================================

/**
 * Tüm kategorileri getir
 */
export async function getCategories(): Promise<APIResponse<any[]>> {
  return fetchAPI('/categories')
}

/**
 * Kategoriye göre ürünleri getir
 */
export async function getCategoryProducts(
  categoryName: string,
  page: number = 1,
  limit: number = 20
): Promise<APIResponse<any>> {
  return fetchAPI(`/categories/${categoryName}/products?page=${page}&limit=${limit}`)
}

/**
 * Kategori istatistiklerini getir
 */
export async function getCategoryStats(
  categoryName: string
): Promise<APIResponse<any>> {
  return fetchAPI(`/categories/${categoryName}/stats`)
}
