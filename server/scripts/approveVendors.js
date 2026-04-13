const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

async function approveAllVendors() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Successfully connected to MongoDB Cluster.');

    const result = await User.updateMany(
      { role: 'Vendor', 'vendorProfile.onboardingStatus': 'Pending' },
      { 
        $set: { 
          'vendorProfile.onboardingStatus': 'Approved',
          'vendorProfile.registrationLicenseId': `SPP-2026-${Math.floor(1000 + Math.random() * 9000)}`
        } 
      }
    );

    console.log(`Synchronization complete. Approved ${result.modifiedCount} vendors.`);
    process.exit(0);
  } catch (err) {
    console.error('Diagnostic error during approval sequence:', err);
    process.exit(1);
  }
}

approveAllVendors();
