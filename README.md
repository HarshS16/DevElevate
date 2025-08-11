# DevElevate 

An AI-powered web app for developers to polish resumes, auto-generate stunning portfolios, and craft smart cover letters powered by Gemini. Connect your GitHub & LinkedIn, upload your resume, and unlock career-ready documents that truly represent your skills.

## 🚀 Features

- **GitHub Import:** Auto-fetch your projects, contributions, and stats.
- **Resume Upload or Builder:** Upload, parse, or create a resume from your GitHub data.
- **AI Resume Enhancer:** Instantly improve and tailor your resume.
- **Job Role Matching:** Customize your documents for specific jobs or pasted JDs.
- **Portfolio Generator:** Choose a template; auto-fill with your best code work.
- **Cover Letter Generator:** Get personalized, job-ready cover letters.

## 🗂 Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── assets/          # Logos, images, icons
├── src/
│   ├── components/      # Reusable UI components (Buttons, Inputs, etc)
│   ├── pages/           # App pages (Dashboard, Builder, etc)
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   ├── api/             # API call logic
│   ├── styles/          # Tailwind configs, CSS
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── package.json
├── tailwind.config.js
└── README.md
```

## 🏗 Tech Stack

- **React** (Vite or CRA) — modern UI framework
- **TailwindCSS** — utility-first styling
- **Clerk/Auth0** — seamless authentication
- **Framer Motion** — smooth micro animations
- **Axios** — API requests
- **Gemini** (via backend) — for generative AI features

## 🛠 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-org/ai-resume-portfolio-frontend.git
cd ai-resume-portfolio-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the root:

```
VITE_BACKEND_API_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

Add other relevant frontend secrets as needed.

### 4. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000` (or as specified by Vite output).

## 🔒 Authentication

- Uses **OAuth** (GitHub, LinkedIn) via backend.
- Clerk/Auth0 powers session and user management.
- Most features require users to log in.

## 📡 API Communication

All frontend routes communicate with the backend defined in the project architecture:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET`  | `/api/github/import`          | Fetch GitHub projects |
| `POST` | `/api/resume/upload`          | Upload and parse resume |
| `POST` | `/api/resume/enhance`         | AI-powered resume generation |
| `POST` | `/api/portfolio/generate`     | Portfolio site generation |
| `POST` | `/api/cover-letter/generate`  | Generate cover letter |

## 📦 Scripts

- `npm run dev`  — Start local dev server
- `npm run build` — Production build
- `npm run preview` — Preview built app

## 🖼 Customization & Theming

- Several portfolio templates available.
- Edit Tailwind config for brand color customization.
- Update `/src/assets/` for logo and image changes.

## ✨ Contributing

1. Fork the repo and create your branch: `git checkout -b feat/your-feature`
2. Commit changes: `git commit -m 'Add something cool'`
3. Push and create a Pull Request

## 🧩 Future Features

- Export to Notion, PDF, hosted link
- Live ATS score breakdown
- One-click job applications
- Peer review on portfolios and resumes

## 📄 License

MIT — Free to use, modify, and share. Give credit if you build with or on top of this project.

**Ready to get your developer story out there? Start building your AI-refined portfolio today!**
