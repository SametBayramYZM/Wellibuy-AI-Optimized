/**
 * Comment/Review Routes
 */

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Models
let Comment, Product, User;
try {
  Comment = mongoose.model('Comment');
} catch {
  const CommentSchema = require('./schemas/comment');
  Comment = mongoose.model('Comment', CommentSchema);
}

try {
  Product = mongoose.model('Product');
} catch {
  const ProductSchema = require('./schemas/product');
  Product = mongoose.model('Product', ProductSchema);
}

try {
  User = mongoose.model('User');
} catch {
  const UserSchema = require('./schemas/user');
  User = mongoose.model('User', UserSchema);
}

// Middleware - Check if user is authenticated
const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token gereklidir' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Geçersiz token' });
  }
};

// POST /api/comments - Yorum ekle
router.post('/', authenticate, async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;

    // Validation
    if (!productId || !rating || !title || !comment) {
      return res.status(400).json({ error: 'Tüm alanlar zorunludur' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Puan 1-5 arasında olmalı' });
    }

    if (comment.length < 10 || comment.length > 2000) {
      return res.status(400).json({ error: 'Yorum 10-2000 karakter arasında olmalı' });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Ürün bulunamadı' });
    }

    // Check if user already commented
    const existingComment = await Comment.findOne({
      productId: productId,
      userId: req.user.id
    });

    if (existingComment) {
      return res.status(400).json({ error: 'Bu ürün için zaten yorum yaptınız' });
    }

    // Get user info
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    // Create comment
    const newComment = new Comment({
      productId,
      userId: req.user.id,
      userName: user.getFullName(),
      rating,
      title,
      comment,
      verified: false,
      isApproved: true
    });

    await newComment.save();

    // Update product rating
    const comments = await Comment.find({ productId });
    const avgRating = comments.reduce((sum, c) => sum + c.rating, 0) / comments.length;
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: comments.length
    });

    res.status(201).json({
      success: true,
      message: 'Yorum başarıyla eklendi',
      data: newComment
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Yorum eklenirken hata oluştu' });
  }
});

// GET /api/comments - Tüm yorumları getir (Sayfalı - Admin panel için)
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const comments = await Comment.find()
      .populate('userId', 'firstName lastName')
      .populate('productId', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Comment.countDocuments();

    res.json({
      success: true,
      data: comments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all comments error:', error);
    res.status(500).json({ error: 'Yorumlar alınamadı' });
  }
});

// GET /api/comments/:productId - Ürün yorumlarını getir
router.get('/:productId', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const comments = await Comment.find({ productId: req.params.productId, isApproved: true })
      .populate('userId', 'firstName lastName')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Comment.countDocuments({
      productId: req.params.productId,
      isApproved: true
    });

    res.json({
      success: true,
      data: comments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Yorumlar alınamadı' });
  }
});

// PUT /api/comments/:commentId - Yorum güncelle (sadece yazarı)
router.put('/:commentId', authenticate, async (req, res) => {
  try {
    const { rating, title, comment } = req.body;

    const existingComment = await Comment.findById(req.params.commentId);
    if (!existingComment) {
      return res.status(404).json({ error: 'Yorum bulunamadı' });
    }

    // Check ownership
    if (existingComment.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Bu yorum üzerinde işlem yapamezsiniz' });
    }

    // Update comment
    existingComment.rating = rating || existingComment.rating;
    existingComment.title = title || existingComment.title;
    existingComment.comment = comment || existingComment.comment;
    existingComment.updatedAt = new Date();

    await existingComment.save();

    // Update product rating
    const comments = await Comment.find({ productId: existingComment.productId });
    const avgRating = comments.reduce((sum, c) => sum + c.rating, 0) / comments.length;
    await Product.findByIdAndUpdate(existingComment.productId, {
      rating: Math.round(avgRating * 10) / 10
    });

    res.json({ success: true, message: 'Yorum güncellendi', data: existingComment });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ error: 'Yorum güncellenirken hata oluştu' });
  }
});

// DELETE /api/comments/:commentId - Yorum sil (yazarı veya admin)
router.delete('/:commentId', authenticate, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Yorum bulunamadı' });
    }

    // Check if user is owner or admin
    const user = await User.findById(req.user.id);
    if (comment.userId.toString() !== req.user.id && user.role !== 'admin') {
      return res.status(403).json({ error: 'Bu yorum üzerinde işlem yapamezsiniz' });
    }

    const productId = comment.productId;
    await Comment.findByIdAndDelete(req.params.commentId);

    // Update product rating
    const comments = await Comment.find({ productId });
    if (comments.length > 0) {
      const avgRating = comments.reduce((sum, c) => sum + c.rating, 0) / comments.length;
      await Product.findByIdAndUpdate(productId, {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: comments.length
      });
    } else {
      await Product.findByIdAndUpdate(productId, {
        rating: 0,
        reviewCount: 0
      });
    }

    res.json({ success: true, message: 'Yorum silindi' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Yorum silinemedi' });
  }
});

module.exports = router;
