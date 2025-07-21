
const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require('@google/generative-ai');
const config = require('../config');
const logger = require('../utils/logger'); // <--- CRITICAL FIX: ADD THIS LINE

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
// Choose your model. 'gemini-pro' for general text, 'gemini-1.5-flash' for speed and large context, 'gemini-1.5-pro' for more complex reasoning.
// For resume and cover letter, 1.5-flash or 1.5-pro are excellent due to context window.
const textModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
const longContextModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Good balance of cost/speed/context for resumes

// Safety settings (adjust as needed for your application)
// For resume/portfolio tools, you generally want less blocking on "dangerous" content
// unless it's genuinely harmful.
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

const generateContent = async (prompt, model = textModel, temperature = 0.7) => {
    try {
        const result = await model.generateContent({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: temperature,
                topK: 1,
                topP: 1,
            },
            safetySettings: safetySettings,
        });
        const response = await result.response;
        return response.text();
    } catch (error) {
        // Use the logger utility here
        logger.error('Error generating content with Gemini:', {
            message: error.message,
            details: error.response ? error.response.promptFeedback : null
        });
        // Check for specific error types (e.g., safety blocking)
        if (error.response && error.response.promptFeedback && error.response.promptFeedback.blockReason) {
            throw new Error(`Gemini content generation blocked: ${error.response.promptFeedback.blockReason}`);
        }
        throw new Error('Failed to generate content using Gemini. Please try again later.');
    }
};

const enhanceResume = async (resumeContent, targetRole) => {
    const prompt = `You are an expert resume writer and ATS optimization specialist. Enhance the following raw resume content for a developer targeting a "${targetRole}" role.
    Focus on:
    1.  **Quantifiable Impact:** Add numbers and metrics where possible (e.g., "Improved load time by 20%"). If no numbers are present, suggest generic quantifiable improvements (e.g., "significantly improved", "reduced").
    2.  **Action Verbs:** Start bullet points with strong action verbs.
    3.  **ATS-Friendliness:** Integrate relevant keywords common for a developer in the "${targetRole}" position.
    4.  **Clarity & Conciseness:** Remove jargon, redundancy, and improve overall readability.
    5.  **Structure:** Ensure standard resume sections (Contact, Summary/Objective, Experience, Projects, Skills, Education) are clear.
    6.  **Tech Stack:** Clearly highlight technologies used within project/experience descriptions.

    Provide the enhanced resume in a clean, professional markdown format, including clear headings for sections.

    Resume Content:
    ${resumeContent}

    Enhanced Resume (in Markdown):`;
    return generateContent(prompt, longContextModel, 0.5); // Lower temperature for more focused output
};

const generateCoverLetter = async (resumeSummary, jobDescription) => {
    const prompt = `Generate a professional and compelling cover letter for a job application.
    Use the provided summary of the applicant's resume and the full job description to tailor the letter specifically for this role.
    Highlight how the applicant's skills, experiences, and projects directly align with the job requirements and the company's needs.
    Make it concise (around 3-4 paragraphs), professional, enthusiastic, and express strong interest in the role and company.
    Conclude with a call to action for an interview.

    Applicant's Resume Summary (key skills, experiences, top projects relevant to the JD):
    ${resumeSummary}

    Job Description:
    ${jobDescription}

    Cover Letter:`;
    return generateContent(prompt, longContextModel, 0.7);
};

const generatePortfolioProjectDescription = async (projectName, projectDescription, technologiesUsed, yourRole, githubUrl, liveUrl) => {
    const prompt = `Write an engaging and professional description for a developer portfolio for the following project.
    Focus on:
    1.  The core problem the project solves or its main purpose.
    2.  Your key contributions and what you learned.
    3.  The technologies used, clearly listed.
    4.  A call to action to view the project on GitHub or a live demo (if applicable).

    Project Name: ${projectName}
    Original GitHub Description: ${projectDescription || 'No description provided.'}
    Technologies Used: ${technologiesUsed.join(', ')}
    Your Role: ${yourRole || 'Developer'}
    GitHub URL: ${githubUrl}
    Live Demo URL: ${liveUrl || 'N/A'}

    Portfolio Project Description:`;
    return generateContent(prompt, textModel, 0.6);
};

// (Stretch Goal) ATS Score Checker - Keyword Extraction
const extractKeywordsFromJD = async (jobDescription) => {
    const prompt = `Analyze the following job description and extract the most important keywords, required skills, and core responsibilities.
    Provide the output as a JSON object with the following keys:
    - "keywords": An array of general relevant keywords.
    - "requiredSkills": An array of specific technical and soft skills explicitly mentioned as required.
    - "responsibilities": An array of key job duties and responsibilities.

    Ensure the output is valid JSON.

    Job Description:
    ${jobDescription}

    JSON Output:`;
    const jsonString = await generateContent(prompt, longContextModel, 0.1); // Low temperature for structured output
    try {
        // Attempt to clean up common JSON formatting issues if Gemini sometimes adds markdown blocks
        let cleanedJsonString = jsonString.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(cleanedJsonString);
    } catch (e) {
        // Use the logger utility here
        logger.error('Failed to parse JSON from Gemini for JD keywords. Raw output:', jsonString, e);
        // Fallback to empty arrays if parsing fails
        return { keywords: [], requiredSkills: [], responsibilities: [] };
    }
};

module.exports = {
    enhanceResume,
    generateCoverLetter,
    generatePortfolioProjectDescription,
    extractKeywordsFromJD,
    generateContent, // <--- This was confirmed to be present in previous checks.
    longContextModel,
    textModel
};