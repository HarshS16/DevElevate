const Resume = require('../models/Resume');
const User = require('../models/User');
const upload = require('../middleware/uploadMiddleware'); // Multer middleware
const resumeParserService = require('../services/resumeParserService');
const geminiService = require('../services/geminiService');
const fs = require('fs').promises; // For file operations (e.g., deleting uploaded files)

// Upload and parse resume
const uploadResume = async (req, res, next) => {
    // Manually run multer middleware to handle file upload
    upload.single('resumeFile')(req, res, async (err) => {
        if (err instanceof Error) { // Multer errors or custom fileFilter errors
            return res.status(400).json({ message: err.message });
        } else if (err) { // Other unexpected errors
            return next(err); // Pass to general error handler
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded. Please select a PDF or DOCX resume.' });
        }

        try {
            const userId = req.user._id; // From authenticateUser middleware
            const originalFileName = req.file.originalname;
            const originalFilePath = req.file.path; // Path where Multer saved the file

            console.log(`Processing uploaded file: ${originalFilePath}`);

            // Parse the resume using the service
            const { rawTextContent, parsedContent } = await resumeParserService.parseResume(originalFilePath);

            const newResume = new Resume({
                userId,
                title: `Uploaded Resume - ${originalFileName.split('.').slice(0, -1).join('.')} (${Date.now()})`,
                originalFileName,
                originalFilePath, // Storing path for potential re-parsing or future use
                rawTextContent,
                parsedContent,
                enhancedContent: rawTextContent, // Initially, enhanced content is the raw content
            });

            await newResume.save();

            // Link resume to user
            await User.findByIdAndUpdate(userId, { $push: { resumes: newResume._id } });

            res.status(201).json({
                message: 'Resume uploaded and parsed successfully!',
                resume: newResume,
            });
        } catch (error) {
            console.error('Error in uploadResume:', error);
            // Clean up uploaded file if processing fails
            if (req.file && req.file.path) {
                await fs.unlink(req.file.path).catch(console.error); // Log error if file deletion fails
            }
            next(error); // Pass error to general error handler
        }
    });
};

// Build a resume from scratch using user inputs and GitHub data
const buildResumeFromScratch = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { githubProjects, qnaData, targetJobRole, customTitle } = req.body; // QnA data from frontend, selected GitHub project data

        if (!targetJobRole) {
            return res.status(400).json({ message: 'Target job role is required to build a resume.' });
        }

        // Prepare context for Gemini from GitHub projects and Q&A
        const projectsContext = githubProjects && githubProjects.length > 0
            ? `GitHub Projects: ${JSON.stringify(githubProjects.map(p => ({ name: p.name, description: p.description, technologies: p.topics })), null, 2)}`
            : '';
        const qnaContext = qnaData && Object.keys(qnaData).length > 0
            ? `User Q&A Data: ${JSON.stringify(qnaData, null, 2)}`
            : '';

        const prompt = `Generate a professional resume for a developer. Combine information from the provided GitHub projects and user-supplied details (Q&A).
        Structure the resume with standard sections: Contact, Summary/Objective, Experience, Projects, Skills, Education.
        Ensure it is tailored for a "${targetJobRole}" role, focusing on relevant skills and achievements.
        Format the output as a clean markdown resume.

        ${projectsContext}

        ${qnaContext}

        Generated Resume (in Markdown):`;

        const generatedRawText = await geminiService.generateContent(prompt, geminiService.longContextModel, 0.7);

        // For initial MVP, we store the generated markdown as both raw and enhanced content.
        // A more advanced step would be to parse this markdown into structured data again.
        const newResume = new Resume({
            userId,
            title: customTitle || `Generated Resume - ${targetJobRole} (${Date.now()})`,
            rawTextContent: generatedRawText,
            enhancedContent: generatedRawText, // Initially, the generated content is the enhanced content
            targetJobRole,
        });

        await newResume.save();
        await User.findByIdAndUpdate(userId, { $push: { resumes: newResume._id } });

        res.status(201).json({
            message: 'Resume generated successfully!',
            resume: newResume,
        });

    } catch (error) {
        console.error('Error building resume from scratch:', error);
        next(error);
    }
};

// Enhance an existing resume using AI
const enhanceResume = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { targetJobRole } = req.body; // User specifies the target job role for tailoring

        if (!targetJobRole) {
            return res.status(400).json({ message: 'Target job role is required for resume enhancement.' });
        }

        const resume = await Resume.findOne({ _id: id, userId: req.user._id });
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found for this user.' });
        }

        // Use the raw text content of the resume for enhancement
        const enhancedContent = await geminiService.enhanceResume(resume.rawTextContent, targetJobRole);

        resume.enhancedContent = enhancedContent;
        resume.targetJobRole = targetJobRole; // Update the target role this version is tailored for
        resume.updatedAt = Date.now();
        await resume.save();

        res.status(200).json({
            message: 'Resume enhanced successfully!',
            resume: resume,
        });
    } catch (error) {
        console.error('Error enhancing resume:', error);
        next(error);
    }
};

// Get all resumes for the authenticated user
const getResumes = async (req, res, next) => {
    try {
        // If user is a fallback object (not from database), return empty array
        if (typeof req.user._id === 'string' && req.user._id === req.user.clerkId) {
            return res.status(200).json([]);
        }

        const resumes = await Resume.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(resumes);
    } catch (error) {
        next(error);
    }
};

// Get a single resume by its ID for the authenticated user
const getResumeById = async (req, res, next) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found or you do not have permission to access it.' });
        }
        res.status(200).json(resume);
    } catch (error) {
        // Handle CastError for invalid IDs
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Resume ID format.' });
        }
        next(error);
    }
};

// Delete a resume
const deleteResume = async (req, res, next) => {
    try {
        const { id } = req.params;
        const resume = await Resume.findOneAndDelete({ _id: id, userId: req.user._id });

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found or you do not have permission to delete it.' });
        }

        // Remove reference from the user's document
        await User.findByIdAndUpdate(req.user._id, { $pull: { resumes: id } });

        // Delete the original uploaded file from the server if it exists
        if (resume.originalFilePath) {
            await fs.unlink(resume.originalFilePath).catch(err => console.error(`Failed to delete original resume file at ${resume.originalFilePath}:`, err));
        }

        res.status(200).json({ message: 'Resume deleted successfully.' });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Resume ID format.' });
        }
        next(error);
    }
};

module.exports = {
    uploadResume,
    getResumes,
    getResumeById,
    enhanceResume,
    buildResumeFromScratch,
    deleteResume
};