/**
 * YAPAY ZEKA API ROUTE'LARI
 * 
 * AI ile ilgili tüm endpoint'ler:
 * - Ürün önerileri
 * - PC Builder
 * - Kamera ile ürün tarama
 * - İçindekiler analizi
 * - Akıllı arama
 */

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// AI servis fonksiyonlarını import et
// Not: TypeScript dosyası olduğu için transpile edilmeli
// Şimdilik basit JavaScript implementasyonu kullanıyoruz

let Product;
try {
  Product = mongoose.model('Product');
} catch {
  const ProductSchema = require('./schemas/product');
  Product = mongoose.model('Product', ProductSchema);
}

// ============================================
// AI ÜRÜN ÖNERİLERİ
// ============================================

/**
 * POST /api/ai/recommendations
 * Body: SearchCriteria
 * Kullanıcının tercihlerine göre AI önerileri
 */
router.post('/recommendations', async (req, res) => {
  try {
    const { category, priceRange, specifications, purpose } = req.body;

    // Ürünleri al
    const filters = {};
    if (category) filters.category = category;
    if (priceRange) {
      filters['prices.price'] = {
        $gte: priceRange.min,
        $lte: priceRange.max
      };
    }

    const products = await Product.find(filters)
      .sort({ rating: -1 })
      .limit(50);

    // Basit öneri algoritması (gerçek AI yerine)
    // Fiyat-performans ve puan bazlı sıralama
    const recommendations = products
      .map(product => {
        const avgPrice = product.prices.reduce((sum, p) => sum + p.price, 0) / product.prices.length;
        const pricePerformance = (product.rating / avgPrice) * 10000;
        
        return {
          productId: product._id,
          product,
          reason: getRecommendationReason(product, purpose),
          score: Math.min(100, Math.round(product.rating * 20)),
          pricePerformance: Math.min(100, Math.round(pricePerformance))
        };
      })
      .sort((a, b) => b.pricePerformance - a.pricePerformance)
      .slice(0, 5);

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('AI öneri hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Öneriler oluşturulamadı'
    });
  }
});

function getRecommendationReason(product, purpose) {
  const reasons = [
    'Yüksek kullanıcı puanı',
    'Mükemmel fiyat-performans oranı',
    'Popüler ve güvenilir marka',
    'Öne çıkan özellikleri'
  ];
  
  if (product.category === 'Gıda') {
    return 'Sağlıklı içerik ve kaliteli malzemeler';
  }
  
  if (purpose === 'oyun') {
    return 'Oyun performansı için optimize edilmiş';
  }
  
  return reasons[Math.floor(Math.random() * reasons.length)];
}

// ============================================
// PC BUILDER AI
// ============================================

/**
 * POST /api/ai/pc-builder
 * Body: PCBuilderRequest
 * Bütçe ve amaca göre PC konfigürasyonu öner
 */
