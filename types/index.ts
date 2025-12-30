/**
 * TİP TANIMLARI
 * 
 * Bu dosya tüm TypeScript tip tanımlarını içerir.
 * Her bir interface, veritabanı modellerine ve API yanıtlarına karşılık gelir.
 */

// ============================================
// ÜRÜN TİPLERİ
// ============================================

/**
 * Ürün Kategorileri
 * - Tüm ürünler bu kategorilerden birine ait olmalıdır
 */
export type ProductCategory = 
  | 'Elektronik' 
  | 'Bilgisayar' 
  | 'Gıda'
  | 'İçecek'
  | 'Hobi'
  | 'Diğer';

/**
 * Fiyat Bilgisi
 * - Hangi sitede hangi fiyata satıldığını gösterir
 */
export interface PriceInfo {
  siteName: string;        // Örn: "Trendyol", "Hepsiburada"
  price: number;           // Türk Lirası cinsinden fiyat
  url: string;            // Ürünün o sitedeki linki
  inStock: boolean;       // Stokta var mı?
  lastUpdated: Date;      // Son güncelleme tarihi
}

/**
 * Ürün Özellikleri
 * - Her ürünün kendine özgü özellikleri vardır
 * - Filtrelemedeki anahtar-değer çiftleri
 */
export interface ProductSpecification {
  name: string;           // Özellik adı (Örn: "İşlemci")
  value: string;          // Özellik değeri (Örn: "Intel i9")
  category: string;       // Özellik kategorisi (Örn: "Donanım")
  unit?: string;          // Birim (Örn: "GB", "GHz")
}

/**
 * Gıda İçindekiler Analizi
 * - AI tarafından yapılan içindekiler değerlendirmesi
 */
export interface IngredientAnalysis {
  name: string;                    // Madde adı
  status: 'yararlı' | 'zararlı' | 'şüpheli';  // Sağlık durumu
  description: string;             // Detaylı açıklama
  healthScore: number;             // 1-10 arası sağlık puanı
}

/**
 * Ana Ürün Modeli
 * - Sistemdeki tüm ürünler bu yapıyı takip eder
 */
export interface Product {
  _id: string;
  name: string;                    // Ürün adı
  description: string;             // Detaylı açıklama
  category: ProductCategory;       // Ana kategori
  subcategory?: string;           // Alt kategori
  brand: string;                  // Marka
  model?: string;                 // Model numarası
  images: string[];               // Ürün görselleri (URL'ler)
  specifications: ProductSpecification[];  // Tüm özellikler
  prices: PriceInfo[];            // Fiyat karşılaştırmaları
  ingredients?: IngredientAnalysis[];  // Gıda için içindekiler
  rating: number;                 // Ortalama puan (1-5)
  reviewCount: number;            // Yorum sayısı
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// AI TİPLERİ
// ============================================

/**
 * AI Ürün Önerisi
 * - Yapay zekanın kullanıcıya önerdiği ürünler
 */
export interface AIRecommendation {
  productId: string;
  product: Product;
  reason: string;                 // Neden önerildi
  score: number;                  // Öneri skoru (0-100)
  pricePerformance: number;       // Fiyat-performans skoru
}

/**
 * PC Builder Talebi
 * - Kullanıcının PC toplama isteği
 */
export interface PCBuilderRequest {
  budget: number;                 // Bütçe (TL)
  purpose: 'oyun' | 'iş' | 'grafik' | 'genel';  // Kullanım amacı
  games?: string[];              // Oynanacak oyunlar (varsa)
  includePeripherals?: boolean;  // Çevresel ekipman dahil mi?
  preferences?: {
    preferredBrands?: string[];  // Tercih edilen markalar
    mustHave?: string[];         // Olmazsa olmaz özellikler
  };
}

/**
 * PC Builder Yanıtı
 * - AI'ın önerdiği bilgisayar konfigürasyonu
 */
export interface PCBuilderResponse {
  totalPrice: number;
  components: {
    type: 'İşlemci' | 'Ekran Kartı' | 'Anakart' | 'RAM' | 'Depolama' | 'Güç Kaynağı' | 'Kasa' | 'CPU Soğutucu' | 'Kasa Fanı' | 'Monitör' | 'Klavye' | 'Mouse' | 'Kulaklık';
    product: Product;
    reason: string;              // Neden bu parça seçildi
  }[];
  performanceScore: number;      // Genel performans skoru
  gamePerformance?: {
    game: string;
    expectedFPS: number;
    settings: string;            // Grafik ayarları
  }[];
  alternatives?: {               // Alternatif öneriler
    type: string;
    products: Product[];
  }[];
}

/**
 * Kamera Tarama Sonucu
 * - Mobil kamerayla taranan ürünün analizi
 */
export interface CameraScanResult {
  productName: string;
  matchedProduct?: Product;      // Eşleşen ürün (varsa)
  confidence: number;            // Tanıma güvenilirliği (0-100)
  analysis: string;              // AI analizi
  ingredientAnalysis?: IngredientAnalysis[];  // Gıda ise içindekiler
  recommendation: 'Alınabilir' | 'Dikkatli' | 'Alınmamalı';
  reasons: string[];             // Öneri nedenleri
}

// ============================================
// ARAMA VE FİLTRELEME TİPLERİ
// ============================================

/**
 * Filtre Seçeneği
 * - Kullanıcının seçebileceği filtre değerleri
 */
export interface FilterOption {
  name: string;                  // Özellik adı
  values: {
    value: string;               // Değer
    count: number;               // Bu değere sahip ürün sayısı
  }[];
}

/**
 * Arama Kriterleri
 * - Kullanıcının arama ve filtreleme parametreleri
 */
export interface SearchCriteria {
  query?: string;                // Arama metni
  category?: ProductCategory;    // Kategori filtresi
  priceRange?: {
    min: number;
    max: number;
  };
  specifications?: {             // En az 2 özellik seçilebilir
    [key: string]: string[];     // Örn: { "İşlemci": ["Intel i9"], "RAM": ["32GB"] }
  };
  brands?: string[];
  rating?: number;               // Minimum puan
  sortBy?: 'price' | 'rating' | 'relevance' | 'performance';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

/**
 * Arama Sonuçları
 */
export interface SearchResults {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  filters: FilterOption[];       // Mevcut filtreler
  aiSuggestions?: AIRecommendation[];  // AI önerileri
}

// ============================================
// API YANIT TİPLERİ
// ============================================

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  details?: any;
}
