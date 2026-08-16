const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    transactionId: {
      type: String,
      required: true,
      unique: true
    },
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['Success', 'Failed', 'Refunded'],
      default: 'Success'
    },
    cardholderName: {
      type: String,
      default: 'N/A'
    },
    last4Digits: {
      type: String,
      default: 'N/A'
    },
    paymentMethod: {
      type: String,
      default: 'Credit/Debit Card'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
