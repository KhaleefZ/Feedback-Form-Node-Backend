const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { signupValidation, loginValidation } = require('../middleware/validation');

/**
 * POST /auth/signup
 * Register a new user
 */
router.post('/signup', signupValidation, authController.signUp);

/**
 * POST /auth/login
 * Login user
 */
router.post('/login', loginValidation, authController.login);

/**
 * GET /auth/me/:userId
 * Get current user profile
 */
router.get('/me/:userId', authController.getProfile);

module.exports = router;
