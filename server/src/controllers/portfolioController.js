// const Portfolio = require('../models/Portfolio');
// const User = require('../models/User');
// const githubService = require('../services/githubService');
// const geminiService = require('../services/geminiService');
// const portfolioTemplateService = require('../services/portfolioTemplateService');

// // Generate a new portfolio based on selected GitHub projects and user input
// const generatePortfolio = async (req, res, next) => {
//     try {
//         const userId = req.user._id;
//         const {
//             title,
//             templateId,
//             selectedGithubRepoIds, // Array of GitHub project IDs selected by the user
//             aboutMeInput, // User's custom "About Me" text
//             skillsInput, // User's custom skills list (array of strings)
//             // You can add more user inputs for other sections like experience, education if not relying on resume parsing
//         } = req.body;

//         if (!title || !templateId || !selectedGithubRepoIds || selectedGithubRepoIds.length === 0) {
//             return res.status(400).json({ message: 'Missing required portfolio generation parameters: title, template, and selected GitHub projects.' });
//         }

//         const user = await User.findById(userId);
//         if (!user || !user.githubAccessToken) {
//             return res.status(400).json({ message: 'GitHub account not linked. Please link your GitHub to generate a portfolio with projects.' });
//         }

//         // Fetch full details for the selected GitHub repositories
//         const allUserRepos = await githubService.getUserRepos(user.githubAccessToken);
//         const selectedReposDetails = allUserRepos.filter(repo => selectedGithubRepoIds.includes(repo.id));

//         // Enhance project descriptions using Gemini
//         const enhancedProjects = await Promise.all(selectedReposDetails.map(async (repo) => {
//             const enhancedDesc = await geminiService.generatePortfolioProjectDescription(
//                 repo.name,
//                 repo.description,
//                 repo.topics || [],
//                 'Developer', // Default role, could be dynamically fetched from user profile or last resume
//                 repo.html_url,
//                 repo.homepage // Include live demo URL if available
//             );
//             return {
//                 projectId: repo.id,
//                 name: repo.name,
//                 description: enhancedDesc,
//                 html_url: repo.html_url,
//                 homepage: repo.homepage,
//                 topics: repo.topics,
//                 stargazers_count: repo.stargazers_count,
//             };
//         }));

//         // Combine About Me and Skills, potentially enhance with Gemini
//         let generatedAboutMe = aboutMeInput || 'A passionate developer.';
//         if (aboutMeInput) {
//             // Refine user's input "About Me" if provided
//             generatedAboutMe = await geminiService.generateContent(
//                 `Refine the following "About Me" text for a professional developer portfolio, making it engaging and concise:\n\n${aboutMeInput}\n\nRefined About Me:`
//             );
//         } else if (user.resumes && user.resumes.length > 0) {
//             // If user has resumes, attempt to use data from their latest/primary resume
//             const latestResume = await Resume.findById(user.resumes[user.resumes.length - 1]); // Get last updated resume
//             if (latestResume && latestResume.parsedContent && latestResume.parsedContent.summary) {
//                 generatedAboutMe = await geminiService.generateContent(
//                     `Write a concise 2-3 sentence "About Me" section for a developer portfolio based on the following resume summary:\n\n${latestResume.parsedContent.summary}\n\nAbout Me:`
//                 );
//             } else if (latestResume && latestResume.rawTextContent) {
//                  generatedAboutMe = await geminiService.generateContent(
//                     `Write a concise 2-3 sentence "About Me" section for a developer portfolio based on the following resume text:\n\n${latestResume.rawTextContent}\n\nAbout Me:`
//                 );
//             }
//         }


//         // Prioritize user-provided skills, fallback to skills from a parsed resume if available
//         const finalSkills = skillsInput && skillsInput.length > 0 ? skillsInput : (
//             user.resumes && user.resumes.length > 0
//                 ? (await Resume.findById(user.resumes[user.resumes.length - 1]))?.parsedContent?.skills || []
//                 : []
//         );


//         const newPortfolio = new Portfolio({
//             userId,
//             title,
//             templateId,
//             selectedGithubProjects: enhancedProjects,
//             sections: {
//                 aboutMe: generatedAboutMe,
//                 skills: finalSkills,
//                 // You can add logic to populate experience/education from parsed resumes here
//                 // experience: latestResume?.parsedContent?.experience || [],
//                 // education: latestResume?.parsedContent?.education || [],
//             },
//         });

//         await newPortfolio.save();
//         await User.findByIdAndUpdate(userId, { $push: { portfolios: newPortfolio._id } });

