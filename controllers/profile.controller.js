const Profile = require('../models/Profile');
const User = require('../models/User');

/**
 * Get user profile by user_id
 * GET /profile/:user_id
 */
exports.getProfile = async (req, res, next) => {
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

    // Find profile
    let profile = await Profile.findOne({ user_id });

    // If profile doesn't exist, create a default one
    if (!profile) {
      profile = await Profile.create({
        user_id: user.user_id,
        name: user.email.split('@')[0],
        email: user.email,
      });
    }

    res.status(200).json({
      message: 'Profile retrieved successfully',
      data: profile,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    next(error);
  }
};

/**
 * Create or update user profile
 * POST /profile/:user_id
 */
exports.createOrUpdateProfile = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const {
      name,
      email,
      profilePhoto,
      dateOfBirth,
      gender,
      phoneNumber,
      countryCode,
      about,
      socialMedia,
      isPublic,
    } = req.body;

    // Verify user exists
    const user = await User.findOne({ user_id });
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      });
    }

    // Find existing profile or create new
    let profile = await Profile.findOne({ user_id });

    if (profile) {
      // Update existing profile
      profile.name = name || profile.name;
      profile.email = email || profile.email;
      profile.profilePhoto = profilePhoto !== undefined ? profilePhoto : profile.profilePhoto;
      profile.dateOfBirth = dateOfBirth || profile.dateOfBirth;
      profile.gender = gender !== undefined ? gender : profile.gender;
      profile.phoneNumber = phoneNumber !== undefined ? phoneNumber : profile.phoneNumber;
      profile.countryCode = countryCode || profile.countryCode;
      profile.about = about !== undefined ? about : profile.about;
      
      if (socialMedia) {
        profile.socialMedia = {
          linkedin: socialMedia.linkedin !== undefined ? socialMedia.linkedin : profile.socialMedia.linkedin,
          website: socialMedia.website !== undefined ? socialMedia.website : profile.socialMedia.website,
          instagram: socialMedia.instagram !== undefined ? socialMedia.instagram : profile.socialMedia.instagram,
          youtube: socialMedia.youtube !== undefined ? socialMedia.youtube : profile.socialMedia.youtube,
          github: socialMedia.github !== undefined ? socialMedia.github : profile.socialMedia.github,
          twitter: socialMedia.twitter !== undefined ? socialMedia.twitter : profile.socialMedia.twitter,
        };
      }
      
      profile.isPublic = isPublic !== undefined ? isPublic : profile.isPublic;

      await profile.save();

      res.status(200).json({
        message: 'Profile updated successfully',
        data: profile,
      });
    } else {
      // Create new profile
      profile = await Profile.create({
        user_id,
        name: name || user.email.split('@')[0],
        email: email || user.email,
        profilePhoto,
        dateOfBirth,
        gender,
        phoneNumber,
        countryCode: countryCode || '+91',
        about,
        socialMedia: socialMedia || {},
        isPublic: isPublic !== undefined ? isPublic : true,
      });

      res.status(201).json({
        message: 'Profile created successfully',
        data: profile,
      });
    }
  } catch (error) {
    console.error('Create/Update profile error:', error);
    next(error);
  }
};

/**
 * Upload profile photo
 * POST /profile/:user_id/photo
 */
exports.uploadProfilePhoto = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const { photoUrl } = req.body;

    if (!photoUrl) {
      return res.status(400).json({
        statusCode: 400,
        message: 'Photo URL is required',
        error: 'Bad Request',
      });
    }

    // Verify user exists
    const user = await User.findOne({ user_id });
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      });
    }

    // Update profile photo
    let profile = await Profile.findOne({ user_id });
    
    if (!profile) {
      // Create profile if doesn't exist
      profile = await Profile.create({
        user_id,
        name: user.email.split('@')[0],
        email: user.email,
        profilePhoto: photoUrl,
      });
    } else {
      profile.profilePhoto = photoUrl;
      await profile.save();
    }

    res.status(200).json({
      message: 'Profile photo updated successfully',
      data: {
        profilePhoto: profile.profilePhoto,
      },
    });
  } catch (error) {
    console.error('Upload profile photo error:', error);
    next(error);
  }
};

/**
 * Delete profile photo
 * DELETE /profile/:user_id/photo
 */
exports.deleteProfilePhoto = async (req, res, next) => {
  try {
    const { user_id } = req.params;

    const profile = await Profile.findOne({ user_id });
    if (!profile) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Profile not found',
        error: 'Not Found',
      });
    }

    profile.profilePhoto = null;
    await profile.save();

    res.status(200).json({
      message: 'Profile photo deleted successfully',
    });
  } catch (error) {
    console.error('Delete profile photo error:', error);
    next(error);
  }
};

/**
 * Share profile - Get public profile URL
 * GET /profile/:user_id/share
 */
exports.shareProfile = async (req, res, next) => {
  try {
    const { user_id } = req.params;

    const profile = await Profile.findOne({ user_id });
    if (!profile) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Profile not found',
        error: 'Not Found',
      });
    }

    if (!profile.isPublic) {
      return res.status(403).json({
        statusCode: 403,
        message: 'This profile is private and cannot be shared',
        error: 'Forbidden',
      });
    }

    // Generate shareable profile data
    const shareableProfile = {
      user_id: profile.user_id,
      name: profile.name,
      profilePhoto: profile.profilePhoto,
      about: profile.about,
      socialMedia: profile.socialMedia,
      profileCompleteness: profile.profileCompleteness,
    };

    res.status(200).json({
      message: 'Profile ready to share',
      data: shareableProfile,
      shareUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/profile/${user_id}`,
    });
  } catch (error) {
    console.error('Share profile error:', error);
    next(error);
  }
};

/**
 * Get all profiles (Admin only or for listing)
 * GET /profile
 */
exports.getAllProfiles = async (req, res, next) => {
  try {
    const profiles = await Profile.find({ isPublic: true })
      .select('-__v')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: profiles.length,
      data: profiles,
    });
  } catch (error) {
    console.error('Get all profiles error:', error);
    next(error);
  }
};
