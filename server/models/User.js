const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Vendor', 'Admin', 'Finance', 'Manager'], 
    default: 'Vendor' 
  },
  // Vendor specific details
  vendorProfile: {
    companyName: String,
    gstNumber: String,
    bankDetails: {
      accountName: String,
      accountNumber: String,
      ifscCode: String,
      bankName: String
    },
    onboardingStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    registrationLicenseId: String,
    documents: [String] // URLs to uploaded docs
  },
  // Manager specific details
  managerPermissions: {
    projects: { type: Boolean, default: false },
    approvals: { type: Boolean, default: false },
    analytics: { type: Boolean, default: false },
    finance: { type: Boolean, default: false },
    settings: { type: Boolean, default: false }
  },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
