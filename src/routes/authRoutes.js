const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');
const { validate } = require('../middleware/validator');
const { handleCORS } = require('../middleware/cors');

// Helper middleware untuk CORS
const corsOptions = {
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Handle OPTIONS request untuk /signup
router.options('/signup', handleCORS(corsOptions));

// Endpoint signup dengan validasi
router.post('/signup', 
  handleCORS(corsOptions),
  [
    check('username')
      .notEmpty().withMessage('Username is required')
      .isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    check('email')
      .isEmail().withMessage('Valid email is required')
      .normalizeEmail(),
    check('password')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
      .matches(/[0-9]/).withMessage('Password must contain a number')
      .matches(/[a-zA-Z]/).withMessage('Password must contain a letter')
  ],
  validate,
  authController.register
);

// Handle OPTIONS request untuk /signin
router.options('/signin', handleCORS(corsOptions));

// Endpoint signin dengan validasi
router.post('/signin',
  handleCORS(corsOptions),
  [
    check('email')
      .isEmail().withMessage('Valid email is required')
      .normalizeEmail(),
    check('password')
      .notEmpty().withMessage('Password is required')
  ],
  validate,
  authController.login
);

module.exports = router;