router.post('/pc-builder', async (req, res) => {
  try {
    const { budget, purpose, games, includePeripherals = true, preferences } = req.body;

    if (!budget) {
      return res.status(400).json({
        success: false,
        error: 'Bütçe belirtilmeli'
      });
    }

    // Bilgisayar parçalarını al
    const components = await Product.find({
      category: 'Bilgisayar',
      'prices.price': { $lte: budget }
    });

    // Parça tiplerini ayır
    const cpus = components.filter(c => 
      c.name.toLowerCase().includes('işlemci') || 
      c.name.toLowerCase().includes('processor') ||
      c.name.toLowerCase().includes('i9') ||
      c.name.toLowerCase().includes('i7') ||
      c.subcategory === 'İşlemci'
    );
    const gpus = components.filter(c => 
      c.name.toLowerCase().includes('ekran kartı') || 
      c.name.toLowerCase().includes('rtx') ||
      c.name.toLowerCase().includes('nvidia') ||
      c.name.toLowerCase().includes('geforce') ||
      c.subcategory === 'Ekran Kartı'
    );
    const rams = components.filter(c => 
      c.name.toLowerCase().includes('ram') ||
      c.name.toLowerCase().includes('fury') ||
      c.name.toLowerCase().includes('vengeance') ||
      c.subcategory === 'RAM'
    );
    const storages = components.filter(c => 
      c.name.toLowerCase().includes('ssd') || 
      c.name.toLowerCase().includes('hdd') ||
      c.name.toLowerCase().includes('evo') ||
      c.subcategory === 'Depolama'
    );
    const psus = components.filter(c =>
      c.name.toLowerCase().includes('psu') ||
      c.name.toLowerCase().includes('güç kaynağı') ||
      c.name.toLowerCase().includes('power supply') ||
      c.name.toLowerCase().includes('watt') ||
      c.subcategory === 'Güç Kaynağı'
    );
    const monitors = components.filter(c =>
      c.name.toLowerCase().includes('monitör') ||
      c.name.toLowerCase().includes('monitor') ||
      c.subcategory === 'Monitör'
    );
    const keyboards = components.filter(c =>
      c.name.toLowerCase().includes('klavye') ||
      c.name.toLowerCase().includes('keyboard') ||
      c.subcategory === 'Klavye'
    );
    const mice = components.filter(c =>
      c.name.toLowerCase().includes('mouse') ||
      c.name.toLowerCase().includes('fare') ||
      c.subcategory === 'Mouse'
    );
    const headsets = components.filter(c =>
      c.name.toLowerCase().includes('kulaklık') ||
      c.name.toLowerCase().includes('headset') ||
      c.name.toLowerCase().includes('headphone') ||
      c.subcategory === 'Kulaklık'
    );

    // Bütçe dağılımı (çevresel ekipman dahil mi?)
    let distribution;
    if (includePeripherals) {
      distribution = purpose === 'oyun' 
        ? { cpu: 0.15, gpu: 0.30, ram: 0.08, storage: 0.07, psu: 0.08, monitor: 0.15, keyboard: 0.06, mouse: 0.06, headset: 0.05 }
        : { cpu: 0.20, gpu: 0.20, ram: 0.10, storage: 0.08, psu: 0.08, monitor: 0.18, keyboard: 0.06, mouse: 0.06, headset: 0.04 };
    } else {
      distribution = purpose === 'oyun' 
        ? { cpu: 0.25, gpu: 0.45, ram: 0.12, storage: 0.10, psu: 0.08 }
        : { cpu: 0.30, gpu: 0.30, ram: 0.15, storage: 0.12, psu: 0.13 };
    }

    // Her kategoriden en uygun ürünü seç
    const selectedComponents = [];
    let totalPrice = 0;

    // İşlemci seç
    if (cpus.length > 0) {
      const cpu = findBestComponent(cpus, budget * distribution.cpu, purpose);
      if (cpu) {
        selectedComponents.push({
          type: 'İşlemci',
          product: cpu,
          reason: `${purpose === 'oyun' ? 'Oyunlar' : 'İş yükü'} için optimize edilmiş`
        });
        totalPrice += cpu.prices[0].price;
      }
    }

    // Ekran kartı seç
    if (gpus.length > 0) {
      const gpu = findBestComponent(gpus, budget * distribution.gpu, purpose);
      if (gpu) {
        selectedComponents.push({
          type: 'Ekran Kartı',
          product: gpu,
          reason: purpose === 'oyun' 
            ? 'Yüksek FPS ve görsel kalite için' 
            : 'Grafik işleme gücü'
        });
        totalPrice += gpu.prices[0].price;
      }
    }

    // RAM seç
    if (rams.length > 0) {
      const ram = findBestComponent(rams, budget * distribution.ram, purpose);
      if (ram) {
        selectedComponents.push({
          type: 'RAM',
          product: ram,
          reason: 'Çoklu görev ve hızlı sistem performansı'
        });
        totalPrice += ram.prices[0].price;
      }
    }

    // Depolama seç
    if (storages.length > 0) {
      const storage = findBestComponent(storages, budget * distribution.storage, purpose);
      if (storage) {
        selectedComponents.push({
          type: 'Depolama',
          product: storage,
          reason: 'Hızlı yükleme süreleri ve geniş alan'
        });
        totalPrice += storage.prices[0].price;
      }
    }

    // Güç Kaynağı seç
    if (psus.length > 0) {
      const psu = findBestComponent(psus, budget * distribution.psu, purpose);
      if (psu) {
        selectedComponents.push({
          type: 'Güç Kaynağı',
          product: psu,
          reason: 'Sistem kararlılığı ve güvenli güç sağlama'
        });
        totalPrice += psu.prices[0].price;
      }
    }

    // Çevresel ekipman (eğer dahil edilmişse)
    if (includePeripherals) {
      // Monitör seç
      if (monitors.length > 0) {
        const monitor = findBestComponent(monitors, budget * distribution.monitor, purpose);
        if (monitor) {
          selectedComponents.push({
            type: 'Monitör',
            product: monitor,
            reason: purpose === 'oyun' 
              ? 'Yüksek yenileme hızı ve düşük gecikme süresi'
              : 'Renk doğruluğu ve görüntü kalitesi'
          });
          totalPrice += monitor.prices[0].price;
        }
      }

      // Klavye seç
      if (keyboards.length > 0) {
        const keyboard = findBestComponent(keyboards, budget * distribution.keyboard, purpose);
        if (keyboard) {
          selectedComponents.push({
            type: 'Klavye',
            product: keyboard,
            reason: purpose === 'oyun' ? 'Mekanik anahtar ve RGB aydınlatma' : 'Ergonomik tasarım ve konfor'
          });
          totalPrice += keyboard.prices[0].price;
        }
      }

      // Mouse seç
      if (mice.length > 0) {
        const mouse = findBestComponent(mice, budget * distribution.mouse, purpose);
        if (mouse) {
          selectedComponents.push({
            type: 'Mouse',
            product: mouse,
            reason: purpose === 'oyun' ? 'Yüksek DPI ve hassasiyet' : 'Ergonomik ve kablosuz kullanım'
          });
          totalPrice += mouse.prices[0].price;
        }
      }

      // Kulaklık seç
      if (headsets.length > 0) {
        const headset = findBestComponent(headsets, budget * distribution.headset, purpose);
        if (headset) {
          selectedComponents.push({
            type: 'Kulaklık',
            product: headset,
            reason: purpose === 'oyun' ? 'Surround ses ve mikrofon kalitesi' : 'Ses kalitesi ve konfor'
          });
          totalPrice += headset.prices[0].price;
        }
      }
    }

    // Performans skoru hesapla
    const performanceScore = calculatePerformanceScore(selectedComponents, purpose);

    // Oyun performansı tahmini (varsa)
    let gamePerformance = undefined;
    if (purpose === 'oyun' && games && games.length > 0) {
      gamePerformance = games.map(game => ({
        game,
        expectedFPS: estimateFPS(selectedComponents, game),
        settings: totalPrice > budget * 0.7 ? 'Ultra' : totalPrice > budget * 0.5 ? 'Yüksek' : 'Orta'
      }));
    }

    res.json({
      success: true,
      data: {
        totalPrice: Math.round(totalPrice),
        components: selectedComponents,
        performanceScore,
        gamePerformance,
        message: totalPrice <= budget 
          ? 'Bütçenize uygun mükemmel bir konfigürasyon!' 
          : 'Bütçeyi biraz aşıyor, ancak en iyi performans için öneriyoruz'
      }
    });
  } catch (error) {
    console.error('PC builder hatası:', error);
    res.status(500).json({
      success: false,
      error: 'PC konfigürasyonu oluşturulamadı'
    });
  }
});

