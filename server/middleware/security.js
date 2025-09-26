/**
 * Security utilities for input sanitization and validation
 * Provides additional layers of protection against common attacks
 */

const validator = require('validator');
const DOMPurify = require('isomorphic-dompurify');

// Sanitize HTML content to prevent XSS
const sanitizeHtml = (input) => {
  if (typeof input !== 'string') return input;
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'u'],
    ALLOWED_ATTR: []
  });
};

// Remove potentially dangerous characters
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=\s*['"]/gi, '') // Remove on* event handlers
    .replace(/data:\s*text\/html/gi, ''); // Remove data:text/html
};

// Validate and sanitize query parameters
const validateQuery = (query) => {
  if (!query || typeof query !== 'string') {
    throw new Error('Query must be a non-empty string');
  }

  // Check minimum and maximum length
  if (query.trim().length < 2) {
    throw new Error('Query must be at least 2 characters long');
  }

  if (query.length > 1000) {
    throw new Error('Query must not exceed 1000 characters');
  }

  // Check for potentially malicious patterns
  const maliciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /onload\s*=/gi,
    /onerror\s*=/gi,
    /onclick\s*=/gi
  ];

  for (const pattern of maliciousPatterns) {
    if (pattern.test(query)) {
      throw new Error('Query contains potentially malicious content');
    }
  }

  return sanitizeInput(query);
};

// Validate email format
const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    throw new Error('Email must be a non-empty string');
  }

  if (!validator.isEmail(email)) {
    throw new Error('Invalid email format');
  }

  return validator.normalizeEmail(email);
};

// Validate and sanitize text input
const validateText = (text, minLength = 1, maxLength = 500) => {
  if (!text || typeof text !== 'string') {
    throw new Error('Text must be a non-empty string');
  }

  const trimmed = text.trim();
  
  if (trimmed.length < minLength) {
    throw new Error(`Text must be at least ${minLength} characters long`);
  }

  if (trimmed.length > maxLength) {
    throw new Error(`Text must not exceed ${maxLength} characters`);
  }

  return sanitizeHtml(trimmed);
};

// Check for SQL injection patterns
const checkSqlInjection = (input) => {
  if (typeof input !== 'string') return false;
  
  const sqlPatterns = [
    /(\b(select|insert|update|delete|drop|create|alter|exec|execute|union|script)\b)/gi,
    /('|(\\'))|((\-\-)|(\#)|(\;)|(\|)|(\*)|(\%)|(\?))|(or\s+1\s*=\s*1)|(and\s+1\s*=\s*1)/gi,
    /((\+|\%2B).*(\+|\%2B))|(\+.*=.*\+)|(\%2B.*=.*\%2B)/gi
  ];

  return sqlPatterns.some(pattern => pattern.test(input));
};

// Security headers for responses
const securityHeaders = (req, res, next) => {
  // Content Security Policy
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://apis.google.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://api.openai.com https://bedrock.us-east-1.amazonaws.com; " +
    "frame-ancestors 'none'"
  );

  // Additional security headers (complementing Helmet)
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  next();
};

// Request sanitization middleware
const sanitizeRequest = (req, res, next) => {
  try {
    // Sanitize body parameters
    if (req.body && typeof req.body === 'object') {
      for (const key in req.body) {
        if (typeof req.body[key] === 'string') {
          req.body[key] = sanitizeInput(req.body[key]);
          
          // Check for SQL injection attempts
          if (checkSqlInjection(req.body[key])) {
            console.warn('🚨 Potential SQL injection attempt detected:', {
              ip: req.ip,
              userAgent: req.get('User-Agent'),
              field: key,
              value: req.body[key].substring(0, 100)
            });
            return res.status(400).json({
              success: false,
              error: 'Invalid input detected',
              code: 'MALICIOUS_INPUT'
            });
          }
        }
      }
    }

    // Sanitize query parameters
    if (req.query && typeof req.query === 'object') {
      for (const key in req.query) {
        if (typeof req.query[key] === 'string') {
          req.query[key] = sanitizeInput(req.query[key]);
        }
      }
    }

    next();
  } catch (error) {
    console.error('🚨 Request sanitization error:', error);
    return res.status(400).json({
      success: false,
      error: 'Request validation failed',
      code: 'VALIDATION_ERROR'
    });
  }
};

module.exports = {
  sanitizeHtml,
  sanitizeInput,
  validateQuery,
  validateEmail,
  validateText,
  checkSqlInjection,
  securityHeaders,
  sanitizeRequest
};