/**
 * YORUM/REVIEW VERİTABANI ŞEMASI (Mongoose için)
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Ürün ID zorunludur'],
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Kullanıcı ID zorunludur']
    },
    userName: {
      type: String,
      required: true,
      trim: true
    },
    rating: {
      type: Number,
      required: [true, 'Puan zorunludur'],
      min: 1,
      max: 5
    },
    title: {
      type: String,
      required: [true, 'Başlık zorunludur'],
      trim: true,
      maxlength: 100
    },
    comment: {
      type: String,
      required: [true, 'Yorum zorunludur'],
      trim: true,
      minlength: 10,
      maxlength: 2000
    },
    verified: {
      type: Boolean,
      default: false // Sadece ürünü satın alanlar verified olacak
    },
    helpful: {
      type: Number,
      default: 0
    },
    unhelpful: {
      type: Number,
      default: 0
    },
    isApproved: {
      type: Boolean,
      default: true // Admin tarafından onaylanması gerekebilir
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true, collection: 'comments' }
);

// Index for product comments
CommentSchema.index({ productId: 1, createdAt: -1 });

module.exports = CommentSchema;
