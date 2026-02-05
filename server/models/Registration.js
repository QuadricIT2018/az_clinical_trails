const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  age: {
    type: Number,
    min: [18, 'Must be 18 years or older to participate']
  },
  zipCode: {
    type: String,
    trim: true
  },
  healthInfo: {
    type: String,
    trim: true
  },
  // Legacy fields - kept for backwards compatibility
  dateOfBirth: {
    type: Date
  },
  researchArea: {
    type: String,
    enum: ['Cell Therapy', 'Respiratory', 'Oncology', 'Diabetes', 'Other']
  },
  medicalConditions: {
    type: String,
    trim: true
  },
  consent: {
    type: Boolean,
    required: [true, 'Consent is required'],
    validate: {
      validator: function(v) {
        return v === true;
      },
      message: 'You must consent to participate'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Registration', registrationSchema);
