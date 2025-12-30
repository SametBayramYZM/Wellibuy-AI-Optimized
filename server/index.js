/**
 * WELLIBUY AI - OPTIMIZED SERVER
 * Ultra-lightweight, secure, production-ready backend
 * 
 * Security Features:
 * ✓ JWT Authentication
 * ✓ bcrypt Password Hashing
 * ✓ Helmet.js Security Headers
 * ✓ Rate Limiting
 * ✓ CORS Protection
 * ✓ Input Validation
 * ✓ NoSQL Injection Prevention
 * ✓ XSS Protection
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const app = express();
const PORT = process.env.PORT || 5001;

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:', 'http:']
    }
  }
}));

// Rate limiting - Prevent brute force
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// Strict rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts
  skipSuccessfulRequests: true
});

// Rate limiting for search/AI endpoints
const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: 'Too many search requests'
});

// CORS - Allow frontend
app.use(cors({
  origin: (process.env.FRONTEND_URL || 'http://localhost:3002'),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // Preflight cache: 24 hours
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// NoSQL injection prevention
app.use(mongoSanitize());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============================================
// DATABASE CONNECTION
// ============================================

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wellibuy';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Wellibuy API is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime()
  });
});

// Import routes
const productRoutes = require('./routes/products');
const aiRoutes = require('./routes/ai');
const categoryRoutes = require('./routes/categories');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const commentRoutes = require('./routes/comments');

// Mount routes
app.use('/api/products', productRoutes);
app.use('/api/ai', searchLimiter, aiRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/comments', commentRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  
  // Security: Don't leak error details in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;
  
  res.status(err.status || 500).json({
    success: false,
    error: message
  });
});

// ============================================
// START SERVER
// ============================================

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   🚀 WELLIBUY AI - OPTIMIZED SERVER       ║
╠════════════════════════════════════════════╣
║   Port: ${PORT}                            ║
║   Environment: ${process.env.NODE_ENV || 'development'}       ║
║   API: http://localhost:${PORT}/api        ║
║   Status: 🟢 Ready                         ║
╚════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⏸️  Shutting down gracefully...');
  server.close(async () => {
    await mongoose.connection.close();
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('💥 Unhandled Rejection:', error);
  process.exit(1);
});

module.exports = app;
