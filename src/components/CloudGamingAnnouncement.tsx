'use client'

import { useState, useEffect } from 'react'
import { X, Gamepad2, Sparkles, Clock } from 'lucide-react'

export default function CloudGamingAnnouncement() {
  const [isVisible, setIsVisible] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    // Show popup after 1 second
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Countdown to September 27, 2025
    const targetDate = new Date('2025-09-27T00:00:00').getTime()
    
    const updateCountdown = () => {
      const now = new Date().getTime()
      const difference = targetDate - now
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black backdrop-blur-md"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
        onClick={() => setIsVisible(false)}
      />
      
      {/* Popup */}
      <div 
        className="relative rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md animate-scale-in"
        style={{ 
          background: 'linear-gradient(135deg, #1a0b2e 0%, #16213e 50%, #0f172a 100%)',
          border: '2px solid rgba(255, 255, 255, 0.4)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-10"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
        >
          <X className="w-4 h-4" style={{ color: '#ffffff' }} />
        </button>

        {/* Content */}
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center mb-3">
              <Gamepad2 className="w-8 h-8 mr-2 animate-bounce" style={{ color: '#ffffff' }} />
              <span 
                className="px-2 py-1 rounded-full text-xs font-bold uppercase"
                style={{ 
                  background: 'linear-gradient(45deg, #fbbf24, #f97316)',
                  color: '#000000'
                }}
              >
                NOVITÀ
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#ffffff' }}>
              <span 
                className="bg-clip-text"
                style={{ 
                  background: 'linear-gradient(45deg, #67e8f9, #a78bfa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Cloud Gaming
              </span>
              <br />
              <span style={{ color: '#ffffff' }}>in Arrivo!</span>
            </h2>
            
            <p className="text-sm mb-4" style={{ color: '#ffffff' }}>
              Gioca ai tuoi titoli preferiti direttamente dal cloud. Zero download, zero attese.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-1"
                style={{ backgroundColor: 'rgba(251, 191, 36, 0.4)' }}
              >
                <Sparkles className="w-4 h-4" style={{ color: '#fde047' }} />
              </div>
              <p className="text-xs font-medium" style={{ color: '#ffffff' }}>4K Streaming</p>
            </div>
            <div className="text-center">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-1"
                style={{ backgroundColor: 'rgba(59, 130, 246, 0.4)' }}
              >
                <Clock className="w-4 h-4" style={{ color: '#93c5fd' }} />
              </div>
              <p className="text-xs font-medium" style={{ color: '#ffffff' }}>Zero Latenza</p>
            </div>
            <div className="text-center">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-1"
                style={{ backgroundColor: 'rgba(34, 197, 94, 0.4)' }}
              >
                <Gamepad2 className="w-4 h-4" style={{ color: '#86efac' }} />
              </div>
              <p className="text-xs font-medium" style={{ color: '#ffffff' }}>Istantaneo</p>
            </div>
          </div>

          {/* Countdown */}
          <div className="text-center mb-4">
            <p className="text-sm font-semibold mb-2" style={{ color: '#fde047' }}>Conto alla Rovescia</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: timeLeft.days, label: 'Giorni' },
                { value: timeLeft.hours, label: 'Ore' },
                { value: timeLeft.minutes, label: 'Min' },
                { value: timeLeft.seconds, label: 'Sec' }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="rounded-lg p-2"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.4)'
                  }}
                >
                  <div className="text-lg font-bold" style={{ color: '#ffffff' }}>
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div className="text-xs font-medium" style={{ color: '#ffffff' }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="w-full py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            style={{ 
              background: 'linear-gradient(45deg, #7c3aed, #2563eb)',
              color: '#ffffff'
            }}
          >
            <Gamepad2 className="w-4 h-4" style={{ color: '#ffffff' }} />
            <span style={{ color: '#ffffff' }}>Preparati al Futuro del Gaming</span>
            <Sparkles className="w-4 h-4" style={{ color: '#ffffff' }} />
          </button>
        </div>
      </div>
    </div>
  )
}