const LeaveRequest = require('../models/Leave');
const AuditLog = require('../models/AuditLog');
const User = require('../models/User');

// @desc    Get leave analytics
// @route   GET /api/leaves/stats/summary
// @access  Private (Admin, HOD)
exports.getStats = async (req, res, next) => {
  try {
    const stats = await LeaveRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const reasonStats = await LeaveRequest.aggregate([
      {
        $group: {
          _id: '$reason',
          count: { $sum: 1 }
        }
      },
      { $limit: 5 }
    ]);

    // Trend by month
    const trend = await LeaveRequest.aggregate([
      {
        $group: {
          _id: { $month: '$startDate' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary: stats,
        reasons: reasonStats,
        monthlyTrend: trend
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get audit logs for a leave
// @route   GET /api/leaves/audit/:id
// @access  Private
exports.getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find({ leaveId: req.params.id })
      .populate('actionBy', 'name role')
      .sort('-timestamp');

    res.status(200).json({
      success: true,
      data: logs
    });
  } catch (err) {
    next(err);
  }
};

// Helper for Audit Logging
exports.logAction = async (leaveId, actionBy, action, prevStatus, newStatus, remarks = '') => {
    try {
        await AuditLog.create({
            leaveId,
            actionBy,
            action,
            previousStatus: prevStatus,
            newStatus,
            remarks
        });
        console.log(`[Audit] Action ${action} recorded for Leave ${leaveId} by ${actionBy}`);
    } catch (err) {
        console.error('Audit Log Error:', err);
    }
};
