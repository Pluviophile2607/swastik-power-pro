require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const projectRoutes = require('./routes/projectRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// Security and Performance Middleware
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// API Route Registration
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/inquiries', require('./routes/inquiryRoutes'));

// Health Check
app.get('/', (req, res) => {
  res.send('Swastik Solar Management Platform API is live...');
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'production'} mode.`);
});
