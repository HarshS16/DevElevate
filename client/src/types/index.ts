// User types
export interface User {
  _id: string
  clerkId: string
  email: string
  name?: string
  githubUsername?: string
  githubAccessToken?: string
  linkedinProfileUrl?: string
  resumes: string[]
  portfolios: string[]
  coverLetters: string[]
  createdAt: string
  updatedAt: string
}

// Resume types
export interface ContactInfo {
  email?: string
  phone?: string
  linkedin?: string
}

export interface Experience {
  title: string
  company: string
  location?: string
  startDate: string
  endDate?: string
  description: string
}

export interface Education {
  degree: string
  institution: string
  location?: string
  startDate: string
  endDate?: string
}

export interface Project {
  name: string
  description: string
  technologies: string[]
  url?: string
}

export interface ParsedContent {
  name?: string
  contactInfo?: ContactInfo
  summary?: string
  experience?: Experience[]
  education?: Education[]
  skills?: string[]
  projects?: Project[]
}

export interface Resume {
  _id: string
  userId: string
  title: string
  originalFileName?: string
  originalFilePath?: string
  parsedContent?: ParsedContent
  rawTextContent?: string
  enhancedContent?: string
  targetJobRole?: string
  pdfUrl?: string
  createdAt: string
  updatedAt: string
}

// Portfolio types
export interface GithubProject {
  projectId: string
  name: string
  description: string
  html_url: string
  homepage?: string
  topics: string[]
  stargazers_count: number
}

export interface PortfolioSections {
  aboutMe?: string
  skills?: string[]
  experience?: Experience[]
  education?: Education[]
}

export interface Portfolio {
  _id: string
  userId: string
  title: string
  templateId: string
  selectedGithubProjects: GithubProject[]
  sections: PortfolioSections
  hostedUrl?: string
  createdAt: string
  updatedAt: string
}

// Cover Letter types
export interface CoverLetter {
  _id: string
  userId: string
  resumeId: string
  jobDescription: string
  generatedContent: string
  createdAt: string
}

// GitHub types
export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description?: string
  html_url: string
  homepage?: string
  topics: string[]
  stargazers_count: number
  language?: string
  updated_at: string
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

// Form types
export interface ResumeUploadForm {
  file: File
}

export interface ResumeBuildForm {
  aboutMe: string
  skills: string[]
  targetJobRole?: string
}

export interface PortfolioGenerateForm {
  title: string
  templateId: string
  selectedGithubRepoIds: string[]
  aboutMeInput?: string
  skillsInput?: string[]
}

export interface CoverLetterForm {
  resumeId: string
  jobDescription: string
}

export interface ATSScoreForm {
  resumeId: string
  jobDescription: string
}

export interface ATSScoreResult {
  score: number
  matchedKeywords: string[]
  missingKeywords: string[]
  suggestions: string[]
  message: string
}
