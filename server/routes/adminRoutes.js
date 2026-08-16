const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const { validateCar } = require('../validations/carValidator');
const {
  getDashboardStats,
  addCar,
  editCar,
  deleteCar,
  getAllBookings,
  updateBookingStatus,
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  getAllPayments,
  getAllReviews,
  deleteReview
} = require('../controllers/adminController');

// Apply protection & administrative filters
router.use(protect);
router.use(admin);

router.get('/dashboard', getDashboardStats);
router.post('/cars', validateCar, addCar);
router.put('/cars/:id', validateCar, editCar);
router.delete('/cars/:id', deleteCar);
router.get('/bookings', getAllBookings);
router.put('/bookings/:id/status', updateBookingStatus);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/status', updateUserStatus);
router.get('/payments', getAllPayments);
router.get('/reviews', getAllReviews);
router.delete('/reviews/:id', deleteReview);

module.exports = router;
