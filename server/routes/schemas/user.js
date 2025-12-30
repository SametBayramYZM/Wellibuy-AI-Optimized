/**
 * USER VERİTABANI ŞEMASI (Mongoose için)
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email zorunludur'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Geçerli email giriniz']
    },
    password: {
      type: String,
      required: [true, 'Şifre zorunludur'],
      minlength: 6,
      select: false // Varsayılan olarak parolayı sorgularda döndürme
    },
    firstName: {
      type: String,
      required: [true, 'Ad zorunludur'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Soyadı zorunludur'],
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true, collection: 'users' }
);

// Password encryption middleware
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Password comparison method
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Get full name
UserSchema.methods.getFullName = function () {
  return `${this.firstName} ${this.lastName}`;
};

module.exports = UserSchema;
