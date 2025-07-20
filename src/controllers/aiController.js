// const geminiService = require('../services/geminiService');
// const CoverLetter = require('../models/CoverLetter');
// const User = require('../models/User');
// const Resume = require('../models/Resume');
// const JobDescription = require('../models/JobDescription'); // For ATS stretch goal

// // Generates a tailored cover letter using a specific resume and job description
// const generateCoverLetter = async (req, res, next) => {
//     try {
//         const { resumeId, jobDescription } = req.body;

//         if (!resumeId || !jobDescription) {
//             return res.status(400).json({ message: 'Resume ID and Job Description are required to generate a cover letter.' });
//         }

//         const userId = req.user._id;
//         // Find the specific resume for the user
//         const resume = await Resume.findOne({ _id: resumeId, userId });

//         if (!resume) {
//             return res.status(404).json({ message: 'Resume not found for this user, or you do not have permission to access it.' });
//         }

//         // Use the enhanced content if available, otherwise raw text
//         const resumeContentForAI = resume.enhancedContent || resume.rawTextContent;

//         if (!resumeContentForAI) {
//             return res.status(400).json({ message: 'Resume content is empty. Cannot generate cover letter.' });
//         }

//         const generatedContent = await geminiService.generateCoverLetter(resumeContentForAI, jobDescription);

//         const newCoverLetter = new CoverLetter({
//             userId,
//             resumeId,
//             jobDescription,
//             generatedContent,
//         });

//         await newCoverLetter.save();
//         await User.findByIdAndUpdate(userId, { $push: { coverLetters: newCoverLetter._id } });

//         res.status(201).json({
//             message: 'Cover letter generated successfully!',
//             coverLetter: newCoverLetter,
//         });
//     } catch (error) {
//         console.error('Error generating cover letter:', error);
//         if (error.name === 'CastError') {
//             return res.status(400).json({ message: 'Invalid Resume ID format.' });
//         }
//         next(error);
//     }
// };

// // (Stretch Goal) Calculates an ATS score for a resume against a job description
// const getATSScore = async (req, res, next) => {
//     try {
//         const { resumeId, jobDescription } = req.body;

//         if (!resumeId || !jobDescription) {
//             return res.status(400).json({ message: 'Resume ID and Job Description are required to calculate ATS score.' });
//         }

//         const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
//         if (!resume) {
//             return res.status(404).json({ message: 'Resume not found for this user.' });
//         }

//         // Use the enhanced resume content if available, otherwise raw.
//         // The enhanced content should already be ATS-friendly.
//         const resumeText = resume.enhancedContent || resume.rawTextContent;

//         if (!resumeText) {
//             return res.status(400).json({ message: 'Resume content is empty. Cannot calculate ATS score.' });
//         }

//         // Use Gemini to extract keywords, skills, and responsibilities from the Job Description
//         const jdAnalysis = await geminiService.extractKeywordsFromJD(jobDescription);

//         const allJdTerms = [
//             ...(jdAnalysis.keywords || []),
//             ...(jdAnalysis.requiredSkills || []),
//             ...(jdAnalysis.responsibilities || [])
//         ].map(term => term.toLowerCase().trim()).filter(Boolean); // Clean and remove empty strings

//         if (allJdTerms.length === 0) {
//             return res.status(200).json({
//                 message: 'No relevant keywords extracted from Job Description. Score cannot be calculated.',
//                 score: 0,
//                 matchedKeywords: [],
//                 missingKeywords: [],
//                 suggestions: 'The job description might be too vague or the AI failed to extract terms.',
//             });
//         }

//         let matchCount = 0;
//         const matchedKeywords = new Set();
//         const missingKeywords = new Set(allJdTerms);
//         const resumeLower = resumeText.toLowerCase();

//         for (const term of allJdTerms) {
//             if (resumeLower.includes(term)) {
//                 matchCount++;
//                 matchedKeywords.add(term);
//                 missingKeywords.delete(term);
//             }
//         }

//         const score = (matchCount / allJdTerms.length) * 100;

//         // Optionally, save the job description to the DB if it's meant to be stored
//         // const newJobDescription = new JobDescription({
//         //     userId: req.user._id,
//         //     title: req.body.jobTitle || 'Unknown Job',
//         //     content: jobDescription,
//         //     keywords: jdAnalysis.keywords,
//         //     requiredSkills: jdAnalysis.requiredSkills,
//         //     responsibilities: jdAnalysis.responsibilities,
//         // });
//         // await newJobDescription.save();


//         res.status(200).json({
//             message: 'ATS score calculated.',
//             score: parseFloat(score.toFixed(2)),
//             matchedKeywords: Array.from(matchedKeywords),
//             missingKeywords: Array.from(missingKeywords),
//             suggestions: `Consider adding or emphasizing the missing keywords in your resume for a better match.`,
//         });

//     } catch (error) {
//         console.error('Error calculating ATS score:', error);
//         if (error.name === 'CastError') {
//             return res.status(400).json({ message: 'Invalid Resume ID format.' });
//         }
//         next(error);
//     }
// };

// module.exports = {
//     generateCoverLetter,
//     getATSScore,
// };


// src/controllers/aiController.js
const geminiService = require('../services/geminiService');
const atsService = require('../services/atsService'); // Import the ATS service
const CoverLetter = require('../models/CoverLetter');
const User = require('../models/User');
const Resume = require('../models/Resume');
// const JobDescription = require('../models/JobDescription'); // Uncomment if you decide to save Job Descriptions
const logger = require('../utils/logger'); // Import the logger utility

