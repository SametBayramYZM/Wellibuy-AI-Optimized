/**
 * YAPAY ZEKA SERVİSİ
 * 
 * Bu dosya tüm AI işlevlerini içerir:
 * 1. Ürün analizi
 * 2. Gıda içindekiler değerlendirmesi
 * 3. PC builder önerileri
 * 4. Kamera ile ürün tarama
 * 5. Akıllı arama ve öneri sistemi
 */

import OpenAI from 'openai';
import type {
  Product,
  IngredientAnalysis,
  PCBuilderRequest,
  PCBuilderResponse,
  CameraScanResult,
  AIRecommendation,
  SearchCriteria
} from '@/types';

// OpenAI istemcisi oluştur
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// ============================================
// YARDIMCI FONKSİYONLAR
// ============================================

/**
 * AI'dan cevap almak için genel fonksiyon
 */
async function getAIResponse(prompt: string, systemMessage: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('AI yanıt hatası:', error);
    throw new Error('AI servisi şu anda kullanılamıyor');
  }
}

// ============================================
// 1. GIDA İÇİNDEKİLER ANALİZİ
// ============================================

/**
 * Gıda ürünlerinin içindekilerini analiz eder
 * Yararlı, zararlı ve şüpheli maddeleri tespit eder
 * 
 * @param productName - Ürün adı
 * @param ingredients - İçindekiler listesi
 * @returns Her bir maddenin detaylı analizi
 */
export async function analyzeIngredients(
  productName: string,
  ingredients: string[]
): Promise<IngredientAnalysis[]> {
  const systemMessage = `Sen bir beslenme uzmanısın. Gıda ürünlerindeki maddeleri analiz ederek 
  sağlığa etkilerini değerlendiriyorsun. Her madde için 'yararlı', 'zararlı' veya 'şüpheli' 
  kategorilerinden birini seç ve kısa bir açıklama yap.`;

  const prompt = `Ürün: ${productName}
İçindekiler: ${ingredients.join(', ')}

Her bir madde için aşağıdaki formatta JSON yanıtı ver:
{
  "analysis": [
    {
      "name": "madde adı",
      "status": "yararlı/zararlı/şüpheli",
      "description": "kısa açıklama",
      "healthScore": 1-10 arası sayı (10 en sağlıklı)
    }
  ]
}`;

  try {
    const response = await getAIResponse(prompt, systemMessage);
    const parsed = JSON.parse(response);
    return parsed.analysis;
  } catch (error) {
    console.error('İçindekiler analiz hatası:', error);
    // Hata durumunda basit bir analiz dön
    return ingredients.map(ing => ({
      name: ing,
      status: 'şüpheli',
      description: 'Detaylı analiz yapılamadı',
      healthScore: 5
    }));
  }
}

// ============================================
// 2. PC BUILDER AI SİSTEMİ
// ============================================

/**
 * Bütçe ve kullanım amacına göre PC konfigürasyonu önerir
 * Oyun performansı, fiyat-performans dengesi ve uyumluluk kontrol eder
 * 
 * @param request - Kullanıcının PC toplama isteği
 * @param availableProducts - Mevcut ürünler (veritabanından)
 * @returns AI tarafından önerilen PC konfigürasyonu
 */
