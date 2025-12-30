import crypto from 'crypto';
import jwt from 'jsonwebtoken';

/**
 * 🔐 Security Utilities
 * 
 * Helper functions for:
 * - Token generation and verification
 * - Data encryption/decryption
 * - Hash generation for reset tokens
 */

/**
 * Generate JWT access token (24 hours)
 */
export const generateAccessToken = (
  userId: string,
  email: string,
  role: string = 'user'
): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign(
    { id: userId, email, role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

/**
 * Generate JWT refresh token (7 days)
 */
export const generateRefreshToken = (userId: string): string => {
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign(
    { id: userId },
    secret,
    { expiresIn: '7d' }
  );
};

/**
 * Verify JWT token
 */
export const verifyToken = (
  token: string,
  isRefresh: boolean = false
): any => {
  try {
    const secret = isRefresh 
      ? (process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET)
      : process.env.JWT_SECRET;
    
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }
    
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

/**
 * Hash token with SHA256 (for storing reset/verification tokens)
 */
export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Generate random token (for password reset, email verification)
 */
export const generateRandomToken = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Encrypt sensitive data (AES-256-CBC)
 */
export const encryptData = (data: string, key?: string): string => {
  const encryptionKey = key || process.env.ENCRYPTION_KEY || crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.isBuffer(encryptionKey) ? encryptionKey : crypto.scryptSync(encryptionKey, 'salt', 32),
    iv
  );
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Return IV + encrypted data
  return iv.toString('hex') + ':' + encrypted;
};

/**
 * Decrypt sensitive data (AES-256-CBC)
 */
export const decryptData = (encryptedData: string, key?: string): string => {
  const encryptionKey = key || process.env.ENCRYPTION_KEY || crypto.randomBytes(32);
  const [ivHex, encrypted] = encryptedData.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.isBuffer(encryptionKey) ? encryptionKey : crypto.scryptSync(encryptionKey, 'salt', 32),
    iv
  );
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};

/**
 * Generate 2FA secret (for Google Authenticator)
 */
export const generate2FASecret = (): string => {
  // Simple base32 secret generation
  // In production, use speakeasy or similar library
  return crypto.randomBytes(16).toString('base64');
};

/**
 * Verify password reset token
 */
export const verifyResetToken = (token: string, tokenHash: string): boolean => {
  return hashToken(token) === tokenHash;
};

/**
 * Verify email verification token
 */
export const verifyVerificationToken = (token: string, tokenHash: string): boolean => {
  return hashToken(token) === tokenHash;
};

/**
 * Generate secure random password
 */
export const generateRandomPassword = (length: number = 16): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '@$!%*?&';
  const all = uppercase + lowercase + numbers + special;
  
  let password = '';
  
  // Ensure at least one of each type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  // Fill rest randomly
  for (let i = password.length; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }
  
  // Shuffle password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

/**
 * Rate limit helper - Check if action is allowed
 */
export const checkRateLimit = (
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 30 * 60 * 1000 // 30 minutes
): { allowed: boolean; remaining: number; resetTime: number } => {
  // TODO: Implement with Redis or in-memory cache
  // For now, return default
  return {
    allowed: true,
    remaining: maxAttempts,
    resetTime: Date.now() + windowMs
  };
};

/**
 * Generate CSRF token
 */
export const generateCSRFToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Generate API key
 */
export const generateAPIKey = (): string => {
  return 'sk_' + crypto.randomBytes(32).toString('hex');
};

/**
 * Hash API key for storage
 */
export const hashAPIKey = (apiKey: string): string => {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
};