//         res.status(201).json({
//             message: 'Portfolio generated successfully! You can now publish it.',
//             portfolio: newPortfolio,
//         });

//     } catch (error) {
//         console.error('Error generating portfolio:', error);
//         next(error);
//     }
// };

// // Publishes a portfolio (simulated for now, actual implementation is complex)
// const publishPortfolio = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const portfolio = await Portfolio.findOne({ _id: id, userId: req.user._id });

//         if (!portfolio) {
//             return res.status(404).json({ message: 'Portfolio not found or you do not have permission to publish it.' });
//         }

//         // Call the service to simulate or actually deploy the portfolio
//         const hostedUrl = await portfolioTemplateService.deployPortfolio(portfolio._id, portfolio.sections);

//         portfolio.hostedUrl = hostedUrl;
//         portfolio.updatedAt = Date.now();
//         await portfolio.save();

//         res.status(200).json({
//             message: 'Portfolio published successfully!',
//             hostedUrl: hostedUrl,
//             portfolio: portfolio,
//         });
//     } catch (error) {
//         console.error('Error publishing portfolio:', error);
//         next(error);
//     }
// };

// // Get all portfolios for the authenticated user
// const getPortfolios = async (req, res, next) => {
//     try {
//         const portfolios = await Portfolio.find({ userId: req.user._id }).sort({ createdAt: -1 });
//         res.status(200).json(portfolios);
//     } catch (error) {
//         next(error);
//     }
// };

// // Get a single portfolio by ID for the authenticated user
// const getPortfolioById = async (req, res, next) => {
//     try {
//         const portfolio = await Portfolio.findOne({ _id: req.params.id, userId: req.user._id });
//         if (!portfolio) {
//             return res.status(404).json({ message: 'Portfolio not found or you do not have permission to access it.' });
//         }
//         res.status(200).json(portfolio);
//     } catch (error) {
//         if (error.name === 'CastError') {
//             return res.status(400).json({ message: 'Invalid Portfolio ID format.' });
//         }
//         next(error);
//     }
// };

// // Delete a portfolio
// const deletePortfolio = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const portfolio = await Portfolio.findOneAndDelete({ _id: id, userId: req.user._id });

//         if (!portfolio) {
//             return res.status(404).json({ message: 'Portfolio not found or you do not have permission to delete it.' });
//         }

//         // Remove reference from the user's document
//         await User.findByIdAndUpdate(req.user._id, { $pull: { portfolios: id } });

//         // TODO: If you implement actual hosting, add logic here to unpublish/delete the hosted site
//         console.log(`Portfolio ${id} deleted. Unpublishing logic not yet implemented.`);

//         res.status(200).json({ message: 'Portfolio deleted successfully.' });
//     } catch (error) {
//         if (error.name === 'CastError') {
//             return res.status(400).json({ message: 'Invalid Portfolio ID format.' });
//         }
//         next(error);
//     }
// };

// module.exports = {
//     generatePortfolio,
//     publishPortfolio,
//     getPortfolios,
//     getPortfolioById,
//     deletePortfolio,
// };

// src/controllers/portfolioController.js
const Portfolio = require('../models/Portfolio');
const User = require('../models/User');
const githubService = require('../services/githubService');
const geminiService = require('../services/geminiService');
const portfolioTemplateService = require('../services/portfolioTemplateService');
const logger = require('../utils/logger'); // <--- ADD THIS LINE

