const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');

// Import security middleware
const {
  authLimiter,
  bidLimiter,
  generalLimiter,
  validateBidInput,
  validateUserInput,
  validateFileUpload,
  sanitizeInput,
  errorHandler,
  requestLogger,
  securityHeaders
} = require('./middlewares/securityMiddleware');

// Import routes
const regRoute = require('./routes/authRoutes/register');
const loginRoute = require('./routes/authRoutes/login');
const logoutRoute = require('./routes/authRoutes/logout');
const protectedRoute = require('./routes/authRoutes/protected');
const updateProfileRoute = require('./routes/authRoutes/updateProfile');
const userStatisticsRoute = require('./routes/authRoutes/userStatistics');
const userBiddingHistoryRoute = require('./routes/authRoutes/userBiddingHistory');
const addBid = require('./routes/bidRoutes/addBid');
const activeBids = require('./routes/bidRoutes/getActiveBids');
const endBids = require('./routes/bidRoutes/getEndedBids');
const getAllBids = require('./routes/bidRoutes/getAllBids');
const placeBid = require('./routes/bidRoutes/placeBid');

// Import cron job
require('./cron/updateBidStatus');

const app = express();

// Security headers middleware (apply to all routes)
app.use(securityHeaders);

// Request logging middleware
app.use(requestLogger);

// CORS configuration with restrictions
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization middleware (apply to all routes)
app.use(sanitizeInput);

// General rate limiting
app.use(generalLimiter);

// Static file serving with security
app.use('/uploads', express.static('uploads', {
  setHeaders: (res, path) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }
}));

// Authentication routes with rate limiting
app.use('/auth/register', validateUserInput, regRoute);
app.use('/auth/login', authLimiter, validateUserInput, loginRoute);
app.use('/auth/logout', logoutRoute);
app.use('/auth/protected', protectedRoute);
app.use('/auth/update-profile', validateUserInput, updateProfileRoute);
app.use('/auth/user-statistics', userStatisticsRoute);
app.use('/auth/user-bidding-history', userBiddingHistoryRoute);

// Bid routes with validation and rate limiting
app.use('/bid/add', validateBidInput, validateFileUpload, addBid);
app.use('/bid/active', activeBids);
app.use('/bid/ended', endBids);
app.use('/bid/all', getAllBids);
app.use('/bid/place', bidLimiter, validateBidInput, placeBid);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler (must be last)
app.use(errorHandler);

// Set default values for environment variables
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/virtualbid';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// Validate environment variables
if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your_jwt_secret_key_here') {
  console.warn('⚠️  WARNING: JWT_SECRET is using default value. Please set a secure secret in production.');
}

// Set JWT_SECRET globally if not already set
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = JWT_SECRET;
}

// Enhanced MongoDB connection with security options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferMaxEntries: 0,
  retryWrites: true,
  // Security options
  ssl: process.env.NODE_ENV === 'production',
  sslValidate: process.env.NODE_ENV === 'production',
  // Connection monitoring
  heartbeatFrequencyMS: 10000,
  // Timeout settings
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  // Buffer settings
  bufferCommands: false,
  bufferMaxEntries: 0
};

// Connect to MongoDB with error handling
mongoose.connect(MONGO_URI, mongooseOptions)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
    
    // Start server only after successful database connection
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔒 Security features enabled`);
    });
  })
  .catch(error => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('✅ MongoDB connection closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('✅ MongoDB connection closed');
    process.exit(0);
  });
});

// Unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

module.exports = app; 