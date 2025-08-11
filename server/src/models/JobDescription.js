const mongoose = require('mongoose');

const jobDescriptionSchema = new mongoose.Schema({
    userId: { // Optional: Link to user if JD is saved for personal use
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    title: String, // e.g., "Software Engineer - Google"
    content: { // The full raw job description text
        type: String,
        required: true,
    },
    keywords: [String], // Keywords extracted by AI/parser
    requiredSkills: [String], // Skills explicitly mentioned as required
    responsibilities: [String], // Key responsibilities listed
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('JobDescription', jobDescriptionSchema);