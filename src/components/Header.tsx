'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, Menu, X, User, Settings, Bell, Home, Cloud, Activity, Mail, BarChart3 } from 'lucide-react'
import ProfileModal from './ProfileModal'
import NotificationsModal from './NotificationsModal'
import SettingsModal from './SettingsModal'
import { useMobileMenu } from '@/contexts/MobileMenuContext'

export default function Header() {
  const { isMenuOpen, setIsMenuOpen } = useMobileMenu()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [notifications, setNotifications] = useState(3)
  const router = useRouter()
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isMenuOpen])

  const handleLogout = async () => {
    try {
      // Call logout API if needed (for session invalidation)
      await fetch('/api/test-users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' })
      })
    } catch (error) {
      console.log('Logout API call failed, proceeding with local logout')
    }
    
    // Clear user data from localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('loginTime')
    localStorage.removeItem('rememberLogin')
    
    // Update user state
    setUser(null)
    setIsMenuOpen(false)
    
    // Redirect to home page
    router.push('/')
  }

  const openProfileModal = () => {
    setIsProfileModalOpen(true)
    setIsMenuOpen(false)
  }

  const openNotificationsModal = () => {
    setIsNotificationsModalOpen(true)
    setIsMenuOpen(false)
  }

  const openSettingsModal = () => {
    setIsSettingsModalOpen(true)
    setIsMenuOpen(false)
  }

  return (
    <>
      {/* Header Container - Fixed with proper z-index */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 z-10">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Nebula</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Home
              </Link>
              <Link href="/servizi" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Servizi
              </Link>
              <Link href="/status" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Status
              </Link>
              <Link href="/contatti" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Contatti
              </Link>
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Accedi
                </Link>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-all duration-200 z-10"
              aria-label={isMenuOpen ? 'Chiudi menu' : 'Apri menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu */}
      <div 
        ref={mobileMenuRef}
        className={`fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-lg font-bold text-gray-900">Nebula</span>
          </div>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Chiudi menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Menu Content */}
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-2">
            <Link
              href="/"
              className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              Home
            </Link>
            <Link
              href="/servizi"
              className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
              onClick={() => setIsMenuOpen(false)}
            >
              <Cloud className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              Servizi
            </Link>
            <Link
              href="/status"
              className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
              onClick={() => setIsMenuOpen(false)}
            >
              <Activity className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              Status
            </Link>
            <Link
              href="/contatti"
              className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
              onClick={() => setIsMenuOpen(false)}
            >
              <Mail className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              Contatti
            </Link>
            
            {user && (
              <Link
                href="/dashboard"
                className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <BarChart3 className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                Dashboard
              </Link>
            )}
          </nav>

          {/* User Section */}
          <div className="border-t border-gray-200 p-4">
            {user ? (
              <div className="space-y-2">
                {/* User Info */}
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Ciao, {user.name}!</p>
                    <p className="text-xs text-gray-500">Account attivo</p>
                  </div>
                </div>
                
                {/* User Actions */}
                <button
                  onClick={openProfileModal}
                  className="flex items-center w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <User className="w-5 h-5 mr-3" />
                  Profilo
                </button>
                <button
                  onClick={openSettingsModal}
                  className="flex items-center w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-5 h-5 mr-3" />
                  Impostazioni
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  className="flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5 mr-2" />
                  Accedi
                </Link>
                <Link
                  href="/login?mode=register"
                  className="flex items-center justify-center w-full bg-white border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-all duration-200 font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5 mr-2" />
                  Registrati
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {isProfileModalOpen && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={user}
          onUpdateUser={(userData) => {
            // Update user state with new data
            setUser(userData)
          }}
        />
      )}
      {isNotificationsModalOpen && (
        <NotificationsModal
          isOpen={isNotificationsModalOpen}
          onClose={() => setIsNotificationsModalOpen(false)}
          onNotificationCountChange={(count) => {
            // Update notification count
            setNotifications(count)
          }}
        />
      )}
      {isSettingsModalOpen && (
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
        />
      )}
    </>
  )
}