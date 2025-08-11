const User = require('../models/User');
const Resume = require('../models/Resume');
const Portfolio = require('../models/Portfolio');
const CoverLetter = require('../models/CoverLetter');

const getUserProfile = async (req, res, next) => {
    try {
        // req.user is populated by authenticateUser middleware
        const userId = req.user._id;

        // Populate related documents for a comprehensive profile view
        const user = await User.findById(userId)
            .populate('resumes')
            .populate('portfolios')
            .populate('coverLetters')
            .exec();

        if (!user) {
            return res.status(404).json({ message: 'User profile not found.' });
        }

        // Remove sensitive data before sending to frontend
        const userProfile = user.toObject(); // Convert Mongoose document to plain JS object
        delete userProfile.githubAccessToken; // Remove sensitive token

        res.status(200).json(userProfile);
    } catch (error) {
        next(error);
    }
};

const updateUserProfile = async (req, res, next) => {
    try {
        const userId = req.user._id;
        // Only allow specific fields to be updated by the user
        const { linkedinProfileUrl } = req.body;

        const updateFields = { updatedAt: Date.now() };
        if (linkedinProfileUrl !== undefined) {
            updateFields.linkedinProfileUrl = linkedinProfileUrl;
        }
        // Add other fields here if they can be directly updated by the user
        // e.g., if you allow them to change their name directly
        // if (req.body.name !== undefined) updateFields.name = req.body.name;


        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateFields },
            { new: true, runValidators: true } // `new: true` returns the updated document, `runValidators` ensures schema validations
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Remove sensitive data before sending to frontend
        const userProfile = updatedUser.toObject();
        delete userProfile.githubAccessToken;

        res.status(200).json({
            message: 'Profile updated successfully!',
            user: userProfile,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
};