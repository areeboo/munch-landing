// Centralized configuration - like having one control panel for your entire app
// Makes it easy to change settings without hunting through code files

import { env } from "./env";

// App-wide configuration object
export const config = {
  // Database settings
  database: {
    name: env.MONGODB_DB || "munch",
    connectionPool: {
      development: { min: 5, max: 10 },
      production: { min: 10, max: 20 }
    },
    timeouts: {
      server: 5000, // 5 seconds
      socket: 5000,
      idle: 30000 // 30 seconds
    }
  },

  // Rate limiting settings
  rateLimit: {
    subscribe: {
      requests: 5,
      windowMs: 60 * 1000, // 1 minute
    },
    verifyEmail: {
      requests: 10,
      windowMs: 60 * 1000,
    },
    // For future scaling - different limits for different user types
    premium: {
      requests: 20,
      windowMs: 60 * 1000,
    }
  },

  // Email verification settings
  email: {
    validation: {
      maxLength: 254,
      dnsTimeoutMs: 1000,
    },
    disposableDomainsRefreshMs: 24 * 60 * 60 * 1000, // 24 hours
  },

  // Security settings
  security: {
    cors: {
      allowedOrigins: process.env.NODE_ENV === 'production' 
        ? ['https://themunch.news', 'https://www.themunch.news'] 
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
      allowedMethods: ['POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    },
    headers: {
      // Security headers for production
      contentSecurityPolicy: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
      xFrameOptions: "DENY",
      xContentTypeOptions: "nosniff",
    }
  },

  // Application settings
  app: {
    name: "The Munch",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    debug: process.env.NODE_ENV !== "production",
    
    // Feature flags for gradual rollout
    features: {
      emailVerification: true,
      profileCollection: true,
      utmTracking: true,
      advancedAnalytics: process.env.ENABLE_ANALYTICS === "true",
      premiumFeatures: process.env.ENABLE_PREMIUM === "true",
    },

    // Subscription settings
    subscription: {
      defaultSource: "landing",
      maxProfileLength: 100,
      maxUtmLength: 200,
      maxSourceLength: 50,
    }
  },

  // Logging and monitoring
  logging: {
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "warn" : "info"),
    enableErrorTracking: process.env.NODE_ENV === "production",
    enablePerformanceMonitoring: process.env.ENABLE_MONITORING === "true",
  },

  // External services (for future use)
  services: {
    // Placeholder for future integrations
    analytics: {
      enabled: process.env.ANALYTICS_ENABLED === "true",
      provider: process.env.ANALYTICS_PROVIDER || "none",
    },
    email: {
      provider: process.env.EMAIL_PROVIDER || "none",
      fromAddress: process.env.FROM_EMAIL || "noreply@themunch.news",
    }
  }
} as const;

// Helper functions for common configuration checks
export const isDevelopment = () => config.app.environment === "development";
export const isProduction = () => config.app.environment === "production";
export const isFeatureEnabled = (feature: keyof typeof config.app.features) => 
  config.app.features[feature];

// Get rate limit config for a specific endpoint
export const getRateLimit = (endpoint: keyof typeof config.rateLimit) => 
  config.rateLimit[endpoint];

// Get database pool settings for current environment
export const getDbPoolConfig = () => 
  config.database.connectionPool[isProduction() ? "production" : "development"];

// Validation helper - ensures config makes sense
export function validateConfig() {
  const errors: string[] = [];

  // Check required environment-specific settings
  if (isProduction()) {
    if (!env.MONGODB_URI.includes("mongodb.net") && !env.MONGODB_URI.includes("mongodb.com")) {
      console.warn("⚠️  Production MongoDB URI doesn't appear to be from Atlas or MongoDB Cloud");
    }
  }

  // Validate rate limits are reasonable
  Object.entries(config.rateLimit).forEach(([key, limit]) => {
    if (limit.requests < 1 || limit.requests > 100) {
      errors.push(`Rate limit for ${key} should be between 1-100 requests`);
    }
  });

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
  }

  return true;
}

// Initialize configuration (run this once at startup)
validateConfig();

export default config;