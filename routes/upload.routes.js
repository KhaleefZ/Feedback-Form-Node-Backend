const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');

/**
 * POST /upload
 * Upload a file
 */
router.post('/', uploadController.uploadFile);

/**
 * DELETE /upload/:filename
 * Delete a file
 */
router.delete('/:filename', uploadController.deleteFile);

module.exports = router;
