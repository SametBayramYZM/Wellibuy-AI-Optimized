/**
 * 🔐 COMPLETE SECURITY MIDDLEWARE INTEGRATION EXAMPLE
 * 
 * Use these in your routes for maximum protection
 */

const express = require('express');
const { authenticate, requireRole } = require('./middleware/auth');
const { recaptchaMiddleware } = require('./services/botDetection');
const { enforceAdminMFA } = require('./services/adminMFA');
const { checkTierLimit, tierRateLimiter, authRateLimiter, paymentRateLimiter } = require('./services/tierRateLimiting');
const { geolocationFilter } = require('./services/geolocation');

const router = express.Router();

// ============================================
// EXAMPLE 1: Public Endpoint (No Auth)
// ============================================
router.get('/api/products', 
  tierRateLimiter,              // Rate limit based on user tier
  async (req, res) => {
    // Product listing logic
  }
);

// ============================================
// EXAMPLE 2: Protected Endpoint (Auth Required)
// ============================================
router.get('/api/profile',
  authenticate,                  // JWT authentication required
  async (req, res) => {
    // User profile logic
  }
);

// ============================================
// EXAMPLE 3: Admin Endpoint (Admin + MFA)
// ============================================
router.post('/api/admin/users',
  authenticate,                  // Must be logged in
  requireRole('admin'),          // Must be admin
  enforceAdminMFA,              // Admin must have 2FA enabled
  async (req, res) => {
    // Admin user management logic
  }
);

// ============================================
// EXAMPLE 4: Registration (Bot Protection)
// ============================================
router.post('/api/auth/register',
  authRateLimiter,              // Strict rate limit (5 per 15min)
  recaptchaMiddleware('register'), // Bot detection
  async (req, res) => {
    // Registration logic
  }
);

// ============================================
// EXAMPLE 5: Payment (Tier Limit + Geo Filter)
// ============================================
router.post('/api/payment/checkout',
  authenticate,
  paymentRateLimiter,           // Very strict (10 per hour)
  geolocationFilter,            // Block certain countries
  checkTierLimit('payment', {   // Check user tier
    free: 0,                    // Free users can't pay (upgrade required)
    premium: 1,                 // Premium: feature available
    enterprise: 1               // Enterprise: feature available
  }),
  async (req, res) => {
    // Payment logic
  }
);

// ============================================
// EXAMPLE 6: AI Recommendations (Tier-Based Access)
// ============================================
router.post('/api/ai/recommendations',
  authenticate,
  checkTierLimit('ai_recommendations', {
    free: 10,                   // Free: 10 per day
    premium: 100,               // Premium: 100 per day
    enterprise: -1              // Enterprise: unlimited
  }),
  async (req, res) => {
    // AI recommendation logic
  }
);

module.exports = router;
