const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const profileController = require('../controllers/profile.controller');
const { profileValidation } = require('../middleware/validation');

/**
 * GET /profile
 * Get all public profiles
 */
router.get('/', profileController.getAllProfiles);

/**
 * GET /profile/:user_id
 * Get user profile by user_id
 */
router.get('/:user_id', profileController.getProfile);

/**
 * POST /profile/:user_id
 * Create or update user profile
 */
router.post('/:user_id', profileValidation, profileController.createOrUpdateProfile);

/**
 * POST /profile/:user_id/photo
 * Upload profile photo
 */
router.post('/:user_id/photo', [
  body('photoUrl').notEmpty().withMessage('Photo URL is required').isString(),
], profileController.uploadProfilePhoto);

/**
 * DELETE /profile/:user_id/photo
 * Delete profile photo
 */
router.delete('/:user_id/photo', profileController.deleteProfilePhoto);

/**
 * GET /profile/:user_id/share
 * Get shareable profile
 */
router.get('/:user_id/share', profileController.shareProfile);

module.exports = router;
