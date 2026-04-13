const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// Get all notifications for the current user
router.get('/', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json({ success: true, notifications });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Broadcast a global notification (Admin only)
router.post('/broadcast', protect, authorize(['Admin']), async (req, res) => {
  try {
    const { title, message, recipientType } = req.body;
    
    let query = { role: 'Vendor' }; // Default to all vendors
    if (recipientType === 'Active') {
      query = { role: 'Vendor', 'vendorProfile.onboardingStatus': 'Approved' };
    }

    const vendors = await User.find(query);
    
    if (vendors.length === 0) {
      return res.status(404).json({ success: false, message: 'No recipients found for this sector.' });
    }

    const notifications = vendors.map(v => ({
      userId: v._id,
      title,
      message,
      type: 'general'
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({ success: true, message: `Broadcast successfully transmitted to ${vendors.length} terminals.` });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Mark a specific notification as read
router.patch('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.status(200).json({ success: true, notification });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Mark all notifications as read for current user
router.patch('/read-all', protect, async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
    res.status(200).json({ success: true, message: 'All notifications synchronized as read' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
