import axios from 'axios';
import storage from '../utils/storage';

// Compute API base URL and ensure '/api' endpoint prefix is present
let rawApiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:9002/api').trim();
rawApiUrl = rawApiUrl.replace(/\/+$/, '');
const finalBaseURL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`;

const API = axios.create({
  baseURL: finalBaseURL,
});

// Interceptor to inject JWT token
API.interceptors.request.use(
  (config) => {
    const token = storage.get(storage.KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth Services
export const loginUser = (credentials) => API.post('/auth/login', credentials);
export const registerUser = (userData) => API.post('/auth/register', userData);
export const getProfile = () => API.get('/auth/me');
export const updateProfile = (profileData) => API.put('/auth/profile', profileData);
export const getNotifications = () => API.get('/auth/notifications');
export const markNotificationRead = (id) => API.put(`/auth/notifications/${id}`);
export const forgotPassword = (emailData) => API.post('/auth/forgot-password', emailData);
export const resetPassword = (token, passwordData) => API.post(`/auth/reset-password/${token}`, passwordData);

// Car Services
export const getCars = (params) => API.get('/cars', { params });
export const getCarDetails = (id) => API.get(`/cars/${id}`);
export const getCarLocations = () => API.get('/cars/locations');
export const getCarBrands = () => API.get('/cars/brands');

// Booking Services
export const createBooking = (bookingData) => API.post('/bookings', bookingData);
export const getUserBookings = (params = {}) => API.get('/bookings', { params });
export const getBookingDetails = (id) => API.get(`/bookings/${id}`);
export const payBooking = (id, paymentData) => API.post(`/bookings/${id}/pay`, paymentData);
export const cancelBooking = (id) => API.post(`/bookings/${id}/cancel`);

// Review Services
export const createReview = (reviewData) => API.post('/reviews', reviewData);
export const getCarReviews = (carId) => API.get(`/reviews/car/${carId}`);

// Favorite Services
export const getUserFavorites = () => API.get('/favorites');
export const toggleUserFavorite = (carId) => API.post(`/favorites/${carId}`);
export const removeUserFavorite = (carId) => API.delete(`/favorites/${carId}`);

// Contact/Support Services
export const submitContact = (contactData) => API.post('/contact', contactData);

// Admin Services
export const getAdminDashboard = () => API.get('/admin/dashboard');
export const adminAddCar = (carData) => API.post('/admin/cars', carData);
export const adminEditCar = (id, carData) => API.put(`/admin/cars/${id}`, carData);
export const adminDeleteCar = (id) => API.delete(`/admin/cars/${id}`);
export const adminGetBookings = (params) => API.get('/admin/bookings', { params });
export const adminUpdateBookingStatus = (id, status) => API.put(`/admin/bookings/${id}/status`, { status });
export const adminGetUsers = (params) => API.get('/admin/users', { params });
export const adminUpdateUserRole = (id, role) => API.put(`/admin/users/${id}/role`, { role });
export const adminUpdateUserStatus = (id, status) => API.put(`/admin/users/${id}/status`, { status });
export const adminGetReviews = () => API.get('/admin/reviews');
export const adminDeleteReview = (id) => API.delete(`/admin/reviews/${id}`);
export const adminGetPayments = () => API.get('/admin/payments');

export default API;
