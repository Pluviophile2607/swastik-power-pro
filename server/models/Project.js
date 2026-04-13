const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  consumerInfo: {
    name: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String }
  },
  propertyDetails: {
    address: { type: String, required: true },
    roofType: { type: String }, // e.g., RCC, Tinubu, etc.
    availableSpace: { type: String }, // in sq ft
    photos: [String]
  },
  energyProfile: {
    monthlyBill: { type: Number },
    desiredCapacity: { type: Number } // in kW
  },
  statusTimeline: {
    currentStage: { 
      type: String, 
      enum: [
        'Form Submitted',
        'Under Review',
        'Approved',
        'Site Survey Scheduled',
        'Site Survey Completed',
        'Design Prepared',
        'Quotation Generated',
        'Purchase Order Issued',
        'Materials Procured',
        'Installation In Progress',
        'Installation Completed',
        'Inspection & Commissioning',
        'Completed'
      ],
      default: 'Form Submitted'
    },
    stages: [
      {
        name: String,
        status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
        note: String,
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        updatedAt: { type: Date, default: Date.now }
      }
    ],
    // Dynamic fields for specific stages
    surveyDetails: {
      date: Date,
      time: String,
      engineerName: String
    },
    designProtocol: {
      fileUrl: String,
      uploadedAt: Date
    },
    financialMetrics: {
      quotationAmount: Number,
      poNumber: String,
      poDate: Date
    }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);
