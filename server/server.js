require('dotenv').config();
const express = require('express');
const cors = require('cors');
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
].filter(Boolean);

// CORS Middleware Configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman, or server-to-server)
    if (!origin) return callback(null, true);

    // Check if origin is explicitly allowed or matches Vercel deployment domain pattern
    const isAllowed =
      allowedOrigins.includes(origin) ||
      /^https:\/\/torque-car-rental-system.*\.vercel\.app$/.test(origin) ||
      /^https:\/\/torque-car-rental.*\.vercel\.app$/.test(origin);

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`[CORS Blocked Origin]: ${origin}`);
      callback(new Error(`CORS policy error: Origin ${origin} is not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

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
