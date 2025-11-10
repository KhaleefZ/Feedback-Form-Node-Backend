const path = require('path');
const fs = require('fs');

/**
 * Upload file
 * POST /upload
 */
exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({
        statusCode: 400,
        message: 'No file uploaded',
        error: 'Bad Request',
      });
    }

    const file = req.files.file;
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        statusCode: 400,
        message: 'Invalid file type. Only JPEG, PNG, and GIF images are allowed',
        error: 'Bad Request',
      });
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        statusCode: 400,
        message: 'File size too large. Maximum size is 5MB',
        error: 'Bad Request',
      });
    }

    // Create uploads directory if it doesn't exist
    const uploadType = req.body.type || 'screenshots'; // 'screenshots' or 'profile-photos'
    const uploadDir = path.join(__dirname, '..', 'uploads', uploadType);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/\s+/g, '_');
    const filename = `${timestamp}_${originalName}`;
    const filepath = path.join(uploadDir, filename);

    // Move file to uploads directory
    await file.mv(filepath);

    // Return the URL with full backend URL
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:3001';
    const fileUrl = `${baseUrl}/uploads/${uploadType}/${filename}`;

    res.status(200).json({
      message: 'File uploaded successfully',
      url: fileUrl,
      filename: filename,
    });
  } catch (error) {
    console.error('Upload file error:', error);
    next(error);
  }
};

/**
 * Delete file
 * DELETE /upload/:filename
 */
exports.deleteFile = async (req, res, next) => {
  try {
    const { filename } = req.params;
    
    const filepath = path.join(__dirname, '..', 'uploads', 'screenshots', filename);
    
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      res.status(200).json({
        message: 'File deleted successfully',
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        message: 'File not found',
        error: 'Not Found',
      });
    }
  } catch (error) {
    console.error('Delete file error:', error);
    next(error);
  }
};
