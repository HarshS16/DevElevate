const User = require('../models/User');

// Handles Clerk webhook events (user creation, update, deletion)
const handleClerkWebhook = async (req, res, next) => {
    const evt = req.clerkEvent;

    try {
        switch (evt.type) {
            case 'user.created':
                const newUser = await User.create({
                    clerkId: evt.data.id,
                    email: evt.data.email_addresses[0].email_address,
                    name: `${evt.data.first_name || ''} ${evt.data.last_name || ''}`.trim(),
                });
                console.log('User created in DB:', newUser.clerkId);
                break;
            case 'user.updated':
                await User.findOneAndUpdate(
                    { clerkId: evt.data.id },
                    {
                        email: evt.data.email_addresses[0].email_address,
                        name: `${evt.data.first_name || ''} ${evt.data.last_name || ''}`.trim(),
                        updatedAt: Date.now(),
                    },
                    { new: true }
                );
                console.log('User updated in DB:', evt.data.id);
                break;
            case 'user.deleted':
                await User.deleteOne({ clerkId: evt.data.id });
                console.log('User deleted from DB:', evt.data.id);
                break;
            default:
                console.log(`Unhandled Clerk event type: ${evt.type}`);
        }
        res.status(200).json({ success: true, message: 'Webhook processed' });
    } catch (error) {
        console.error('Error processing Clerk webhook:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get current authenticated user's profile
const getMe = async (req, res, next) => {
    try {
        // req.user is set by authenticateUser middleware
        const user = req.user;
        res.status(200).json(user);
    } catch (error) {
        next(error); // Pass to error handling middleware
    }
};

module.exports = {
    handleClerkWebhook,
    getMe,
};