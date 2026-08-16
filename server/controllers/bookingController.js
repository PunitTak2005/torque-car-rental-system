const Booking = require('../models/Booking');
const Car = require('../models/Car');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');

// Helper to generate a random readable Booking ID
const generateBookingId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const prefix = chars.charAt(Math.floor(Math.random() * chars.length)) + chars.charAt(Math.floor(Math.random() * chars.length));
  const num = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${num}`;
};

// @desc    Create a new booking (checks for overlapping dates and processes mock payment if card details provided)
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const {
      carId,
      pickupLocation,
      dropoffLocation,
      pickupDate,
      returnDate,
      customerDetails,
      paymentDetails
    } = req.body;

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    if (!car.availability) {
      return res.status(400).json({ success: false, message: 'This car is currently unavailable for rental' });
    }

    const pDate = new Date(pickupDate);
    const rDate = new Date(returnDate);

    // Business Rule: Check for overlapping bookings at the controller layer
    const overlappingBooking = await Booking.findOne({
      car: carId,
      status: { $in: ['Pending', 'Confirmed', 'Active'] },
      $or: [
        {
          pickupDate: { $lte: rDate },
          returnDate: { $gte: pDate }
        }
      ]
    });

    if (overlappingBooking) {
      return res.status(400).json({
        success: false,
        message: 'This vehicle is already booked for the selected dates. Please choose different dates or another vehicle.'
      });
    }

    // Calculate billing
    const timeDiff = Math.abs(rDate.getTime() - pDate.getTime());
    const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    const subtotal = car.pricePerDay * totalDays;
    const taxes = Math.round(subtotal * 0.08); // 8% tax
    const securityDeposit = car.securityDeposit || 150;
    const totalAmount = subtotal + taxes + securityDeposit;

    const bId = generateBookingId();

    const bookingData = {
      bookingId: bId,
      user: req.user._id,
      car: carId,
      pickupLocation,
      dropoffLocation,
      pickupDate: pDate,
      returnDate: rDate,
      totalDays,
      dailyRate: car.pricePerDay,
      billing: {
        subtotal,
        securityDeposit,
        taxes,
        totalAmount
      },
      customerDetails
    };

    if (paymentDetails) {
      const selectedMethod = paymentDetails.paymentMethod || 'Credit/Debit Card';
      let transactionId = 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      let paymentStatus = 'Paid';
      let paymentMethodName = 'Credit/Debit Card';
      let last4 = 'N/A';
      let holder = customerDetails.fullName;

      if (selectedMethod === 'UPI') {
        paymentMethodName = 'UPI';
        last4 = 'UPI';
        bookingData.paymentDetails = {
          transactionId,
          cardholderName: holder,
          paymentMethod: 'UPI',
          upiProvider: paymentDetails.upiProvider || 'UPI',
          upiId: paymentDetails.upiId,
          paymentDate: new Date()
        };
      } else if (selectedMethod === 'Cash on Pickup' || selectedMethod === 'CASH') {
        transactionId = 'COP-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        paymentStatus = 'Pending';
        paymentMethodName = 'Cash on Pickup';
        last4 = 'CASH';
        bookingData.paymentDetails = {
          transactionId,
          cardholderName: holder,
          paymentMethod: 'Cash on Pickup',
          paymentDate: new Date()
        };
      } else {
        // Default Credit / Debit Card
        paymentMethodName = 'Credit/Debit Card';
        holder = paymentDetails.cardholderName || customerDetails.fullName;
        last4 = (paymentDetails.cardNumber || '4444').replace(/\s/g, '').slice(-4);
        bookingData.paymentDetails = {
          transactionId,
          cardholderName: holder,
          paymentMethod: 'Credit/Debit Card',
          last4Digits: last4,
          paymentDate: new Date()
        };
      }

      bookingData.status = 'Confirmed';
      bookingData.paymentStatus = paymentStatus;

      const booking = await Booking.create(bookingData);

      // Create Payment log entry
      await Payment.create({
        booking: booking._id,
        user: req.user._id,
        transactionId,
        amount: totalAmount,
        status: paymentStatus === 'Paid' ? 'Success' : 'Success',
        cardholderName: holder,
        last4Digits: last4,
        paymentMethod: paymentMethodName
      });

      await Notification.create({
        user: req.user._id,
        title: 'Booking Confirmed!',
        message: `Your booking ${bId} for ${car.brand} ${car.model} is confirmed (${paymentMethodName}). View details on your dashboard.`,
        type: 'booking_confirmed'
      });

      return res.status(201).json({
        success: true,
        message: `Booking created (${paymentMethodName}) successfully`,
        booking
      });
    } else {
      // Pending booking
      const booking = await Booking.create(bookingData);

      await Notification.create({
        user: req.user._id,
        title: 'Booking Created (Pending Payment)',
        message: `Your booking ${bId} is pending. Complete payment to secure your rental.`,
        type: 'booking_created'
      });

      return res.status(201).json({
        success: true,
        message: 'Booking created successfully (pending payment)',
        booking
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings
// @access  Private
const getUserBookings = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { status, sort } = req.query;
    // Strictly scope database query to authenticated user ID derived from verified JWT
    const query = { user: req.user._id };

    if (status && status !== 'All') {
      if (status === 'Upcoming') {
        query.status = { $in: ['Confirmed', 'Pending'] };
        query.pickupDate = { $gte: new Date(new Date().setHours(0,0,0,0)) };
      } else {
        query.status = status;
      }
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'pickupDate') {
      sortOptions = { pickupDate: 1 };
    }

    const bookings = await Booking.find(query)
      .populate('car')
      .sort(sortOptions);

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingDetails = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('car');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Process mock payment for a pending booking
// @route   POST /api/bookings/:id/pay
// @access  Private
const payBooking = async (req, res, next) => {
  try {
    const { cardholderName, cardNumber } = req.body;

    const booking = await Booking.findById(req.params.id).populate('car');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.paymentStatus === 'Paid') {
      return res.status(400).json({ success: false, message: 'Booking is already paid' });
    }

    const transactionId = 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    booking.status = 'Confirmed';
    booking.paymentStatus = 'Paid';
    booking.paymentDetails = {
      transactionId,
      cardholderName,
      paymentMethod: 'Credit Card',
      paymentDate: new Date()
    };

    await booking.save();

    await Payment.create({
      booking: booking._id,
      user: req.user._id,
      transactionId,
      amount: booking.billing.totalAmount,
      status: 'Success',
      cardholderName,
      last4Digits: cardNumber.slice(-4),
      paymentMethod: 'Credit Card'
    });

    await Notification.create({
      user: req.user._id,
      title: 'Payment Received',
      message: `Payment for booking ${booking.bookingId} was successfully processed. Your rental is confirmed!`,
      type: 'booking_confirmed'
    });

    res.json({ success: true, message: 'Payment processed successfully', booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   POST /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('car');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this booking' });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
    }

    if (booking.status === 'Active' || booking.status === 'Completed') {
      return res.status(400).json({ success: false, message: 'Cannot cancel an active or completed rental' });
    }

    booking.status = 'Cancelled';
    
    if (booking.paymentStatus === 'Paid') {
      booking.paymentStatus = 'Refunded';
      await Payment.findOneAndUpdate(
        { booking: booking._id, status: 'Success' },
        { status: 'Refunded' }
      );
    }

    await booking.save();

    await Notification.create({
      user: booking.user,
      title: 'Booking Cancelled',
      message: `Your booking ${booking.bookingId} has been cancelled successfully.${booking.paymentStatus === 'Refunded' ? ' A refund has been issued to your card.' : ''}`,
      type: 'booking_cancelled'
    });

    res.json({ success: true, message: 'Booking cancelled successfully', booking });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingDetails,
  payBooking,
  cancelBooking
};