// Generate a new portfolio based on selected GitHub projects and user input
const generatePortfolio = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const {
            title,
            templateId,
            selectedGithubRepoIds, // Array of GitHub project IDs selected by the user
            aboutMeInput, // User's custom "About Me" text
            skillsInput, // User's custom skills list (array of strings)
            // You can add more user inputs for other sections like experience, education if not relying on resume parsing
        } = req.body;

        // --- ADDED DEBUG LOGS FOR INITIAL INPUTS ---
        logger.debug('Portfolio generation request received.', { userId, title, templateId, selectedGithubRepoIds });
        // --- END DEBUG LOGS ---

        if (!title || !templateId || !selectedGithubRepoIds || selectedGithubRepoIds.length === 0) {
            logger.warn('Missing required portfolio generation parameters.');
            return res.status(400).json({ message: 'Missing required portfolio generation parameters: title, template, and selected GitHub projects.' });
        }

        const user = await User.findById(userId);
        if (!user || !user.githubAccessToken) {
            logger.warn(`GitHub not linked for user ${userId}.`);
            return res.status(400).json({ message: 'GitHub account not linked. Please link your GitHub to generate a portfolio with projects.' });
        }

        // Fetch full details for the selected GitHub repositories
        const allUserRepos = await githubService.getUserRepos(user.githubAccessToken);
        const selectedReposDetails = allUserRepos.filter(repo => selectedGithubRepoIds.includes(repo.id));

        // --- ADDED DEBUG LOG: Selected Repos ---
        logger.debug('Selected GitHub repos for portfolio:', selectedReposDetails.map(r => ({ id: r.id, name: r.name })));
        if (selectedReposDetails.length !== selectedGithubRepoIds.length) {
            logger.warn('Some selected GitHub IDs did not match actual repos fetched.');
        }
        // --- END DEBUG LOG ---

        // Enhance project descriptions using Gemini
        const enhancedProjects = await Promise.all(selectedReposDetails.map(async (repo) => {
            // --- ADDED DEBUG LOGS FOR EACH PROJECT SENT TO GEMINI ---
            logger.debug(`Preparing project data for Gemini for project: ${repo.name}`);
            logger.debug(`Project details:`, {
                projectName: repo.name,
                projectDescription: repo.description,
                technologiesUsed: repo.topics || [], // Ensure topics is an array, often it's null if no topics
                githubUrl: repo.html_url,
                liveUrl: repo.homepage // Ensure this property exists if your repo has it, or handle null
            });
            // --- END DEBUG LOGS ---

            const enhancedDesc = await geminiService.generatePortfolioProjectDescription(
                repo.name,
                repo.description,
                repo.topics || [], // Pass an empty array if repo.topics is null/undefined
                'Developer', // Default role, could be dynamically fetched from user profile or last resume
                repo.html_url,
                repo.homepage // Include live demo URL if available
            );
            return {
                projectId: repo.id,
                name: repo.name,
                description: enhancedDesc,
                html_url: repo.html_url,
                homepage: repo.homepage,
                topics: repo.topics,
                stargazers_count: repo.stargazers_count,
            };
        }));

        // --- ADDED DEBUG LOG: Enhanced Projects received from Gemini ---
        logger.debug('Enhanced projects received from Gemini:', enhancedProjects.map(p => p.name));
        // --- END DEBUG LOG ---

        // Combine About Me and Skills, potentially enhance with Gemini
        let generatedAboutMe = aboutMeInput || 'A passionate developer.';
        if (aboutMeInput) {
            logger.debug('Enhancing About Me section with Gemini based on user input.');
            generatedAboutMe = await geminiService.generateContent(
                `Refine the following "About Me" text for a professional developer portfolio, making it engaging and concise:\n\n${aboutMeInput}\n\nRefined About Me:`
            );
        } else if (user.resumes && user.resumes.length > 0) {
            logger.debug('Attempting to use resume summary for About Me section.');
            const latestResume = await Resume.findById(user.resumes[user.resumes.length - 1]); // Get last updated resume
            if (latestResume && latestResume.parsedContent && latestResume.parsedContent.summary) {
                generatedAboutMe = await geminiService.generateContent(
                    `Write a concise 2-3 sentence "About Me" section for a developer portfolio based on the following resume summary:\n\n${latestResume.parsedContent.summary}\n\nAbout Me:`
                );
            } else if (latestResume && latestResume.rawTextContent) {
                generatedAboutMe = await geminiService.generateContent(
                    `Write a concise 2-3 sentence "About Me" section for a developer portfolio based on the following resume text:\n\n${latestResume.rawTextContent}\n\nAbout Me:`
                );
            }
        }
        logger.debug('Final About Me content:', generatedAboutMe ? generatedAboutMe.substring(0, Math.min(generatedAboutMe.length, 100)) + '...' : 'N/A'); // Handle empty generatedAboutMe

        const finalSkills = skillsInput && skillsInput.length > 0 ? skillsInput : (
            user.resumes && user.resumes.length > 0
                ? (await Resume.findById(user.resumes[user.resumes.length - 1]))?.parsedContent?.skills || []
                : []
        );
        logger.debug('Final Skills content:', finalSkills);

        const newPortfolio = new Portfolio({
            userId,
            title,
            templateId,
            selectedGithubProjects: enhancedProjects,
            sections: {
                aboutMe: generatedAboutMe,
                skills: finalSkills,
                // You can add logic to populate experience/education from parsed resumes here
                // experience: latestResume?.parsedContent?.experience || [],
                // education: latestResume?.parsedContent?.education || [],
            },
        });

        await newPortfolio.save();
        await User.findByIdAndUpdate(userId, { $push: { portfolios: newPortfolio._id } });

        logger.info(`Portfolio ${newPortfolio._id} generated successfully!`);
        res.status(201).json({
            message: 'Portfolio generated successfully! You can now publish it.',
            portfolio: newPortfolio,
        });

    } catch (error) {
        // --- CRITICAL FIX FOR LOGGING THE FULL ERROR ---
        logger.error('Error in generatePortfolio controller:', {
            message: error.message,
            name: error.name,
            stack: error.stack,
            // If it's an Axios error from Gemini, it will have a response property
            responseStatus: error.response ? error.response.status : 'N/A',
            responseData: error.response ? error.response.data : 'N/A',
            // Check if it's a specific error from our services
            originalErrorDetails: error.details || 'N/A' // For custom errors that pass details
        });
        // --- END CRITICAL FIX ---
        // Pass the error to the global error handler
        next(error);
    }
};

