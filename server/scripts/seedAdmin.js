require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Synchronized...');

    const adminEmail = 'swastikpowerpro369@gmail.com';
    const adminExists = await User.findOne({ email: adminEmail });

    if (adminExists) {
      console.log('Admin already exists in system protocol. Updating password...');
      adminExists.password = 'swastikpower@123.';
      await adminExists.save();
      console.log('Admin credentials synchronized.');
    } else {
      await User.create({
        name: 'Swastik Admin Force',
        email: adminEmail,
        password: 'swastikpower@123.',
        role: 'Admin'
      });
      console.log('New Admin Command initialized successfully.');
    }

    process.exit(0);
  } catch (err) {
    console.error('System synchronization failed:', err.message);
    process.exit(1);
  }
};

seedAdmin();
