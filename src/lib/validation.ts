// Request validation - like having a strict bouncer check IDs
// Makes sure data coming into your API is exactly what you expect

import { NextResponse } from "next/server";

// Email validation schema
interface SubscribeRequest {
  email: string;
  profile?: string;
  utm?: string;
  source?: string;
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

  const { email, profile, utm, source } = data;

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

  return {
    valid: true,
    data: {
      email: email.toLowerCase().trim(),
      profile: profile?.trim() || undefined,
      utm: utm?.trim() || undefined,
      source: source?.trim() || 'landing',
    }
  };
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