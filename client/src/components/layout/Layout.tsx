import { Link, NavLink } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'
import { cn } from '../../lib/utils'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="sticky top-0 z-40 w-full border-b bg-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <span className="text-xl font-bold">DevElevate</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink
              to="/dashboard"
              className={({ isActive }) => cn('text-sm font-medium text-gray-600 hover:text-gray-900', isActive && 'text-gray-900')}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/resumes"
              className={({ isActive }) => cn('text-sm font-medium text-gray-600 hover:text-gray-900', isActive && 'text-gray-900')}
            >
              Resumes
            </NavLink>
            <NavLink
              to="/portfolios"
              className={({ isActive }) => cn('text-sm font-medium text-gray-600 hover:text-gray-900', isActive && 'text-gray-900')}
            >
              Portfolios
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) => cn('text-sm font-medium text-gray-600 hover:text-gray-900', isActive && 'text-gray-900')}
            >
              Profile
            </NavLink>
          </nav>
          <div className="flex items-center space-x-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
