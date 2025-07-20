const express = require('express');
const { initiateGitHubAuth, githubAuthCallback, getUserRepositories } = require('../controllers/githubController');
const { authenticateUser } = require('../middleware/authMiddleware');

const router = express.Router();

// Initiate GitHub OAuth flow. The `state` parameter is crucial for security
// and maintaining context (e.g., associating with a Clerk user session).
// The frontend should dynamically append the Clerk user ID to this state.
router.get('/auth', initiateGitHubAuth);

// GitHub OAuth callback. The frontend will redirect here.
// Ensure this route matches your registered GitHub OAuth App's callback URL.
// The 'state' query param from GitHub's redirect will contain the Clerk user ID.
router.get('/callback', githubAuthCallback);

router.get('/repos', authenticateUser, getUserRepositories);

module.exports = router;