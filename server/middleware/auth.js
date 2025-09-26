const jwt = require('jsonwebtoken');

/**
 * Security middleware for JWT token verification
 * Provides robust authentication for production deployment
 */

// Generate JWT token
const generateToken = (user) => {
  const payload = {
    sub: user.uid || user.id,
    email: user.email,
    role: user.role || 'user',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: 'HS256',
    issuer: 'ayurdiscovery-ai',
    audience: 'ayurdiscovery-ai-client'
  });
};

// Verify JWT token middleware
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required',
        code: 'NO_TOKEN'
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'ayurdiscovery-ai',
      audience: 'ayurdiscovery-ai-client',
      algorithms: ['HS256']
    }, (err, decoded) => {
      if (err) {
        console.warn('🚨 JWT verification failed:', err.message);
        
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({
            success: false,
            error: 'Token expired',
            code: 'TOKEN_EXPIRED'
          });
        }
        
        if (err.name === 'JsonWebTokenError') {
          return res.status(401).json({
            success: false,
            error: 'Invalid token',
            code: 'INVALID_TOKEN'
          });
        }

        return res.status(401).json({
          success: false,
          error: 'Token verification failed',
          code: 'VERIFICATION_FAILED'
        });
      }

      // Add user info to request object
      req.user = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
        tokenIssuedAt: decoded.iat,
        tokenExpiresAt: decoded.exp
      };

      console.log(`✅ User authenticated: ${decoded.email} (${decoded.role})`);
      next();
    });

  } catch (error) {
    console.error('🚨 Authentication middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Authentication service error',
      code: 'AUTH_SERVICE_ERROR'
    });
  }
};

// Optional authentication middleware (for endpoints that work with/without auth)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET, {
    issuer: 'ayurdiscovery-ai',
    audience: 'ayurdiscovery-ai-client',
    algorithms: ['HS256']
  }, (err, decoded) => {
    if (err) {
      console.warn('⚠️ Optional auth failed:', err.message);
      req.user = null;
    } else {
      req.user = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role
      };
    }
    next();
  });
};

// Role-based authorization middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    const userRole = req.user.role || 'user';
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      console.warn(`🚨 Access denied for role: ${userRole}, required: ${allowedRoles.join(', ')}`);
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: allowedRoles,
        current: userRole
      });
    }

    next();
  };
};

module.exports = {
  generateToken,
  verifyToken,
  optionalAuth,
  requireRole
};