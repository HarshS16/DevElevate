const { Webhook } = require('svix');
const { CLERK_WEBHOOK_SECRET } = require('../config');
const User = require('../models/User'); // Will create this soon

// Middleware to verify Clerk webhooks
const verifyClerkWebhook = async (req, res, next) => {
    const WEBHOOK_SECRET = CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        console.error('CLERK_WEBHOOK_SECRET is not set.');
        return res.status(500).send('Internal Server Error: Missing webhook secret.');
    }

    const headers = req.headers;
    const payload = JSON.stringify(req.body);

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

// Middleware to protect routes for authenticated users (Clerk's session token verification)
// For production, you'd use Clerk's `@clerk/express` SDK middleware or similar to verify JWTs.
// For now, a placeholder assuming the frontend sends a valid Clerk session token.
const authenticateUser = async (req, res, next) => {
    // In a real scenario, you'd verify the Clerk session token (e.g., from Authorization: Bearer token)
    // For simplicity, we'll assume a 'userId' header for testing, but replace with actual Clerk token verification.
    const userId = req.headers['x-clerk-user-id']; // Example: Frontend sends Clerk userId in a custom header

    if (!userId) {
        return res.status(401).json({ message: 'Authentication required. No user ID provided.' });
    }

    try {
        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found in database.' });
        }
        req.user = user; // Attach user object to request
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