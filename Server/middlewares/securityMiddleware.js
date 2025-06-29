const rateLimit = require('express-rate-limit');
const validator = require('validator');

// Rate limiting middleware
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { error: "Too many login attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

const bidLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 bid requests per minute
  message: { error: "Too many bid attempts, please slow down" },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per minute
  message: { error: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Input validation middleware
const validateBidInput = (req, res, next) => {
  const { title, description, startingBid, bidAmount, startTime, endTime } = req.body;
  
  // Validate title
  if (!title || !validator.trim(title) || title.length === 0) {
    return res.status(400).json({ error: "Title is required and cannot be empty" });
  }
  
  if (title.length > 100) {
    return res.status(400).json({ error: "Title must be less than 100 characters" });
  }
  
  // Validate description
  if (description && description.length > 1000) {
    return res.status(400).json({ error: "Description must be less than 1000 characters" });
  }
  
  // Validate bid amounts
  if (startingBid !== undefined) {
    const startingBidNum = parseFloat(startingBid);
    if (isNaN(startingBidNum) || startingBidNum <= 0) {
      return res.status(400).json({ error: "Starting bid must be a positive number" });
    }
  }
  
  if (bidAmount !== undefined) {
    const bidAmountNum = parseFloat(bidAmount);
    if (isNaN(bidAmountNum) || bidAmountNum <= 0) {
      return res.status(400).json({ error: "Bid amount must be a positive number" });
    }
  }
  
  // Validate dates
  if (startTime) {
    const startDate = new Date(startTime);
    if (isNaN(startDate.getTime())) {
      return res.status(400).json({ error: "Invalid start time format" });
    }
  }
  
  if (endTime) {
    const endDate = new Date(endTime);
    if (isNaN(endDate.getTime())) {
      return res.status(400).json({ error: "Invalid end time format" });
    }
  }
  
  // Validate start time is before end time
  if (startTime && endTime) {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    if (startDate >= endDate) {
      return res.status(400).json({ error: "Start time must be before end time" });
    }
  }
  
  next();
};

// User input validation middleware
const validateUserInput = (req, res, next) => {
  const { name, email, age, phone, password } = req.body;
  
  // Validate name
  if (name !== undefined) {
    if (!name || !validator.trim(name) || name.length === 0) {
      return res.status(400).json({ error: "Name is required and cannot be empty" });
    }
    
    if (name.length > 50) {
      return res.status(400).json({ error: "Name must be less than 50 characters" });
    }
    
    if (!validator.isAlpha(name.replace(/\s/g, ''))) {
      return res.status(400).json({ error: "Name can only contain letters and spaces" });
    }
  }
  
  // Validate email
  if (email !== undefined) {
    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ error: "Valid email address is required" });
    }
    
    if (email.length > 100) {
      return res.status(400).json({ error: "Email must be less than 100 characters" });
    }
  }
  
  // Validate age
  if (age !== undefined) {
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 120) {
      return res.status(400).json({ error: "Age must be between 18 and 120" });
    }
  }
  
  // Validate phone
  if (phone !== undefined) {
    if (!phone || !validator.isMobilePhone(phone, 'any')) {
      return res.status(400).json({ error: "Valid phone number is required" });
    }
  }
  
  // Validate password
  if (password !== undefined) {
    if (!password || password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }
    
    if (password.length > 128) {
      return res.status(400).json({ error: "Password must be less than 128 characters" });
    }
    
    // Check for common password patterns
    if (password.toLowerCase().includes('password') || 
        password.toLowerCase().includes('123') ||
        password.toLowerCase().includes('qwerty')) {
      return res.status(400).json({ error: "Password is too weak" });
    }
  }
  
  next();
};

// File upload validation middleware
const validateFileUpload = (req, res, next) => {
  if (!req.file) {
    return next(); // No file uploaded, continue
  }
  
  const { mimetype, size, originalname } = req.file;
  
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!allowedTypes.includes(mimetype)) {
    return res.status(400).json({ error: "Only JPG/PNG images are allowed" });
  }
  
  // Validate file size (5MB max)
  const maxSize = 5 * 1024 * 1024;
  if (size > maxSize) {
    return res.status(400).json({ error: "File size must be less than 5MB" });
  }
  
  // Validate filename
  if (originalname) {
    const sanitizedFilename = originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    if (sanitizedFilename !== originalname) {
      req.file.originalname = sanitizedFilename;
    }
  }
  
  next();
};

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        // Remove dangerous characters and escape HTML
        obj[key] = validator.escape(obj[key].replace(/[<>{}]/g, ''));
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };
  
  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);
  
  next();
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // Don't expose internal errors to client
  let statusCode = 500;
  let message = "Internal server error";
  
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = "Invalid input data";
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = "Invalid ID format";
  } else if (err.name === 'MongoError' && err.code === 11000) {
    statusCode = 409;
    message = "Duplicate entry";
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = "Token expired";
  } else if (err.status) {
    statusCode = err.status;
    message = err.message;
  }
  
  res.status(statusCode).json({ error: message });
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    };
    
    console.log(`[${logData.timestamp}] ${logData.method} ${logData.url} ${logData.status} ${logData.duration}`);
  });
  
  next();
};

// Security headers middleware
const securityHeaders = (req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Strict transport security (for HTTPS)
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  // Content security policy
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;");
  
  next();
};

module.exports = {
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
}; 