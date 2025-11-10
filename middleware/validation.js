const { body, validationResult } = require('express-validator');

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      statusCode: 400,
      message: errors.array().map(err => err.msg),
      error: 'Bad Request',
    });
  }
  next();
};

/**
 * Validation rules for user signup
 */
const signupValidation = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors,
];

/**
 * Validation rules for user login
 */
const loginValidation = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string'),
  handleValidationErrors,
];

/**
 * Validation rules for creating support request
 */
const createSupportRequestValidation = [
  body('user_id')
    .notEmpty()
    .withMessage('User ID is required')
    .isString()
    .withMessage('User ID must be a string'),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('subject')
    .notEmpty()
    .withMessage('Subject is required')
    .isString()
    .withMessage('Subject must be a string')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Subject must be between 5 and 100 characters long'),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isString()
    .withMessage('Description must be a string')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters long'),
  body('contactNumber')
    .notEmpty()
    .withMessage('Contact number is required')
    .matches(/^[0-9]{10}$/)
    .withMessage('Contact number must be exactly 10 digits'),
  body('screenshot')
    .optional()
    .isString()
    .withMessage('Screenshot must be a string'),
  handleValidationErrors,
];

/**
 * Validation rules for profile update
 */
const profileValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string')
    .trim(),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('profilePhoto')
    .optional()
    .isString()
    .withMessage('Profile photo must be a valid URL string'),
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Date of birth must be a valid date'),
  body('gender')
    .notEmpty()
    .withMessage('Gender is required')
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Gender must be Male, Female, or Other'),
  body('phoneNumber')
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[0-9]{10}$/)
    .withMessage('Phone number must be exactly 10 digits'),
  body('countryCode')
    .optional()
    .isString()
    .withMessage('Country code must be a string'),
  body('about')
    .notEmpty()
    .withMessage('About section is required')
    .isString()
    .withMessage('About must be a string')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('About section must be between 1 and 500 characters'),
  body('socialMedia.linkedin')
    .optional()
    .custom((value) => {
      if (!value) return true;
      // Accept full URL or just username
      if (value.includes('linkedin.com')) {
        const regex = /^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/[\w-]+\/?$/;
        if (!regex.test(value)) {
          throw new Error('Invalid LinkedIn URL format');
        }
      }
      return true;
    }),
  body('socialMedia.website')
    .optional()
    .custom((value) => {
      if (!value) return true;
      const regex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
      if (!regex.test(value)) {
        throw new Error('Invalid website URL format');
      }
      return true;
    }),
  body('socialMedia.instagram')
    .optional()
    .custom((value) => {
      if (!value) return true;
      // Accept full URL or just username
      if (value.includes('instagram.com')) {
        const regex = /^https?:\/\/(www\.)?instagram\.com\/[\w.-]+\/?$/;
        if (!regex.test(value)) {
          throw new Error('Invalid Instagram URL format');
        }
      } else {
        const regex = /^[\w.-]+$/;
        if (!regex.test(value)) {
          throw new Error('Invalid Instagram username format');
        }
      }
      return true;
    }),
  body('socialMedia.youtube')
    .optional()
    .custom((value) => {
      if (!value) return true;
      // Accept full URL or @username
      if (value.includes('youtube.com')) {
        const regex = /^https?:\/\/(www\.)?youtube\.com\/(c|channel|@)\/[\w-]+\/?$/;
        if (!regex.test(value)) {
          throw new Error('Invalid YouTube URL format');
        }
      } else if (value.startsWith('@')) {
        const regex = /^@[\w-]+$/;
        if (!regex.test(value)) {
          throw new Error('Invalid YouTube handle format');
        }
      }
      return true;
    }),
  body('socialMedia.github')
    .optional()
    .custom((value) => {
      if (!value) return true;
      if (value.includes('github.com')) {
        const regex = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/?$/;
        if (!regex.test(value)) {
          throw new Error('Invalid GitHub URL format');
        }
      } else {
        const regex = /^[\w-]+$/;
        if (!regex.test(value)) {
          throw new Error('Invalid GitHub username format');
        }
      }
      return true;
    }),
  body('socialMedia.twitter')
    .optional()
    .custom((value) => {
      if (!value) return true;
      if (value.includes('twitter.com') || value.includes('x.com')) {
        const regex = /^https?:\/\/(www\.)?(twitter|x)\.com\/[\w]+\/?$/;
        if (!regex.test(value)) {
          throw new Error('Invalid Twitter/X URL format');
        }
      } else {
        const regex = /^@?[\w]+$/;
        if (!regex.test(value)) {
          throw new Error('Invalid Twitter/X username format');
        }
      }
      return true;
    }),
  handleValidationErrors,
];

module.exports = {
  signupValidation,
  loginValidation,
  createSupportRequestValidation,
  profileValidation,
};
