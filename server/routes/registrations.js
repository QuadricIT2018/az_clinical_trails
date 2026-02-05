const express = require('express');
const Registration = require('../models/Registration');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/registrations
// @desc    Create a new registration
// @access  Public
router.post('/', async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      age,
      zipCode,
      healthInfo,
      // Legacy fields
      dateOfBirth,
      researchArea,
      medicalConditions,
      consent
    } = req.body;

    // Check if email already registered
    const existingRegistration = await Registration.findOne({ email });
    if (existingRegistration) {
      return res.status(400).json({ message: 'This email is already registered for a clinical trial' });
    }

    // Build registration data object
    const registrationData = {
      fullName,
      email,
      phone,
      consent
    };

    // Add new fields if provided
    if (age) registrationData.age = age;
    if (zipCode) registrationData.zipCode = zipCode;
    if (healthInfo) registrationData.healthInfo = healthInfo;

    // Add legacy fields if provided
    if (dateOfBirth) registrationData.dateOfBirth = dateOfBirth;
    if (researchArea) registrationData.researchArea = researchArea;
    if (medicalConditions) registrationData.medicalConditions = medicalConditions;

    const registration = await Registration.create(registrationData);

    res.status(201).json({
      message: 'Registration submitted successfully',
      registration: {
        _id: registration._id,
        fullName: registration.fullName,
        email: registration.email,
        status: registration.status
      }
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// @route   GET /api/registrations
// @desc    Get all registrations
// @access  Private (Admin only)
router.get('/', protect, async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/registrations/:id
// @desc    Get a single registration
// @access  Private (Admin only)
router.get('/:id', protect, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    res.json(registration);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/registrations/:id
// @desc    Update registration status
// @access  Private (Admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    res.json(registration);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/registrations/:id
// @desc    Delete a registration
// @access  Private (Admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const registration = await Registration.findByIdAndDelete(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    res.json({ message: 'Registration deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
