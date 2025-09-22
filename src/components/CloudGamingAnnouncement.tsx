'use client'

import { useState, useEffect } from 'react'
import { Gamepad2, Sparkles, Clock, Zap, Star } from 'lucide-react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function CloudGamingAnnouncement() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isVisible, setIsVisible] = useState(true)

  // Data di lancio del cloud gaming - 27 settembre 2025 a mezzanotte
  const launchDate = new Date('2025-09-27T00:00:00')

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = launchDate.getTime() - now

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [launchDate])

  if (!isVisible) return null

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 border-b-4 border-gradient-to-r from-purple-500 to-blue-500">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)',
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      {/* Floating Gaming Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-4 left-1/4 w-16 h-16 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-4 right-1/4 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse animation-delay-500"></div>
        <div className="absolute top-1/2 right-1/6 w-12 h-12 bg-cyan-500/20 rounded-full blur-xl animate-pulse animation-delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors duration-200 z-20"
          aria-label="Chiudi annuncio"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
          {/* Left Side - Announcement */}
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
              <div className="relative">
                <Gamepad2 className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400 animate-bounce" />
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 animate-pulse" />
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                NOVITÀ
              </div>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                Cloud Gaming
              </span>
              <br />
              <span className="text-white">in Arrivo!</span>
            </h2>
            
            <p className="text-lg sm:text-xl text-blue-100 mb-4 max-w-2xl mx-auto lg:mx-0">
              🎮 <strong>Rivoluzione Gaming:</strong> Gioca ai tuoi titoli preferiti direttamente dal cloud, 
              senza download, senza limiti hardware!
            </p>
            
            <div className="flex items-center justify-center lg:justify-start gap-2 text-purple-300">
              <Zap className="w-5 h-5" />
              <span className="text-sm sm:text-base">Streaming 4K • Latenza Ultra-Bassa • Accesso Istantaneo</span>
            </div>
          </div>

          {/* Right Side - Countdown */}
          <div className="flex-shrink-0">
            <div className="text-center">
              <div className="flex items-center gap-2 mb-4 justify-center">
                <Clock className="w-6 h-6 text-yellow-400" />
                <span className="text-yellow-400 font-semibold text-lg">Conto alla Rovescia</span>
              </div>
              
              <div className="grid grid-cols-4 gap-2 sm:gap-4">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/20 min-w-[60px] sm:min-w-[80px]">
                  <div className="text-2xl sm:text-3xl font-bold text-white">{timeLeft.days}</div>
                  <div className="text-xs sm:text-sm text-blue-200">Giorni</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/20 min-w-[60px] sm:min-w-[80px]">
                  <div className="text-2xl sm:text-3xl font-bold text-white">{timeLeft.hours}</div>
                  <div className="text-xs sm:text-sm text-blue-200">Ore</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/20 min-w-[60px] sm:min-w-[80px]">
                  <div className="text-2xl sm:text-3xl font-bold text-white">{timeLeft.minutes}</div>
                  <div className="text-xs sm:text-sm text-blue-200">Min</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/20 min-w-[60px] sm:min-w-[80px]">
                  <div className="text-2xl sm:text-3xl font-bold text-white">{timeLeft.seconds}</div>
                  <div className="text-xs sm:text-sm text-blue-200">Sec</div>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-sm text-yellow-400 font-medium">Esperienza Premium</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:scale-105 cursor-pointer">
            <Gamepad2 className="w-5 h-5" />
            <span>Preparati al Futuro del Gaming</span>
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Animated Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 animate-pulse"></div>
    </div>
  )
}