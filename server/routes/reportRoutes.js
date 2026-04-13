const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Invoice = require('../models/Invoice');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// Get Financial Report (Finance, Admin, Manager with finance permission)
router.get('/financial', protect, authorize(['Finance', 'Admin', 'Manager'], 'finance'), async (req, res) => {
  try {
    const invoices = await Invoice.find().populate('vendorId', 'vendorProfile.companyName').populate('projectId', 'consumerInfo.name');
    
    // Simplistic formatting for report download
    const reportData = invoices.map(i => ({
      invoiceNumber: i.invoiceNumber,
      amount: i.amount,
      status: i.status,
      date: i.createdAt,
      vendor: i.vendorId?.vendorProfile?.companyName || 'Unknown',
      project: i.projectId?.consumerInfo?.name || 'Unknown'
    }));

    res.status(200).json({ success: true, reportType: 'Financial', data: reportData });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Get General Operational Report (Admin, Manager with analytics permission)
router.get('/general', protect, authorize(['Admin', 'Manager'], 'analytics'), async (req, res) => {
  try {
    const projects = await Project.find().populate('vendorId', 'name vendorProfile.companyName');
    
    // Simplistic formatting for general operations download
    const reportData = projects.map(p => ({
      projectId: p._id,
      consumerName: p.consumerInfo.name,
      stage: p.statusTimeline.currentStage,
      capacity: p.energyProfile.desiredCapacity,
      vendor: p.vendorId?.vendorProfile?.companyName || 'Unknown',
      createdDate: p.createdAt
    }));

    res.status(200).json({ success: true, reportType: 'General Operations', data: reportData });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
