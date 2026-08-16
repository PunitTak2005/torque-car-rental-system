import { createBooking, getUserBookings, cancelBooking, getAdminBookings, updateBookingStatus, getAdminStats, getAdminRevenueStats } from '../api';

export const bookingService = {
  createBooking,
  getUserBookings,
  cancelBooking,
  getAdminBookings,
  updateBookingStatus,
  getAdminStats,
  getAdminRevenueStats
};

export default bookingService;
