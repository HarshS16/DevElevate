import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'

// Normalize base URL: ensure it includes /api
const rawBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
const baseURL = rawBase.endsWith('/api') || rawBase.includes('/api/') ? rawBase : `${rawBase.replace(/\/$/, '')}/api`

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Use Clerk global to get token without React hooks
      // @ts-expect-error Clerk is injected on window by ClerkProvider
      const token = await window.Clerk?.session?.getToken()
      if (token) {
        config.headers = config.headers || {}
        // @ts-ignore
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      console.error('Failed to get auth token:', error)
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/sign-in'
    }
    return Promise.reject(error)
  }
)

// API endpoints
export const api = {
  // Auth endpoints
  auth: {
    getMe: () => apiClient.get('/auth/me'),
  },

  // User endpoints
  users: {
    getProfile: () => apiClient.get('/users/profile'),
    updateProfile: (data: any) => apiClient.put('/users/profile', data),
  },

  // GitHub endpoints
  github: {
    initiateAuth: () => apiClient.get('/github/auth'),
    getRepos: () => apiClient.get('/github/repos'),
  },

  // Resume endpoints
  resumes: {
    getAll: () => apiClient.get('/resumes'),
    getById: (id: string) => apiClient.get(`/resumes/${id}`),
    upload: (formData: FormData) => apiClient.post('/resumes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    build: (data: any) => apiClient.post('/resumes/build', data),
    enhance: (id: string, data: any) => apiClient.put(`/resumes/${id}/enhance`, data),
    delete: (id: string) => apiClient.delete(`/resumes/${id}`),
  },

  // Portfolio endpoints
  portfolios: {
    getAll: () => apiClient.get('/portfolios'),
    getById: (id: string) => apiClient.get(`/portfolios/${id}`),
    generate: (data: any) => apiClient.post('/portfolios/generate', data),
    publish: (id: string) => apiClient.post(`/portfolios/${id}/publish`),
    delete: (id: string) => apiClient.delete(`/portfolios/${id}`),
  },

  // AI endpoints
  ai: {
    generateCoverLetter: (data: any) => apiClient.post('/ai/coverletter/generate', data),
    getATSScore: (data: any) => apiClient.post('/ai/ats-score', data),
  },
}

export default api
