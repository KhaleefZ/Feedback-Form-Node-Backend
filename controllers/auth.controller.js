const bcrypt = require('bcrypt');
const User = require('../models/User');

/**
 * Sign up a new user
 * POST /auth/signup
 */
exports.signUp = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        statusCode: 409,
        message: 'Email already registered. Please login.',
        error: 'Conflict',
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    // Return response without password
    res.status(201).json({
      message: 'Registration successful! Please login.',
      user: {
        id: newUser._id,
        user_id: newUser.user_id,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error('Sign up error:', error);
    next(error);
  }
};

/**
 * Login user with email and password
 * POST /auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        statusCode: 401,
        message: 'Invalid email or password',
        error: 'Unauthorized',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        statusCode: 401,
        message: 'Account is deactivated. Please contact support.',
        error: 'Unauthorized',
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        statusCode: 401,
        message: 'Invalid email or password',
        error: 'Unauthorized',
      });
    }

    // Return user without password
    res.status(200).json({
      message: 'Login successful!',
      user: {
        id: user._id,
        user_id: user.user_id,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};

/**
 * Get user profile by ID
 * GET /auth/me/:userId
 */
exports.getProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Find user by ID
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      });
    }

    // Return only email from user profile
    res.status(200).json({
      user: {
        id: user._id,
        user_id: user.user_id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    next(error);
  }
};
