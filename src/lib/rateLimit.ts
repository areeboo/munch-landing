// Rate limiting - like a bouncer at a popular club
// Prevents spam attacks and keeps your app running smoothly

type RateLimitStore = {
  [key: string]: {
    count: number;
    resetTime: number;
  };
};

// In-memory storage (for simple use cases)
// For production scaling, you'd use Redis instead
const store: RateLimitStore = {};

// Clean up old entries every 5 minutes (garbage collection)
setInterval(() => {
  const now = Date.now();
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  }
}, 5 * 60 * 1000);

export function rateLimit(
  identifier: string, // Usually IP address or user ID
  maxRequests: number = 10, // How many requests allowed
  windowMs: number = 60 * 1000 // Time window (default: 1 minute)
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = identifier;
  
  // Get or create rate limit info for this identifier
  if (!store[key] || store[key].resetTime < now) {
    // First request or window expired - reset the counter
    store[key] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return {
      success: true,
      remaining: maxRequests - 1,
      resetTime: store[key].resetTime,
    };
  }

  // Check if they've hit the limit
  if (store[key].count >= maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: store[key].resetTime,
    };
  }

  // Increment counter
  store[key].count++;

  return {
    success: true,
    remaining: maxRequests - store[key].count,
    resetTime: store[key].resetTime,
  };
}

// Helper to get client IP address
export function getClientIP(request: Request): string {
  // Check various headers that might contain the real IP
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  return request.headers.get('x-real-ip') || 
         request.headers.get('cf-connecting-ip') || 
         'unknown';
}