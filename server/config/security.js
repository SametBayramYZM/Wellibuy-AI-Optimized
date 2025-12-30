/**
 * GÜVENLİK AYARLARI
 * 
 * Hassas güvenlik konfigürasyonları burada tutulur
 */

module.exports = {
  // ============================================
  // CORS AYARLARI
  // ============================================
  cors: {
    allowedOrigins: [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.FRONTEND_URL || ''
    ].filter(Boolean),
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400 // 24 saat
  },

  // ============================================
  // RATE LIMITING
  // ============================================
  rateLimiting: {
    default: {
      windowMs: 15 * 60 * 1000, // 15 dakika
      max: 100, // 100 istek
      message: 'Çok fazla istek, lütfen daha sonra tekrar deneyin.'
    },
    strict: {
      windowMs: 15 * 60 * 1000, // 15 dakika
      max: 5, // 5 istek
      message: 'Çok fazla deneme, lütfen 15 dakika sonra tekrar deneyin.'
    },
    search: {
      windowMs: 60 * 1000, // 1 dakika
      max: 30, // 30 istek/dakika
      message: 'Arama sınırına ulaşıldı.'
    },
    api: {
      windowMs: 60 * 1000, // 1 dakika
      max: 60, // 60 istek/dakika
      message: 'API sınırına ulaşıldı.'
    }
  },

  // ============================================
  // PASSWORD POLİCYSİ
  // ============================================
  passwordPolicy: {
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    errorMessage: 'Şifre en az 8 karakter, 1 büyük harf, 1 küçük harf, 1 rakam ve 1 özel karakter içermelidir.'
  },

  // ============================================
  // SESSION AYARLARI
  // ============================================
  session: {
    name: 'wellibuy_session',
    secret: process.env.SESSION_SECRET || 'change-this-in-production',
    cookie: {
      secure: process.env.NODE_ENV === 'production', // HTTPS sadece
      httpOnly: true, // JavaScript erişimine kapalı
      sameSite: 'Strict', // CSRF koruması
      maxAge: 24 * 60 * 60 * 1000 // 24 saat
    },
    resave: false,
    saveUninitialized: false
  },

  // ============================================
  // JWT AYARLARI
  // ============================================
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '24h',
    refreshExpiresIn: '7d'
  },

  // ============================================
  // REQUEST BODY LİMİTLERİ
  // ============================================
  bodyLimits: {
    json: '10mb', // JSON istek boyutu
    urlencoded: '10mb', // URL-encoded istek boyutu
    raw: '10mb' // Raw istek boyutu
  },

  // ============================================
  // İZİN VERİLEN FİLE TYPELERİ
  // ============================================
  allowedFileTypes: {
    image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    document: ['application/pdf', 'application/msword'],
    maxSize: 5 * 1024 * 1024 // 5MB
  },

  // ============================================
  // HELMET AYARLARI
  // ============================================
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https:'],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      }
    },
    frameguard: { action: 'deny' },
    nosniff: true,
    xssFilter: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts: {
      maxAge: 31536000, // 1 yıl
      includeSubDomains: true,
      preload: true
    }
  },

  // ============================================
  // VERİTABANı GÜVENLİĞİ
  // ============================================
  database: {
    mongooseOptions: {
      ssl: true, // SSL bağlantı
      retryWrites: true,
      w: 'majority'
    },
    collectionCaps: {
      accessLogs: 10 * 1024 * 1024 // 10MB - Otomatik siler
    }
  },

  // ============================================
  // LOGGING (GÜVENLİK EVENTLERİ)
  // ============================================
  logging: {
    logFailedLogins: true,
    logSuspiciousActivity: true,
    logDataAccess: true,
    retentionDays: 90 // 90 gün log tut
  },

  // ============================================
  // DDOS KORUMASI
  // ============================================
  ddosProtection: {
    trustProxy: process.env.TRUST_PROXY === 'true',
    cloudflareEnabled: process.env.CLOUDFLARE_ENABLED === 'true'
  }
};
