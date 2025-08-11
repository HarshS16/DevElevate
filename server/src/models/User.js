const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
    },
    githubUsername: {
        type: String,
        unique: true,
        sparse: true, // Allows null values but enforces uniqueness for non-null
    },
    githubAccessToken: {
        type: String,
        // Sensitive: Consider encrypting this in production DB
    },
    linkedinProfileUrl: {
        type: String,
    },
    // references to other documents
    resumes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resume' }],
    portfolios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio' }],
    coverLetters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CoverLetter' }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', userSchema);