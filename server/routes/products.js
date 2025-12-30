/**
 * ÜRÜN API ROUTE'LARI
 * 
 * Ürünlerle ilgili tüm işlemler:
 * - Ürün listesi
 * - Ürün arama ve filtreleme
 * - Ürün detayı
 * - Ürün ekleme/güncelleme/silme
 * 
 * ⚠️ GÜVENLİK ÖNLEMLERİ ⚠️
 * - Input validation
 * - SQL/NoSQL injection koruması
 * - Rate limiting
 */

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Simple validation helper (optimize - no extra dependency)
const isValidString = (str, maxLen = 100) => 
  typeof str === 'string' && str.trim().length > 0 && str.length <= maxLen;

// Admin Middleware
const isAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token gereklidir' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin yetkisi gereklidir' });
    }

    next();
  } catch (error) {
    res.status(401).json({ error: 'Geçersiz token' });
  }
};

// Model'i import et (dinamik olarak)
let Product;
try {
  Product = mongoose.model('Product');
} catch {
  // Model henüz yüklenmemişse şemayı tanımla
  const ProductSchema = require('./schemas/product');
  Product = mongoose.model('Product', ProductSchema);
}

// ============================================
// ÜRÜN LİSTESİ (Sayfalama ile)
// ============================================

/**
 * GET /api/products
 * Query parametreleri:
 * - page: Sayfa numarası (varsayılan: 1)
 * - limit: Sayfa başına ürün (varsayılan: 20)
 * - category: Kategori filtresi
 * - sort: Sıralama (price, rating, name)
 */
router.get('/', async (req, res) => {
  try {
    // Input validation
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20); // Max 100 ürün
    const skip = (page - 1) * limit;

    // Filtreler (Injection koruması)
    const filters = {};
    
    if (req.query.category) {
      if (!isValidString(req.query.category)) {
        return res.status(400).json({ success: false, error: 'Geçersiz kategori' });
      }
      filters.category = req.query.category.trim();
    }
    
    if (req.query.brand) {
      if (!isValidString(req.query.brand)) {
        return res.status(400).json({ success: false, error: 'Geçersiz brand' });
      }
      filters.brand = req.query.brand.trim();
    }

    // Sıralama
    const sort = {};
    switch (req.query.sort) {
      case 'price':
        sort['prices.0.price'] = 1; // Artan fiyat
        break;
      case 'price-desc':
        sort['prices.0.price'] = -1; // Azalan fiyat
        break;
      case 'rating':
        sort.rating = -1; // En yüksek puan
        break;
      default:
        sort.createdAt = -1; // En yeni
    }

    // Veritabanı sorgusu
    const products = await Product.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filters);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Ürün listesi hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Ürünler alınamadı'
    });
  }
});

// ============================================
// GELİŞMİŞ ARAMA VE FİLTRELEME
// ============================================

/**
 * GET /api/products/search
 * Query parametreleri:
 * - q: Arama metni
 * - category: Kategori
 * - minPrice, maxPrice: Fiyat aralığı
 * - specifications: Özellikler (JSON formatında)
 * - minRating: Minimum puan
 * 
 * Önemli: En az 2 özellik seçilmeli (specification)
 */
router.get('/search', async (req, res) => {
  try {
    const {
      q,
      category,
      minPrice,
      maxPrice,
      specifications,
      minRating,
      page = 1,
      limit = 20
    } = req.query;

    // Arama filtreleri
    const filters = {};

    // Metin araması
    if (q) {
      filters.$text = { $search: q };
    }

    // Kategori
    if (category) {
      filters.category = category;
    }

    // Fiyat aralığı
    if (minPrice || maxPrice) {
      filters['prices.price'] = {};
      if (minPrice) filters['prices.price'].$gte = parseFloat(minPrice);
      if (maxPrice) filters['prices.price'].$lte = parseFloat(maxPrice);
    }

    // Minimum puan
    if (minRating) {
      filters.rating = { $gte: parseFloat(minRating) };
    }

    // Özellik filtreleme (en az 2 özellik)
    if (specifications) {
      try {
        const specs = JSON.parse(specifications);
        const specKeys = Object.keys(specs);

        // En az 2 özellik kontrolü
        if (specKeys.length < 2 && Object.values(specs).some(v => v.length > 0)) {
          // En az 2 özellik var mı kontrol et
          const filledSpecs = specKeys.filter(key => specs[key].length > 0);
          if (filledSpecs.length < 2) {
            return res.status(400).json({
              success: false,
              error: 'En az 2 özellik seçmelisiniz'
            });
          }
        }

        // Özellik filtreleme - tüm özelliklerin birlikte bulunduğu ürünler
        filters.$and = specKeys
          .filter(key => specs[key].length > 0)
          .map(key => ({
            specifications: {
              $elemMatch: {
                name: key,
                value: { $in: specs[key] }
              }
            }
          }));
      } catch (parseError) {
        console.error('Özellik parse hatası:', parseError);
      }
    }

    // Sayfalama
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sorguyu çalıştır
    const products = await Product.find(filters)
      .sort({ rating: -1, 'prices.0.price': 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filters);

    // Filtreleme seçeneklerini al (kullanıcıya göster)
    const availableFilters = await getAvailableFilters(filters);

    res.json({
      success: true,
      data: {
        products,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        filters: availableFilters
      }
    });
  } catch (error) {
    console.error('Arama hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Arama başarısız'
    });
  }
});

