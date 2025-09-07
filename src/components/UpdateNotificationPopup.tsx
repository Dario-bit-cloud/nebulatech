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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className={`bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ${
            isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        >
          {/* Header */}
          <div className="relative p-6 pb-4">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Aggiornamento in Corso
                </h3>
                <p className="text-sm text-gray-500">
                  Sistema in manutenzione
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Stiamo implementando un importante aggiornamento per migliorare la tua esperienza. 
                Durante questo processo, potresti riscontrare alcuni <strong>bug temporanei</strong>.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Cosa aspettarsi:</p>
                    <ul className="space-y-1 text-blue-700">
                      <li>• Possibili rallentamenti temporanei</li>
                      <li>• Alcune funzionalità potrebbero essere limitate</li>
                      <li>• L'aggiornamento sarà completato a breve</li>
                    </ul>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600">
                Grazie per la tua pazienza. Il nostro team sta lavorando per garantire 
                un'esperienza ottimale.
              </p>
            </div>

            {/* Action Button */}
            <div className="mt-6">
              <button
                onClick={handleClose}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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