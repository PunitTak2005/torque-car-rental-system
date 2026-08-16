const User = require('../models/User');
const Car = require('../models/Car');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');

// @desc    Get Admin dashboard statistics and chart data
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalCars = await Car.countDocuments();
    const availableCars = await Car.countDocuments({ availability: true });
    const totalBookings = await Booking.countDocuments();
    
    const activeRentals = await Booking.countDocuments({ status: 'Active' });

    // Calculate total revenue from successful payments or paid bookings
    const payments = await Payment.find({ status: 'Success' });
    let totalRevenue = payments.reduce((sum, pay) => sum + (pay.amount || 0), 0);

    const paidBookings = await Booking.find({ paymentStatus: 'Paid' });
    const bookingRevenue = paidBookings.reduce((sum, b) => sum + (b.billing?.totalAmount || 0), 0);
    if (bookingRevenue > totalRevenue) {
      totalRevenue = bookingRevenue;
    }

    // Popular cars: Aggregate booking counts
    const popularCarsAgg = await Booking.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: '$car', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const popularCars = await Promise.all(
      popularCarsAgg.map(async (item) => {
        const car = await Car.findById(item._id);
        return {
          car,
          bookingsCount: item.count
        };
      })
    );

    // Revenue and booking trends over past 6 months
    const monthlyStats = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
      
      const monthPayments = await Payment.find({
        createdAt: { $gte: monthStart, $lte: monthEnd },
        status: 'Success'
      });
      let monthRevenue = monthPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

      const monthPaidBookings = await Booking.find({
        createdAt: { $gte: monthStart, $lte: monthEnd },
        paymentStatus: 'Paid',
        status: { $ne: 'Cancelled' }
      });
      const monthBookingRev = monthPaidBookings.reduce((sum, b) => sum + (b.billing?.totalAmount || 0), 0);
      if (monthBookingRev > monthRevenue) {
        monthRevenue = monthBookingRev;
      }

      const monthBookingsCount = await Booking.countDocuments({
        createdAt: { $gte: monthStart, $lte: monthEnd }
      });

      const monthLabel = monthStart.toLocaleString('default', { month: 'short', year: '2-digit' });
      
      monthlyStats.push({
        month: monthLabel,
        revenue: monthRevenue,
        bookings: monthBookingsCount
      });
    }

    // Monthly Growth Percentage Calculation
    const curMonthRevenue = monthlyStats[5]?.revenue || 0;
    const prevMonthRevenue = monthlyStats[4]?.revenue || 0;

    let revenueGrowthPercentage = null;
    let revenueGrowthTrend = 'neutral';
    let revenueGrowthLabel = 'No previous-month comparison';

    if (prevMonthRevenue > 0) {
      const pct = ((curMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100;
      revenueGrowthPercentage = Number(pct.toFixed(1));
      if (pct > 0) {
        revenueGrowthTrend = 'positive';
        revenueGrowthLabel = `↑ +${revenueGrowthPercentage}% vs last month`;
      } else if (pct < 0) {
        revenueGrowthTrend = 'negative';
        revenueGrowthLabel = `↓ ${revenueGrowthPercentage}% vs last month`;
      } else {
        revenueGrowthTrend = 'neutral';
        revenueGrowthLabel = `0.0% vs last month`;
      }
    } else if (curMonthRevenue > 0) {
      revenueGrowthTrend = 'positive';
      revenueGrowthLabel = `New revenue (First Month)`;
    } else {
      revenueGrowthTrend = 'neutral';
      revenueGrowthLabel = `No previous-month comparison`;
    }

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalCars,
        availableCars,
        totalBookings,
        activeRentals,
        totalRevenue,
        curMonthRevenue,
        prevMonthRevenue,
        revenueGrowthPercentage,
        revenueGrowthTrend,
        revenueGrowthLabel
      },
      popularCars,
      monthlyStats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new car
// @route   POST /api/admin/cars
// @access  Private/Admin
const addCar = async (req, res, next) => {
  try {
    const car = await Car.create(req.body);
    res.status(201).json({ success: true, message: 'Car added successfully', car });
  } catch (error) {
    next(error);
  }
};

// @desc    Edit a car
// @route   PUT /api/admin/cars/:id
// @access  Private/Admin
const editCar = async (req, res, next) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    res.json({ success: true, message: 'Car updated successfully', car });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a car
// @route   DELETE /api/admin/cars/:id
// @access  Private/Admin
const deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);

    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    await Review.deleteMany({ car: req.params.id });
    await Booking.deleteMany({ car: req.params.id });

    res.json({ success: true, message: 'Car and associated details deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (with optional search and filters)
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getAllBookings = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    let bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('car')
      .sort({ createdAt: -1 });

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      bookings = bookings.filter(b => 
        (b.user && searchRegex.test(b.user.name)) || 
        (b.user && searchRegex.test(b.user.email)) || 
        (b.car && searchRegex.test(b.car.brand)) || 
        (b.car && searchRegex.test(b.car.model)) ||
        searchRegex.test(b.bookingId)
      );
    }

    res.json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a booking status (Confirm, Reject, Start, Complete, Cancel)
// @route   PUT /api/admin/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id).populate('car');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = status;

    if (status === 'Cancelled' || status === 'Rejected') {
      if (booking.paymentStatus === 'Paid') {
        booking.paymentStatus = 'Refunded';
        await Payment.findOneAndUpdate({ booking: booking._id }, { status: 'Refunded' });
      }
    }

    await booking.save();

    let title = `Booking Update: ${status}`;
    let message = `Your booking ${booking.bookingId} is now ${status}.`;

    if (status === 'Confirmed') {
      title = 'Booking Confirmed!';
      message = `Excellent! Your booking ${booking.bookingId} has been confirmed. You are good to pick up on your selected date.`;
    } else if (status === 'Active') {
      title = 'Rental Journey Started!';
      message = `Your rental for ${booking.car.brand} ${booking.car.model} is now active. Have a safe drive!`;
    } else if (status === 'Completed') {
      title = 'Rental Completed';
      message = `Your rental ${booking.bookingId} has been completed. Thank you for choosing DriveEase! Please leave us a review.`;
    }

    await Notification.create({
      user: booking.user,
      title,
      message,
      type: status === 'Confirmed' ? 'booking_confirmed' : status === 'Cancelled' ? 'booking_cancelled' : 'general'
    });

    res.json({ success: true, message: `Booking status updated to ${status}`, booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const { search } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ success: false, message: 'You cannot change your own admin role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: `User role updated to ${role}`, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user status (Active / Suspended)
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
const updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ success: false, message: 'You cannot suspend yourself' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: `User status updated to ${status}`, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all payments
// @route   GET /api/admin/payments
// @access  Private/Admin
const getAllPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'name email')
      .populate({
        path: 'booking',
        populate: { path: 'car', select: 'brand model' }
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, payments });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews
// @route   GET /api/admin/reviews
// @access  Private/Admin
const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('car', 'brand model')
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review
// @route   DELETE /api/admin/reviews/:id
// @access  Private/Admin
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    const carReviews = await Review.find({ car: review.car });
    const numReviews = carReviews.length;
    let avgRating = 5;

    if (numReviews > 0) {
      avgRating = carReviews.reduce((sum, rev) => sum + rev.rating, 0) / numReviews;
    }

    await Car.findByIdAndUpdate(review.car, {
      rating: parseFloat(avgRating.toFixed(1)),
      numReviews
    });

    res.json({ success: true, message: 'Review deleted and car rating updated' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
