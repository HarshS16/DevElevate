const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Body parser for JSON
// If you're expecting form-data (e.g., file uploads), you'll add 'multer' or 'express-fileupload' here later.

// Basic Route (for testing)
app.get('/', (req, res) => {
    res.send('AI Resume Refiner Backend API is running!');
});

// Import and use routes (will add these later)
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/github', require('./routes/githubRoutes'));
// etc.

// Error handling middleware (should be last)
app.use(errorHandler);
// ...
// Middleware
app.use(cors());
app.use(express.json()); // For regular JSON bodies
// For Clerk webhooks, Clerk recommends using `express.raw` to get the raw body
// and then JSON.parse it in the controller if needed, but `express.json()` usually works.
// For robustness with webhooks, handle it specifically in authRoutes.js with `express.raw()`.

// ...
// Import and use routes
app.use('/api/auth', require('./routes/authRoutes'));
// ...

module.exports = app;