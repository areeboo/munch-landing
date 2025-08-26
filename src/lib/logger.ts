// Logging system - like having a detailed security camera system for your app
// Helps you debug issues and monitor what's happening in production

import { config } from "./config";

// Log levels (in order of importance)
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
  userId?: string;
  requestId?: string;
}

class Logger {
  private logLevel: LogLevel;
  
  constructor() {
    this.logLevel = config.logging.level as LogLevel;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }

  private formatMessage(entry: LogEntry): string {
    const { level, message, timestamp, metadata, userId, requestId } = entry;
    
    let formattedMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    
    if (userId) formattedMessage += ` | User: ${userId}`;
    if (requestId) formattedMessage += ` | Request: ${requestId}`;
    
    if (metadata && Object.keys(metadata).length > 0) {
      formattedMessage += ` | Data: ${JSON.stringify(metadata)}`;
    }
    
    return formattedMessage;
  }

  private log(level: LogLevel, message: string, metadata?: Record<string, any>, context?: { userId?: string; requestId?: string }) {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      metadata,
      userId: context?.userId,
      requestId: context?.requestId,
    };

    const formattedMessage = this.formatMessage(entry);

    // Console output with colors
    switch (level) {
      case 'debug':
        console.debug(`\x1b[36m${formattedMessage}\x1b[0m`); // Cyan
        break;
      case 'info':
        console.info(`\x1b[32m${formattedMessage}\x1b[0m`); // Green
        break;
      case 'warn':
        console.warn(`\x1b[33m${formattedMessage}\x1b[0m`); // Yellow
        break;
      case 'error':
        console.error(`\x1b[31m${formattedMessage}\x1b[0m`); // Red
        break;
    }

    // In production, you'd also send logs to external service like:
    // - DataDog, Sentry, LogRocket, etc.
    if (config.logging.enableErrorTracking && level === 'error') {
      this.sendToErrorService(entry);
    }
  }

  private sendToErrorService(entry: LogEntry) {
    // Placeholder for external error tracking
    // In real app, you'd use Sentry, Rollbar, or similar:
    /*
    try {
      Sentry.captureException(new Error(entry.message), {
        level: entry.level,
        extra: entry.metadata,
        user: { id: entry.userId },
        tags: { requestId: entry.requestId }
      });
    } catch (err) {
      console.error('Failed to send error to tracking service:', err);
    }
    */
  }

  // Public logging methods
  debug(message: string, metadata?: Record<string, any>, context?: { userId?: string; requestId?: string }) {
    this.log('debug', message, metadata, context);
  }

  info(message: string, metadata?: Record<string, any>, context?: { userId?: string; requestId?: string }) {
    this.log('info', message, metadata, context);
  }

  warn(message: string, metadata?: Record<string, any>, context?: { userId?: string; requestId?: string }) {
    this.log('warn', message, metadata, context);
  }

  error(message: string, metadata?: Record<string, any>, context?: { userId?: string; requestId?: string }) {
    this.log('error', message, metadata, context);
  }

  // Special methods for common scenarios
  apiRequest(method: string, path: string, statusCode: number, duration: number, context?: { userId?: string; requestId?: string }) {
    this.info(`API ${method} ${path} - ${statusCode} (${duration}ms)`, { method, path, statusCode, duration }, context);
  }

  apiError(method: string, path: string, error: Error, context?: { userId?: string; requestId?: string }) {
    this.error(`API ${method} ${path} failed: ${error.message}`, { 
      method, 
      path, 
      error: error.name, 
      stack: error.stack 
    }, context);
  }

  dbOperation(operation: string, collection: string, duration: number, context?: { userId?: string; requestId?: string }) {
    this.debug(`DB ${operation} on ${collection} (${duration}ms)`, { operation, collection, duration }, context);
  }

  rateLimitHit(ip: string, endpoint: string, context?: { userId?: string; requestId?: string }) {
    this.warn(`Rate limit exceeded for ${ip} on ${endpoint}`, { ip, endpoint }, context);
  }

  emailVerification(email: string, result: string, duration: number, context?: { userId?: string; requestId?: string }) {
    this.info(`Email verification for ${email}: ${result} (${duration}ms)`, { email, result, duration }, context);
  }
}

// Create singleton instance
export const logger = new Logger();

// Helper function to generate request IDs
export function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Middleware helper for Next.js API routes
export function createRequestContext(req: Request) {
  const requestId = generateRequestId();
  const method = req.method;
  const url = new URL(req.url);
  const path = url.pathname;
  
  return {
    requestId,
    method,
    path,
    startTime: Date.now(),
    
    // Helper to log this specific request
    log: {
      info: (message: string, metadata?: Record<string, any>) => 
        logger.info(message, metadata, { requestId }),
      warn: (message: string, metadata?: Record<string, any>) => 
        logger.warn(message, metadata, { requestId }),
      error: (message: string, metadata?: Record<string, any>) => 
        logger.error(message, metadata, { requestId }),
    },
    
    // Helper to log request completion
    finish: (statusCode: number) => {
      const duration = Date.now() - Date.now();
      logger.apiRequest(method, path, statusCode, duration, { requestId });
    }
  };
}

export default logger;