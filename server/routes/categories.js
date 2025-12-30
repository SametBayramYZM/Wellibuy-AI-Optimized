/**
 * KATEGORİ API ROUTE'LARI
 * 
 * Kategori işlemleri:
 * - Tüm kategoriler
 * - Kategoriye göre ürünler
 * - Kategori istatistikleri
 */

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

let Product;
try {
  Product = mongoose.model('Product');
} catch {
  const ProductSchema = require('./schemas/product');
  Product = mongoose.model('Product', ProductSchema);
}

// ============================================
// TÜM KATEGORİLER
// ============================================

/**
 * GET /api/categories
 * Tüm kategorileri ve ürün sayılarını döndür
 */
router.get('/', async (req, res) => {
  try {
    // Kategorilere göre grupla ve say
    const categories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgRating: { $avg: '$rating' }
        }
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          count: 1,
          avgRating: { $round: ['$avgRating', 1] }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Kategori listesi hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Kategoriler alınamadı'
    });
  }
});

// ============================================
// KATEGORİYE GÖRE ÜRÜNLER
// ============================================

/**
 * GET /api/categories/:name/products
 * Belirli bir kategorideki ürünleri listele
 */
router.get('/:name/products', async (req, res) => {
  try {
    const categoryName = req.params.name;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Ürünleri al (case-insensitive arama için regex kullan)
    const products = await Product.find({ 
      category: new RegExp(`^${categoryName}$`, 'i')
    })
      .sort({ rating: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments({ 
      category: new RegExp(`^${categoryName}$`, 'i')
    });

    res.json({
      success: true,
      data: {
        category: categoryName,
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
    console.error('Kategori ürünleri hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Kategori ürünleri alınamadı'
    });
  }
});

// ============================================
// KATEGORİ İSTATİSTİKLERİ
// ============================================

/**
 * GET /api/categories/:name/stats
 * Kategori hakkında detaylı istatistikler
 */
router.get('/:name/stats', async (req, res) => {
  try {
    const categoryName = req.params.name;

    const stats = await Product.aggregate([
      { $match: { category: categoryName } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          avgRating: { $avg: '$rating' },
          minPrice: { $min: { $arrayElemAt: ['$prices.price', 0] } },
          maxPrice: { $max: { $arrayElemAt: ['$prices.price', 0] } },
          avgPrice: { $avg: { $arrayElemAt: ['$prices.price', 0] } },
          brands: { $addToSet: '$brand' }
        }
      },
      {
        $project: {
          _id: 0,
          totalProducts: 1,
          avgRating: { $round: ['$avgRating', 2] },
          minPrice: { $round: ['$minPrice', 2] },
          maxPrice: { $round: ['$maxPrice', 2] },
          avgPrice: { $round: ['$avgPrice', 2] },
          brandCount: { $size: '$brands' }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Kategori bulunamadı'
      });
    }

    res.json({
      success: true,
      data: {
        category: categoryName,
        ...stats[0]
      }
    });
  } catch (error) {
    console.error('Kategori istatistik hatası:', error);
    res.status(500).json({
      success: false,
      error: 'İstatistikler alınamadı'
    });
  }
});

module.exports = router;
