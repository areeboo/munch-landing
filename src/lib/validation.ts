// Request validation - like having a strict bouncer check IDs
// Makes sure data coming into your API is exactly what you expect

import { NextResponse } from "next/server";

// Email validation schema
interface SubscribeRequest {
  email: string;
  profile?: string;
  utm?: string;
  source?: string;
  context?: any;
}

interface VerifyRequest {
  email: string;
}

// Helper to validate email format (more strict than basic regex)
export function isValidEmail(email: string): boolean {
  if (typeof email !== "string") return false;
  
  const trimmed = email.trim();
  
  // Basic checks
  if (trimmed.length === 0 || trimmed.length > 254) return false;
  if (trimmed.includes('..') || trimmed.startsWith('.') || trimmed.endsWith('.')) return false;
  
  // Email regex (more comprehensive)
  const emailRegex = /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;
  
  return emailRegex.test(trimmed);
}

// Validate subscribe request
export function validateSubscribeRequest(data: any): { 
  valid: boolean; 
  data?: SubscribeRequest; 
  error?: string 
} {
  // Check if data exists
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'invalid_request_body' };
  }

  const { email, profile, utm, source, context } = data;

  // Email is required and must be valid
  if (!isValidEmail(email)) {
    return { valid: false, error: 'invalid_email' };
  }

  // Optional fields validation
  if (profile !== undefined && (typeof profile !== 'string' || profile.length > 100)) {
    return { valid: false, error: 'invalid_profile' };
  }

  if (utm !== undefined && (typeof utm !== 'string' || utm.length > 200)) {
    return { valid: false, error: 'invalid_utm' };
  }

  if (source !== undefined && (typeof source !== 'string' || source.length > 50)) {
    return { valid: false, error: 'invalid_source' };
  }

  // Optional: context payload (client passive analytics)
  const sanitizedContext = sanitizeContext(context);

  return {
    valid: true,
    data: {
      email: email.toLowerCase().trim(),
      profile: profile?.trim() || undefined,
      utm: utm?.trim() || undefined,
      source: source?.trim() || 'landing',
      context: sanitizedContext,
    }
  };
}

// Sanitize a nested analytics/context object to avoid excessively large or unsafe input
function sanitizeContext(input: any) {
  if (!input || typeof input !== 'object') return undefined;

  const clampStr = (v: any, max = 512) => typeof v === 'string' ? v.slice(0, max) : undefined;
  const clampNum = (v: any) => (typeof v === 'number' && Number.isFinite(v)) ? v : undefined;

  const out: any = {};

  // Client context only; server context is added on the API from headers
  if (input.client && typeof input.client === 'object') {
    const c = input.client;
    out.client = {
      deviceType: clampStr(c.deviceType, 16),
      browser: clampStr(c.browser, 32),
      os: clampStr(c.os, 32),
      timeZone: clampStr(c.timeZone, 64),
      tzOffset: clampNum(c.tzOffset),
      languages: Array.isArray(c.languages) ? c.languages.slice(0, 10).map((x: any) => clampStr(x, 32)).filter(Boolean) : undefined,
      userAgent: clampStr(c.userAgent, 512),
      platform: clampStr(c.platform, 64),
      dnt: clampStr(c.dnt, 8),
      screen: c.screen && typeof c.screen === 'object' ? {
        width: clampNum(c.screen.width),
        height: clampNum(c.screen.height),
        pixelRatio: clampNum(c.screen.pixelRatio),
      } : undefined,
      viewport: c.viewport && typeof c.viewport === 'object' ? {
        width: clampNum(c.viewport.width),
        height: clampNum(c.viewport.height),
      } : undefined,
      deviceMemory: clampNum(c.deviceMemory),
      hardwareConcurrency: clampNum(c.hardwareConcurrency),
      connection: c.connection && typeof c.connection === 'object' ? {
        effectiveType: clampStr(c.connection.effectiveType, 16),
        downlink: clampNum(c.connection.downlink),
        rtt: clampNum(c.connection.rtt),
        saveData: typeof c.connection.saveData === 'boolean' ? c.connection.saveData : undefined,
      } : undefined,
      sessionId: clampStr(c.sessionId, 64),
      session: c.session && typeof c.session === 'object' ? {
        startTs: clampStr(c.session.startTs, 64),
        durationMs: clampNum(c.session.durationMs),
        pageViews: clampNum(c.session.pageViews),
      } : undefined,
      referrer: clampStr(c.referrer, 2048),
      pathHistory: Array.isArray(c.pathHistory) ? c.pathHistory.slice(-50).map((p: any) => ({
        path: clampStr(p?.path, 256),
        ts: clampStr(p?.ts, 64),
      })).filter((p: any) => p.path && p.ts) : undefined,
      firstTouch: c.firstTouch && typeof c.firstTouch === 'object' ? {
        ts: clampStr(c.firstTouch.ts, 64),
        url: clampStr(c.firstTouch.url, 2048),
        referrer: clampStr(c.firstTouch.referrer, 2048),
        utm: c.firstTouch.utm && typeof c.firstTouch.utm === 'object' ? c.firstTouch.utm : undefined,
      } : undefined,
      lastTouch: c.lastTouch && typeof c.lastTouch === 'object' ? {
        ts: clampStr(c.lastTouch.ts, 64),
        url: clampStr(c.lastTouch.url, 2048),
        utm: c.lastTouch.utm && typeof c.lastTouch.utm === 'object' ? c.lastTouch.utm : undefined,
      } : undefined,
      adBlock: typeof c.adBlock === 'boolean' ? c.adBlock : (c.adBlock === null ? null : undefined),
      gclid: clampStr(c.gclid, 64),
      fbclid: clampStr(c.fbclid, 64),
      msclkid: clampStr(c.msclkid, 64),
    };
  }

  return Object.keys(out).length > 0 ? out : undefined;
}

// Validate verify request
export function validateVerifyRequest(data: any): { 
  valid: boolean; 
  data?: VerifyRequest; 
  error?: string 
} {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'invalid_request_body' };
  }

  const { email } = data;

  if (!isValidEmail(email)) {
    return { valid: false, error: 'invalid_email' };
  }

  return {
    valid: true,
    data: { email: email.toLowerCase().trim() }
  };
}

// Helper to create consistent error responses
export function createErrorResponse(error: string, status: number = 400) {
  const errorMessages: Record<string, string> = {
    invalid_request_body: 'Request body is invalid or missing',
    invalid_email: 'Email address is invalid',
    invalid_profile: 'Profile data is too long or invalid',
    invalid_utm: 'UTM data is too long or invalid',
    invalid_source: 'Source data is too long or invalid',
    missing_email: 'Email address is required',
  };

  return NextResponse.json(
    { 
      error, 
      message: errorMessages[error] || 'Validation failed',
      timestamp: new Date().toISOString()
    },
    { status }
  );
}

// CORS helper for API routes
export function setCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}