function findBestComponent(components, targetBudget, purpose) {
  return components
    .filter(c => c.prices[0].price <= targetBudget * 1.2)
    .sort((a, b) => {
      const scoreA = (a.rating / a.prices[0].price) * 1000;
      const scoreB = (b.rating / b.prices[0].price) * 1000;
      return scoreB - scoreA;
    })[0];
}

function calculatePerformanceScore(components, purpose) {
  const avgRating = components.reduce((sum, c) => sum + c.product.rating, 0) / components.length;
  const baseScore = avgRating * 20;
  
  // Purpose'a göre bonus
  const bonus = purpose === 'oyun' && components.some(c => c.type === 'Ekran Kartı') ? 10 : 0;
  
  return Math.min(100, Math.round(baseScore + bonus));
}

function estimateFPS(components, game) {
  // Basit FPS tahmini
  const hasHighEndGPU = components.some(c => 
    c.type === 'Ekran Kartı' && c.product.name.toLowerCase().includes('rtx')
  );
  
  const baseFPS = hasHighEndGPU ? 120 : 60;
  return Math.round(baseFPS + Math.random() * 30);
}

// ============================================
// KAMERA İLE ÜRÜN TARAMA
// ============================================

/**
 * POST /api/ai/scan-product
 * Body: { imageBase64: string }
 * Mobil kamera ile ürün tara ve analiz et
 */
