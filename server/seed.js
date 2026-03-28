const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vidumurai');

const users = [
  {
    name: 'Admin User',
    email: 'admin@collegename.edu',
    password: 'password123',
    role: 'Admin',
    leaveBalance: 20
  },
  {
    name: 'HOD User',
    email: 'hod@collegename.edu',
    password: 'password123',
    role: 'HOD',
    leaveBalance: 15
  },
  {
    name: 'Anand',
    email: 'anand@staff.collegename.edu',
    password: 'password123',
    role: 'Staff',
    leaveBalance: 15
  },
  {
    name: 'Karam Santh N',
    email: 'karam@student.collegename.edu',
    password: 'password123',
    role: 'Student',
    leaveBalance: 10
  },
  {
    name: 'Shanjana G',
    email: 'shanjana@student.collegename.edu',
    password: 'password123',
    role: 'Student',
    leaveBalance: 8
  },
  {
    name: 'Scholar Student',
    email: 'scholar@student.collegename.edu',
    password: 'password123',
    role: 'Student',
    leaveBalance: 12
  }
];

// Import into DB
const importData = async () => {
  try {
    await User.deleteMany();
    await User.create(users);
    console.log('Seed data successfully populated!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

importData();
