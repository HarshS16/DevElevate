const express = require('express');
const { handleClerkWebhook, getMe } = require('../controllers/authController');
const { verifyClerkWebhook, authenticateUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/webhook', express.raw({ type: 'application/json' }), verifyClerkWebhook, handleClerkWebhook);
router.get('/me', authenticateUser, getMe);

module.exports = router;