'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, Menu, X, User, Settings, Bell, Home, Cloud, Activity, Mail, BarChart3, ChevronDown, Calculator } from 'lucide-react'
import ProfileModal from './ProfileModal'
import NotificationsModal from './NotificationsModal'
import SettingsModal from './SettingsModal'
import { useMobileMenu } from '@/contexts/MobileMenuContext'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const { isMenuOpen, setIsMenuOpen } = useMobileMenu()
  const { user, login, logout, isAuthenticated } = useAuth()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const router = useRouter()
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const profileDropdownRef = useRef<HTMLDivElement>(null)

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
      if (e.key === 'Escape' && isProfileDropdownOpen) {
        setIsProfileDropdownOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isMenuOpen, isProfileDropdownOpen])

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      // Call logout API if needed (for session invalidation)
      await fetch('/api/test-users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' })
      })
    } catch (error) {
      // Logout API call failed, proceeding with local logout
    }
    
    // Use AuthContext logout
    logout()
    setIsMenuOpen(false)
    setIsProfileDropdownOpen(false)
    
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
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 xs:h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-1 xs:space-x-2 group z-10">
              <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-bold text-xs xs:text-sm sm:text-base">N</span>
              </div>
              <span className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Nebula</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm lg:text-base">
                Home
              </Link>
              <Link href="/servizi" className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm lg:text-base">
                Servizi
              </Link>
              <Link href="/status" className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm lg:text-base">
                Status
              </Link>
              <Link href="/contatti" className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm lg:text-base">
                Contatti
              </Link>
              {isAuthenticated ? (
                <div className="flex items-center space-x-2 lg:space-x-4">
                  <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm lg:text-base">
                    Dashboard
                  </Link>
                  
                  {/* Notifications */}
                  <button
                    onClick={() => setIsNotificationsModalOpen(true)}
                    className="relative p-2 lg:p-3 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Notifiche"
                  >
                    <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
                    {notifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                        {notifications}
                      </span>
                    )}
                  </button>

                  {/* Logout Button - Prominente e sempre visibile */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 lg:space-x-2 px-3 lg:px-4 py-2 lg:py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 font-medium text-sm lg:text-base min-h-[44px] shadow-sm hover:shadow-md"
                    aria-label="Disconnetti"
                  >
                    <LogOut className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>

                  <div className="relative" ref={profileDropdownRef}>
                    <button
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className="flex items-center space-x-1 lg:space-x-2 p-2 rounded-lg hover:bg-gray-100 hover:shadow-sm transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 min-h-[44px]"
                    >
                      <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow duration-200">
                        <span className="text-white font-semibold text-xs lg:text-sm">
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <ChevronDown className={`w-3 h-3 lg:w-4 lg:h-4 text-gray-600 transition-all duration-300 ${isProfileDropdownOpen ? 'rotate-180 text-blue-600' : 'hover:text-blue-600'}`} />
                    </button>
                    
                    <div className={`absolute -right-2 sm:right-0 mt-2 w-56 sm:w-64 md:w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 transform transition-all duration-300 origin-top-right max-w-[90vw] sm:max-w-none ${
                      isProfileDropdownOpen 
                        ? 'opacity-100 scale-100 translate-y-0' 
                        : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                    }`}>
                      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user?.name || 'Utente'}</p>
                            <p className="text-xs text-gray-500">{user?.email || 'email@example.com'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => {
                            openProfileModal()
                            setIsProfileDropdownOpen(false)
                          }}
                          className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group min-h-[44px]"
                        >
                          <User className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                          Profilo
                        </button>
                        <button
                          onClick={() => {
                            setIsNotificationsModalOpen(true)
                            setIsProfileDropdownOpen(false)
                          }}
                          className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group min-h-[44px]"
                        >
                          <Bell className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                          <span className="flex-1 text-left">Notifiche</span>
                          {notifications > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-2 animate-pulse">
                              {notifications}
                            </span>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            openSettingsModal()
                            setIsProfileDropdownOpen(false)
                          }}
                          className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group min-h-[44px]"
                        >
                          <Settings className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                          Impostazioni
                        </button>
                      </div>
                      <hr className="my-1 border-gray-200" />
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group min-h-[44px]"
                        >
                          <LogOut className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="bg-blue-600 text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base min-h-[44px] flex items-center justify-center"
                >
                  Accedi
                </Link>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-all duration-200 z-10 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={isMenuOpen ? 'Chiudi menu' : 'Apri menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 xs:w-6 xs:h-6" />
              ) : (
                <Menu className="w-5 h-5 xs:w-6 xs:h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu */}
      <div 
        ref={mobileMenuRef}
        className={`fixed top-0 right-0 h-full w-72 xs:w-80 max-w-[85vw] xs:max-w-[90vw] bg-white shadow-2xl z-[10000] transform transition-transform duration-300 ease-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-3 xs:p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 xs:w-8 xs:h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs xs:text-sm">N</span>
            </div>
            <span className="text-base xs:text-lg font-bold text-gray-900">Nebula</span>
          </div>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Chiudi menu"
          >
            <X className="w-4 h-4 xs:w-5 xs:h-5" />
          </button>
        </div>

        {/* Mobile Menu Content */}
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Navigation Links */}
          <nav className="flex-1 p-3 xs:p-4 space-y-1 xs:space-y-2">
            <Link
              href="/"
              className="flex items-center px-3 xs:px-4 py-3 xs:py-4 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group min-h-[48px] text-sm xs:text-base"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="w-4 h-4 xs:w-5 xs:h-5 mr-2 xs:mr-3 group-hover:scale-110 transition-transform" />
              Home
            </Link>
            <Link
              href="/servizi"
              className="flex items-center px-3 xs:px-4 py-3 xs:py-4 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group min-h-[48px] text-sm xs:text-base"
              onClick={() => setIsMenuOpen(false)}
            >
              <Cloud className="w-4 h-4 xs:w-5 xs:h-5 mr-2 xs:mr-3 group-hover:scale-110 transition-transform" />
              Servizi
            </Link>
            <Link
              href="/status"
              className="flex items-center px-3 xs:px-4 py-3 xs:py-4 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group min-h-[48px] text-sm xs:text-base"
              onClick={() => setIsMenuOpen(false)}
            >
              <Activity className="w-4 h-4 xs:w-5 xs:h-5 mr-2 xs:mr-3 group-hover:scale-110 transition-transform" />
              Status
            </Link>
            <Link
              href="/calcolatore"
              className="flex items-center px-3 xs:px-4 py-3 xs:py-4 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group min-h-[48px] text-sm xs:text-base"
              onClick={() => setIsMenuOpen(false)}
            >
              <Calculator className="w-4 h-4 xs:w-5 xs:h-5 mr-2 xs:mr-3 group-hover:scale-110 transition-transform" />
              Calcolatore
            </Link>
            <Link
              href="/contatti"
              className="flex items-center px-3 xs:px-4 py-3 xs:py-4 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group min-h-[48px] text-sm xs:text-base"
              onClick={() => setIsMenuOpen(false)}
            >
              <Mail className="w-4 h-4 xs:w-5 xs:h-5 mr-2 xs:mr-3 group-hover:scale-110 transition-transform" />
              Contatti
            </Link>
            
            {isAuthenticated && (
              <Link
                href="/dashboard"
                className="flex items-center px-3 xs:px-4 py-3 xs:py-4 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group min-h-[48px] text-sm xs:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                <BarChart3 className="w-4 h-4 xs:w-5 xs:h-5 mr-2 xs:mr-3 group-hover:scale-110 transition-transform" />
                Dashboard
              </Link>
            )}
          </nav>

          {/* User Section */}
          <div className="border-t border-gray-200 p-3 xs:p-4">
            {isAuthenticated ? (
              <div className="space-y-1 xs:space-y-2">
                {/* User Info */}
                <div className="flex items-center p-2 xs:p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 xs:w-10 xs:h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xs xs:text-sm">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="ml-2 xs:ml-3">
                    <p className="text-xs xs:text-sm font-medium text-gray-900">Ciao, {user?.name || 'Utente'}!</p>
                    <p className="text-xs text-gray-500">Account attivo</p>
                  </div>
                </div>
                
                {/* User Actions */}
                <button
                  onClick={() => {
                    openProfileModal()
                    setIsProfileDropdownOpen(false)
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center w-full px-3 xs:px-4 py-3 xs:py-4 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors min-h-[48px] text-sm xs:text-base"
                >
                  <User className="w-4 h-4 xs:w-5 xs:h-5 mr-2 xs:mr-3" />
                  Profilo
                </button>
                <button
                  onClick={() => {
                    openSettingsModal()
                    setIsProfileDropdownOpen(false)
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center w-full px-3 xs:px-4 py-3 xs:py-4 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors min-h-[48px] text-sm xs:text-base"
                >
                  <Settings className="w-4 h-4 xs:w-5 xs:h-5 mr-2 xs:mr-3" />
                  Impostazioni
                </button>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center w-full px-3 xs:px-4 py-3 xs:py-4 text-red-600 rounded-lg hover:bg-red-50 transition-colors min-h-[48px] text-sm xs:text-base"
                >
                  <LogOut className="w-4 h-4 xs:w-5 xs:h-5 mr-2 xs:mr-3" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2 xs:space-y-3">
                <Link
                  href="/login"
                  className="flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 xs:px-6 py-3 xs:py-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold min-h-[48px] text-sm xs:text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-4 h-4 xs:w-5 xs:h-5 mr-2" />
                  Accedi
                </Link>
                <Link
                  href="/login?mode=register"
                  className="flex items-center justify-center w-full bg-white border-2 border-blue-600 text-blue-600 px-4 xs:px-6 py-3 xs:py-4 rounded-lg hover:bg-blue-50 transition-all duration-200 font-semibold min-h-[48px] text-sm xs:text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-4 h-4 xs:w-5 xs:h-5 mr-2" />
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
            login(userData)
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