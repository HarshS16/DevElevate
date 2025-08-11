const { Webhook } = require('svix');
const { CLERK_WEBHOOK_SECRET } = require('../config');
const User = require('../models/User'); // Model will be created soon

// Middleware to verify Clerk webhooks
const verifyClerkWebhook = async (req, res, next) => {
    const WEBHOOK_SECRET = CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        console.error('CLERK_WEBHOOK_SECRET is not set. Webhook verification skipped.');
        // In production, you might want to throw an error here.
        // For development, we might allow it to pass for testing purposes, but log a warning.
        // return res.status(500).send('Internal Server Error: Missing webhook secret.');
        return next(); // Skip verification if secret not set (for dev convenience, but dangerous in prod)
    }

    const headers = req.headers;
    // Clerk webhook body often comes as raw, not parsed JSON
    const payload = req.body.toString(); // Ensure body is a string

    const svix_id = headers['svix-id'];
    const svix_timestamp = headers['svix-timestamp'];
    const svix_signature = headers['svix-signature'];

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return res.status(400).send('No svix headers');
    }

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt;

    try {
        evt = wh.verify(payload, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        });
    } catch (err) {
        console.error('Error verifying webhook:', err.message);
        return res.status(400).json({ error: err.message });
    }

    req.clerkEvent = evt; // Attach the verified event to the request
    next();
};

// Middleware to protect routes for authenticated users
const authenticateUser = async (req, res, next) => {
    // In a real scenario with Clerk, you would typically verify the Clerk session token
    // (JWT) sent from the frontend in the Authorization header.
    // Clerk's `@clerk/express` SDK provides specific middleware for this.
    // For this boilerplate, we'll assume the frontend sends the Clerk userId
    // in a custom header (e.g., 'x-clerk-user-id') for simplicity.
    // REPLACE THIS WITH ACTUAL JWT VERIFICATION IN PRODUCTION.

    const userId = req.headers['x-clerk-user-id']; // Example: Frontend sends Clerk userId

    if (!userId) {
        return res.status(401).json({ message: 'Authentication required. No user ID provided (x-clerk-user-id header missing).' });
    }

    try {
        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found in database. Please ensure user is synced via Clerk webhooks.' });
        }
        req.user = user; // Attach user object from DB to request
        next();
    } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(500).json({ message: 'Server error during authentication.' });
    }
};

module.exports = {
    verifyClerkWebhook,
    authenticateUser
};