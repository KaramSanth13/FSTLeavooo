const LeaveRequest = require('../models/Leave');
const User = require('../models/User');
const { logAction } = require('./stats');

// @desc    Get all leaves (Approvers see all, Users see own)
// @route   GET /api/leaves
// @access  Private
exports.getLeaves = async (req, res, next) => {
  try {
    let query;

    if (req.user.role === 'Student' || req.user.role === 'Staff') {
      query = LeaveRequest.find({ userId: req.user.id });
    } else {
      query = LeaveRequest.find().populate({
        path: 'userId',
        select: 'name role email leaveBalance'
      });
    }

    let leaves = await query;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Rule 4: Rule-based tags (AI-Like Engine) only applied when sending to approvers
    if (req.user.role === 'HOD' || req.user.role === 'Admin') {
      const allActiveLeaves = await LeaveRequest.find({
         status: { $in: ['Pending', 'HOD_Approved', 'Final_Approved'] },
         endDate: { $gte: today }
      });
      
      const modifiedLeaves = leaves.map(leave => {
        const l = leave.toObject();
        let tag = 'Safe';
        
        // Count overlapping active leaves roughly matching start date
        const overlapCount = allActiveLeaves.filter(al => {
           return (al.startDate <= leave.endDate && al.endDate >= leave.startDate) && al._id.toString() !== leave._id.toString();
        }).length;

        // < 3 leave balance check (requires populated userId)
        const balance = l.userId?.leaveBalance !== undefined ? l.userId.leaveBalance : 10;
        
        if (overlapCount > 5) {
          tag = 'High Load';
        } else if (balance < 3) {
          tag = 'Risky';
        }
        
        l.recommendationTag = tag;
        return l;
      });
      
      return res.status(200).json({ success: true, count: modifiedLeaves.length, data: modifiedLeaves });
    }

    res.status(200).json({ success: true, count: leaves.length, data: leaves });
  } catch (err) {
    next(err);
  }
};

// @desc    Apply for a leave
// @route   POST /api/leaves
// @access  Private (Students, Staff)
exports.createLeave = async (req, res, next) => {
  try {
    req.body.userId = req.user.id;
    const { startDate, endDate, reason } = req.body;

    if (!startDate || !endDate || !reason) {
      return res.status(400).json({ success: false, error: 'Please provide startDate, endDate and reason' });
    }

    // Rule: Medical certificate required for leaves > 3 days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (diffDays > 3 && !req.body.medicalCertificate) {
      return res.status(400).json({ 
        success: false, 
        error: 'Medical certificate is required for leaves longer than 3 days.' 
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Rule 1 (Lockout): If a user has an active leave, block application.
    const activeLeave = await LeaveRequest.findOne({
      userId: req.user.id,
      status: { $in: ['Pending', 'HOD_Approved', 'Final_Approved'] },
      endDate: { $gte: today }
    });

    if (activeLeave) {
      return res.status(403).json({ success: false, error: 'Cannot apply: You currently have an active leave.' });
    }


    const leave = await LeaveRequest.create(req.body);
    
    // Log creation
    await logAction(leave._id, req.user.id, 'Created', null, 'Pending', 'Initial application');

    res.status(201).json({ success: true, data: leave });
  } catch (err) {
    next(err);
  }
};

// @desc    Modify End Date of active leave
// @route   PUT /api/leaves/modify/:id
// @access  Private (Owner of leave)
exports.modifyLeaveEndDate = async (req, res, next) => {
  try {
    const { endDate } = req.body;
    let leave = await LeaveRequest.findById(req.params.id);

    if (!leave) return res.status(404).json({ success: false, error: 'Leave not found' });
    if (leave.userId.toString() !== req.user.id) {
       return res.status(403).json({ success: false, error: 'Not authorized to modify this leave' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentEnd = new Date(leave.endDate);

    // Rule 2 (Modification): Put endpoint allowing extension ONLY if current date <= endDate
    if (today > currentEnd) {
      return res.status(403).json({ success: false, error: 'Cannot modify past leaves' });
    }
    
    // Ensure new end date is at least the existing start date
    if (new Date(endDate) < new Date(leave.startDate)) {
      return res.status(400).json({ success: false, error: 'End Date cannot be before Start Date' });
    }

    const oldStatus = leave.status;
    leave.endDate = new Date(endDate);
    leave.status = 'Pending';
    
    await leave.save();

    // Log modification
    await logAction(leave._id, req.user.id, 'Modified', oldStatus, 'Pending', `Extended end date to ${endDate}`);

    res.status(200).json({ success: true, data: leave });
  } catch (err) {
    next(err);
  }
};

// @desc    Update leave status (Approve/Reject flow)
// @route   PUT /api/leaves/:id
// @access  Private (HOD, Admin)
exports.updateLeave = async (req, res, next) => {
  try {
    const { status } = req.body;
    let leave = await LeaveRequest.findById(req.params.id).populate('userId');

    if (!leave) return res.status(404).json({ success: false, error: 'Leave not found' });

    // Rule 3 (Workflow): Student/Staff > HOD > Admin. Logic is handled in frontend buttons natively but restricted here.
    if (req.user.role === 'HOD' && status === 'Final_Approved') {
       return res.status(403).json({ success: false, error: 'HODs cannot give Final approval directly.'});
    }

    const oldStatus = leave.status;
    leave.status = status;
    await leave.save();

    // Log update
    await logAction(leave._id, req.user.id, status, oldStatus, status, `Status changed by ${req.user.role}`);

    // Reduce balance on final approval
    if (status === 'Final_Approved') {
      const user = await User.findById(leave.userId);
      const leaveDays = Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1;
      user.leaveBalance = Math.max(0, user.leaveBalance - leaveDays);
      await user.save();
    }

    res.status(200).json({ success: true, data: leave });
  } catch (err) {
    next(err);
  }
};
