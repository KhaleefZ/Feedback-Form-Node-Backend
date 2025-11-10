/**
 * Global error handling middleware
 * Handles all errors and sends consistent error responses
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(error => error.message);
    return res.status(400).json({
      statusCode: 400,
      message: messages,
      error: 'Validation Error',
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      statusCode: 409,
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
      error: 'Duplicate Entry',
    });
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      statusCode: 400,
      message: 'Invalid ID format',
      error: 'Bad Request',
    });
  }

  // Default error response
  res.status(err.statusCode || 500).json({
    statusCode: err.statusCode || 500,
    message: err.message || 'Internal Server Error',
    error: err.name || 'Error',
  });
};

module.exports = errorHandler;
