const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const LeaveRequest = require('./models/Leave');
const { logAction } = require('./controllers/stats');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vidumurai');

const users = [
  {
    name: 'Admin User',
    email: 'admin@ceg.in',
    password: 'password123',
    role: 'Admin',
    leaveBalance: 20
  },
  {
    name: 'HOD CSE',
    email: 'hod@hod.cse.ceg.in',
    password: 'password123',
    role: 'HOD',
    leaveBalance: 15
  },
  {
    name: 'Anand',
    email: 'anand@staff.ceg.in',
    password: 'password123',
    role: 'Staff',
    leaveBalance: 15
  },
  {
    name: 'Karam Santh N',
    email: 'karam@student.ceg.in',
    password: 'password123',
    role: 'Student',
    leaveBalance: 10
  },
  {
    name: 'Shanjana G',
    email: 'shanjana@student.ceg.in',
    password: 'password123',
    role: 'Student',
    leaveBalance: 8
  },
  {
    name: 'Scholar Student',
    email: 'scholar@student.ceg.in',
    password: 'password123',
    role: 'Student',
    leaveBalance: 12
  }
];

// Import into DB
const importData = async () => {
  try {
    await User.deleteMany();
    await LeaveRequest.deleteMany();
    
    // Create users first to get IDs
    const createdUsers = await User.create(users);
    const student = createdUsers.find(u => u.role === 'Student');
    const staff = createdUsers.find(u => u.role === 'Staff');
    const hod = createdUsers.find(u => u.role === 'HOD');

    if (student && staff && hod) {
      // Create some sample leaves
      const sampleLeaves = [
        {
          userId: student._id,
          startDate: new Date(),
          endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          reason: 'Going home for festival',
          status: 'Pending'
        },
        {
          userId: student._id,
          startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          reason: 'Medical checkup',
          status: 'Final_Approved',
          medicalCertificate: true
        }
      ];
      await LeaveRequest.create(sampleLeaves);
      console.log('Sample leaves created!');
    }

    console.log('Seed data successfully populated!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

importData();
