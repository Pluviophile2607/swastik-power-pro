const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Operator name required for protocol transmission.']
  },
  email: {
    type: String,
    required: [true, 'Digital endpoint (Email) required for synchronization.']
  },
  mobile: {
    type: String,
    required: [true, 'Mobile contact protocol required.']
  },
  type: {
    type: String,
    required: [true, 'Inquiry classification required.']
  },
  message: {
    type: String,
    default: 'Awaiting detailed transmission.'
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Resolved'],
    default: 'New'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Inquiry', InquirySchema);
