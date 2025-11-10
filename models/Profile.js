const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: [true, 'User ID is required'],
      unique: true,
      ref: 'User',
      index: true,
    },
    // Basic Information
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    profilePhoto: {
      type: String,
      default: null,
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', ''],
      default: '',
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: '',
    },
    countryCode: {
      type: String,
      default: '+91',
    },
    about: {
      type: String,
      maxlength: [500, 'About section cannot exceed 500 characters'],
      default: '',
    },
    // Social Media Links
    socialMedia: {
      linkedin: {
        type: String,
        trim: true,
        default: '',
      },
      website: {
        type: String,
        trim: true,
        default: '',
      },
      instagram: {
        type: String,
        trim: true,
        default: '',
      },
      youtube: {
        type: String,
        trim: true,
        default: '',
      },
      github: {
        type: String,
        trim: true,
        default: '',
      },
      twitter: {
        type: String,
        trim: true,
        default: '',
      },
    },
    // Profile Completeness
    profileCompleteness: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    // Profile Visibility
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Method to calculate profile completeness
profileSchema.methods.calculateCompleteness = function () {
  let completeness = 0;
  const fields = [
    this.name,
    this.email,
    this.profilePhoto,
    this.dateOfBirth,
    this.gender,
    this.phoneNumber,
    this.about,
    this.socialMedia.linkedin,
    this.socialMedia.website,
  ];
  
  const filledFields = fields.filter(field => field && field !== '').length;
  completeness = Math.round((filledFields / fields.length) * 100);
  
  return completeness;
};

// Pre-save hook to update profile completeness
profileSchema.pre('save', function (next) {
  this.profileCompleteness = this.calculateCompleteness();
  next();
});

module.exports = mongoose.model('Profile', profileSchema);
