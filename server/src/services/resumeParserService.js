const fs = require('fs').promises;
const pdfParse = require('pdf-parse'); // For PDF
const mammoth = require('mammoth'); // For DOCX
const geminiService = require('./geminiService'); // To use Gemini for structuring text

// You can uncomment and use resumey.pro if you get an API key
// const axios = require('axios');
// const config = require('../config');

const parseResume = async (filePath) => {
    // --- OPTION 1: Using an external API like resumey.pro (Recommended for best accuracy) ---
    // if (config.RESUMEY_PRO_API_KEY) {
    //     try {
    //         const fileBuffer = await fs.readFile(filePath);
    //         const response = await axios.post('[https://api.resumey.pro/parse](https://api.resumey.pro/parse)', fileBuffer, {
    //             headers: {
    //                 'Content-Type': 'application/pdf', // Adjust content type based on file
    //                 'Authorization': `Bearer ${config.RESUMEY_PRO_API_KEY}`,
    //             },
    //             // For .docx, you might need to adjust content type and possibly payload format
    //         });
    //         // Ensure resumey.pro returns structured JSON like: { name: "...", experience: [...] }
    //         return {
    //             rawTextContent: response.data.raw_text, // Assuming resumey.pro provides raw text
    //             parsedContent: response.data, // The structured data from resumey.pro
    //         };
    //     } catch (error) {
    //         console.error('Error parsing resume with resumey.pro:', error.response ? error.response.data : error.message);
    //         throw new Error('Failed to parse resume with external service. Check API key and service status.');
    //     } finally {
    //         // Clean up the uploaded file after processing
    //         await fs.unlink(filePath).catch(err => console.error("Failed to delete temp file:", err));
    //     }
    // }

    // --- OPTION 2: Local text extraction + Gemini for structuring (Good for MVP, less accurate) ---
    try {
        const fileBuffer = await fs.readFile(filePath);
        let rawText;

        if (filePath.endsWith('.pdf')) {
            const data = await pdfParse(fileBuffer);
            rawText = data.text;
        } else if (filePath.endsWith('.docx')) {
            const result = await mammoth.extractRawText({ arrayBuffer: fileBuffer });
            rawText = result.value;
        } else if (filePath.endsWith('.doc')) {
            // .doc parsing is significantly harder and often requires specific native libraries
            // or conversion services. For MVP, it's advised to focus on PDF/DOCX.
            throw new Error('DOC files (.doc) are not directly supported by this parser. Please upload PDF or DOCX.');
        } else {
            throw new Error('Unsupported file type for resume parsing. Only PDF and DOCX are allowed.');
        }

        // Use Gemini to try and structure the raw text
        const prompt = `Given the following raw resume text, extract and format the key sections into a JSON object.
        Focus on:
        - "name": Full name.
        - "contactInfo": { "email", "phone", "linkedin" }.
        - "summary": A concise personal summary.
        - "experience": An array of objects, each with "title", "company", "location", "startDate", "endDate", "description".
        - "education": An array of objects, each with "degree", "institution", "location", "startDate", "endDate".
        - "skills": An array of strings (e.g., ["JavaScript", "React"]).
        - "projects": An array of objects, each with "name", "description", "technologies" (array of strings), "url".
        If a section or field is not found, use an empty array, empty string, or null/empty object as appropriate.
        Ensure the output is valid JSON.

        Raw Resume Text:
        ${rawText}

        JSON Output:`;

        const structuredDataString = await geminiService.generateContent(prompt, geminiService.longContextModel, 0.1); // Low temp for structured
        let structuredData;
        try {
            // Clean up possible markdown block from Gemini
            let cleanedJsonString = structuredDataString.replace(/```json\n?|\n?```/g, '').trim();
            structuredData = JSON.parse(cleanedJsonString);
        } catch (e) {
            console.error('Gemini returned invalid JSON for resume parsing. Raw output:', structuredDataString, e);
            // Fallback to empty structure if parsing fails
            structuredData = {
                name: null, contactInfo: {}, summary: null,
                experience: [], education: [], skills: [], projects: []
            };
        }

        return {
            rawTextContent: rawText,
            parsedContent: structuredData,
        };

    } catch (error) {
        console.error('Error parsing resume locally:', error.message);
        throw new Error('Failed to parse resume. Please ensure it\'s a valid PDF/DOCX: ' + error.message);
    } finally {
        // Always clean up the uploaded file after processing, regardless of success or failure
        await fs.unlink(filePath).catch(err => console.error("Failed to delete temp file:", err));
    }
};

module.exports = {
    parseResume,
};