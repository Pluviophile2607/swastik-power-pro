require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');

const debug = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');

    const user = await User.findOne({ email: 'swastikpower@gmail.com' });
    if (user) {
      console.log('Admin found: YES');
      const isMatch = await user.comparePassword('swastikpower@123.');
      console.log('Password Match for swastikpower@123. :', isMatch ? 'YES' : 'NO');
    } else {
      console.log('Admin found: NO');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

debug();
