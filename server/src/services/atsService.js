// src/services/atsService.js
const geminiService = require('./geminiService');
const logger = require('../utils/logger'); // For better logging

/**
 * Calculates an ATS (Applicant Tracking System) match score between a resume and a job description.
 * This implementation uses Gemini to extract key terms from the job description and then performs
 * a keyword-based matching against the resume text.
 *
 * @param {string} resumeText - The full text content of the resume (preferably the AI-enhanced version).
 * @param {string} jobDescription - The full text content of the job description.
 * @returns {object} An object containing the score, matched keywords, missing keywords, and suggestions.
 */
const calculateATSMatch = async (resumeText, jobDescription) => {
    try {
        if (!resumeText || resumeText.trim().length === 0) {
            logger.warn('calculateATSMatch: Resume text is empty.');
            return {
                score: 0,
                matchedKeywords: [],
                missingKeywords: [],
                suggestions: 'Please provide resume content to calculate an ATS score.',
                message: 'Resume content is empty.',
            };
        }
        if (!jobDescription || jobDescription.trim().length === 0) {
            logger.warn('calculateATSMatch: Job description is empty.');
            return {
                score: 0,
                matchedKeywords: [],
                missingKeywords: [],
                suggestions: 'Please provide a job description to calculate an ATS score.',
                message: 'Job description is empty.',
            };
        }

        // 1. Use Gemini to extract structured keywords, skills, and responsibilities from the Job Description
        logger.info('Calling Gemini to extract keywords from JD...');
        const jdAnalysis = await geminiService.extractKeywordsFromJD(jobDescription);
        logger.debug('Gemini JD analysis result:', jdAnalysis);

        const allJdTerms = [
            ...(jdAnalysis.keywords || []),
            ...(jdAnalysis.requiredSkills || []),
            ...(jdAnalysis.responsibilities || [])
        ]
        .map(term => term.toLowerCase().trim()) // Convert to lowercase and trim whitespace
        .filter(term => term.length > 1); // Filter out very short or empty terms (e.g., single letters)

        if (allJdTerms.length === 0) {
            logger.warn('calculateATSMatch: No relevant keywords extracted from Job Description by Gemini.');
            return {
                score: 0,
                matchedKeywords: [],
                missingKeywords: [],
                suggestions: 'The job description might be too vague or the AI failed to extract meaningful terms. Consider using a more detailed job description.',
                message: 'No relevant keywords extracted from Job Description.',
            };
        }

        let matchCount = 0;
        const matchedKeywords = new Set();
        const missingKeywords = new Set(allJdTerms); // Start with all JD terms as potentially missing
        const resumeLower = resumeText.toLowerCase(); // Convert resume to lowercase once

        // 2. Perform keyword matching
        for (const term of allJdTerms) {
            // Check if the resume contains the term
            if (resumeLower.includes(term)) {
                matchCount++;
                matchedKeywords.add(term);
                missingKeywords.delete(term); // If matched, it's not missing
            }
        }

        // 3. Calculate the score (simple percentage for MVP)
        const score = (matchCount / allJdTerms.length) * 100;

        // 4. Generate suggestions for improvement
        let suggestions = '';
        if (score < 70) { // Example threshold
            suggestions = 'Your resume could be better aligned with this job description. ';
            if (missingKeywords.size > 0) {
                suggestions += `Consider adding or emphasizing the following keywords: ${Array.from(missingKeywords).slice(0, 5).join(', ')}.`;
            }
            suggestions += ' Ensure you use action verbs and quantify your achievements where possible.';
        } else {
            suggestions = 'Your resume shows a strong match with this job description. Great job!';
        }

        logger.info(`ATS Score calculated: ${score.toFixed(2)}%`);
        logger.debug('Matched keywords:', Array.from(matchedKeywords));
        logger.debug('Missing keywords:', Array.from(missingKeywords));

        return {
            score: parseFloat(score.toFixed(2)),
            matchedKeywords: Array.from(matchedKeywords),
            missingKeywords: Array.from(missingKeywords),
            suggestions: suggestions,
            message: 'ATS score calculated successfully.',
        };

    } catch (error) {
        logger.error('Error in calculateATSMatch service:', error);
        throw new Error(`Failed to calculate ATS match: ${error.message}`);
    }
};

module.exports = {
    calculateATSMatch,
};