/**
 * Generates a tailored cover letter using a specific resume and job description.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} req.user - The authenticated user object from authMiddleware.
 * @param {Object} req.body - The request body containing resumeId and jobDescription.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
const generateCoverLetter = async (req, res, next) => {
    try {
        const { resumeId, jobDescription } = req.body;

        if (!resumeId || !jobDescription) {
            logger.warn('generateCoverLetter: Missing resumeId or jobDescription in request body.');
            return res.status(400).json({ message: 'Resume ID and Job Description are required to generate a cover letter.' });
        }

        const userId = req.user._id;
        // Find the specific resume for the user to get its content
        const resume = await Resume.findOne({ _id: resumeId, userId });

        if (!resume) {
            logger.warn(`generateCoverLetter: Resume with ID ${resumeId} not found for user ${userId}.`);
            return res.status(404).json({ message: 'Resume not found for this user, or you do not have permission to access it.' });
        }

        // Use the enhanced content if available, otherwise fall back to raw text content
        const resumeContentForAI = resume.enhancedContent || resume.rawTextContent;

        if (!resumeContentForAI || resumeContentForAI.trim().length === 0) {
            logger.warn(`generateCoverLetter: Resume content is empty for resume ID ${resumeId}.`);
            return res.status(400).json({ message: 'Resume content is empty. Cannot generate cover letter.' });
        }

        logger.info(`Generating cover letter for resume ID ${resumeId} and user ${userId}...`);
        const generatedContent = await geminiService.generateCoverLetter(resumeContentForAI, jobDescription);
        logger.info('Cover letter content generated by Gemini.');

        // Save the generated cover letter to the database
        const newCoverLetter = new CoverLetter({
            userId,
            resumeId,
            jobDescription, // Store the original JD for reference
            generatedContent,
        });

        await newCoverLetter.save();
        logger.debug(`Cover letter saved with ID: ${newCoverLetter._id}`);

        // Link the new cover letter to the user's document
        await User.findByIdAndUpdate(userId, { $push: { coverLetters: newCoverLetter._id } });
        logger.info(`Cover letter linked to user ${userId}.`);

        res.status(201).json({
            message: 'Cover letter generated successfully!',
            coverLetter: newCoverLetter,
        });
    } catch (error) {
        logger.error('Error generating cover letter:', error);
        // Handle Mongoose CastError for invalid ObjectId
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Resume ID format.' });
        }
        next(error); // Pass other errors to the global error handler
    }
};

/**
 * Calculates an ATS (Applicant Tracking System) score for a resume against a job description.
 * This is a stretch goal feature.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} req.user - The authenticated user object from authMiddleware.
 * @param {Object} req.body - The request body containing resumeId and jobDescription.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
const getATSScore = async (req, res, next) => {
    try {
        const { resumeId, jobDescription } = req.body;

        if (!resumeId || !jobDescription) {
            logger.warn('getATSScore: Missing resumeId or jobDescription in request body.');
            return res.status(400).json({ message: 'Resume ID and Job Description are required to calculate ATS score.' });
        }

        const userId = req.user._id;
        const resume = await Resume.findOne({ _id: resumeId, userId });

        if (!resume) {
            logger.warn(`getATSScore: Resume with ID ${resumeId} not found for user ${userId}.`);
            return res.status(404).json({ message: 'Resume not found for this user, or you do not have permission to access it.' });
        }

        // Use the enhanced resume content if available, as it should be more ATS-friendly.
        // Fall back to raw text if enhanced content is not present.
        const resumeText = resume.enhancedContent || resume.rawTextContent;

        if (!resumeText || resumeText.trim().length === 0) {
            logger.warn(`getATSScore: Resume content is empty for resume ID ${resumeId}.`);
            return res.status(400).json({ message: 'Resume content is empty. Cannot calculate ATS score.' });
        }

        logger.info(`Calculating ATS score for resume ID ${resumeId} against provided JD...`);
        // Call the dedicated ATS service to perform the calculation
        const atsResult = await atsService.calculateATSMatch(resumeText, jobDescription);
        logger.info(`ATS score calculated: ${atsResult.score.toFixed(2)}%`);

        // Optionally: If you want to store the job description used for ATS check in your DB,
        // you would uncomment and implement the following block:
        /*
        // Example of saving job description (requires JobDescription model)
        const newJobDescription = new JobDescription({
            userId: req.user._id,
            // You might need to get a job title from the frontend or parse it from the JD
            title: req.body.jobTitle || `ATS Check for ${resume.title}`,
            content: jobDescription,
            keywords: atsResult.matchedKeywords.concat(atsResult.missingKeywords), // Store all terms found relevant in JD
            // You could further process jdAnalysis from atsService for more structured storage
            // of requiredSkills and responsibilities if your JobDescription model has those.
        });
        await newJobDescription.save();
        logger.debug(`Job Description for ATS check saved with ID: ${newJobDescription._id}`);
        */

        res.status(200).json({
            message: atsResult.message,
            score: atsResult.score,
            matchedKeywords: atsResult.matchedKeywords,
            missingKeywords: atsResult.missingKeywords,
            suggestions: atsResult.suggestions,
        });

    } catch (error) {
        logger.error('Error calculating ATS score:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Resume ID format.' });
        }
        next(error); // Pass other errors to the global error handler
    }
};

module.exports = {
    generateCoverLetter,
    getATSScore,
};