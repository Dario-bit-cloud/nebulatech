'use client'

import React, { useEffect, useState, useRef } from 'react'
import { X, ArrowRight, ArrowLeft, Play, SkipForward, HelpCircle } from 'lucide-react'
import { useTutorial, type TutorialStep } from '@/hooks/useTutorial'

interface TutorialOverlayProps {
  isVisible: boolean
}

interface TooltipPosition {
  top: number
  left: number
  arrow: 'top' | 'bottom' | 'left' | 'right'
}

export default function TutorialOverlay({ isVisible }: TutorialOverlayProps) {
  const {
    shouldShowTutorial,
    currentStep,
    totalSteps,
    tutorialState,
    nextStep,
    prevStep,
    skipTutorial,
    closeTutorial
  } = useTutorial()

  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({
    top: 0,
    left: 0,
    arrow: 'top'
  })
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Calcola la posizione del tooltip basata sull'elemento target
  const calculateTooltipPosition = (targetSelector: string, preferredPosition: string = 'bottom') => {
    const targetElement = document.querySelector(targetSelector)
    if (!targetElement) {
      return {
        top: window.innerHeight / 2 - 100,
        left: window.innerWidth / 2 - 200,
        arrow: 'top' as const
      }
    }

    const rect = targetElement.getBoundingClientRect()
    const tooltipWidth = 400
    const tooltipHeight = 200
    const padding = 20

    let position: TooltipPosition = {
      top: 0,
      left: 0,
      arrow: 'top'
    }

    switch (preferredPosition) {
      case 'bottom':
        position = {
          top: rect.bottom + padding,
          left: rect.left + (rect.width / 2) - (tooltipWidth / 2),
          arrow: 'top'
        }
        break
      case 'top':
        position = {
          top: rect.top - tooltipHeight - padding,
          left: rect.left + (rect.width / 2) - (tooltipWidth / 2),
          arrow: 'bottom'
        }
        break
      case 'right':
        position = {
          top: rect.top + (rect.height / 2) - (tooltipHeight / 2),
          left: rect.right + padding,
          arrow: 'left'
        }
        break
      case 'left':
        position = {
          top: rect.top + (rect.height / 2) - (tooltipHeight / 2),
          left: rect.left - tooltipWidth - padding,
          arrow: 'right'
        }
        break
    }

    // Assicurati che il tooltip rimanga dentro la viewport
    if (position.left < padding) {
      position.left = padding
    } else if (position.left + tooltipWidth > window.innerWidth - padding) {
      position.left = window.innerWidth - tooltipWidth - padding
    }

    if (position.top < padding) {
      position.top = padding
      position.arrow = 'top'
    } else if (position.top + tooltipHeight > window.innerHeight - padding) {
      position.top = window.innerHeight - tooltipHeight - padding
      position.arrow = 'bottom'
    }

    return position
  }

  // Evidenzia l'elemento target
  const highlightElement = (targetSelector: string) => {
    // Rimuovi evidenziazione precedente
    if (highlightedElement) {
      highlightedElement.classList.remove('tutorial-highlight')
    }

    const targetElement = document.querySelector(targetSelector)
    if (targetElement) {
      targetElement.classList.add('tutorial-highlight')
      setHighlightedElement(targetElement)
      
      // Scroll verso l'elemento se necessario
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      })
    }
  }

  // Aggiorna posizione quando cambia lo step
  useEffect(() => {
    if (currentStep && currentStep.target) {
      const position = calculateTooltipPosition(currentStep.target, currentStep.position)
      setTooltipPosition(position)
      highlightElement(currentStep.target)
    } else {
      // Step senza target (es. welcome)
      setTooltipPosition({
        top: window.innerHeight / 2 - 100,
        left: window.innerWidth / 2 - 200,
        arrow: 'top'
      })
      if (highlightedElement) {
        highlightedElement.classList.remove('tutorial-highlight')
        setHighlightedElement(null)
      }
    }
  }, [currentStep])

  // Cleanup quando il tutorial si chiude
  useEffect(() => {
    if (!shouldShowTutorial && highlightedElement) {
      highlightedElement.classList.remove('tutorial-highlight')
      setHighlightedElement(null)
    }
  }, [shouldShowTutorial, highlightedElement])

  // Gestisci eventi keyboard
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!shouldShowTutorial) return
      
      switch (e.key) {
        case 'Escape':
          closeTutorial()
          break
        case 'ArrowRight':
        case 'Enter':
          nextStep()
          break
        case 'ArrowLeft':
          prevStep()
          break
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [shouldShowTutorial, nextStep, prevStep, closeTutorial])

  if (!isVisible || !shouldShowTutorial || !currentStep) {
    return null
  }

  const progressPercentage = ((tutorialState.currentStep + 1) / totalSteps) * 100

  return (
    <>
      {/* Overlay scuro */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-all duration-300"
        onClick={closeTutorial}
      />
      
      {/* Tooltip del tutorial */}
      <div
        className="fixed z-[101] bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md animate-in zoom-in-95 duration-300"
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
          width: '400px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Freccia del tooltip */}
        <div
          className={`absolute w-4 h-4 bg-white border transform rotate-45 ${
            tooltipPosition.arrow === 'top' ? '-top-2 left-1/2 -translate-x-1/2 border-b-0 border-r-0' :
            tooltipPosition.arrow === 'bottom' ? '-bottom-2 left-1/2 -translate-x-1/2 border-t-0 border-l-0' :
            tooltipPosition.arrow === 'left' ? '-left-2 top-1/2 -translate-y-1/2 border-t-0 border-r-0' :
            '-right-2 top-1/2 -translate-y-1/2 border-b-0 border-l-0'
          }`}
        />
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <HelpCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{currentStep.title}</h3>
              <p className="text-sm text-gray-500">
                Step {tutorialState.currentStep + 1} di {totalSteps}
              </p>
            </div>
          </div>
          <button
            onClick={closeTutorial}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="px-4 pt-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <p className="text-gray-700 leading-relaxed mb-4">
            {currentStep.description}
          </p>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button
            onClick={skipTutorial}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center"
          >
            <SkipForward className="w-4 h-4 mr-1" />
            Salta tutorial
          </button>
          
          <div className="flex space-x-2">
            {tutorialState.currentStep > 0 && (
              <button
                onClick={prevStep}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Indietro
              </button>
            )}
            
            <button
              onClick={nextStep}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {tutorialState.currentStep === totalSteps - 1 ? (
                <>
                  <Play className="w-4 h-4 mr-1" />
                  Completa
                </>
              ) : (
                <>
                  Avanti
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Stili CSS per l'evidenziazione */}
      <style jsx global>{`
        .tutorial-highlight {
          position: relative;
          z-index: 99;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 8px rgba(59, 130, 246, 0.2);
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .tutorial-highlight::after {
          content: '';
          position: absolute;
          inset: -4px;
          border: 2px solid #3b82f6;
          border-radius: 8px;
          animation: tutorial-pulse 2s infinite;
        }
        
        @keyframes tutorial-pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.02);
          }
        }
      `}</style>
    </>
  )
}