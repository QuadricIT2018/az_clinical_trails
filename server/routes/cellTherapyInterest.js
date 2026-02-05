const express = require('express');
const router = express.Router();
const CellTherapyInterest = require('../models/CellTherapyInterest');

// @route   POST /api/cell-therapy-interest
// @desc    Submit cell therapy interest form
// @access  Public
router.post('/', async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobileNumber,
      zipCode,
      age,
      currentDiagnosis,
      currentHealthStatus,
      trialNctId,
      trialTitle,
      formType
    } = req.body;

    // Create new submission
    const submission = new CellTherapyInterest({
      fullName,
      email,
      mobileNumber: mobileNumber.replace(/\D/g, ''), // Store only digits
      zipCode,
      age: parseInt(age),
      currentDiagnosis,
      currentHealthStatus,
      trialNctId: trialNctId || null,
      trialTitle: trialTitle || null,
      formType: formType || 'Cell Therapy Interest'
    });

    await submission.save();

    res.status(201).json({
      success: true,
      message: 'Your interest has been submitted successfully. Our team will contact you within 3-5 business days.',
      data: {
        id: submission._id,
        submittedAt: submission.createdAt
      }
    });
  } catch (error) {
    console.error('Error submitting cell therapy interest:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    // Handle duplicate email (if user already submitted)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'An application with this email already exists. Our team will be in contact with you.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'There was an error submitting your form. Please try again later.'
    });
  }
});

// @route   GET /api/cell-therapy-interest
// @desc    Get all cell therapy interest submissions
// @access  Public (for admin dashboard with localStorage auth)
router.get('/', async (req, res) => {
  try {
    const { status, trialNctId, page = 1, limit = 100 } = req.query;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (trialNctId) filter.trialNctId = trialNctId;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const submissions = await CellTherapyInterest.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await CellTherapyInterest.countDocuments(filter);

    res.json({
      success: true,
      data: submissions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching cell therapy interest submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching submissions'
    });
  }
});

// @route   GET /api/cell-therapy-interest/:id
// @desc    Get single cell therapy interest submission
// @access  Public (for admin dashboard)
router.get('/:id', async (req, res) => {
  try {
    const submission = await CellTherapyInterest.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    res.json({
      success: true,
      data: submission
    });
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching submission'
    });
  }
});

// @route   PATCH /api/cell-therapy-interest/:id
// @desc    Update cell therapy interest submission status
// @access  Public (for admin dashboard)
router.patch('/:id', async (req, res) => {
  try {
    const { status, notes, emailSent } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (emailSent !== undefined) updateData.emailSent = emailSent;

    const submission = await CellTherapyInterest.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    res.json({
      success: true,
      message: 'Submission updated successfully',
      data: submission
    });
  } catch (error) {
    console.error('Error updating submission:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating submission'
    });
  }
});

// @route   DELETE /api/cell-therapy-interest/:id
// @desc    Delete cell therapy interest submission
// @access  Public (for admin dashboard)
router.delete('/:id', async (req, res) => {
  try {
    const submission = await CellTherapyInterest.findByIdAndDelete(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    res.json({
      success: true,
      message: 'Submission deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting submission'
    });
  }
});

module.exports = router;
