const SupportRequest = require('../models/SupportRequest');
const User = require('../models/User');

/**
 * Create a new support request
 * POST /support
 */
exports.createSupportRequest = async (req, res, next) => {
  try {
    const { user_id, email, subject, description, screenshot, contactNumber } = req.body;

    // Verify user exists and get user details
    const user = await User.findOne({ user_id });
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      });
    }

    // Create support request with user_id automatically linked
    const supportRequest = await SupportRequest.create({
      user_id,
      email: email || user.email, // Use provided email or fall back to user's email
      subject,
      description,
      screenshot,
      contactNumber,
    });

    res.status(201).json({
      message: 'Support request submitted successfully',
      data: supportRequest,
    });
  } catch (error) {
    console.error('Create support request error:', error);
    next(error);
  }
};

/**
 * Get all support requests
 * GET /support
 */
exports.getAllSupportRequests = async (req, res, next) => {
  try {
    const supportRequests = await SupportRequest.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: supportRequests.length,
      data: supportRequests,
    });
  } catch (error) {
    console.error('Get all support requests error:', error);
    next(error);
  }
};

/**
 * Get a single support request by ID
 * GET /support/:id
 */
exports.getSupportRequestById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const supportRequest = await SupportRequest.findById(id);

    if (!supportRequest) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Support request not found',
        error: 'Not Found',
      });
    }

    res.status(200).json({
      data: supportRequest,
    });
  } catch (error) {
    console.error('Get support request error:', error);
    next(error);
  }
};

/**
 * Get all support requests for a specific user
 * GET /support/user/:user_id
 */
exports.getSupportRequestsByUserId = async (req, res, next) => {
  try {
    const { user_id } = req.params;

    // Verify user exists
    const user = await User.findOne({ user_id });
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      });
    }

    const supportRequests = await SupportRequest.find({ user_id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: supportRequests.length,
      data: supportRequests,
    });
  } catch (error) {
    console.error('Get user support requests error:', error);
    next(error);
  }
};
