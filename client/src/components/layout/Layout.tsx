import { Link, NavLink } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'
import { cn } from '../../lib/utils'
import { Sparkles } from 'lucide-react'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950">
      {/* Top nav */}
      <header className="sticky top-0 z-50 w-full bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              DevElevate
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <NavLink
              to="/dashboard"
              className={({ isActive }) => cn(
                'text-gray-300 hover:text-white transition-colors duration-200 font-medium relative group',
                isActive && 'text-white'
              )}
            >
              Dashboard
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300" />
            </NavLink>
            <NavLink
              to="/resumes"
              className={({ isActive }) => cn(
                'text-gray-300 hover:text-white transition-colors duration-200 font-medium relative group',
                isActive && 'text-white'
              )}
            >
              Resumes
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300" />
            </NavLink>
            <NavLink
              to="/portfolios"
              className={({ isActive }) => cn(
                'text-gray-300 hover:text-white transition-colors duration-200 font-medium relative group',
                isActive && 'text-white'
              )}
            >
              Portfolios
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300" />
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) => cn(
                'text-gray-300 hover:text-white transition-colors duration-200 font-medium relative group',
                isActive && 'text-white'
              )}
            >
              Profile
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300" />
            </NavLink>
          </nav>

          <div className="flex items-center space-x-4">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: 'w-10 h-10',
                  userButtonPopoverCard: 'bg-slate-800 border border-white/10',
                  userButtonPopoverActionButton: 'text-gray-300 hover:text-white hover:bg-white/10',
                  userButtonPopoverActionButtonText: 'text-gray-300',
                  userButtonPopoverFooter: 'hidden'
                }
              }}
            />
          </div>
        </div>
      </header>

      {/* Main content - Full width, no padding */}
      <main className="relative">
        {children}
      </main>
    </div>
  )
}
