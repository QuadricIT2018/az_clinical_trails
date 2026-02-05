const mongoose = require('mongoose');

const cellTherapyInterestSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v.replace(/\D/g, ''));
      },
      message: 'Please enter a valid 10-digit phone number'
    }
  },
  zipCode: {
    type: String,
    required: [true, 'ZIP code is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^\d{5}$/.test(v);
      },
      message: 'Please enter a valid 5-digit ZIP code'
    }
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [18, 'Must be 18 years or older to participate'],
    max: [120, 'Please enter a valid age']
  },
  currentDiagnosis: {
    type: String,
    required: [true, 'Current diagnosis is required'],
    trim: true
  },
  currentHealthStatus: {
    type: String,
    required: [true, 'Current health status is required'],
    trim: true
  },
  trialNctId: {
    type: String,
    trim: true,
    default: null
  },
  trialTitle: {
    type: String,
    trim: true,
    default: null
  },
  formType: {
    type: String,
    default: 'Cell Therapy Interest'
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'eligible', 'not_eligible', 'enrolled', 'withdrawn'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient querying
cellTherapyInterestSchema.index({ email: 1 });
cellTherapyInterestSchema.index({ trialNctId: 1 });
cellTherapyInterestSchema.index({ status: 1 });
cellTherapyInterestSchema.index({ createdAt: -1 });

module.exports = mongoose.model('CellTherapyInterest', cellTherapyInterestSchema);
