/**
 * Admin Routes
 * Kullanıcı yönetimi ve sistem yönetimi
 */

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

// User Model
let User;
try {
  User = mongoose.model('User');
} catch {
  const UserSchema = require('./schemas/user');
  User = mongoose.model('User', UserSchema);
}

// Admin Middleware - Check if user is admin
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

// GET /api/admin/users - Tüm kullanıcıları listele
router.get('/users', isAdmin, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    res.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Kullanıcı listesi alınamadı' });
  }
});

// PUT /api/admin/users/:userId - Kullanıcı güncelle
router.put('/users/:userId', isAdmin, async (req, res) => {
  try {
    const { firstName, lastName, phone, city, country, role, isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      {
        firstName,
        lastName,
        phone,
        city,
        country,
        role: role || undefined,
        isActive: isActive !== undefined ? isActive : undefined
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Kullanıcı güncellenemedi' });
  }
});

// DELETE /api/admin/users/:userId - Kullanıcı sil
router.delete('/users/:userId', isAdmin, async (req, res) => {
  try {
    // Kendi hesabını silemesin diye kontrol
    if (req.user.id === req.params.userId) {
      return res.status(400).json({ error: 'Kendi hesabınızı silemezsiniz' });
    }

    const user = await User.findByIdAndDelete(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    res.json({ success: true, message: 'Kullanıcı silindi' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Kullanıcı silinemedi' });
  }
});

// GET /api/admin/users/:userId - Kullanıcı detayı
router.get('/users/:userId', isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Kullanıcı alınamadı' });
  }
});

// GET /api/admin/stats - Genel istatistikler
router.get('/stats', isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const regularUsers = await User.countDocuments({ role: 'user' });
    const activeUsers = await User.countDocuments({ isActive: true });

    let Product;
    try {
      Product = mongoose.model('Product');
    } catch {
      const ProductSchema = require('./schemas/product');
      Product = mongoose.model('Product', ProductSchema);
    }

    const totalProducts = await Product.countDocuments();

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          admin: adminUsers,
          regular: regularUsers,
          active: activeUsers
        },
        products: {
          total: totalProducts
        }
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'İstatistikler alınamadı' });
  }
});

module.exports = router;
