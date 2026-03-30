const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: [true, 'Please add a start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please add an end date']
  },
  reason: {
    type: String,
    required: [true, 'Please add a reason']
  },
  medicalCertificate: {
    type: Boolean,
    default: false
  },
  attachmentUrl: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Pending', 'HOD_Approved', 'Final_Approved', 'Rejected'],
    default: 'Pending'
  },
  recommendationTag: {
    type: String,
    enum: ['High Load', 'Risky', 'Safe']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LeaveRequest', LeaveSchema);
