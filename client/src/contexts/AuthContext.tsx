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
    console.log('AuthContext - refreshUser called, clerkUser:', !!clerkUser)

    if (!clerkUser) {
      console.log('AuthContext - No clerk user, setting user to null')
      setUser(null)
      setIsLoading(false)
      return
    }

    try {
      console.log('AuthContext - Fetching user profile from backend')
      const response = await apiClient.get('/auth/me')
      console.log('AuthContext - Successfully fetched user profile')
      setUser(response.data)
    } catch (error: any) {
      console.error('AuthContext - Failed to fetch user profile:', error)

      // If it's a network/CORS error, create a basic user object from Clerk data
      // Don't set user to null as this would cause auth loops
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        console.log('AuthContext - Using Clerk user data due to network error')
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
      } else if (error.response?.status === 401 || error.response?.status === 404) {
        console.log(`AuthContext - ${error.response.status} error, but user is signed in with Clerk. Using Clerk data.`)
        // If we get 401/404 but user is signed in with Clerk, use Clerk data
        // This prevents auth loops when backend auth is misconfigured or user not synced
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
        console.log('AuthContext - Other error, setting user to null')
        // Only set to null for actual auth errors
        setUser(null)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    console.log('AuthContext - useEffect triggered, isLoaded:', isLoaded, 'clerkUser:', !!clerkUser)

    if (isLoaded) {
      // Add a small delay to prevent rapid fire requests and state changes
      const timer = setTimeout(() => {
        refreshUser()
      }, 200) // Increased delay slightly

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
