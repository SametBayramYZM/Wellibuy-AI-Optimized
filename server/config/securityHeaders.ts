/**
 * 🔐 Security Headers Configuration
 * 
 * Production-ready security headers for comprehensive protection
 */

export const securityHeadersConfig = {
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',

  // XSS Protection (legacy, but still useful)
  'X-XSS-Protection': '1; mode=block',

  // Clickjacking protection
  'X-Frame-Options': 'DENY',

  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Permissions Policy (replaces Feature-Policy)
  'Permissions-Policy':
    'geolocation=(), microphone=(), camera=(), payment=(self), usb=()',

  // Strict Transport Security
  'Strict-Transport-Security':
    'max-age=31536000; includeSubDomains; preload',

  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https:",
    "connect-src 'self' https:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),

  // Expect-CT for certificate transparency
  'Expect-CT':
    'max-age=86400, enforce, report-uri=https://your-domain.com/ct-report',

  // X-Permitted-Cross-Domain-Policies
  'X-Permitted-Cross-Domain-Policies': 'none',

  // Remove X-Powered-By header
  'X-Powered-By': undefined,

  // Public Key Pinning (optional - uncomment with your domain)
  // 'Public-Key-Pins':
  //   'pin-sha256="..."; pin-sha256="..."; max-age=2592000; includeSubDomains',
};

/**
 * Content Security Policy with nonce support for inline scripts
 */
export const cspWithNonce = (nonce: string) => {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://cdn.jsdelivr.net`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https:",
    "connect-src 'self' https:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
};

/**
 * Get all configured security headers
 */
export const getSecurityHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {};

  Object.entries(securityHeadersConfig).forEach(([key, value]) => {
    if (value !== undefined) {
      headers[key] = value;
    }
  });

  return headers;
};