router.post('/scan-product', async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        error: 'Görsel gerekli'
      });
    }

    // Gerçek AI implementasyonu yerine basit simülasyon
    // Gerçek uygulamada OpenAI Vision API kullanılmalı
    
    // Örnek ürün tespiti
    const products = await Product.find().limit(10);
    const randomProduct = products[Math.floor(Math.random() * products.length)];

    const result = {
      productName: randomProduct.name,
      matchedProduct: randomProduct,
      confidence: 85,
      analysis: `${randomProduct.name} tespit edildi. Bu ürün ${randomProduct.category} kategorisinde.`,
      recommendation: randomProduct.rating >= 4 ? 'Alınabilir' : randomProduct.rating >= 3 ? 'Dikkatli' : 'Alınmamalı',
      reasons: [
        `Kullanıcı puanı: ${randomProduct.rating}/5`,
        `${randomProduct.prices.length} farklı satıcıda mevcut`,
        randomProduct.category === 'Gıda' ? 'İçindekiler incelendi' : 'Teknik özellikler değerlendirildi'
      ]
    };

    // Gıda ürünüyse içindekiler analizi ekle
    if (randomProduct.ingredients && randomProduct.ingredients.length > 0) {
      result.ingredientAnalysis = randomProduct.ingredients;
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Kamera tarama hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Ürün taraması başarısız'
    });
  }
});

// ============================================
// İÇİNDEKİLER ANALİZİ
// ============================================

/**
 * POST /api/ai/ingredients
 * Body: { productName: string, ingredients: string[] }
 * Gıda içindekilerini analiz et
 */
router.post('/ingredients', async (req, res) => {
  try {
    const { productName, ingredients } = req.body;

    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'İçindekiler listesi gerekli'
      });
    }

    // Basit içindekiler analizi
    // Gerçek uygulamada AI kullanılmalı
    const analysis = ingredients.map(ingredient => {
      const lower = ingredient.toLowerCase();
      
      let status = 'şüpheli';
      let description = 'Daha fazla araştırma gerekli';
      let healthScore = 5;

      // Yararlı maddeler
      if (lower.includes('vitamin') || lower.includes('protein') || 
          lower.includes('kalsiyum') || lower.includes('demir') ||
          lower.includes('omega')) {
        status = 'yararlı';
        description = 'Sağlık için faydalı bir bileşen';
        healthScore = 8;
      }
      // Zararlı maddeler
      else if (lower.includes('aspartam') || lower.includes('msg') || 
               lower.includes('trans yağ') || lower.includes('nitrit')) {
        status = 'zararlı';
        description = 'Sağlık açısından dikkatli tüketilmeli';
        healthScore = 2;
      }
      // Doğal maddeler
      else if (lower.includes('su') || lower.includes('tuz') || 
               lower.includes('şeker') || lower.includes('un')) {
        status = 'yararlı';
        description = 'Doğal ve yaygın kullanılan bileşen';
        healthScore = 6;
      }

      return {
        name: ingredient,
        status,
        description,
        healthScore
      };
    });

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('İçindekiler analiz hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Analiz başarısız'
    });
  }
});

// ============================================
// AKILLI ARAMA
// ============================================

/**
 * POST /api/ai/smart-search
 * Body: { query: string }
 * Doğal dil ile arama yap
 */
router.post('/smart-search', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Arama sorgusu gerekli'
      });
    }

    // Basit NLP - anahtar kelimeleri çıkar
    const lowerQuery = query.toLowerCase();
    
    const criteria = {
      query: query
    };

    // Kategori tespiti
    if (lowerQuery.includes('bilgisayar') || lowerQuery.includes('pc') || lowerQuery.includes('laptop')) {
      criteria.category = 'Bilgisayar';
    } else if (lowerQuery.includes('yiyecek') || lowerQuery.includes('gıda')) {
      criteria.category = 'Gıda';
    } else if (lowerQuery.includes('elektronik')) {
      criteria.category = 'Elektronik';
    }

    // Bütçe tespiti
    const budgetMatch = lowerQuery.match(/(\d+)\s*(bin|lira|tl|₺)/);
    if (budgetMatch) {
      const amount = parseInt(budgetMatch[1]);
      const unit = budgetMatch[2];
      const budget = unit === 'bin' ? amount * 1000 : amount;
      
      criteria.priceRange = {
        min: budget * 0.8,
        max: budget * 1.2
      };
    }

    // Purpose tespiti
    if (lowerQuery.includes('oyun')) {
      criteria.purpose = 'oyun';
    } else if (lowerQuery.includes('iş') || lowerQuery.includes('ofis')) {
      criteria.purpose = 'iş';
    }

    res.json({
      success: true,
      data: criteria,
      message: 'Arama kriterleri başarıyla çıkarıldı'
    });
  } catch (error) {
    console.error('Akıllı arama hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Arama işlenemedi'
    });
  }
});

