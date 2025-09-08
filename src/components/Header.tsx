'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, Menu, X, User, Settings, Bell, BarChart3, Shield, ChevronDown } from 'lucide-react'
import ProfileModal from './ProfileModal'
import NotificationsModal from './NotificationsModal'
import SettingsModal from './SettingsModal'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [notifications, setNotifications] = useState(3) // Demo notifications count
  const [dropdownPosition, setDropdownPosition] = useState({ top: 'top-full', right: 'right-0' })
  const router = useRouter()
  const accountMenuRef = useRef<HTMLDivElement>(null)
  const accountButtonRef = useRef<HTMLButtonElement>(null)

  // Calcola la posizione ottimale del dropdown
  const calculateDropdownPosition = useCallback(() => {
    if (!accountButtonRef.current) return
    
    const buttonRect = accountButtonRef.current.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const windowWidth = window.innerWidth
    const dropdownHeight = 400 // Altezza stimata del dropdown
    const dropdownWidth = 320 // Larghezza del dropdown
    const isMobile = windowWidth < 768
    
    let newPosition = { top: 'top-full', right: 'right-0' }
    
    if (isMobile) {
      // Su mobile, centra il dropdown e usa tutta la larghezza disponibile
      newPosition = { top: 'top-full', right: 'right-0' }
    } else {
      // Controlla se c'è spazio sotto il pulsante
      if (buttonRect.bottom + dropdownHeight > windowHeight - 20) {
        newPosition.top = 'bottom-full'
      }
      
      // Controlla se c'è spazio a destra
      if (buttonRect.right - dropdownWidth < 20) {
        newPosition.right = 'left-0'
      }
    }
    
    setDropdownPosition(newPosition)
  }, [])

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  // Close account menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false)
      }
    }

    const handleResize = () => {
      if (isAccountMenuOpen) {
        calculateDropdownPosition()
      }
    }

    if (isAccountMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      window.addEventListener('resize', handleResize)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('resize', handleResize)
    }
  }, [isAccountMenuOpen, calculateDropdownPosition])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('loginTime')
    setUser(null)
    router.push('/')
  }

  const handleUpdateUser = (userData: any) => {
    setUser(userData)
    // Aggiorna anche il localStorage
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const handleNotificationCountChange = (count: number) => {
    setNotifications(count)
  }

  // Funzioni per gestione esclusiva dei modali
  const closeAllModals = () => {
    setIsProfileModalOpen(false)
    setIsNotificationsModalOpen(false)
    setIsSettingsModalOpen(false)
  }

  const openProfileModal = () => {
    closeAllModals()
    setIsProfileModalOpen(true)
    setIsAccountMenuOpen(false)
  }

  const openNotificationsModal = () => {
    closeAllModals()
    setIsNotificationsModalOpen(true)
    setIsAccountMenuOpen(false)
  }

  const openSettingsModal = () => {
    closeAllModals()
    setIsSettingsModalOpen(true)
    setIsAccountMenuOpen(false)
  }

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg fixed top-0 left-0 right-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                <span className="hidden xs:inline">NebulaTech</span>
                <span className="xs:hidden">Nebula</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link 
              href="/" 
              className="group relative px-4 py-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 font-medium hover:scale-105 transform-gpu"
            >
              <span className="relative z-10">Home</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
            </Link>
            <Link 
              href="/servizi" 
              className="group relative px-4 py-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 font-medium hover:scale-105 transform-gpu"
            >
              <span className="relative z-10">Servizi</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
            </Link>
            <Link 
              href="/status" 
              className="group relative px-4 py-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 font-medium hover:scale-105 transform-gpu"
            >
              <span className="relative z-10">Status</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
            </Link>
            <Link 
              href="/contatti" 
              className="group relative px-4 py-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 font-medium hover:scale-105 transform-gpu"
            >
              <span className="relative z-10">Contatti</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
            </Link>
            {user ? (
              <div className="relative ml-4 pl-4 border-l border-gray-200" ref={accountMenuRef}>
                <button
                  ref={accountButtonRef}
                  onClick={() => {
                    if (!isAccountMenuOpen) {
                      calculateDropdownPosition()
                    }
                    setIsAccountMenuOpen(!isAccountMenuOpen)
                  }}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 font-medium group"
                  aria-expanded={isAccountMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white text-sm font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {notifications > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{notifications}</span>
                      </div>
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-gray-700 font-medium">Ciao, {user.name}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isAccountMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Account Dropdown Menu */}
                {isAccountMenuOpen && (
                  <div className={`absolute ${dropdownPosition.right} ${dropdownPosition.top} ${dropdownPosition.top === 'bottom-full' ? 'mb-3' : 'mt-3'} w-80 md:w-80 sm:w-72 max-sm:w-screen max-sm:left-0 max-sm:right-0 max-sm:mx-4 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 animate-in fade-in-0 slide-in-from-top-5 duration-300 max-h-96 overflow-y-auto`}>
                    {/* User Info Header */}
                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-white text-xl font-bold">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 font-bold text-lg truncate">{user.name}</p>
                          <p className="text-gray-600 text-sm truncate">{user.email}</p>
                          <div className="flex items-center mt-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                            <span className="text-green-600 text-sm font-medium">Online</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-3">
                      <Link
                        href="/dashboard"
                        className="flex items-center px-6 py-4 text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group rounded-xl mx-3"
                        onClick={() => setIsAccountMenuOpen(false)}
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors">
                          <BarChart3 className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-base">Dashboard</div>
                          <div className="text-sm text-gray-500">Gestisci i tuoi servizi</div>
                        </div>
                      </Link>

                      <button
                        className="w-full flex items-center px-6 py-4 text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group rounded-xl mx-3"
                        onClick={openProfileModal}
                      >
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors">
                          <User className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-base">Il Mio Profilo</div>
                          <div className="text-sm text-gray-500">Modifica informazioni personali</div>
                        </div>
                      </button>

                      <button
                        className="w-full flex items-center px-6 py-4 text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group rounded-xl mx-3 relative"
                        onClick={openNotificationsModal}
                      >
                        <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-yellow-200 transition-colors relative">
                          <Bell className="w-5 h-5 text-yellow-600 group-hover:scale-110 transition-transform" />
                          {notifications > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">{notifications}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-base flex items-center">
                            Notifiche
                          </div>
                          <div className="text-sm text-gray-500">Messaggi e aggiornamenti</div>
                        </div>
                      </button>

                      <button
                        className="w-full flex items-center px-6 py-4 text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group rounded-xl mx-3"
                        onClick={openSettingsModal}
                      >
                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-purple-200 transition-colors">
                          <Settings className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-base">Impostazioni</div>
                          <div className="text-sm text-gray-500">Preferenze e configurazioni</div>
                        </div>
                      </button>
                    </div>

                    {/* Logout Section */}
                    <div className="border-t border-gray-100 pt-3">
                      <button
                        onClick={() => {
                          handleLogout()
                          setIsAccountMenuOpen(false)
                        }}
                        className="w-full flex items-center px-6 py-4 text-gray-600 hover:text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-300 group rounded-xl mx-3"
                      >
                        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-red-200 transition-colors">
                          <LogOut className="w-5 h-5 text-red-600 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-base">Logout</div>
                          <div className="text-sm text-gray-500">Esci dal tuo account</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/login" 
                className="ml-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
              >
                Accedi
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="group relative p-3 rounded-2xl text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 touch-manipulation hover:scale-110 active:scale-95 transform-gpu shadow-sm hover:shadow-md"
              aria-label={isMenuOpen ? 'Chiudi menu' : 'Apri menu'}
              aria-expanded={isMenuOpen}
            >
              <div className="relative z-10">
                {isMenuOpen ? (
                  <X className="w-6 h-6 transition-transform duration-300 rotate-90" />
                ) : (
                  <Menu className="w-6 h-6 transition-transform duration-300 group-hover:rotate-180" />
                )}
              </div>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
              
              {/* Ripple effect */}
              <span className="absolute inset-0 rounded-2xl opacity-0 group-active:opacity-30 bg-gradient-to-r from-blue-400 to-indigo-400 transition-opacity duration-150 -z-10"></span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-500 ease-out overflow-hidden ${isMenuOpen ? 'max-h-screen opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4'}`}>
          <div className="relative">
            {/* Backdrop blur overlay */}
            <div className="absolute inset-0 bg-white/95 backdrop-blur-xl border-t border-gray-100/50"></div>
            
            {/* Menu content */}
            <div className="relative px-4 pt-6 pb-6 space-y-1">
              {/* Navigation Links */}
              <div className="space-y-1">
              <Link
                href="/"
                className="group flex items-center px-5 py-4 text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-2xl transition-all duration-300 font-medium touch-manipulation text-base hover:scale-105 hover:shadow-sm active:scale-95 transform-gpu"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="relative">
                  Home
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300 rounded-full"></span>
                </span>
              </Link>
              
              <Link
                href="/servizi"
                className="group flex items-center px-5 py-4 text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-2xl transition-all duration-300 font-medium touch-manipulation text-base hover:scale-105 hover:shadow-sm active:scale-95 transform-gpu"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="relative">
                  Servizi
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300 rounded-full"></span>
                </span>
              </Link>
              
              <Link
                href="/status"
                className="group flex items-center px-5 py-4 text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-2xl transition-all duration-300 font-medium touch-manipulation text-base hover:scale-105 hover:shadow-sm active:scale-95 transform-gpu"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="relative">
                  Status
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300 rounded-full"></span>
                </span>
              </Link>
              
              <Link
                href="/contatti"
                className="group flex items-center px-5 py-4 text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-2xl transition-all duration-300 font-medium touch-manipulation text-base hover:scale-105 hover:shadow-sm active:scale-95 transform-gpu"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="relative">
                  Contatti
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300 rounded-full"></span>
                </span>
              </Link>
            </div>
              
              {/* User Section */}
              <div className="mt-6 pt-6 relative">
                {/* Elegant separator */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                
                {user ? (
                  <div className="space-y-4">
                    {/* User Profile Card */}
                    <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 backdrop-blur-sm rounded-2xl p-4 border border-blue-100/50">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-white text-lg font-bold">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 font-semibold text-base truncate">Ciao, {user.name}</p>
                          <p className="text-gray-500 text-sm">Account attivo</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Logout Button */}
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      className="group flex items-center w-full px-5 py-4 text-gray-600 hover:text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-2xl transition-all duration-300 touch-manipulation text-base hover:scale-105 hover:shadow-sm active:scale-95 transform-gpu"
                    >
                      <LogOut className="w-5 h-5 mr-4 group-hover:rotate-12 transition-transform duration-300" />
                      <span className="relative">
                        Logout
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-pink-500 group-hover:w-full transition-all duration-300 rounded-full"></span>
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/login"
                      className="group flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl touch-manipulation text-base hover:scale-105 active:scale-95 transform-gpu"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="relative">
                        Accedi
                        <span className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      </span>
                    </Link>
                    <p className="text-center text-sm text-gray-500">Accedi per gestire i tuoi servizi</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={closeAllModals}
        user={user}
        onUpdateUser={handleUpdateUser}
      />
      
      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={closeAllModals}
        onNotificationCountChange={handleNotificationCountChange}
      />
      
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={closeAllModals}
      />
    </header>
  )
}