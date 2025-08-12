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
    try {
        // Check for Authorization header with Bearer token (JWT from Clerk)
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            // Fallback: check for x-clerk-user-id header (for backward compatibility)
            const userId = req.headers['x-clerk-user-id'];
            if (!userId) {
                return res.status(401).json({
                    message: 'Authentication required. No valid token or user ID provided.'
                });
            }

            // Use the user ID directly (legacy approach)
            let user = await User.findOne({ clerkId: userId });
            if (!user) {
                console.log(`User with clerkId ${userId} not found in database (legacy header). Creating user in database.`);

                // Create the user in the database automatically
                try {
                    user = await User.create({
                        clerkId: userId,
                        email: 'unknown@example.com',
                        name: 'Unknown User',
                        resumes: [],
                        portfolios: [],
                        coverLetters: []
                    });
                    console.log(`User created in database (legacy): ${user.clerkId}`);
                } catch (createError) {
                    console.error('Error creating user in database (legacy):', createError);
                    // If creation fails, use fallback object
                    user = {
                        _id: userId, // Use clerkId as temporary _id
                        clerkId: userId,
                        email: 'unknown@example.com',
                        name: 'Unknown User',
                        resumes: [],
                        portfolios: [],
                        coverLetters: [],
                        createdAt: new Date(),
                        updatedAt: new Date()
                    };
                }
            }
            req.user = user;
            return next();
        }

        // Extract JWT token from Authorization header
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // For now, we'll decode the JWT without verification to get the user ID
        // In production, you should verify the JWT signature using Clerk's public key
        try {
            const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
            const userId = payload.sub; // 'sub' claim contains the user ID in Clerk JWTs

            if (!userId) {
                return res.status(401).json({
                    message: 'Invalid token: no user ID found.'
                });
            }

            // Find user in database
            let user = await User.findOne({ clerkId: userId });
            if (!user) {
                console.log(`User with clerkId ${userId} not found in database. Creating user in database.`);

                // Create the user in the database automatically
                try {
                    user = await User.create({
                        clerkId: userId,
                        email: payload.email || 'unknown@example.com',
                        name: payload.name || payload.given_name || payload.family_name || 'Unknown User',
                        resumes: [],
                        portfolios: [],
                        coverLetters: []
                    });
                    console.log(`User created in database: ${user.clerkId}`);
                } catch (createError) {
                    console.error('Error creating user in database:', createError);
                    // If creation fails, use fallback object
                    user = {
                        _id: userId, // Use clerkId as temporary _id
                        clerkId: userId,
                        email: payload.email || 'unknown@example.com',
                        name: payload.name || 'Unknown User',
                        resumes: [],
                        portfolios: [],
                        coverLetters: [],
                        createdAt: new Date(),
                        updatedAt: new Date()
                    };
                }
            }

            req.user = user;
            next();
        } catch (jwtError) {
            console.error('Error decoding JWT:', jwtError);
            return res.status(401).json({
                message: 'Invalid token format.'
            });
        }
    } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(500).json({ message: 'Server error during authentication.' });
    }
};

module.exports = {
    verifyClerkWebhook,
    authenticateUser
};