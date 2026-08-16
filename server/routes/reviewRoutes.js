const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createReview,
  getCarReviews
} = require('../controllers/reviewController');

router.post('/', protect, createReview);
router.get('/car/:carId', getCarReviews);

module.exports = router;
