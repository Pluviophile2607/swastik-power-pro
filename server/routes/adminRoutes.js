const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Notification = require('../models/Notification');
const { protect, authorize } = require('../middleware/auth');

// Get pending vendors for approval (Admin only, or Manager with approvals permission)
router.get('/pending-vendors', protect, authorize(['Admin', 'Manager'], 'approvals'), async (req, res, next) => {
  try {
    const vendors = await User.find({ 
      role: 'Vendor', 
      'vendorProfile.onboardingStatus': 'Pending' 
    });
    res.status(200).json({ success: true, vendors });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Approve a vendor and issue license (Admin only, or Manager with approvals permission)
router.put('/approve/:id', protect, authorize(['Admin', 'Manager'], 'approvals'), async (req, res, next) => {
  try {
    const { registrationLicenseId } = req.body;
    const vendor = await User.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    vendor.vendorProfile.onboardingStatus = 'Approved';
    vendor.vendorProfile.registrationLicenseId = registrationLicenseId || `SPPL-VND-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    
    await vendor.save();

    // Create Notification
    await Notification.create({
      userId: vendor._id,
      title: 'Industrial License Issued',
      message: `Your partnership has been verified. Registration License ID: ${vendor.vendorProfile.registrationLicenseId} is now active.`,
      type: 'system'
    });

    res.status(200).json({ success: true, message: 'Vendor approved', vendor });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Get all vendors (Admin/Manager only)
router.get('/all-vendors', protect, authorize(['Admin', 'Manager'], 'projects'), async (req, res, next) => {
  try {
    const vendors = await User.find({ role: 'Vendor' }).select('-password');
    res.status(200).json({ success: true, vendors });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Get all projects across the platform (Admin/Manager with projects permission)
router.get('/all-projects', protect, authorize(['Admin', 'Manager'], 'projects'), async (req, res, next) => {
  try {
    const Project = require('../models/Project'); // Lazy load to avoid circular deps if any
    const projects = await Project.find()
      .populate('vendorId', 'name vendorProfile')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, projects });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// --- MANAGER DELEGATION ROUTES ---

// Get all managers (Admin only)
router.get('/managers', protect, authorize(['Admin']), async (req, res) => {
  try {
    const managers = await User.find({ role: 'Manager' }).select('-password');
    res.status(200).json({ success: true, managers });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Add a new manager (Admin only)
router.post('/managers', protect, authorize(['Admin']), async (req, res) => {
  try {
    const { name, email, password, permissions } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    const manager = await User.create({
      name,
      email,
      password,
      role: 'Manager',
      managerPermissions: permissions || {
        projects: false,
        approvals: false,
        analytics: false,
        finance: false,
        settings: false
      }
    });

    res.status(201).json({ 
      success: true, 
      manager: {
        _id: manager._id,
        name: manager.name,
        email: manager.email,
        managerPermissions: manager.managerPermissions
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Update manager permissions (Admin only)
router.patch('/managers/:id/permissions', protect, authorize(['Admin']), async (req, res) => {
  try {
    const { permissions } = req.body;
    
    // Check if user exists and is a manager
    const manager = await User.findOne({ _id: req.params.id, role: 'Manager' });
    if (!manager) {
      return res.status(404).json({ success: false, message: 'Manager not found' });
    }

    // Completely replace or selectively merge
    manager.managerPermissions = { ...manager.managerPermissions.toObject(), ...permissions };
    await manager.save();

    res.status(200).json({ 
      success: true, 
      managerPermissions: manager.managerPermissions 
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Remove a manager (Admin only)
router.delete('/managers/:id', protect, authorize(['Admin']), async (req, res) => {
  try {
    const result = await User.findOneAndDelete({ _id: req.params.id, role: 'Manager' });
    
    if (!result) {
      return res.status(404).json({ success: false, message: 'Manager not found or already removed' });
    }

    res.status(200).json({ success: true, message: 'Manager access revoked' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
