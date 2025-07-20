// src/routes/aiRoutes.js
const express = require('express');
const { generateCoverLetter, getATSScore } = require('../controllers/aiController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { validate, validateCoverLetterInput } = require('../utils/validator'); // <-- ADD THIS

const router = express.Router();

router.use(authenticateUser); // All AI routes are protected

router.post('/coverletter/generate', validateCoverLetterInput, validate, generateCoverLetter); // <-- ADD VALIDATION
router.post('/ats-score', validateCoverLetterInput, validate, getATSScore); // Stretch goal, same validation as CL for simplicity. // <-- ADD VALIDATION

module.exports = router;