// Publishes a portfolio (simulated for now, actual implementation is complex)
const publishPortfolio = async (req, res, next) => {
    try {
        const { id } = req.params;
        const portfolio = await Portfolio.findOne({ _id: id, userId: req.user._id });

        if (!portfolio) {
            logger.warn(`Portfolio ${id} not found for user ${req.user._id} for publishing.`);
            return res.status(404).json({ message: 'Portfolio not found or you do not have permission to publish it.' });
        }

        // Call the service to simulate or actually deploy the portfolio
        const hostedUrl = await portfolioTemplateService.deployPortfolio(portfolio._id, portfolio.sections);

        portfolio.hostedUrl = hostedUrl;
        portfolio.updatedAt = Date.now();
        await portfolio.save();

        logger.info(`Portfolio ${portfolio._id} published successfully to ${hostedUrl}.`);
        res.status(200).json({
            message: 'Portfolio published successfully!',
            hostedUrl: hostedUrl,
            portfolio: portfolio,
        });
    } catch (error) {
        logger.error('Error publishing portfolio:', error);
        next(error);
    }
};

// Get all portfolios for the authenticated user
const getPortfolios = async (req, res, next) => {
    try {
        // If user is a fallback object (not from database), return empty array
        if (typeof req.user._id === 'string' && req.user._id === req.user.clerkId) {
            logger.info(`Fallback user ${req.user._id} - returning empty portfolios array.`);
            return res.status(200).json([]);
        }

        const portfolios = await Portfolio.find({ userId: req.user._id }).sort({ createdAt: -1 });
        logger.info(`Fetched ${portfolios.length} portfolios for user ${req.user._id}.`);
        res.status(200).json(portfolios);
    } catch (error) {
        logger.error('Error getting portfolios:', error);
        next(error);
    }
};

// Get a single portfolio by ID for the authenticated user
const getPortfolioById = async (req, res, next) => {
    try {
        const portfolio = await Portfolio.findOne({ _id: req.params.id, userId: req.user._id });
        if (!portfolio) {
            logger.warn(`Portfolio ${req.params.id} not found for user ${req.user._id}.`);
            return res.status(404).json({ message: 'Portfolio not found or you do not have permission to access it.' });
        }
        logger.info(`Fetched portfolio ${portfolio._id} for user ${req.user._id}.`);
        res.status(200).json(portfolio);
    } catch (error) {
        logger.error('Error getting portfolio by ID:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Portfolio ID format.' });
        }
        next(error);
    }
};

// Delete a portfolio
const deletePortfolio = async (req, res, next) => {
    try {
        const { id } = req.params;
        const portfolio = await Portfolio.findOneAndDelete({ _id: id, userId: req.user._id });

        if (!portfolio) {
            logger.warn(`Portfolio ${id} not found for user ${req.user._id} for deletion.`);
            return res.status(404).json({ message: 'Portfolio not found or you do not have permission to delete it.' });
        }

        // Remove reference from the user's document
        await User.findByIdAndUpdate(req.user._id, { $pull: { portfolios: id } });

        // TODO: If you implement actual hosting, add logic here to unpublish/delete the hosted site
        logger.info(`Portfolio ${id} deleted for user ${req.user._id}. Unpublishing logic not yet implemented.`);

        res.status(200).json({ message: 'Portfolio deleted successfully.' });
    } catch (error) {
        logger.error('Error deleting portfolio:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Portfolio ID format.' });
        }
        next(error);
    }
};

module.exports = {
    generatePortfolio,
    publishPortfolio,
    getPortfolios,
    getPortfolioById,
    deletePortfolio,
};