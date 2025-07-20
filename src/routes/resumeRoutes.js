// src/routes/resumeRoutes.js
const express = require('express');
const {
    uploadResume,
    getResumes,
    getResumeById,
    enhanceResume,
    buildResumeFromScratch,
    deleteResume
} = require('../controllers/resumeController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { validate, validateResumeInput } = require('../utils/validator'); // <-- ADD THIS

const router = express.Router();

// All resume routes should be protected
router.use(authenticateUser);

// Apply validation to the routes that receive user input
router.post('/upload', uploadResume); // File upload logic needs specific handling, validation for other fields (if any)
router.post('/build', validateResumeInput, validate, buildResumeFromScratch); // <-- ADD VALIDATION
router.put('/:id/enhance', validateResumeInput, validate, enhanceResume); // <-- ADD VALIDATION
router.get('/', getResumes);
router.get('/:id', getResumeById);
router.delete('/:id', deleteResume);

module.exports = router;