'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Controlla se l'utente è loggato
    const userData = localStorage.getItem('nebulatech_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('nebulatech_user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              NebulaTech
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-105 relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/servizi" className="text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-105 relative group">
              Servizi
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link href="/status" className="text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-105 relative group">
              Status
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-gray-700 font-medium">Ciao, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Esci
                </button>
              </div>
            ) : (
              <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105">
                Accedi
              </Link>
            )}
          </nav>



          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none transition-all duration-300 hover:scale-110"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t animate-fade-in">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-all duration-300 hover:scale-105 animate-slide-in-left"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/servizi"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-all duration-300 hover:scale-105 animate-slide-in-left animation-delay-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Servizi
              </Link>

              <Link
                href="/status"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-all duration-300 hover:scale-105 animate-slide-in-left animation-delay-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Status
              </Link>
              {user ? (
                <div className="px-3 py-2 space-y-2">
                  <div className="text-gray-700 font-medium">Ciao, {user.name}</div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Esci
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="block px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 hover:scale-105 animate-slide-in-left animation-delay-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Accedi
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;