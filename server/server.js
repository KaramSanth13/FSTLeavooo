// 1. Load env vars AT THE VERY TOP
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const errorHandler = require('./middleware/error');

// Connect to database
connectDB();

const app = express();

// Auto-seed admin and student if none exists
const User = require('./models/User');
const seedData = async () => {
    try {
        const adminCount = await User.countDocuments({ role: 'Admin' });
        if (adminCount === 0) {
            await User.create({
                name: 'System Admin',
                email: 'admin@ceg.in',
                password: 'password123',
                role: 'Admin'
            });
            console.log('✅ Default admin created: admin@ceg.in / password123');
        }
        const studentCount = await User.countDocuments({ role: 'Student' });
        if (studentCount === 0) {
            await User.create({
                name: 'Test Student',
                email: 'student@student.ceg.in',
                password: 'password123',
                role: 'Student'
            });
            console.log('✅ Default student created: student@student.ceg.in / password123');
        }
    } catch (err) {
        console.error('❌ Auto-seed failed:', err.message);
    }
};
seedData();

// Body parser
app.use(express.json());

// 2. Enable CORS (Only ONCE, with all your environments)
// 2. Enable CORS (Bulletproof Configuration)
const allowedOrigins = [
    'http://localhost:4200',
    'http://localhost:5173',
    'http://localhost:3000',
    'https://fst-leavooo-react.vercel.app',
    'https://fst-leavooo-angular.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (origin.endsWith('.vercel.app') || origin.includes('localhost') || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.warn(`🛑 CORS Blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// MUST ADD THIS: Catch the invisible preflight requests
app.options('*', cors());

// 3. Swagger Docs setup (Dynamic URLs)
const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'Leave Management API',
        version: '1.0.0',
        description: 'API documentation for the Leave Management System'
    },
    servers: [
        {
            url: process.env.NODE_ENV === 'production' 
                ? 'https://fstleavooo-production.up.railway.app' 
                : 'http://localhost:5000',
            description: 'API Server'
        }
    ],
    paths: {}
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health check and root API route
app.get('/api', (req, res) => {
    res.json({ success: true, message: 'Leavooo API is LIVE and reachabale! 🚀' });
});

// Import original routes
const auth = require('./routes/auth');
const leaves = require('./routes/leave');

// 4. Mount Original Routes
app.use('/api/auth', auth);
app.use('/api/leaves', leaves);

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));