const mongoose = require('mongoose');

const coverLetterSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    resumeId: { // Link to the resume used for generating this cover letter
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resume',
        required: true,
    },
    jobDescription: { // The raw job description text provided by the user
        type: String,
        required: true,
    },
    generatedContent: { // The AI-generated cover letter content
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('CoverLetter', coverLetterSchema);