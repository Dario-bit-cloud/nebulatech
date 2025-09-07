'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, Menu, X } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('loginTime')
    setUser(null)
    router.push('/')
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
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-gray-700 font-medium">Ciao, {user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </button>
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
    </header>
  )
}