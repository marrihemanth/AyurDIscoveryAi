const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Mock user storage (in production, use a database)
const users = new Map();

// Middleware to verify Auth0 token (simplified for demo)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  // In production, verify the JWT token with Auth0
  // For now, we'll just pass through
  req.user = { sub: 'demo-user-id' }; // Mock user ID
  next();
};

// Validation middleware for user profile
const validateUserProfile = [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('role').isIn(['researcher', 'practitioner', 'student']).withMessage('Invalid role'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('name').notEmpty().withMessage('Name is required')
];

// Update user profile
router.put('/profile', authenticateToken, validateUserProfile, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { userId, role, email, name } = req.body;

    // Store user profile (in production, save to database)
    users.set(userId, {
      userId,
      role,
      email,
      name,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log(`✅ User profile updated: ${name} (${role})`);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        userId,
        role,
        email,
        name
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

// Get user profile
router.get('/profile/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = users.get(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
});

module.exports = router;