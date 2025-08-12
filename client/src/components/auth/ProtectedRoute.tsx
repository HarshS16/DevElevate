import { useAuth } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'
import { LoadingSpinner } from '../ui/LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isSignedIn, isLoaded } = useAuth()

  // Debug logging
  console.log('ProtectedRoute - isLoaded:', isLoaded, 'isSignedIn:', isSignedIn)

  if (!isLoaded) {
    console.log('ProtectedRoute - Still loading, showing spinner')
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoadingSpinner />
      </div>
    )
  }

  if (!isSignedIn) {
    console.log('ProtectedRoute - Not signed in, redirecting to sign-in')
    return <Navigate to="/sign-in" replace />
  }

  console.log('ProtectedRoute - Signed in, rendering children')
  return <>{children}</>
}
