const User = require('../models/User');
const LeaveRequest = require('../models/Leave');
const { logAction } = require('./stats');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Dynamic Role Assignment Rules via email domain pattern matching (CEG.IN Syntax)
    let role = 'Student'; 
    const domain = email.split('@')[1];

    if (email === 'admin@ceg.in') {
      role = 'Admin';
    } else if (domain === 'student.ceg.in') {
      role = 'Student';
    } else if (domain && domain.startsWith('hod.') && domain.endsWith('.ceg.in')) {
      role = 'HOD';
    } else if (domain === 'staff.ceg.in') {
      role = 'Staff';
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role
    });

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect' });
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete user
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

// @desc    Seed database with sample data
// @route   POST /api/auth/seed
// @access  Public (Temporary for setup)
exports.seedDB = async (req, res, next) => {
  try {
    const users = [
      { name: 'Admin User', email: 'admin@ceg.in', password: 'password123', role: 'Admin', leaveBalance: 20 },
      { name: 'HOD CSE', email: 'hod@hod.cse.ceg.in', password: 'password123', role: 'HOD', leaveBalance: 15 },
      { name: 'Karam Santh N', email: 'karam@student.ceg.in', password: 'password123', role: 'Student', leaveBalance: 10 },
      { name: 'Shanjana G', email: 'shanjana@student.ceg.in', password: 'password123', role: 'Student', leaveBalance: 8 }
    ];

    await User.deleteMany();
    await LeaveRequest.deleteMany();
    
    const createdUsers = await User.create(users);
    const student = createdUsers.find(u => u.role === 'Student');

    if (student) {
      const sampleLeaves = [
        {
          userId: student._id,
          startDate: new Date(),
          endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          reason: 'Attend Symposium at CEG',
          status: 'Pending'
        },
        {
          userId: student._id,
          startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          reason: 'Family Emergency',
          status: 'Final_Approved',
          medicalCertificate: true
        }
      ];
      await LeaveRequest.create(sampleLeaves);
    }

    res.status(200).json({ success: true, message: 'Database seeded successfully!' });
  } catch (err) {
    next(err);
  }
};

// Get token from model and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      leaveBalance: user.leaveBalance
    }
  });
};
