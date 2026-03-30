const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  leaveId: {
    type: mongoose.Schema.ObjectId,
    ref: 'LeaveRequest',
    required: true
  },
  actionBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['Created', 'Modified', 'HOD_Approved', 'Final_Approved', 'Rejected']
  },
  previousStatus: String,
  newStatus: String,
  remarks: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
