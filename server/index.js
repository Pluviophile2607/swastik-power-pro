require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const errorHandler = require('./middleware/errorMiddleware');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const projectRoutes = require('./routes/projectRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const healthRoutes = require('./routes/healthRoutes');

const app = express();

// 1. CORS PROTOCOL (Priority #1 for Preflight handling)
const whitelist = [
  'https://swastik-power-pro.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173'
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not authorized by SWASTIK_CORS_PROTOCOL'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// 2. SECURITY HARDENING
app.use(helmet()); // Security Headers
app.use(mongoSanitize()); // Prevent NoSQL Injection
app.use(xss()); // Prevent XSS Attacks

// Rate Limiting Protocol
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this terminal, please try again after 15 minutes.'
  }
});
app.use('/api/', limiter);

// 3. CORE MIDDLEWARE
app.use(compression());
app.use(express.json({ limit: '10kb' })); 
app.use('/uploads', express.static('uploads'));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 5. API ROUTE REGISTRATION
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/inquiries', require('./routes/inquiryRoutes'));

// Root Status
app.get('/', (req, res) => {
  res.send('Swastik Solar Management Platform API is live...');
});

// 6. GLOBAL ERROR PROTOCOL
app.use(errorHandler);

// DATABASE CONNECTION
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[SYSTEM] MongoDB Connected and Synchronized.');
  } catch (err) {
    console.error('[SYSTEM] MongoDB Connection Error:', err);
    process.exit(1);
  }
};
connectDB();

// 7. PRODUCTION SERVER LIFECYCLE
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`[TERMINAL] Server Operational at port ${PORT} [${process.env.NODE_ENV}]`);
});

// GRACEFUL SHUTDOWN
process.on('unhandledRejection', (err) => {
  console.error('[CRITICAL] Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.log('[SYSTEM] SIGTERM signal received. Closing terminal...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('[SYSTEM] Database and Server detached.');
      process.exit(0);
    });
  });
});
