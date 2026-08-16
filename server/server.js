require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Connect to Database
connectDB();

const app = express();

// Allowed Origins for CORS (Production Vercel + Local Development)
const allowedOrigins = [
  'http://localhost:3253',
  'http://localhost:5173',
  'http://127.0.0.1:3253',
  'http://127.0.0.1:5173',
  'https://torque-car-rental-system.vercel.app',
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL
].filter(Boolean).map(url => url.trim().replace(/\/+$/, ''));

// Helper to check if an origin is permitted
const isAllowedOrigin = (origin) => {
  if (!origin) return true; // Server-to-server, Mobile, Postman
  const normalized = origin.trim().replace(/\/+$/, '');
  if (allowedOrigins.includes(normalized)) return true;
  if (/^https:\/\/torque-car-rental-system.*\.vercel\.app$/.test(normalized)) return true;
  if (/^https:\/\/torque-car-rental.*\.vercel\.app$/.test(normalized)) return true;
  if (normalized.startsWith('http://localhost:') || normalized.startsWith('http://127.0.0.1:')) return true;
  return false;
};

// Comprehensive CORS Middleware (Handles Preflight & Normal Requests Explicitly)
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (isAllowedOrigin(origin)) {
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  } else {
    console.warn(`[CORS Blocked Origin]: ${origin}`);
  }

  // Intercept and answer OPTIONS preflight requests immediately with 204 No Content
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  next();
});

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root Endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Torque Car Rental API is running smoothly.' });
});

// API Routes Registration
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/cars', require('./routes/carRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/favorites', require('./routes/favoriteRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Centralized Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 9002;

app.listen(PORT, () => {
  console.log(`[Torque Backend API] Running on http://localhost:${PORT}`);
  console.log(`[CORS Configured] Allowed Origins: ${allowedOrigins.join(', ')}`);
});
