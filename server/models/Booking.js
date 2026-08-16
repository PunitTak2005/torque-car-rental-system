const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
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
    pickupLocation: {
      type: String,
      required: true
    },
    dropoffLocation: {
      type: String,
      required: true
    },
    pickupDate: {
      type: Date,
      required: true
    },
    returnDate: {
      type: Date,
      required: true
    },
    totalDays: {
      type: Number,
      required: true
    },
    dailyRate: {
      type: Number,
      required: true
    },
    billing: {
      subtotal: {
        type: Number,
        required: true
      },
      securityDeposit: {
        type: Number,
        default: 0
      },
      taxes: {
        type: Number,
        required: true
      },
      totalAmount: {
        type: Number,
        required: true
      }
    },
    customerDetails: {
      fullName: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true
      },
      driverLicense: {
        type: String,
        required: true
      }
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Active', 'Completed', 'Cancelled'],
      default: 'Pending'
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Refunded'],
      default: 'Pending'
    },
    paymentDetails: {
      transactionId: String,
      cardholderName: String,
      paymentMethod: {
        type: String,
        default: 'Credit/Debit Card'
      },
      upiProvider: String,
      upiId: String,
      last4Digits: String,
      paymentDate: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
