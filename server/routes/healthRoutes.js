const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/**
 * @desc    System Health Protocol
 * @route   GET /api/health/status
 * @access  Public
 */
router.get('/status', async (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    status: 'Operational',
    timestamp: Date.now(),
    protocol: 'SWASTIK_CORE_UPLINK',
    checks: {
      database: {
        status: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
      },
      server: {
        status: 'Online'
      }
    }
  };

  try {
    if (mongoose.connection.readyState !== 1) {
       healthCheck.status = 'Degraded';
    }
    res.status(200).json(healthCheck);
  } catch (err) {
    healthCheck.status = 'Critical Protocol Failure';
    res.status(503).json(healthCheck);
  }
});

module.exports = router;