export async function buildPCConfiguration(
  request: PCBuilderRequest,
  availableProducts: Product[]
): Promise<PCBuilderResponse> {
  const systemMessage = `Sen bir bilgisayar donanımı uzmanısın. Kullanıcının bütçesine ve 
  ihtiyaçlarına göre en iyi performansı verecek PC konfigürasyonu öneriyorsun. 
  Fiyat-performans dengesini gözetiyorsun ve parçaların uyumluluğunu kontrol ediyorsun.`;

  // Ürünleri kategorilere göre ayır
  const cpus = availableProducts.filter(p => 
    p.specifications.some(s => s.category === 'İşlemci')
  );
  const gpus = availableProducts.filter(p => 
    p.specifications.some(s => s.category === 'Ekran Kartı')
  );
  const rams = availableProducts.filter(p => 
    p.specifications.some(s => s.category === 'RAM')
  );

  const prompt = `Bütçe: ${request.budget} TL
Kullanım Amacı: ${request.purpose}
${request.games ? `Oyunlar: ${request.games.join(', ')}` : ''}

Mevcut Ürünlerden Öner:
İşlemciler: ${cpus.slice(0, 5).map(c => `${c.name} - ${c.prices[0]?.price} TL`).join(', ')}
Ekran Kartları: ${gpus.slice(0, 5).map(g => `${g.name} - ${g.prices[0]?.price} TL`).join(', ')}

Aşağıdaki formatta JSON yanıtı ver:
{
  "components": [
    {
      "type": "İşlemci",
      "productId": "...",
      "reason": "seçim nedeni"
    }
  ],
  "totalPrice": toplam fiyat,
  "performanceScore": 1-100 arası puan,
  "gamePerformance": [
    {
      "game": "oyun adı",
      "expectedFPS": tahmini FPS,
      "settings": "Yüksek/Ultra/Orta"
    }
  ]
}`;

  try {
    const response = await getAIResponse(prompt, systemMessage);
    const parsed = JSON.parse(response);

    // Ürün ID'lerini gerçek ürünlerle eşleştir
    const components = parsed.components.map((comp: any) => {
      const product = availableProducts.find(p => p._id === comp.productId) 
        || availableProducts.find(p => p.name.includes(comp.type));
      
      return {
        type: comp.type,
        product: product!,
        reason: comp.reason
      };
    });

    return {
      totalPrice: parsed.totalPrice,
      components,
      performanceScore: parsed.performanceScore,
      gamePerformance: parsed.gamePerformance
    };
  } catch (error) {
    console.error('PC builder hatası:', error);
    throw new Error('PC konfigürasyonu oluşturulamadı');
  }
}

// ============================================
// 3. KAMERA İLE ÜRÜN TARAMA
// ============================================

/**
 * Mobil kamerayla çekilen ürün görselini analiz eder
 * Ürünü tanır, içindekileri değerlendirir ve öneri sunar
 * 
 * @param imageBase64 - Ürün görseli (base64 formatında)
 * @param products - Veritabanındaki ürünler (karşılaştırma için)
 * @returns Ürün analizi ve öneriler
 */
