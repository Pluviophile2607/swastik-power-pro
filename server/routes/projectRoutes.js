const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const { uploadToCloudinary } = require('../config/cloudinaryConfig');

// Configure Multer for memory storage (buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload Design Document (Admin/Manager only, or Manager with projects permission)
router.post('/:id/upload-design', protect, authorize(['Admin', 'Manager'], 'projects'), upload.single('designFile'), async (req, res) => {
  try {
    const { designNote } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No design file provided' });
    }

    // Upload to Cloudinary
    const cloudUrl = await uploadToCloudinary(req.file.buffer, 'swastik-designs');

    project.statusTimeline.designProtocol = {
        blueprintUrl: cloudUrl,
        notes: designNote || 'Blueprints finalized and uploaded.',
        finalizedAt: Date.now()
    };

    await project.save();

    res.status(200).json({ success: true, message: 'Design protocol uploaded successfully', project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Submit a new solar project request (Vendor only)
router.post('/submit', protect, authorize(['Vendor']), async (req, res) => {
  try {
    const { consumerInfo, propertyDetails, energyProfile } = req.body;
    
    // Check if vendor is approved
    if (req.user.vendorProfile.onboardingStatus !== 'Approved') {
      return res.status(403).json({ 
        success: false, 
        message: 'Your account is pending approval. You cannot submit projects yet.' 
      });
    }

    const project = await Project.create({
      vendorId: req.user._id,
      consumerInfo,
      propertyDetails,
      energyProfile
    });

    res.status(201).json({ success: true, project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Submit multiple solar project requests in batch (Vendor only)
router.post('/submit-batch', protect, authorize(['Vendor']), async (req, res) => {
  try {
    const { projects } = req.body;

    if (!projects || !Array.isArray(projects) || projects.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid project batch data.' });
    }

    // Check if vendor is approved
    if (req.user.vendorProfile.onboardingStatus !== 'Approved') {
      return res.status(403).json({ 
        success: false, 
        message: 'Your account is pending approval. You cannot submit projects yet.' 
      });
    }

    const projectsToCreate = projects.map(p => ({
      vendorId: req.user._id,
      consumerInfo: p.consumerInfo,
      propertyDetails: p.propertyDetails,
      energyProfile: p.energyProfile
    }));

    const createdProjects = await Project.insertMany(projectsToCreate);

    res.status(201).json({ 
      success: true, 
      message: `${createdProjects.length} projects successfully synchronized.`,
      projects: createdProjects 
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Get projects for the logged-in vendor
router.get('/my-projects', protect, authorize(['Vendor']), async (req, res) => {
  try {
    const projects = await Project.find({ vendorId: req.user._id });
    res.status(200).json({ success: true, projects });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Get project details and timeline (Vendor, Admin, Manager with projects permission)
router.get('/:id', protect, authorize(['Vendor', 'Admin', 'Manager'], 'projects'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('vendorId', 'name vendorProfile');
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (req.user.role === 'Vendor' && project.vendorId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to restricted project vector' });
    }

    res.status(200).json({ success: true, project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Update project status (Admin or Manager with projects permission)
router.patch('/:id/status', protect, authorize(['Admin', 'Manager'], 'projects'), async (req, res) => {
  try {
    const { currentStage, note, surveyDetails, financialMetrics, designProtocol } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Capture dynamic fields if provided
    if (surveyDetails) project.statusTimeline.surveyDetails = { ...project.statusTimeline.surveyDetails, ...surveyDetails };
    if (financialMetrics) project.statusTimeline.financialMetrics = { ...project.statusTimeline.financialMetrics, ...financialMetrics };
    if (designProtocol) project.statusTimeline.designProtocol = { ...project.statusTimeline.designProtocol, ...designProtocol };

    // Update current stage and history
    if (currentStage) {
      project.statusTimeline.currentStage = currentStage;
      project.statusTimeline.stages.push({
        name: currentStage,
        status: 'Completed',
        note,
        updatedBy: req.user._id,
        updatedAt: Date.now()
      });
    }

    await project.save();

    // Create Notification for Vendor
    const Notification = require('../models/Notification');
    await Notification.create({
      userId: project.vendorId,
      title: 'Project Protocol Update',
      message: `Your solar installation for ${project.consumerInfo.name} has moved to: ${currentStage}.`,
      type: 'project'
    });

    res.status(200).json({ success: true, message: 'Project status updated', project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
