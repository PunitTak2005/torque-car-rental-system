const crypto = require('crypto');
const User = require('../models/User');
const Notification = require('../models/Notification');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, phone, password, termsAccepted, termsVersion } = req.body;

    if (termsAccepted !== true && termsAccepted !== 'true') {
      return res.status(400).json({
        success: false,
        message: 'Please accept the Terms & Conditions and Privacy Policy to create your account.'
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      termsAccepted: true,
      termsAcceptedAt: new Date(),
      termsVersion: termsVersion || '1.0'
    });

    if (user) {
      await Notification.create({
        user: user._id,
        title: 'Welcome to Torque!',
        message: 'Thank you for registering. Explore our premium fleet and start booking today!',
        type: 'general'
      });

      res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          profilePhoto: user.profilePhoto,
          termsAccepted: user.termsAccepted,
          termsAcceptedAt: user.termsAcceptedAt,
          termsVersion: user.termsVersion
        },
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail }).select('+password');

    // Auto-seed demo accounts on demand if database is missing demo accounts
    if (!user) {
      if (normalizedEmail === 'punittak2005@gmail.com' || normalizedEmail === 'john@gmail.com') {
        user = await User.create({
          name: normalizedEmail === 'punittak2005@gmail.com' ? 'Punit Tak' : 'John Doe',
          email: normalizedEmail,
          phone: '06367088841',
          password: 'password123',
          role: 'customer',
          termsAccepted: true
        });
        user = await User.findById(user._id).select('+password');
        console.log(`[Auth Demo Seeding]: Initialized demo customer account: ${normalizedEmail}`);
      } else if (normalizedEmail === 'admin@torque.com') {
        user = await User.create({
          name: 'System Administrator',
          email: 'admin@torque.com',
          phone: '9876543210',
          password: 'admin123',
          role: 'admin',
          termsAccepted: true
        });
        user = await User.findById(user._id).select('+password');
        console.log(`[Auth Demo Seeding]: Initialized admin account: admin@torque.com`);
      }
    }

    if (user && (await user.matchPassword(password))) {
      if (user.status === 'suspended') {
        return res.status(403).json({ success: false, message: 'Your account has been suspended' });
      }

      const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePhoto: user.profilePhoto,
        status: user.status
      };

      return res.json({
        success: true,
        user: userData,
        ...userData,
        token: generateToken(user._id)
      });
    } else {
      console.log(`[Auth Failure]: Invalid credentials attempt for email: ${normalizedEmail}`);
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePhoto: user.profilePhoto,
        status: user.status
      };
      res.json({
        success: true,
        user: userData,
        ...userData
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.phone) user.phone = req.body.phone;

    if (req.body.profilePhoto !== undefined) {
      user.profilePhoto = req.body.profilePhoto;
    }

    if (req.body.password && req.body.password.trim().length >= 6) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    const userObj = {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      profilePhoto: updatedUser.profilePhoto
    };

    res.json({
      success: true,
      user: userObj,
      ...userObj,
      token: generateToken(updatedUser._id)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user notifications
// @route   GET /api/auth/notifications
// @access  Private
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, notifications });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/auth/notifications/:id
// @access  Private
const markNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, user: req.user._id });
    if (notification) {
      notification.read = true;
      await notification.save();
      res.json({ success: true, notification });
    } else {
      res.status(404).json({ success: false, message: 'Notification not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Request a password reset link
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email' });
    }

    // Generate random mock token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Set fields on user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    await user.save();

    // Mock link for user response
    const resetUrl = `http://localhost:9002/reset-password/${resetToken}`;
    console.log(`[MOCK EMAIL SENT] Password reset URL: ${resetUrl}`);

    res.json({
      success: true,
      message: 'Password reset email simulated successfully.',
      mockLink: resetUrl
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password using token
// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ success: true, message: 'Password has been reset successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  getNotifications,
  markNotificationRead,
  forgotPassword,
  resetPassword
};
