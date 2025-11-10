const express = require('express');
const router = express.Router();
const supportController = require('../controllers/support.controller');
const { createSupportRequestValidation } = require('../middleware/validation');

/**
 * POST /support
 * Create a new support request
 */
router.post('/', createSupportRequestValidation, supportController.createSupportRequest);

/**
 * GET /support
 * Get all support requests
 */
router.get('/', supportController.getAllSupportRequests);

/**
 * GET /support/user/:user_id
 * Get all support requests for a specific user
 */
router.get('/user/:user_id', supportController.getSupportRequestsByUserId);

/**
 * GET /support/:id
 * Get a single support request by ID
 */
router.get('/:id', supportController.getSupportRequestById);

module.exports = router;
