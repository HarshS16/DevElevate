const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    templateId: String, // e.g., 'minimalist', 'developer-pro' - used by frontend
    selectedGithubProjects: [{ // Details of projects selected from GitHub for the portfolio
        projectId: String, // GitHub project ID
        name: String,
        description: String, // Can be the AI-enhanced description
        html_url: String, // Link to GitHub repo
        homepage: String, // Link to live demo
        topics: [String],
        stargazers_count: Number,
        // Add any other details you want to save from GitHub
    }],
    // Structured content for different portfolio sections, mostly text that frontend will render
    sections: {
        aboutMe: String, // AI-generated or user-provided "About Me"
        skills: [String], // From resume or user input
        experience: [Object], // Can pull from resume.parsedContent
        education: [Object], // Can pull from resume.parsedContent
        // Add more custom sections if your templates support them
    },
    hostedUrl: String, // The public URL after deployment (if using static site hosting)
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Portfolio', portfolioSchema);