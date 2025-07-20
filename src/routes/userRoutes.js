// src/routes/userRoutes.js
const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { validate, validateUserProfileUpdate } = require('../utils/validator'); // <-- ADD THIS

const router = express.Router();

router.use(authenticateUser); // All user profile routes are protected

router.get('/profile', getUserProfile);
router.put('/profile', validateUserProfileUpdate, validate, updateUserProfile); // <-- ADD VALIDATION

module.exports = router;