// ============================================
// AI CHAT ASISTANI
// ============================================

/**
 * POST /api/ai/chat
 * Body: { message: string, context: Array }
 * Genel AI asistan sohbet endpoint'i
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, context = [] } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Mesaj gerekli'
      });
    }

    // Veritabanından güncel ürün bilgilerini al
    const products = await Product.find().limit(10).select('name category prices.price specifications');
    
    // Akıllı mock yanıtlar (OpenAI kredisi dolunca kullanılır)
    let response = '';
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('bilgisayar topla') || lowerMessage.includes('pc topla') || lowerMessage.includes('video düzenl')) {
      const relevantProducts = products.filter(p => 
        p.category === 'Bilgisayar' || p.category === 'bilgisayar'
      );
      response = `Video düzenleme için harika bir bilgisayar önerisi hazırladım! 📹

Sistemimizde şu anda şu bileşenler mevcut:
${relevantProducts.slice(0, 5).map(p => 
  `✓ ${p.name} - ${p.prices && p.prices[0] ? p.prices[0].price.toLocaleString('tr-TR') + ' TL' : 'Fiyat bilgisi yok'}`
).join('\n')}

Video düzenleme için önerilerim:
- Güçlü işlemci (Intel i9 veya AMD Ryzen 9)
- Minimum 32GB RAM
- Hızlı NVMe SSD (1TB+)
- İyi bir ekran kartı (RTX 4070 üzeri)
- Kaliteli monitör

Daha detaylı bilgi için PC Builder sayfamızı ziyaret edebilirsin! 🚀`;
    } else if (lowerMessage.includes('fiyat') || lowerMessage.includes('karşılaştır')) {
      const mentionedProduct = products.find(p => 
        lowerMessage.includes(p.name.toLowerCase().split(' ')[0])
      );
      if (mentionedProduct) {
        response = `${mentionedProduct.name} için fiyat bilgileri:

${mentionedProduct.prices ? mentionedProduct.prices.map((p, i) => 
  `${i + 1}. ${p.store}: ${p.price.toLocaleString('tr-TR')} TL`
).join('\n') : 'Fiyat bilgisi mevcut değil'}

En iyi fiyatı bulmak için ürün sayfasını ziyaret edebilirsin! 💰`;
      } else {
        response = `Fiyat karşılaştırması yapabilirim! Hangi ürünü arıyorsun? 

Sistemimizde şu anda şu ürünler mevcut:
${products.slice(0, 5).map(p => `- ${p.name}`).join('\n')}

İstediğin ürünü söyleyebilir misin? 🔍`;
      }
    } else if (lowerMessage.includes('öner') || lowerMessage.includes('öneri')) {
      response = `Tabii ki! Sana harika ürünler önerebilirim. 🎯

Sistemimizde popüler ürünlerden bazıları:
${products.slice(0, 5).map(p => 
  `✨ ${p.name} (${p.category}) - ${p.prices && p.prices[0] ? p.prices[0].price.toLocaleString('tr-TR') + ' TL' : 'Fiyat bilgisi yok'}`
).join('\n')}

Ne tür bir ürün arıyorsun? Bütçen ne kadar? 💡`;
    } else {
      response = `Merhaba! 👋 

Size yardımcı olabilirim. Ben Wellibuy AI asistanıyım ve şu konularda destek verebilirim:

🛍️ Ürün önerileri
💻 Bilgisayar toplama tavsiyeleri  
💰 Fiyat karşılaştırmaları
🔍 Ürün arama ve filtreleme

Sistemimizde ${products.length}+ ürün mevcut. Ne aramak istersin?

**Not:** OpenAI API kotası dolduğu için şu anda mock yanıtlarla çalışıyorum. Gerçek AI yanıtları için lütfen OpenAI hesabınıza kredi ekleyin.`;
    }

    res.json({
      success: true,
      response: response,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('AI Chat hatası:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Chat işlenemedi',
      response: 'Üzgünüm, şu anda bir teknik sorun yaşıyorum. Lütfen daha sonra tekrar deneyin.'
    });
  }
});

module.exports = router;
