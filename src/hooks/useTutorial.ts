'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface TutorialState {
  hasSeenTutorial: boolean
  currentStep: number
  isActive: boolean
}

interface TutorialStep {
  id: string
  title: string
  description: string
  target?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  action?: 'click' | 'hover' | 'none'
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Benvenuto in Nebula Tech!',
    description: 'Questa è la tua dashboard personale dove puoi gestire tutti i tuoi servizi cloud.',
    position: 'bottom'
  },
  {
    id: 'servers',
    title: 'I tuoi Server',
    description: 'Qui puoi visualizzare tutti i tuoi server attivi, monitorare le prestazioni e gestire le risorse.',
    target: '.servers-grid',
    position: 'top'
  },
  {
    id: 'add-server',
    title: 'Aggiungi Nuovo Server',
    description: 'Clicca qui per creare un nuovo server. Puoi scegliere tra diversi tipi e piani.',
    target: '.add-server-btn',
    position: 'left'
  },
  {
    id: 'stats',
    title: 'Statistiche Generali',
    description: 'Monitora le tue statistiche generali: server attivi, utilizzo risorse e costi.',
    target: '.stats-cards',
    position: 'bottom'
  },
  {
    id: 'settings',
    title: 'Impostazioni',
    description: 'Personalizza la tua esperienza e gestisci le preferenze del tuo account.',
    target: '.settings-btn',
    position: 'left'
  }
]

const STORAGE_KEY = 'nebula-tutorial-state'

export function useTutorial() {
  const { user } = useAuth()
  const [tutorialState, setTutorialState] = useState<TutorialState>({
    hasSeenTutorial: false,
    currentStep: 0,
    isActive: false
  })

  // Carica lo stato del tutorial dal localStorage
  useEffect(() => {
    if (user?.email) {
      const storageKey = `${STORAGE_KEY}-${user.email}`
      const savedState = localStorage.getItem(storageKey)
      
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState)
          setTutorialState(parsed)
        } catch (error) {
          console.error('Errore nel caricamento dello stato del tutorial:', error)
        }
      } else {
        // Se è la prima volta, avvia il tutorial
        setTutorialState(prev => ({
          ...prev,
          isActive: true
        }))
      }
    }
  }, [user?.email])

  // Salva lo stato del tutorial nel localStorage
  const saveState = useCallback((newState: TutorialState) => {
    if (user?.email) {
      const storageKey = `${STORAGE_KEY}-${user.email}`
      localStorage.setItem(storageKey, JSON.stringify(newState))
      setTutorialState(newState)
    }
  }, [user?.email])

  // Avvia il tutorial
  const startTutorial = useCallback(() => {
    const newState: TutorialState = {
      hasSeenTutorial: false,
      currentStep: 0,
      isActive: true
    }
    saveState(newState)
  }, [saveState])

  // Vai al prossimo step
  const nextStep = useCallback(() => {
    const nextStepIndex = tutorialState.currentStep + 1
    
    if (nextStepIndex >= TUTORIAL_STEPS.length) {
      // Tutorial completato
      const newState: TutorialState = {
        hasSeenTutorial: true,
        currentStep: 0,
        isActive: false
      }
      saveState(newState)
    } else {
      const newState: TutorialState = {
        ...tutorialState,
        currentStep: nextStepIndex
      }
      saveState(newState)
    }
  }, [tutorialState, saveState])

  // Vai allo step precedente
  const prevStep = useCallback(() => {
    if (tutorialState.currentStep > 0) {
      const newState: TutorialState = {
        ...tutorialState,
        currentStep: tutorialState.currentStep - 1
      }
      saveState(newState)
    }
  }, [tutorialState, saveState])

  // Salta il tutorial
  const skipTutorial = useCallback(() => {
    const newState: TutorialState = {
      hasSeenTutorial: true,
      currentStep: 0,
      isActive: false
    }
    saveState(newState)
  }, [saveState])

  // Chiudi il tutorial
  const closeTutorial = useCallback(() => {
    const newState: TutorialState = {
      ...tutorialState,
      isActive: false
    }
    saveState(newState)
  }, [tutorialState, saveState])

  // Ottieni lo step corrente
  const getCurrentStep = useCallback(() => {
    return TUTORIAL_STEPS[tutorialState.currentStep] || null
  }, [tutorialState.currentStep])

  // Verifica se dovrebbe mostrare il tutorial
  const shouldShowTutorial = tutorialState.isActive && !tutorialState.hasSeenTutorial

  return {
    // Stato
    tutorialState,
    shouldShowTutorial,
    currentStep: getCurrentStep(),
    totalSteps: TUTORIAL_STEPS.length,
    
    // Azioni
    startTutorial,
    nextStep,
    prevStep,
    skipTutorial,
    closeTutorial
  }
}

export type { TutorialStep, TutorialState }
export { TUTORIAL_STEPS }