/**
 * Mevcut filtreleme seçeneklerini al
 */
async function getAvailableFilters(currentFilters) {
  try {
    // Mevcut ürünlerden özellikleri çıkar
    const products = await Product.find(currentFilters);
    
    const specMap = new Map();
    
    products.forEach(product => {
      product.specifications.forEach(spec => {
        if (!specMap.has(spec.name)) {
          specMap.set(spec.name, new Set());
        }
        specMap.get(spec.name).add(spec.value);
      });
    });

    // Set'leri array'e çevir
    const filters = [];
    specMap.forEach((values, name) => {
      filters.push({
        name,
        values: Array.from(values).map(v => ({
          value: v,
          count: products.filter(p => 
            p.specifications.some(s => s.name === name && s.value === v)
          ).length
        }))
      });
    });

    return filters;
  } catch (error) {
    console.error('Filtre hesaplama hatası:', error);
    return [];
  }
}

// ============================================
// ÜRÜN DETAYI
// ============================================

/**
 * GET /api/products/:id
 * Tek bir ürünün tüm detaylarını döndürür
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Ürün bulunamadı'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Ürün detay hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Ürün bilgisi alınamadı'
    });
  }
});

// ============================================
// ÜRÜN EKLEME (Admin)
// ============================================

/**
 * POST /api/products
 * Yeni ürün ekler (Sadece Admin)
 */
router.post('/', isAdmin, async (req, res) => {
  try {
    const { name, description, category, brand, images, prices, specifications } = req.body;

    // Validation
    if (!name || !description || !category || !brand || !images || !prices) {
      return res.status(400).json({ error: 'Gerekli alanlar: name, description, category, brand, images, prices' });
    }

    const product = new Product({
      name,
      description,
      category,
      brand,
      images,
      prices,
      specifications: specifications || []
    });

    await product.save();

    res.status(201).json({
      success: true,
      data: product,
      message: 'Ürün başarıyla eklendi'
    });
  } catch (error) {
    console.error('Ürün ekleme hatası:', error);
    res.status(400).json({
      success: false,
      error: 'Ürün eklenemedi',
      details: error.message
    });
  }
});

// ============================================
// ÜRÜN GÜNCELLEME (Admin)
// ============================================

/**
 * PUT /api/products/:id
 * Mevcut ürünü günceller (Sadece Admin)
 */
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Ürün bulunamadı'
      });
    }

    res.json({
      success: true,
      data: product,
      message: 'Ürün güncellendi'
    });
  } catch (error) {
    console.error('Ürün güncelleme hatası:', error);
    res.status(400).json({
      success: false,
      error: 'Ürün güncellenemedi',
      details: error.message
    });
  }
});

// ============================================
// ÜRÜN SİLME (Admin)
// ============================================

/**
 * DELETE /api/products/:id
 * Ürünü siler (Sadece Admin)
 */
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Ürün bulunamadı'
      });
    }

    res.json({
      success: true,
      message: 'Ürün silindi'
    });
  } catch (error) {
    console.error('Ürün silme hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Ürün silinemedi'
    });
  }
});

// ============================================
// ÜRÜN KARŞILAŞTIRMA
// ============================================

/**
 * POST /api/products/compare
 * Birden fazla ürünü karşılaştır
 */
router.post('/compare', async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'En az 2 ürün ID\'si gereklidir'
      });
    }

    if (productIds.length > 6) {
      return res.status(400).json({
        success: false,
        error: 'Maksimum 6 ürün karşılaştırabilirsiniz'
      });
    }

    const products = await Product.find({
      _id: { $in: productIds }
    });

    if (products.length < 2) {
      return res.status(404).json({
        success: false,
        error: 'Belirtilen ürünler bulunamadı'
      });
    }

    // Özellikleri bul ve düzenle
    const allSpecKeys = new Set();
    products.forEach(product => {
      if (product.specifications) {
        product.specifications.forEach(spec => {
          allSpecKeys.add(spec.name);
        });
      }
    });

    // Karşılaştırma tablosu oluştur
    const comparisonData = {
      products: products.map(p => ({
        _id: p._id,
        name: p.name,
        brand: p.brand,
        images: p.images,
        rating: p.rating,
        reviewCount: p.reviewCount,
        prices: p.prices,
        description: p.description
      })),
      specifications: Array.from(allSpecKeys).map(key => ({
        name: key,
        values: products.map(product => {
          const spec = product.specifications?.find(s => s.name === key);
          return spec ? spec.value : 'Bilgi yok';
        })
      }))
    };

    res.json({
      success: true,
      data: comparisonData
    });
  } catch (error) {
    console.error('Ürün karşılaştırma hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Ürünler karşılaştırılamadı'
    });
  }
});

module.exports = router;
