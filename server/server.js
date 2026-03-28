const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const errorHandler = require('./middleware/error');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Swagger Docs setup
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Leave Management API',
    version: '1.0.0',
    description: 'API documentation for the Leave Management System'
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local server'
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

app.listen(PORT, console.log(`Server running on port ${PORT}`));
