'use client'

import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, Play, BarChart3, Plus, Settings, Bell, Server, Database, Shield, Activity, Eye, CheckCircle } from 'lucide-react'

interface TutorialStep {
  id: number
  title: string
  content: string
  target?: string
  position: 'top' | 'bottom' | 'left' | 'right' | 'center'
  icon: React.ReactNode
}

interface TutorialOverlayProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "Benvenuto nella Dashboard! 🎉",
    content: "Questa è la tua dashboard principale dove puoi gestire tutti i tuoi servizi cloud. Ti guideremo attraverso le funzionalità principali per aiutarti a iniziare.",
    position: 'center',
    icon: <BarChart3 className="w-6 h-6" />
  },
  {
    id: 2,
    title: "Statistiche in Tempo Reale 📊",
    content: "Queste card mostrano le statistiche dei tuoi servizi: server attivi, database, storage utilizzato e traffico. Vengono aggiornate automaticamente per darti sempre una visione completa.",
    target: '[role="region"][aria-label="Statistiche dashboard"]',
    position: 'bottom',
    icon: <Activity className="w-6 h-6" />
  },
  {
    id: 3,
    title: "Crea Nuovo Servizio ➕",
    content: "Clicca qui per creare un nuovo servizio cloud. Puoi scegliere tra server web, database, storage e molto altro. Il processo è guidato e intuitivo.",
    target: 'button[aria-label="Crea un nuovo servizio cloud"]',
    position: 'bottom',
    icon: <Plus className="w-6 h-6" />
  },
  {
    id: 4,
    title: "Menu Utente 👤",
    content: "Dal menu utente puoi accedere al tuo profilo, alle notifiche e alle impostazioni. Qui troverai anche l'opzione per ripetere questo tutorial.",
    target: 'button[aria-label="Menu utente"]',
    position: 'left',
    icon: <Settings className="w-6 h-6" />
  },
  {
    id: 5,
    title: "Gestione Server 🖥️",
    content: "Nella sezione server puoi visualizzare, modificare e monitorare tutti i tuoi server. Ogni server mostra stato, risorse utilizzate e metriche di performance.",
    target: '.grid.grid-cols-1.gap-6',
    position: 'top',
    icon: <Server className="w-6 h-6" />
  },
  {
    id: 6,
    title: "Monitoraggio e Sicurezza 🛡️",
    content: "Monitora le performance dei tuoi servizi in tempo reale. Ricevi notifiche automatiche per eventi importanti e mantieni tutto sotto controllo.",
    position: 'center',
    icon: <Shield className="w-6 h-6" />
  },
  {
    id: 7,
    title: "Completato! ✅",
    content: "Perfetto! Ora conosci le funzionalità principali della dashboard. Puoi sempre ripetere questo tutorial dalle impostazioni. Buon lavoro con NebulaTech!",
    position: 'center',
    icon: <CheckCircle className="w-6 h-6" />
  }
]

export default function TutorialOverlay({ isOpen, onClose, onComplete }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const step = tutorialSteps[currentStep]
    if (step?.target) {
      const element = document.querySelector(step.target)
      setHighlightedElement(element)
      
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    } else {
      setHighlightedElement(null)
    }
  }, [currentStep, isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const currentTutorialStep = tutorialSteps[currentStep]
  const isLastStep = currentStep === tutorialSteps.length - 1
  const isFirstStep = currentStep === 0

  const nextStep = () => {
    if (isLastStep) {
      onComplete()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const skipTutorial = () => {
    onClose()
  }

  const getTooltipPosition = () => {
    if (!highlightedElement || !currentTutorialStep.target) {
      return 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
    }

    const rect = highlightedElement.getBoundingClientRect()
    const { position } = currentTutorialStep

    switch (position) {
      case 'top':
        return `fixed top-[${rect.top - 20}px] left-[${rect.left + rect.width / 2}px] transform -translate-x-1/2 -translate-y-full`
      case 'bottom':
        return `fixed top-[${rect.bottom + 20}px] left-[${rect.left + rect.width / 2}px] transform -translate-x-1/2`
      case 'left':
        return `fixed top-[${rect.top + rect.height / 2}px] left-[${rect.left - 20}px] transform -translate-x-full -translate-y-1/2`
      case 'right':
        return `fixed top-[${rect.top + rect.height / 2}px] left-[${rect.right + 20}px] transform -translate-y-1/2`
      default:
        return 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
    }
  }

  return (
    <>
      {/* Overlay Background */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] transition-opacity duration-300">
        {/* Highlight Effect */}
        {highlightedElement && (
          <div
            className="absolute border-4 border-blue-500 rounded-lg shadow-2xl pointer-events-none transition-all duration-500 animate-pulse"
            style={{
              top: highlightedElement.getBoundingClientRect().top - 8,
              left: highlightedElement.getBoundingClientRect().left - 8,
              width: highlightedElement.getBoundingClientRect().width + 16,
              height: highlightedElement.getBoundingClientRect().height + 16,
            }}
          />
        )}

        {/* Tutorial Tooltip */}
        <div className={`${getTooltipPosition()} max-w-sm sm:max-w-md z-[10000]`}>
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-fade-in-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    {currentTutorialStep.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{currentTutorialStep.title}</h3>
                    <p className="text-blue-100 text-sm">Passo {currentStep + 1} di {tutorialSteps.length}</p>
                  </div>
                </div>
                <button
                  onClick={skipTutorial}
                  className="text-white/80 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
                  aria-label="Chiudi tutorial"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed mb-6">
                {currentTutorialStep.content}
              </p>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Progresso</span>
                  <span>{Math.round(((currentStep + 1) / tutorialSteps.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <button
                  onClick={prevStep}
                  disabled={isFirstStep}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isFirstStep 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Indietro</span>
                </button>

                <div className="flex space-x-1">
                  {tutorialSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentStep ? 'bg-blue-600 w-6' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextStep}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span>{isLastStep ? 'Completa' : 'Avanti'}</span>
                  {isLastStep ? <CheckCircle className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}