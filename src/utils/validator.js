// src/utils/validator.js
const { body, validationResult } = require('express-validator');

// Middleware to handle validation results and send error responses
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

    return res.status(422).json({
        success: false,
        errors: extractedErrors,
        message: 'Validation failed. Please check your inputs.',
    });
};

// --- Validation Chains ---

// Example validation for resume upload/build (adjust as per your frontend's requirements)
const validateResumeInput = [
    body('targetJobRole')
        .notEmpty()
        .withMessage('Target job role is required.')
        .isString()
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Target job role must be between 3 and 100 characters.'),
    // For buildResumeFromScratch, you might add more validations for qnaData or githubProjects
    // body('qnaData').optional().isObject().withMessage('Q&A data must be an object.'),
    // body('githubProjects').optional().isArray().withMessage('GitHub projects must be an array.'),
];

// Validation for cover letter generation
const validateCoverLetterInput = [
    body('resumeId')
        .notEmpty()
        .withMessage('Resume ID is required.')
        .isMongoId()
        .withMessage('Invalid Resume ID format.'),
    body('jobDescription')
        .notEmpty()
        .withMessage('Job description is required.')
        .isString()
        .trim()
        .isLength({ min: 50 })
        .withMessage('Job description must be at least 50 characters long.'),
];

// Validation for portfolio generation
const validatePortfolioInput = [
    body('title')
        .notEmpty()
        .withMessage('Portfolio title is required.')
        .isString()
        .trim()
        .isLength({ min: 3, max: 150 })
        .withMessage('Portfolio title must be between 3 and 150 characters.'),
    body('templateId')
        .notEmpty()
        .withMessage('Template ID is required.')
        .isString()
        .trim(),
    body('selectedGithubRepoIds')
        .notEmpty()
        .withMessage('At least one GitHub repository must be selected for the portfolio.')
        .isArray({ min: 1 })
        .withMessage('Selected GitHub repositories must be an array with at least one item.'),
    body('selectedGithubRepoIds.*') // For each item in the array
        .isInt({ gt: 0 }) // Assuming GitHub IDs are positive integers (they can be large numbers, check actual range if needed)
        .withMessage('Invalid GitHub repository ID format.'),
    body('aboutMeInput').optional().isString().trim(),
    body('skillsInput').optional().isArray().withMessage('Skills must be an array of strings.'),
    body('skillsInput.*').optional().isString().trim(), // Validate each skill string
];

// Validation for user profile update
const validateUserProfileUpdate = [
    body('linkedinProfileUrl')
        .optional()
        .isURL()
        .withMessage('Invalid LinkedIn profile URL format.')
        .trim(),
];


module.exports = {
    validate,
    validateResumeInput,
    validateCoverLetterInput,
    validatePortfolioInput,
    validateUserProfileUpdate,
};