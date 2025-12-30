/**
 * Authentication Routes
 * Register, Login, Logout
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = '24h';

// Security check
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  console.error('❌ SECURITY WARNING: JWT_SECRET must be at least 32 characters long');
  process.exit(1);
}

// User Model
let User;
try {
  User = mongoose.model('User');
  console.log('✅ User model already loaded');
} catch (err) {
  console.log('📦 Creating User model from schema...');
  const UserSchema = require('./schemas/user');
  User = mongoose.model('User', UserSchema);
  console.log('✅ User model created');
}

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Tüm alanlar zorunludur' });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({ error: 'Şifre en az 6 karakterli olmalı' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'Bu email zaten kayıtlı' });
    }

    // Create user
    const user = new User({
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      role: 'user',
      isActive: true
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    res.status(201).json({
      success: true,
      message: 'Kayıt başarılı',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    // Validation error'ları yakalayalım
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    res.status(500).json({ error: error.message || 'Kayıt işlemi başarısız' });
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', async (req, res) => {
  try {
    console.log('🔐 Login attempt:', req.body.email);
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email ve şifre gereklidir' });
    }

    // Find user
    console.log('🔍 Searching for user:', email);
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ error: 'Geçersiz email veya şifre' });
    }

    console.log('✅ User found, checking password...');

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ error: 'Hesap deaktif edilmiştir' });
    }

    // Check password
    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      console.log('❌ Password mismatch');
      return res.status(401).json({ error: 'Geçersiz email veya şifre' });
    }

    console.log('✅ Password matched');

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    console.log('✅ Token generated');

    res.json({
      success: true,
      message: 'Giriş başarılı',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: error.message || 'Giriş işlemi başarısız' });
  }
});

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post('/logout', (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
});

module.exports = router;

