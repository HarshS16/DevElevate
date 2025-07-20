const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require('@google/generative-ai');
const config = require('../config');

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
// Choose your model. 'gemini-pro' for text, 'gemini-1.5-flash' for speed, 'gemini-1.5-pro' for more complex reasoning.
const textModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
const longContextModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Or 'gemini-1.5-pro' for longer inputs

// Safety settings (adjust as needed for your application)
const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
];

const generateContent = async (prompt, model = textModel) => {
    try {
        const result = await model.generateContent(prompt, safetySettings);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error generating content with Gemini:', error);
        // Check for specific error types (e.g., safety blocking)
        if (error.response && error.response.promptFeedback && error.response.promptFeedback.blockReason) {
            throw new Error(`Gemini content generation blocked: ${error.response.promptFeedback.blockReason}`);
        }
        throw new Error('Failed to generate content using Gemini.');
    }
};

const enhanceResume = async (resumeContent, targetRole) => {
    const prompt = `You are an expert resume writer and ATS optimization specialist. Enhance the following resume content for a developer targeting a "${targetRole}" role. Focus on:
    1. Improving action verbs and quantifiable impact (e.g., "Increased performance by 30%").
    2. Ensuring ATS-friendliness by integrating relevant keywords for a developer in this role.
    3. Improving structure, clarity, and conciseness.
    4. Highlighting relevant tech stack.
    5. The output should be a well-structured markdown resume.

    Resume Content:
    ${resumeContent}

    Enhanced Resume (in Markdown):`;
    return generateContent(prompt, longContextModel);
};

const generateCoverLetter = async (resumeSummary, jobDescription) => {
    const prompt = `Generate a professional and compelling cover letter.
    Use the provided summary of the applicant's resume and the job description to tailor the letter.
    Highlight how the applicant's skills and experience directly align with the job requirements.
    Make it concise, persuasive, and suitable for a developer role.

    Applicant's Resume Summary (key skills, experiences, projects):
    ${resumeSummary}

    Job Description:
    ${jobDescription}

    Cover Letter:`;
    return generateContent(prompt, longContextModel);
};

const generatePortfolioProjectDescription = async (projectName, projectDescription, technologiesUsed, yourRole, githubUrl) => {
    const prompt = `Write an engaging and professional description for a developer portfolio for the following project.
    Focus on the problem solved, your contribution, and the technologies used. Keep it concise but informative.

    Project Name: ${projectName}
    Original GitHub Description: ${projectDescription || 'No description provided.'}
    Technologies Used: ${technologiesUsed.join(', ')}
    Your Role: ${yourRole || 'Full Stack Developer'}
    GitHub URL: ${githubUrl}

    Portfolio Project Description:`;
    return generateContent(prompt);
};

// (Stretch Goal) ATS Score Checker - Keyword Extraction
const extractKeywordsFromJD = async (jobDescription) => {
    const prompt = `Extract the most important keywords, required skills, and core responsibilities from the following job description.
    Provide the output as a JSON object with keys: "keywords", "requiredSkills", "responsibilities". Each key should contain an array of strings.

    Job Description:
    ${jobDescription}

    JSON Output:`;
    const jsonString = await generateContent(prompt);
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        console.error('Failed to parse JSON from Gemini:', jsonString);
        return { keywords: [], requiredSkills: [], responsibilities: [] }; // Fallback
    }
};

module.exports = {
    enhanceResume,
    generateCoverLetter,
    generatePortfolioProjectDescription,
    extractKeywordsFromJD,
};