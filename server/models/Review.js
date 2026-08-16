const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: false
    },
    reviewerName: {
      type: String,
      trim: true
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: [true, 'Please provide a review comment'],
      trim: true
    }
  },
  { timestamps: true }
);

// Prevent double review for same booking
reviewSchema.index({ user: 1, booking: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
