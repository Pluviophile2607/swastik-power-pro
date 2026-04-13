const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  invoiceNumber: { type: String, required: true },
  fileUrl: { type: String, required: true }, // URL to uploaded document
  status: { 
    type: String, 
    enum: ['Uploaded', 'Approved', 'Paid', 'Rejected'], 
    default: 'Uploaded' 
  },
  transactionRef: { type: String },
  paymentMode: { type: String, enum: ['NEFT', 'RTGS', 'IMPS'] },
  paidAt: { type: Date },
  financeNotes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
