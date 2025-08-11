# DevElevate-Backend

Backend for the AI Resume + Portfolio Refiner for Developers.

## Project Description

This backend powers a web application designed to help developers enhance their resumes, create professional portfolios, and generate tailored cover letters using AI. It integrates with GitHub, LinkedIn (future), and utilizes Google's Gemini API for AI-driven content generation and refinement.

## Tech Stack

* **Node.js** with **Express.js**
* **MongoDB** (via Mongoose)
* **Google Gemini API** for AI capabilities
* **GitHub OAuth** for integration
* **Clerk** for authentication (via webhooks)
* **Multer** for file uploads
* **pdf-parse** and **mammoth** for local resume text extraction (optional, can be replaced by external parser like resumey.pro)

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your_username/DevElevate-Backend.git](https://github.com/your_username/DevElevate-Backend.git)
    cd DevElevate-Backend
    ```

2.  **Create and configure environment variables:**
    * Create a `.env` file in the project root.
    * Populate it with your sensitive keys and configurations (see `.env.example` or the previous `.env` content).
        * `PORT`: Port for the server (e.g., 5000)
        * `MONGO_URI`: Your MongoDB connection string.
        * `GEMINI_API_KEY`: Your Google Gemini API key from Google AI Studio.
        * `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`: From your GitHub OAuth App registration.
        * `CLERK_WEBHOOK_SECRET`: From your Clerk dashboard webhook settings.
        * `CLERK_FRONTEND_API_URL`: The URL of your frontend application (e.g., `http://localhost:3000` or your Vercel/Netlify URL).
        * `RESUMEY_PRO_API_KEY`: (Optional) If you plan to use resumey.pro for advanced resume parsing.

3.  **Install dependencies:**
    ```bash
    npm install
    ```
    If you want `nodemon` for automatic server restarts during development, also run:
    ```bash
    npm install -D nodemon
    ```

4.  **Create necessary directories:**
    * If you haven't already, create the `src` folder and its subfolders:
        ```bash
        # For Windows Command Prompt
        mkdir src
        mkdir src\config
        mkdir src\middleware
        mkdir src\models
        mkdir src\routes
        mkdir src\services
        mkdir src\utils
        mkdir src\controllers
        mkdir uploads # For uploaded resume files
        ```
        *(Adjust for PowerShell or Git Bash if preferred, as discussed in previous steps)*

5.  **Start the server:**
    * **Development mode (with nodemon):**
        ```bash
        npm run dev
        ```
    * **Production mode:**
        ```bash
        npm start
        ```

## API Endpoints

(This section should be expanded as you build out your API, providing details on each endpoint, methods, and expected request/response bodies.)

* `GET /` - Basic server check
* `POST /api/auth/webhook` - Clerk webhook endpoint
* `GET /api/auth/me` - Get current user profile
* `GET /api/github/auth` - Initiate GitHub OAuth
* `GET /api/github/callback` - GitHub OAuth callback
* `GET /api/github/repos` - Get user's GitHub repositories
* `POST /api/resumes/upload` - Upload and parse a resume
* `POST /api/resumes/build` - Build a resume from scratch (GitHub + QnA)
* `PUT /api/resumes/:id/enhance` - Enhance a resume using AI
* `GET /api/resumes` - Get all user resumes
* `GET /api/resumes/:id` - Get a specific resume
* `DELETE /api/resumes/:id` - Delete a resume
* `POST /api/portfolios/generate` - Generate a new portfolio
* `POST /api/portfolios/:id/publish` - Publish a portfolio
* `GET /api/portfolios` - Get all user portfolios
* `GET /api/portfolios/:id` - Get a specific portfolio
* `DELETE /api/portfolios/:id` - Delete a portfolio
* `POST /api/ai/coverletter/generate` - Generate a cover letter
* `POST /api/ai/ats-score` - Calculate ATS score (Stretch Goal)
* `GET /api/users/profile` - Get full user profile
* `PUT /api/users/profile` - Update user profile

---

### **`src/` Folder Files:**

---

#### 5. `src/app.js`

Create this file in **`DevElevate-Backend/src/`**.

```javascript
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Body parser for JSON

// Basic Route
app.get('/', (req, res) => {
    res.send('AI Resume Refiner Backend API is running!');
});

// Import and use routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/github', require('./routes/githubRoutes'));
app.use('/api/resumes', require('./routes/resumeRoutes'));
app.use('/api/portfolios', require('./routes/portfolioRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/users', require('./routes/userRoutes'));


// Error handling middleware (should be last)
app.use(errorHandler);

module.exports = app;