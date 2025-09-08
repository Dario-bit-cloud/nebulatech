'use client'

import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '../providers/ThemeProvider'

interface ThemeToggleProps {
  variant?: 'button' | 'dropdown'
  className?: string
}

export default function ThemeToggle({ variant = 'button', className = '' }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  if (variant === 'dropdown') {
    return (
      <div className={`relative group ${className}`}>
        <button
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105 active:scale-95 transform-gpu"
          aria-label="Cambia tema"
        >
          {resolvedTheme === 'dark' ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </button>
        
        {/* Dropdown Menu */}
        <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="p-2 space-y-1">
            <button
              onClick={() => setTheme('light')}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                theme === 'light'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Sun className="w-4 h-4 mr-3" />
              Chiaro
            </button>
            
            <button
              onClick={() => setTheme('dark')}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                theme === 'dark'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Moon className="w-4 h-4 mr-3" />
              Scuro
            </button>
            
            <button
              onClick={() => setTheme('system')}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                theme === 'system'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Monitor className="w-4 h-4 mr-3" />
              Sistema
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Simple toggle button
  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105 active:scale-95 transform-gpu ${className}`}
      aria-label={`Cambia a tema ${resolvedTheme === 'light' ? 'scuro' : 'chiaro'}`}
    >
      <div className="relative w-5 h-5">
        {/* Sun Icon */}
        <Sun 
          className={`absolute inset-0 w-5 h-5 transition-all duration-500 transform ${
            resolvedTheme === 'light' 
              ? 'rotate-0 scale-100 opacity-100' 
              : 'rotate-90 scale-0 opacity-0'
          }`} 
        />
        
        {/* Moon Icon */}
        <Moon 
          className={`absolute inset-0 w-5 h-5 transition-all duration-500 transform ${
            resolvedTheme === 'dark' 
              ? 'rotate-0 scale-100 opacity-100' 
              : '-rotate-90 scale-0 opacity-0'
          }`} 
        />
      </div>
    </button>
  )
}