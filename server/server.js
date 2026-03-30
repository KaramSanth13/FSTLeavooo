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
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Allow any Vercel deployment dynamically, OR exact matches in the array
        if (origin.endsWith('.vercel.app') || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('CORS blocked this origin:', origin); // Helps with debugging!
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly allow all methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Explicitly allow your headers
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

// Route files
const auth = require('./routes/auth');
const leave = require('./routes/leave');

// Mount routers
app.use('/api/auth', auth);
app.use('/api/leaves', leave);

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));