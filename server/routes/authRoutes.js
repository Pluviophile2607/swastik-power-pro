const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Otp = require('../models/Otp');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const { uploadToCloudinary } = require('../config/cloudinaryConfig');

// Configure Multer for memory storage (buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // In production, send via Email (Nodemailer/SendGrid)
    console.log(`[INDUSTRIAL-SYNC] OTP Protocol Generated for ${email}: ${otpCode}`);
    
    // Save to database
    await Otp.findOneAndUpdate(
      { email }, 
      { otp: otpCode, createdAt: Date.now() }, 
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, message: 'OTP transmitted to terminal.' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = await Otp.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP protocol.' });
    }

    // Success - delete the OTP record
    await Otp.deleteOne({ _id: record._id });

    res.status(200).json({ success: true, message: 'Terminal identity verified.' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Register User
router.post('/register', upload.fields([
  { name: 'gstCertificate', maxCount: 1 },
  { name: 'panCard', maxCount: 1 }
]), async (req, res, next) => {
  try {
    const { name, email, password, role, ...flatData } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Process files if they exist and upload to Cloudinary
    const documents = [];
    if (req.files) {
      try {
        if (req.files.gstCertificate) {
          const cloudUrl = await uploadToCloudinary(req.files.gstCertificate[0].buffer, 'swastik-vendors');
          documents.push(cloudUrl);
        }
        if (req.files.panCard) {
          const cloudUrl = await uploadToCloudinary(req.files.panCard[0].buffer, 'swastik-vendors');
          documents.push(cloudUrl);
        }
      } catch (uploadErr) {
        console.error('[AUTH PROXY ERROR] Cloudinary Transmission Failure:', uploadErr);
        return res.status(500).json({ success: false, message: 'Document synchronization failed.' });
      }
    }

    // Manually reconstruct nested objects from flat body (bankDetails[key])
    const bankDetails = {
      accountName: req.body['bankDetails[accountName]'] || '',
      accountNumber: req.body['bankDetails[accountNumber]'] || '',
      ifscCode: req.body['bankDetails[ifscCode]'] || '',
      bankName: req.body['bankDetails[bankName]'] || ''
    };

    const vendorProfile = {
      companyName: req.body.companyName || '',
      gstNumber: req.body.gstNumber || '',
      registrationLicenseId: req.body.registrationLicenseId || '',
      address: req.body.address || '',
      bankDetails,
      documents
    };

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'Vendor',
      vendorProfile
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({ success: true, token, user });
  } catch (err) {
    next(err);
  }
});

// Login User
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(200).json({ success: true, token, user });
  } catch (err) {
    next(err);
  }
});

// Get Current User
router.get('/me', protect, async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

module.exports = router;
