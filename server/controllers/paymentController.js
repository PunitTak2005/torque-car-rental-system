const Payment = require('../models/Payment');

// @desc    Get user's payments
// @route   GET /api/payments
// @access  Private
const getUserPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate({
        path: 'booking',
        populate: { path: 'car', select: 'brand model pricePerDay' }
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, payments });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserPayments
};
