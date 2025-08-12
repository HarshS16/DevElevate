import React, { createContext, useContext, useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { apiClient } from '../lib/api'
import type { User } from '../types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded } = useUser()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = async () => {
    if (!clerkUser) {
      setUser(null)
      setIsLoading(false)
      return
    }

    try {
      const response = await apiClient.get('/auth/me')
      setUser(response.data)
    } catch (error: any) {
      console.error('Failed to fetch user profile:', error)

      // If it's a network/CORS error, create a basic user object from Clerk data
      // Don't set user to null as this would cause auth loops
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        console.log('Using Clerk user data due to network error')
        setUser({
          _id: clerkUser.id,
          clerkId: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          name: clerkUser.fullName || '',
          resumes: [],
          portfolios: [],
          coverLetters: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      } else {
        // Only set to null for actual auth errors
        setUser(null)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isLoaded) {
      // Add a small delay to prevent rapid fire requests
      const timer = setTimeout(() => {
        refreshUser()
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [clerkUser, isLoaded])

  return (
    <AuthContext.Provider value={{ user, isLoading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
