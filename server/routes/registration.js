const express = require('express');
const { body, validationResult } = require('express-validator');
const registrationController = require('../controllers/registrationController');
const logger = require('../config/logger');

const router = express.Router();

// Validation middleware
const validateRegistration = [
  // Student Information
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ min: 1, max: 50 }).withMessage('Last name must be between 1 and 50 characters'),
  
  body('dob')
    .notEmpty().withMessage('Date of birth is required')
    .isISO8601().withMessage('Invalid date format. Please use YYYY-MM-DD')
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      const minAgeDate = new Date(today.getFullYear() - 3, today.getMonth(), today.getDate());
      
      if (birthDate > minAgeDate) {
        throw new Error('Student must be at least 3 years old');
      }
      return true;
    }),
  
  body('gender')
    .isIn(['male', 'female', 'other', 'prefer-not-to-say']).withMessage('Invalid gender selection'),
  
  // Contact Information
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
  
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[0-9\-+\s()]{10,15}$/).withMessage('Please enter a valid phone number'),
  
  body('address')
    .trim()
    .notEmpty().withMessage('Address is required')
    .isLength({ min: 10, max: 500 }).withMessage('Address must be between 10 and 500 characters'),
  
  // Academic Information
  body('grade')
    .notEmpty().withMessage('Please select a grade/class'),
  
  // Parent/Guardian Information
  body('parentName')
    .trim()
    .notEmpty().withMessage('Parent/guardian name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  
  body('parentRelation')
    .isIn(['father', 'mother', 'guardian', 'other']).withMessage('Please select a valid relation'),
  
  body('parentPhone')
    .trim()
    .notEmpty().withMessage('Parent/guardian phone number is required')
    .matches(/^[0-9\-+\s()]{10,15}$/).withMessage('Please enter a valid phone number'),
  
  // Additional Information
  body('howDidYouHear')
    .notEmpty().withMessage('Please let us know how you heard about us'),
  
  // Terms and Conditions
  body('termsAgree')
    .equals('true').withMessage('You must agree to the terms and conditions'),
  
  // Custom validation for at least one subject selected
  body('subjects')
    .custom((value) => {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        throw new Error('Please select at least one subject');
      }
      return true;
    }),
  
  // Error handling middleware
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Validation errors in registration form', { errors: errors.array() });
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors.array() 
      });
    }
    next();
  }
];

// Routes
router.post('/submit', validateRegistration, registrationController.submitRegistration);
router.get('/classes', registrationController.getAvailableClasses);

module.exports = router;
