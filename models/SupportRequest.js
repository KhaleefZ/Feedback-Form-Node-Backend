const mongoose = require('mongoose');

const supportRequestSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: [true, 'User ID is required'],
      ref: 'User',
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      minlength: [5, 'Subject must be at least 5 characters long'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [10, 'Description must be at least 10 characters long'],
    },
    screenshot: {
      type: String,
      default: null,
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'resolved', 'closed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SupportRequest', supportRequestSchema);
