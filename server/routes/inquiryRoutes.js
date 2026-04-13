const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const { protect, authorize } = require('../middleware/auth');

/**
 * @desc    Submit a new inquiry (Lead Capture)
 * @route   POST /api/inquiries
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, mobile, type, message } = req.body;
    const inquiry = await Inquiry.create({ name, email, mobile, type, message });
    res.status(201).json({ success: true, inquiry });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * @desc    Get all inquiries (Admin Review)
 * @route   GET /api/inquiries
 * @access  Admin, Manager
 */
router.get('/', protect, authorize(['Admin', 'Manager']), async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: inquiries.length, inquiries });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * @desc    Update inquiry status
 * @route   PATCH /api/inquiries/:id
 * @access  Admin, Manager
 */
router.patch('/:id', protect, authorize(['Admin', 'Manager']), async (req, res) => {
  try {
    const { status } = req.body;
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Protocol record not found.' });
    }

    res.status(200).json({ success: true, inquiry });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
