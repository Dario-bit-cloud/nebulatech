'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, Menu, X, User, Settings, Bell, Home, Cloud, Activity, Mail, BarChart3, ChevronDown } from 'lucide-react'
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
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b shadow-sm" style={{backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 z-10">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-xl font-bold" style={{color: 'var(--text-primary)'}}>Nebula</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="font-medium transition-colors hover:text-blue-600" style={{color: 'var(--text-secondary)'}}>
                Home
              </Link>
              <Link href="/servizi" className="font-medium transition-colors hover:text-blue-600" style={{color: 'var(--text-secondary)'}}>
                Servizi
              </Link>
              <Link href="/status" className="font-medium transition-colors hover:text-blue-600" style={{color: 'var(--text-secondary)'}}>
                Status
              </Link>
              <Link href="/contatti" className="font-medium transition-colors hover:text-blue-600" style={{color: 'var(--text-secondary)'}}>
                Contatti
              </Link>
              {isAuthenticated ? (
                <div className="flex items-center space-x-2 xs:space-x-3 sm:space-x-4">
                  <Link href="/dashboard" className="hidden xs:block font-medium transition-colors text-sm xs:text-base px-2 py-1 rounded-md hover:text-blue-600" style={{color: 'var(--text-secondary)'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    Dashboard
                  </Link>
                  <div className="relative" ref={profileDropdownRef}>
                    <button
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className="flex items-center space-x-1.5 xs:space-x-2 p-1.5 xs:p-2 rounded-lg hover:shadow-sm transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 touch-manipulation" onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      aria-label="Menu profilo utente"
                      aria-expanded={isProfileDropdownOpen}
                      aria-haspopup="true"
                    >
                      <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow duration-200">
                        <span className="text-white font-semibold text-xs xs:text-sm sm:text-base">
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <ChevronDown className={`w-3 h-3 xs:w-4 xs:h-4 transition-all duration-300 ${isProfileDropdownOpen ? 'rotate-180 text-blue-600' : 'hover:text-blue-600'}`} style={{color: isProfileDropdownOpen ? '#2563eb' : 'var(--text-secondary)'}} />
                    </button>
                    
                    <div className={`absolute right-0 mt-2 w-72 xs:w-80 sm:w-64 md:w-72 lg:w-80 rounded-xl shadow-xl border py-2 z-50 transform transition-all duration-300 origin-top-right max-w-[95vw] xs:max-w-[90vw] sm:max-w-none ${
                      isProfileDropdownOpen 
                        ? 'opacity-100 scale-100 translate-y-0' 
                        : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                    }`} style={{backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)'}}>
                      <div className="px-3 xs:px-4 py-3 border-b rounded-t-xl" style={{borderColor: 'var(--border-secondary)', background: `linear-gradient(to right, var(--gradient-header-from), var(--gradient-header-to))`}}>
                        <div className="flex items-center space-x-2 xs:space-x-3">
                          <div className="w-10 h-10 xs:w-12 xs:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-semibold text-sm xs:text-base">
                              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm xs:text-base font-medium truncate" style={{color: 'var(--text-primary)'}}>{user?.name || 'Utente'}</p>
                            <p className="text-xs xs:text-sm truncate" style={{color: 'var(--text-secondary)'}}>{user?.email || 'email@example.com'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => {
                            openProfileModal()
                            setIsProfileDropdownOpen(false)
                          }}
                          className="flex items-center w-full px-3 xs:px-4 py-2.5 xs:py-3 text-sm xs:text-base transition-all duration-200 group touch-manipulation"
                          style={{color: 'var(--text-secondary)'}}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
                            e.currentTarget.style.color = 'var(--hover-text-color)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent'
                            e.currentTarget.style.color = 'var(--text-secondary)'
                          }}
                        >
                          <User className="w-4 h-4 xs:w-5 xs:h-5 mr-2 xs:mr-3 group-hover:scale-110 transition-transform duration-200 flex-shrink-0" />
                          <span className="truncate">Profilo</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsNotificationsModalOpen(true)
                            setIsProfileDropdownOpen(false)
                          }}
                          className="flex items-center w-full px-3 xs:px-4 py-2.5 xs:py-3 text-sm xs:text-base transition-all duration-200 group touch-manipulation"
                          style={{color: 'var(--text-secondary)'}}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
                            e.currentTarget.style.color = 'var(--hover-text-color)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent'
                            e.currentTarget.style.color = 'var(--text-secondary)'
                          }}
                        >
                          <Bell className="w-4 h-4 xs:w-5 xs:h-5 mr-2 xs:mr-3 group-hover:scale-110 transition-transform duration-200 flex-shrink-0" />
                          <span className="flex-1 text-left truncate">Notifiche</span>
                          {notifications > 0 && (
                            <span className="bg-red-500 text-white text-xs xs:text-sm rounded-full px-1.5 xs:px-2 py-0.5 xs:py-1 ml-1 xs:ml-2 animate-pulse flex-shrink-0 min-w-[1.25rem] xs:min-w-[1.5rem] text-center">
                              {notifications > 99 ? '99+' : notifications}
                            </span>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            openSettingsModal()
                            setIsProfileDropdownOpen(false)
                          }}
                          className="flex items-center w-full px-3 xs:px-4 py-2.5 xs:py-3 text-sm xs:text-base transition-all duration-200 group touch-manipulation"
                          style={{color: 'var(--text-secondary)'}}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
                            e.currentTarget.style.color = 'var(--hover-text-color)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent'
                            e.currentTarget.style.color = 'var(--text-secondary)'
                          }}
                        >
                          <Settings className="w-4 h-4 xs:w-5 xs:h-5 mr-2 xs:mr-3 group-hover:scale-110 transition-transform duration-200 flex-shrink-0" />
                          <span className="truncate">Impostazioni</span>
                        </button>
                      </div>
                      <hr className="my-1" style={{borderColor: 'var(--border-secondary)'}} />
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-3 xs:px-4 py-2.5 xs:py-3 text-sm xs:text-base text-red-600 hover:text-red-700 transition-all duration-200 group touch-manipulation"
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <LogOut className="w-4 h-4 xs:w-5 xs:h-5 mr-2 xs:mr-3 group-hover:scale-110 transition-transform duration-200 flex-shrink-0" />
                          <span className="truncate">Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
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
              className="md:hidden p-2 rounded-lg hover:text-blue-600 transition-all duration-200 z-10"
              style={{color: 'var(--text-secondary)'}}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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
        className={`mobile-menu fixed top-0 right-0 h-full w-80 max-w-[90vw] shadow-2xl z-50 transform transition-transform duration-300 ease-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{backgroundColor: 'var(--bg-primary)'}}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{borderColor: 'var(--border-primary)', background: `linear-gradient(to right, var(--gradient-header-from), var(--gradient-header-to))`}}>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background: 'linear-gradient(to right, var(--primary-600), var(--primary-700))'}}>
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-lg font-bold" style={{color: 'var(--text-primary)'}}>Nebula</span>
          </div>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 rounded-lg transition-colors"
            style={{color: 'var(--text-secondary)'}}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
              e.currentTarget.style.color = 'var(--text-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'var(--text-secondary)'
            }}
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
              className="flex items-center px-4 py-3 rounded-lg transition-all duration-200 group touch-manipulation"
              style={{color: 'var(--text-secondary)'}}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-50)'
                e.currentTarget.style.color = 'var(--primary-600)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              Home
            </Link>
            <Link
              href="/servizi"
              className="flex items-center px-4 py-3 rounded-lg transition-all duration-200 group touch-manipulation"
              style={{color: 'var(--text-secondary)'}}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-50)'
                e.currentTarget.style.color = 'var(--primary-600)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
              onClick={() => setIsMenuOpen(false)}
            >
              <Cloud className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              Servizi
            </Link>
            <Link
              href="/status"
              className="flex items-center px-4 py-3 rounded-lg transition-all duration-200 group touch-manipulation"
              style={{color: 'var(--text-secondary)'}}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-50)'
                e.currentTarget.style.color = 'var(--primary-600)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
              onClick={() => setIsMenuOpen(false)}
            >
              <Activity className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              Status
            </Link>
            <Link
              href="/contatti"
              className="flex items-center px-4 py-3 rounded-lg transition-all duration-200 group touch-manipulation"
              style={{color: 'var(--text-secondary)'}}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-50)'
                e.currentTarget.style.color = 'var(--primary-600)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
              onClick={() => setIsMenuOpen(false)}
            >
              <Mail className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              Contatti
            </Link>
            
            {isAuthenticated && (
              <Link
                href="/dashboard"
                className="flex items-center px-4 py-3 rounded-lg transition-all duration-200 group touch-manipulation"
                style={{color: 'var(--text-secondary)'}}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary-50)'
                  e.currentTarget.style.color = 'var(--primary-600)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = 'var(--text-secondary)'
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                <BarChart3 className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                Dashboard
              </Link>
            )}
          </nav>

          {/* User Section */}
          <div className="border-t p-4" style={{borderColor: 'var(--border-primary)'}}>
            {isAuthenticated ? (
              <div className="space-y-3">
                {/* User Info */}
                <div className="flex items-center p-3 rounded-lg" style={{backgroundColor: 'var(--bg-secondary)'}}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{background: 'linear-gradient(to right, var(--primary-600), var(--primary-700))'}}>
                    <span className="text-white font-semibold text-sm">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium" style={{color: 'var(--text-primary)'}}>Ciao, {user?.name || 'Utente'}!</p>
                    <p className="text-xs" style={{color: 'var(--text-secondary)'}}>Account attivo</p>
                  </div>
                </div>
                
                {/* User Actions */}
                <button
                  onClick={() => {
                    openProfileModal()
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 touch-manipulation"
                  style={{color: 'var(--text-secondary)'}}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
                    e.currentTarget.style.color = 'var(--text-primary)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = 'var(--text-secondary)'
                  }}
                >
                  <User className="w-5 h-5 mr-3" />
                  Profilo
                </button>
                <button
                  onClick={() => {
                    openSettingsModal()
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 touch-manipulation"
                  style={{color: 'var(--text-secondary)'}}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
                    e.currentTarget.style.color = 'var(--text-primary)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = 'var(--text-secondary)'
                  }}
                >
                  <Settings className="w-5 h-5 mr-3" />
                  Impostazioni
                </button>
                <button
                  onClick={() => {
                    setIsNotificationsModalOpen(true)
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 touch-manipulation"
                  style={{color: 'var(--text-secondary)'}}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
                    e.currentTarget.style.color = 'var(--text-primary)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = 'var(--text-secondary)'
                  }}
                >
                  <Bell className="w-5 h-5 mr-3" />
                  Notifiche
                </button>
                <div className="border-t pt-3 mt-3" style={{borderColor: 'var(--border-primary)'}}>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 touch-manipulation"
                    style={{color: 'var(--danger-600)'}}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--danger-50)'
                      e.currentTarget.style.color = 'var(--danger-700)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = 'var(--danger-600)'
                    }}
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  href="/login"
                  className="flex items-center justify-center w-full px-6 py-3 rounded-lg transition-all duration-200 font-semibold text-white touch-manipulation"
                  style={{background: 'linear-gradient(to right, var(--primary-600), var(--primary-700))'}}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(to right, var(--primary-700), var(--primary-800))'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(to right, var(--primary-600), var(--primary-700))'
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5 mr-2" />
                  Accedi
                </Link>
                <Link
                  href="/login?mode=register"
                  className="flex items-center justify-center w-full px-6 py-3 rounded-lg border-2 transition-all duration-200 font-semibold touch-manipulation"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--primary-600)',
                    color: 'var(--primary-600)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary-50)'
                    e.currentTarget.style.color = 'var(--primary-700)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-primary)'
                    e.currentTarget.style.color = 'var(--primary-600)'
                  }}
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