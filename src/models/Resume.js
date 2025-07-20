const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    originalFileName: String,
    originalFilePath: String, // Path on your server where original file is stored
    parsedContent: { // Structured data from resume parser
        name: String,
        contactInfo: {
            email: String,
            phone: String,
            linkedin: String,
        },
        summary: String,
        experience: [{ // Array of objects for work experience
            title: String,
            company: String,
            location: String,
            startDate: String,
            endDate: String,
            description: String, // Can be bullet points or paragraph
        }],
        education: [{ // Array of objects for education
            degree: String,
            institution: String,
            location: String,
            startDate: String,
            endDate: String,
        }],
        skills: [String], // Array of strings (e.g., ["JavaScript", "React", "Node.js"])
        projects: [{ // Array of objects for personal/professional projects
            name: String,
            description: String,
            technologies: [String],
            url: String, // Link to project demo or GitHub
        }],
        // ... more structured data if your parser provides it
    },
    rawTextContent: String, // Full text extracted from resume
    enhancedContent: String, // Markdown/text content after AI enhancement
    targetJobRole: String, // Role for which this resume version is tailored
    pdfUrl: String, // URL to the generated PDF (if stored externally or re-generated)
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Resume', resumeSchema);