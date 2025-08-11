import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { Layout } from './components/layout/Layout'
import LandingPage from './pages/LandingPage'
import { Dashboard } from './pages/Dashboard'
import SignInPage from './pages/auth/SignInPage'
import { SignUpPage } from './pages/auth/SignUpPage'
import { ResumesPage } from './pages/resumes/ResumesPage'
import { PortfoliosPage } from './pages/portfolios/PortfoliosPage'
import { ProfilePage } from './pages/ProfilePage'

// Get Clerk publishable key from environment variables
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key')
}

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/resumes/*" element={
              <ProtectedRoute>
                <Layout>
                  <ResumesPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/portfolios/*" element={
              <ProtectedRoute>
                <Layout>
                  <PortfoliosPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <ProfilePage />
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ClerkProvider>
  )
}

export default App
