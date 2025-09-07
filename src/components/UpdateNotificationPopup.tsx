'use client'

import { useState, useEffect } from 'react'
import { X, AlertTriangle, CheckCircle } from 'lucide-react'

interface UpdateNotificationPopupProps {
  isVisible: boolean
  onClose: () => void
}

export default function UpdateNotificationPopup({ isVisible, onClose }: UpdateNotificationPopupProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true)
    }
  }, [isVisible])

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  if (!isVisible) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        <div 
          className={`bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-sm sm:max-w-md w-full mx-2 sm:mx-4 transform transition-all duration-300 ${
            isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        >
          {/* Header */}
          <div className="relative p-4 sm:p-6 pb-3 sm:pb-4">
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 touch-manipulation"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            </button>
            
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4 pr-8 sm:pr-10">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-full flex-shrink-0">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 leading-tight">
                  Sistema in Manutenzione
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  Aggiornamento in corso
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Stiamo aggiornando il sistema per migliorare la tua esperienza. 
                Potrebbero verificarsi <strong>interruzioni temporanee</strong> del servizio.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs sm:text-sm text-blue-800 min-w-0">
                    <p className="font-medium mb-1">Durante la manutenzione:</p>
                    <ul className="space-y-0.5 sm:space-y-1 text-blue-700">
                      <li>• Possibili rallentamenti</li>
                      <li>• Funzionalità limitate</li>
                      <li>• Completamento a breve</li>
                    </ul>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Grazie per la pazienza. Stiamo lavorando per garantire un servizio ottimale.
              </p>
            </div>

            {/* Action Button */}
            <div className="mt-4 sm:mt-6">
              <button
                onClick={handleClose}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 sm:py-3 px-4 rounded-lg text-sm sm:text-base font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform active:scale-95 sm:hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 touch-manipulation"
              >
                Ho Capito
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}