const Review = require('../models/Review');
const Car = require('../models/Car');
const Booking = require('../models/Booking');

// @desc    Create a review for a car or completed rental
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res, next) => {
  try {
    const { carId, bookingId, rating, comment } = req.body;
    let targetCarId = carId;

    if (bookingId) {
      const booking = await Booking.findById(bookingId);
      if (booking) {
        targetCarId = booking.car;
      }
    }

    if (!targetCarId) {
      return res.status(400).json({ success: false, message: 'Car ID is required' });
    }

    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ success: false, message: 'Please provide a valid rating (1-5 stars)' });
    }

    if (!comment || !comment.trim()) {
      return res.status(400).json({ success: false, message: 'Please write a review comment' });
    }

    const review = await Review.create({
      user: req.user._id,
      car: targetCarId,
      booking: bookingId || undefined,
      reviewerName: req.user?.name || 'Verified Client',
      rating: Number(rating),
      comment: comment.trim()
    });

    const carReviews = await Review.find({ car: targetCarId });
    const numReviews = carReviews.length;
    const avgRating = carReviews.reduce((sum, rev) => sum + rev.rating, 0) / numReviews;

    await Car.findByIdAndUpdate(targetCarId, {
      rating: parseFloat(avgRating.toFixed(1)),
      numReviews
    });

    const populatedReview = await Review.findById(review._id).populate('user', 'name profilePhoto');

    res.status(201).json({ success: true, review: populatedReview });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a specific car
// @route   GET /api/reviews/car/:carId
// @access  Public
const getCarReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ car: req.params.carId })
      .populate('user', 'name profilePhoto')
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getCarReviews
};
