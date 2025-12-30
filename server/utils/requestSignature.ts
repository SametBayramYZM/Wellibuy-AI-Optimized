import crypto from 'crypto';

/**
 * 🔑 Request Signature Verification Utility
 * 
 * Sign and verify requests using HMAC-SHA256
 * Prevents tampering and ensures request authenticity
 */

/**
 * Generate request signature
 * @param method HTTP method
 * @param path Request path
 * @param body Request body
 * @param secret API secret key
 * @returns HMAC signature
 */
export const generateSignature = (
  method: string,
  path: string,
  body: any,
  secret: string
): string => {
  const bodyStr = body ? JSON.stringify(body) : '';
  const message = `${method}:${path}:${bodyStr}`;

  return crypto.createHmac('sha256', secret).update(message).digest('hex');
};

/**
 * Generate timestamp for request
 * @returns ISO timestamp
 */
export const generateTimestamp = (): string => {
  return new Date().toISOString();
};

/**
 * Verify request signature
 * @param signature Provided signature
 * @param method HTTP method
 * @param path Request path
 * @param body Request body
 * @param secret API secret key
 * @param timestamp Request timestamp
 * @param maxAge Max age in seconds (default: 5 minutes)
 * @returns true if valid
 */
export const verifySignature = (
  signature: string,
  method: string,
  path: string,
  body: any,
  secret: string,
  timestamp: string,
  maxAge: number = 300
): boolean => {
  // Verify timestamp freshness
  const requestTime = new Date(timestamp).getTime();
  const now = Date.now();
  const age = Math.abs(now - requestTime) / 1000;

  if (age > maxAge) {
    console.warn('Request timestamp too old:', age, 'seconds');
    return false;
  }

  // Verify signature
  const expectedSignature = generateSignature(method, path, body, secret);

  // Use timing-safe comparison
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
};

/**
 * Middleware to verify request signatures
 */
export const signatureMiddleware = (secret: string) => {
  return (req: any, res: any, next: any) => {
    // Skip verification for certain paths
    if (
      ['/api/auth/login', '/api/auth/register', '/health'].includes(req.path)
    ) {
      return next();
    }

    try {
      const signature = req.headers['x-signature'];
      const timestamp = req.headers['x-timestamp'];

      if (!signature || !timestamp) {
        return res.status(401).json({
          success: false,
          message: 'Missing signature or timestamp',
        });
      }

      const isValid = verifySignature(
        signature,
        req.method,
        req.path,
        req.body,
        secret,
        timestamp
      );

      if (!isValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid request signature',
        });
      }

      next();
    } catch (err) {
      console.error('Signature verification error:', err);
      res.status(500).json({
        success: false,
        message: 'Signature verification failed',
      });
    }
  };
};