export async function scanProductWithCamera(
  imageBase64: string,
  products: Product[]
): Promise<CameraScanResult> {
  try {
    // OpenAI Vision API ile görsel analizi
    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Bu ürünün adını, markasını ve görünen tüm bilgileri analiz et. 
              Eğer gıda ürünüyse içindekiler listesini oku ve sağlık değerlendirmesi yap.
              JSON formatında yanıt ver: 
              {
                "productName": "...",
                "brand": "...",
                "category": "...",
                "visibleIngredients": ["..."],
                "recommendation": "Alınabilir/Dikkatli/Alınmamalı",
                "reasons": ["neden 1", "neden 2"]
              }`
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000
    });

    const result = JSON.parse(response.choices[0]?.message?.content || '{}');

    // Veritabanında eşleşen ürün ara
    const matchedProduct = products.find(p => 
      p.name.toLowerCase().includes(result.productName.toLowerCase()) ||
      result.productName.toLowerCase().includes(p.name.toLowerCase())
    );

    // Gıda ürünüyse içindekiler analizi yap
    let ingredientAnalysis: IngredientAnalysis[] | undefined;
    if (result.visibleIngredients && result.visibleIngredients.length > 0) {
      ingredientAnalysis = await analyzeIngredients(
        result.productName,
        result.visibleIngredients
      );
    }

    return {
      productName: result.productName,
      matchedProduct,
      confidence: matchedProduct ? 90 : 60,
      analysis: `${result.productName} tespit edildi. ${result.reasons.join('. ')}`,
      ingredientAnalysis,
      recommendation: result.recommendation,
      reasons: result.reasons
    };
  } catch (error) {
    console.error('Kamera tarama hatası:', error);
    throw new Error('Ürün tanıma başarısız oldu');
  }
}

// ============================================
// 4. AKILLI ÜRÜN ÖNERİ SİSTEMİ
// ============================================

/**
 * Kullanıcının tercihlerine göre akıllı ürün önerileri sunar
 * Fiyat-performans, kalite ve sağlık faktörlerini değerlendirir
 * 
 * @param criteria - Arama kriterleri
 * @param products - Değerlendirilecek ürünler
 * @returns AI tarafından önerilen ürünler
 */
export async function getAIRecommendations(
  criteria: SearchCriteria,
  products: Product[]
): Promise<AIRecommendation[]> {
  const systemMessage = `Sen bir e-ticaret danışmanısın. Kullanıcılara en iyi 
  fiyat-performans oranına sahip, kaliteli ve (gıda ürünlerinde) sağlıklı ürünler öneriyorsun.`;

  const prompt = `Kullanıcı Tercihleri:
Kategori: ${criteria.category || 'Tümü'}
Bütçe: ${criteria.priceRange ? `${criteria.priceRange.min}-${criteria.priceRange.max} TL` : 'Belirtilmemiş'}
Özellikler: ${JSON.stringify(criteria.specifications || {})}

Mevcut Ürünler:
${products.slice(0, 20).map(p => 
  `${p.name} - ${p.prices[0]?.price} TL - Puan: ${p.rating}`
).join('\n')}

Bu ürünlerden en iyi 5 tanesini seç ve öneri nedenleriyle birlikte sırala.
JSON formatında yanıt ver:
{
  "recommendations": [
    {
      "productId": "...",
      "reason": "öneri nedeni",
      "score": 1-100 arası puan,
      "pricePerformance": 1-100 arası puan
    }
  ]
}`;

  try {
    const response = await getAIResponse(prompt, systemMessage);
    const parsed = JSON.parse(response);

    return parsed.recommendations.map((rec: any) => {
      const product = products.find(p => p._id === rec.productId) 
        || products[0]; // Fallback
      
      return {
        productId: rec.productId,
        product,
        reason: rec.reason,
        score: rec.score,
        pricePerformance: rec.pricePerformance
      };
    });
  } catch (error) {
    console.error('AI öneri hatası:', error);
    // Basit öneri sistemi (fallback)
    return products.slice(0, 5).map(p => ({
      productId: p._id,
      product: p,
      reason: 'Popüler ve yüksek puanlı ürün',
      score: p.rating * 20,
      pricePerformance: 70
    }));
  }
}

// ============================================
// 5. AKILLI ARAMA MOT ORU
// ============================================

/**
 * Doğal dil ile yapılan aramaları anlar ve en uygun ürünleri bulur
 * Örn: "30 bin liraya oyun bilgisayarı toplamak istiyorum"
 * 
 * @param query - Kullanıcının arama sorgusu
 * @returns Anlaşılmış arama kriterleri
 */
export async function parseSmartSearch(query: string): Promise<SearchCriteria> {
  const systemMessage = `Sen bir arama motoru asistanısın. Kullanıcının doğal dilde 
  yazdığı sorguları anlar ve yapılandırılmış arama kriterlerine çevirirsin.`;

  const prompt = `Sorgu: "${query}"

Bu sorgudan aşağıdaki bilgileri çıkar ve JSON formatında ver:
{
  "category": "Elektronik/Bilgisayar/Gıda/İçecek/Hobi/Diğer",
  "priceRange": { "min": 0, "max": 0 },
  "specifications": { "özellik": ["değer"] },
  "purpose": "kullanım amacı"
}`;

  try {
    const response = await getAIResponse(prompt, systemMessage);
    return JSON.parse(response);
  } catch (error) {
    console.error('Akıllı arama parse hatası:', error);
    return { query }; // Basit arama yap
  }
}

export default {
  analyzeIngredients,
  buildPCConfiguration,
  scanProductWithCamera,
  getAIRecommendations,
  parseSmartSearch
};
