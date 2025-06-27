import React, { useState } from 'react'
import { Menu, X, Search, User, Shield, Users, Settings } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import AuthPopup from '../Auth/AuthPopup'
import { Link } from 'react-router-dom'

const Header: React.FC = () => {
  const { user, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')

  const handleAuthClick = (mode: 'signin' | 'signup') => {
    setAuthMode(mode)
    setIsAuthOpen(true)
  }

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4" />
      case 'police': return <Shield className="w-4 h-4 text-blue-400" />
      case 'mortuary_staff': return <Users className="w-4 h-4 text-green-400" />
      default: return <User className="w-4 h-4" />
    }
  }

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'admin': return 'Administrator'
      case 'police': return 'Police Officer'
      case 'mortuary_staff': return 'Mortuary Staff'
      default: return 'Public User'
    }
  }

  return (
    <>
      <header className="bg-ek-bg-main border-b border-ek-accent-gold/20 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <img src="/logo.svg" alt="Everlasting Kin" className="h-8 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/search" 
                className="flex items-center space-x-2 text-ek-text-muted hover:text-ek-accent-mint transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </Link>
              
              {user && (
                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-2 text-ek-text-muted hover:text-ek-accent-mint transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
              )}
            </nav>

            {/* User Section */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="hidden sm:block text-right">
                    <div className="flex items-center space-x-2 text-ek-text-main text-sm font-medium">
                      {getRoleIcon(user.role)}
                      <span>{user.first_name} {user.last_name}</span>
                    </div>
                    <div className="text-ek-text-muted text-xs">
                      {getRoleLabel(user.role)}
                    </div>
                  </div>
                  <button
                    onClick={signOut}
                    className="bg-ek-error hover:bg-ek-error/80 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center space-x-3">
                  <button
                    onClick={() => handleAuthClick('signin')}
                    className="text-ek-text-muted hover:text-ek-accent-mint transition-colors font-medium"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleAuthClick('signup')}
                    className="bg-ek-accent-gold hover:bg-ek-accent-gold/80 text-ek-bg-main px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Register
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-ek-text-main hover:text-ek-accent-mint transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-ek-bg-main border-t border-ek-accent-gold/20 animate-slide-in-left">
            <div className="px-4 py-3 space-y-3">
              <Link 
                to="/search" 
                className="flex items-center space-x-2 text-ek-text-muted hover:text-ek-accent-mint transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="flex items-center space-x-2 text-ek-text-muted hover:text-ek-accent-mint transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <div className="pt-2 border-t border-ek-accent-gold/20">
                    <div className="flex items-center space-x-2 text-ek-text-main text-sm font-medium py-2">
                      {getRoleIcon(user.role)}
                      <span>{user.first_name} {user.last_name}</span>
                    </div>
                    <div className="text-ek-text-muted text-xs mb-3">
                      {getRoleLabel(user.role)}
                    </div>
                    <button
                      onClick={() => {
                        signOut()
                        setIsMenuOpen(false)
                      }}
                      className="w-full bg-ek-error hover:bg-ek-error/80 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-2 border-t border-ek-accent-gold/20 space-y-2">
                  <button
                    onClick={() => {
                      handleAuthClick('signin')
                      setIsMenuOpen(false)
                    }}
                    className="w-full text-left text-ek-text-muted hover:text-ek-accent-mint transition-colors py-2"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      handleAuthClick('signup')
                      setIsMenuOpen(false)
                    }}
                    className="w-full bg-ek-accent-gold hover:bg-ek-accent-gold/80 text-ek-bg-main px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth Popup */}
      <AuthPopup 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        mode={authMode}
        onToggleMode={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
      />
    </>
  )
}

export default Header