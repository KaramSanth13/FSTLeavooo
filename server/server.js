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
app.use(cors({
    origin: [
        'http://localhost:4200',                 // Angular Local
        'http://localhost:5173',                 // React Local (Vite)
        'https://fst-leavooo-react.vercel.app',  // React Live
        'https://fst-leavooo-angular.vercel.app' // Angular Live
    ],
    credentials: true // Important if you ever use cookies/sessions
}));

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
            // This ensures Swagger works locally AND on Render
            url: process.env.NODE_ENV === 'production' 
                ? 'https://leavooo-backend-api.onrender.com' // Replace with your actual Render URL later
                : 'http://localhost:5000',
            description: 'API Server'
        }
    ],
    paths: {
        // We will add paths here later
    }
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