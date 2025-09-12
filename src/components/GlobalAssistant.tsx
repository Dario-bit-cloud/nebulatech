'use client'

import { useState } from 'react'
import { Bot } from 'lucide-react'
import AssistenteVirtuale from './AssistenteVirtuale'
import { useMobileMenu } from '@/contexts/MobileMenuContext'

const GlobalAssistant = () => {
  const [showAssistant, setShowAssistant] = useState(false)
  const { isMenuOpen } = useMobileMenu()

  return (
    <>
      {/* Floating Assistant Button - Posizione fissa globale */}
      <button
        onClick={() => setShowAssistant(true)}
        className={`fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-50 transition-all duration-300 z-50 flex items-center justify-center group ${
          isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
        }`}
        aria-label="Apri assistente virtuale Alex"
        title="Chatta con Alex, il tuo assistente virtuale"
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 9999
        }}
      >
        <Bot className="w-7 h-7 group-hover:scale-110 transition-transform" />
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
          Chatta con Alex
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </button>
      
      {/* Assistente Virtuale */}
      <AssistenteVirtuale 
        isOpen={showAssistant} 
        onClose={() => setShowAssistant(false)} 
      />
    </>
  )
}

export default GlobalAssistant