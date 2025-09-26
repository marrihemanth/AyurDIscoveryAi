const rateLimit = require('express-rate-limit');

// Create rate limiter middleware
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs: windowMs,
    max: max,
    message: {
      success: false,
      error: message || 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
      console.warn(`🚨 Rate limit exceeded for IP: ${req.ip}`);
      res.status(429).json({
        success: false,
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
  });
};

// General API rate limiter - More generous for development
const generalLimiter = createRateLimiter(
  60000,  // 1 minute window
  1000,   // 1000 requests per minute (very generous for dev)
  'Too many requests from this IP, please try again later.'
);

// AI endpoints rate limiter - Generous for development
const aiLimiter = createRateLimiter(
  60000, // 1 minute
  100,   // 100 AI requests per minute (generous for testing)
  'Too many AI requests, please wait before making another request.'
);

// Authentication rate limiter
const authLimiter = createRateLimiter(
  900000, // 15 minutes
  5,      // limit each IP to 5 auth attempts per 15 minutes
  'Too many authentication attempts, please try again later.'
);

module.exports = {
  generalLimiter,
  aiLimiter,
  authLimiter
};