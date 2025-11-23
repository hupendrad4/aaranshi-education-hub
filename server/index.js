require('dotenv').config();
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize, errors } = format;

// Import routes
const registrationRoutes = require('./routes/registration');

// Import email service
const emailService = require('./utils/emailService');

// Initialize express app
const app = express();
const server = http.createServer(app);

// Configure logging
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' })
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'logs/exceptions.log' })
  ]
});

// Create logs directory if it doesn't exist
const fs = require('fs');
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Configure CSP
const cspConfig = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      'https://code.jquery.com',
      'https://cdn.jsdelivr.net',
      'https://cdnjs.cloudflare.com',
      "'unsafe-inline'"
    ],
    styleSrc: [
      "'self'",
      'https://cdn.jsdelivr.net',
      'https://cdnjs.cloudflare.com',
      'https://fonts.googleapis.com',
      "'unsafe-inline'"
    ],
    imgSrc: [
      "'self'",
      'data:',
      'https://images.unsplash.com',
      'https://*.unsplash.com'
    ],
    fontSrc: [
      "'self'",
      'https://cdn.jsdelivr.net',
      'https://cdnjs.cloudflare.com',
      'https://fonts.gstatic.com',
      'data:'
    ],
    connectSrc: [
      "'self'",
      `http://localhost:${process.env.PORT || 3002}`
    ]
  }
};

// Middleware
app.use(helmet({
  contentSecurityPolicy: cspConfig
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  optionsSuccessStatus: 200
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve static files from the root directory (HTML, CSS, JS, assets)
app.use(express.static(path.join(__dirname, '..')));

// Serve register.html directly
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../register.html'));
});

// API Routes
app.use('/api/register', registrationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});


// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack });
  
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// Initialize email service
emailService.initialize();
emailService.verify().then(verified => {
  if (verified) {
    logger.info('✓ Email service ready');
  } else {
    logger.warn('⚠️  Email service not configured - check EMAIL_USER and EMAIL_PASSWORD in .env');
  }
}).catch(err => {
  logger.error('✗ Email service error:', err.message);
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', { error: err.message, stack: err.stack });
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = { app, server };
