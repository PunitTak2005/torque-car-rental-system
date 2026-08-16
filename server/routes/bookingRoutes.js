const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  validateCreateBooking,
  validatePayBooking
} = require('../validations/bookingValidator');
const {
  createBooking,
  getUserBookings,
  getBookingDetails,
  payBooking,
  cancelBooking
} = require('../controllers/bookingController');

router.post('/', protect, validateCreateBooking, createBooking);
router.get('/', protect, getUserBookings);
router.get('/:id', protect, getBookingDetails);
router.post('/:id/pay', protect, validatePayBooking, payBooking);
router.post('/:id/cancel', protect, cancelBooking);
router.patch('/:id/cancel', protect, cancelBooking);

module.exports = router;
