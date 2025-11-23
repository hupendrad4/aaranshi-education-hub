const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');

/**
 * POST /api/registration
 * Submit new registration
 */
router.post('/', registrationController.createRegistration);

/**
 * GET /api/registration
 * Get all registrations (admin)
 */
router.get('/', registrationController.getAllRegistrations);

/**
 * GET /api/registration/:id
 * Get single registration by ID
 */
router.get('/:id', registrationController.getRegistrationById);

/**
 * GET /api/registration/test/email
 * Test email configuration
 */
router.get('/test/email', registrationController.testEmail);

module.exports = router;

