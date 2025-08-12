
// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/db');
// const errorHandler = require('./middleware/errorHandler');

// const app = express();

// // Connect Database
// connectDB();

// // Middleware
// app.use(cors()); // Allow cross-origin requests

// // --- CRITICAL FIX FOR WEBHOOK BODY PARSING ---
// // Apply express.json() conditionally, skipping the webhook route
// // This ensures express.raw() (in authRoutes) gets the raw body for webhooks.
// app.use((req, res, next) => {
//     // If the request URL is exactly the webhook route AND it's a POST request,
//     // then we skip express.json() because express.raw() will handle it in authRoutes.js
//     if (req.originalUrl === '/api/auth/webhook' && req.method === 'POST') {
//         // console.log("Skipping express.json for webhook."); // Optional debug log
//         return next(); // Skip express.json for this specific webhook path
//     }
//     // For all other requests, use express.json() to parse JSON bodies
//     // console.log("Applying express.json for non-webhook route:", req.originalUrl); // Optional debug log
//     express.json()(req, res, next);
// });
// // --- END CRITICAL FIX ---


// // Basic Route (for testing)
// app.get('/', (req, res) => {
//     res.send('AI Resume Refiner Backend API is running!');
// });

// // Import and use routes
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/github', require('./routes/githubRoutes'));
// app.use('/api/resumes', require('./routes/resumeRoutes'));
// app.use('/api/portfolios', require('./routes/portfolioRoutes'));
// app.use('/api/ai', require('./routes/aiRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));

// // Error handling middleware (should be last)
// app.use(errorHandler);

// module.exports = app;

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const config = require('./config'); // <--- ADD THIS LINE: Import config to access CLERK_FRONTEND_API_URL

const app = express();

// Connect Database
connectDB();

// Middleware
// --- CORS CONFIGURATION FOR PRODUCTION ---
// Handle both with and without trailing slash
const allowedOrigins = [
    config.CLERK_FRONTEND_API_URL,
    config.CLERK_FRONTEND_API_URL?.replace(/\/$/, ''), // Remove trailing slash
    config.CLERK_FRONTEND_API_URL?.replace(/\/$/, '') + '/', // Add trailing slash
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002'
].filter(Boolean).filter((url, index, arr) => arr.indexOf(url) === index); // Remove duplicates

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            console.log('Allowed origins:', allowedOrigins);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization', 'x-clerk-user-id'], // Allowed headers from frontend
    credentials: true // Allow cookies, authorization headers, etc.
}));
// --- END CORS CONFIGURATION ---

// --- CRITICAL FIX FOR WEBHOOK BODY PARSING ---
// Apply express.json() conditionally, skipping the webhook route
// This ensures express.raw() (in authRoutes) gets the raw body for webhooks.
app.use((req, res, next) => {
    // If the request URL is exactly the webhook route AND it's a POST request,
    // then we skip express.json() because express.raw() will handle it in authRoutes.js
    if (req.originalUrl === '/api/auth/webhook' && req.method === 'POST') {
        // console.log("Skipping express.json for webhook."); // Optional debug log
        return next(); // Skip express.json for this specific webhook path
    }
    // For all other requests, use express.json() to parse JSON bodies
    // console.log("Applying express.json for non-webhook route:", req.originalUrl); // Optional debug log
    express.json()(req, res, next);
});
// --- END CRITICAL FIX ---


// Basic Route (for testing)
app.get('/', (req, res) => {
    res.send('AI Resume Refiner Backend API is running!');
});

// Import and use routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/github', require('./routes/githubRoutes'));
app.use('/api/resumes', require('./routes/resumeRoutes'));
app.use('/api/portfolios', require('./routes/portfolioRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Error handling middleware (should be last)
app.use(errorHandler);

module.exports = app;