const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  validateRegister,
  validateLogin,
  validateProfile,
  validateForgot,
  validateReset
} = require('../validations/authValidator');
const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  getNotifications,
  markNotificationRead,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.get('/me', protect, getProfile);
router.put('/profile', protect, validateProfile, updateProfile);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/:id', protect, markNotificationRead);

// Forgot & Reset Password Flow routes
router.post('/forgot-password', validateForgot, forgotPassword);
router.post('/reset-password/:token', validateReset, resetPassword);

module.exports = router;
