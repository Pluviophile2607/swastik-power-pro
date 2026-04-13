const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const Notification = require('../models/Notification');
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const { uploadToCloudinary } = require('../config/cloudinaryConfig');

// Configure Multer for memory storage (buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload an invoice (Vendor only)
router.post('/upload', protect, authorize(['Vendor']), upload.single('invoiceFile'), async (req, res) => {
  try {
    const { projectId, amount, invoiceNumber } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No invoice file provided' });
    }

    // Upload to Cloudinary
    const cloudUrl = await uploadToCloudinary(req.file.buffer, 'swastik-invoices');

    const invoice = await Invoice.create({
      projectId,
      vendorId: req.user._id,
      amount,
      invoiceNumber,
      fileUrl: cloudUrl
    });

    res.status(201).json({ success: true, invoice });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Get vendor's own invoices (Vendor only)
router.get('/my-invoices', protect, authorize(['Vendor']), async (req, res) => {
  try {
    const invoices = await Invoice.find({ vendorId: req.user._id })
      .populate('projectId', 'consumerInfo.name propertyDetails.city statusTimeline.currentStage');
    res.status(200).json({ success: true, invoices });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Get pending invoices for review (Finance/Admin only, or Manager with finance permission)
router.get('/pending-invoices', protect, authorize(['Finance', 'Admin', 'Manager'], 'finance'), async (req, res) => {
  try {
    const { status } = req.query;
    let query = { status: 'Uploaded' };
    
    if (status) {
      if (status.includes(',')) {
        query = { status: { $in: status.split(',') } };
      } else {
        query = { status };
      }
    }
    
    const invoices = await Invoice.find(query)
      .populate('projectId')
      .populate('vendorId', 'name vendorProfile');
    res.status(200).json({ success: true, invoices });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Update invoice status (Finance / Admin / Manager with finance permission)
router.put('/review/:id', protect, authorize(['Finance', 'Admin', 'Manager'], 'finance'), async (req, res) => {
  try {
    const { status, financeNotes } = req.body;
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
        return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    invoice.status = status;
    invoice.financeNotes = financeNotes;
    if (status === 'Paid') {
      invoice.paidAt = Date.now();
    }
    
    await invoice.save();

    // Create Notification
    await Notification.create({
      userId: invoice.vendorId,
      title: `Financial Status: ${status}`,
      message: `Invoice #${invoice.invoiceNumber} for ₹${invoice.amount} has been ${status.toLowerCase()}.${financeNotes ? ` Note: ${financeNotes}` : ''}`,
      type: 'invoice'
    });

    res.status(200).json({ success: true, message: `Invoice marked as ${status}`, invoice });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Batch pay invoices (Finance / Admin only)
router.post('/batch-pay', protect, authorize(['Finance', 'Admin']), async (req, res) => {
  try {
    const { invoiceIds, paymentDate, transactionRef, paymentMode } = req.body;

    if (!invoiceIds || !Array.isArray(invoiceIds)) {
      return res.status(400).json({ success: false, message: 'Invalid invoice IDs' });
    }

    const invoices = await Invoice.find({ _id: { $in: invoiceIds }, status: 'Approved' });

    if (invoices.length === 0) {
      return res.status(404).json({ success: false, message: 'No approved invoices found for payment' });
    }

    await Invoice.updateMany(
      { _id: { $in: invoiceIds } },
      { 
        $set: { 
          status: 'Paid', 
          transactionRef, 
          paymentMode, 
          paidAt: paymentDate || Date.now() 
        } 
      }
    );

    // Create notifications for each vendor
    for (const inv of invoices) {
      await Notification.create({
        userId: inv.vendorId,
        title: 'Payment Disbursed',
        message: `Payment of ₹${inv.amount} for Invoice #${inv.invoiceNumber} has been successfully disbursed via ${paymentMode}. Ref: ${transactionRef}`,
        type: 'invoice'
      });
    }

    res.status(200).json({ success: true, message: `${invoices.length} invoices processed successfully` });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
