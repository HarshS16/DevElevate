const githubService = require('../services/githubService');
const User = require('../models/User');
const config = require('../config');

const initiateGitHubAuth = (req, res) => {
    const { GITHUB_CLIENT_ID } = config;
    // The redirect_uri should match what's configured in your GitHub OAuth App
    const redirectUri = encodeURIComponent(`${req.protocol}://${req.get('host')}/api/github/callback`);
    res.redirect(
        `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=repo,user`
    );
};

const githubAuthCallback = async (req, res, next) => {
    const { code } = req.query;
    const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = config;
    const clerkUserId = req.query.state; // Assuming 'state' is used to pass Clerk user ID

    if (!code) {
        return res.status(400).json({ message: 'GitHub authorization code missing.' });
    }

    try {
        const accessToken = await githubService.getAccessToken(
            code,
            GITHUB_CLIENT_ID,
            GITHUB_CLIENT_SECRET
        );

        if (!accessToken) {
            return res.status(500).json({ message: 'Failed to retrieve GitHub access token.' });
        }

        const githubProfile = await githubService.getUserProfile(accessToken);

        // Find user by Clerk ID and update
        const user = await User.findOneAndUpdate(
            { clerkId: clerkUserId }, // Match by Clerk ID
            {
                githubAccessToken: accessToken,
                githubUsername: githubProfile.username,
                // You might want to store more profile data here
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found in database for GitHub linking.' });
        }

        // Redirect back to frontend, perhaps with a success message or to a dashboard
        // You might need to adjust this redirect to your frontend's success page
        res.redirect(`${config.CLERK_FRONTEND_API_URL}/dashboard?githubLinked=true`); // Example frontend redirect

    } catch (error) {
        console.error('GitHub authentication callback error:', error);
        next(error);
    }
};

const getUserRepositories = async (req, res, next) => {
    try {
        const user = req.user; // From authenticateUser middleware
        if (!user || !user.githubAccessToken) {
            return res.status(400).json({ message: 'GitHub not linked or access token missing.' });
        }
        const repos = await githubService.getUserRepos(user.githubAccessToken);
        res.status(200).json(repos);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    initiateGitHubAuth,
    githubAuthCallback,
    getUserRepositories,
};