'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface TutorialState {
  hasSeenTutorial: boolean
  showTutorial: boolean
  isFirstVisit: boolean
}

const TUTORIAL_STORAGE_KEY = 'nebulatech_tutorial_completed'
const FIRST_VISIT_KEY = 'nebulatech_first_visit'

export function useTutorial() {
  const { user, isAuthenticated } = useAuth()
  const [tutorialState, setTutorialState] = useState<TutorialState>({
    hasSeenTutorial: false,
    showTutorial: false,
    isFirstVisit: true
  })

  // Check tutorial status on mount and when user changes
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setTutorialState({
        hasSeenTutorial: false,
        showTutorial: false,
        isFirstVisit: true
      })
      return
    }

    const checkTutorialStatus = () => {
      try {
        // Create user-specific keys
        const userTutorialKey = `${TUTORIAL_STORAGE_KEY}_${user.email || user.id || 'guest'}`
        const userFirstVisitKey = `${FIRST_VISIT_KEY}_${user.email || user.id || 'guest'}`
        
        // Check if user has completed tutorial
        const hasCompletedTutorial = localStorage.getItem(userTutorialKey) === 'true'
        
        // Check if this is first visit
        const hasVisitedBefore = localStorage.getItem(userFirstVisitKey) === 'true'
        const isFirstVisit = !hasVisitedBefore
        
        // Mark as visited
        if (isFirstVisit) {
          localStorage.setItem(userFirstVisitKey, 'true')
        }
        
        // Show tutorial if it's first visit and user hasn't completed it
        const shouldShowTutorial = isFirstVisit && !hasCompletedTutorial
        
        setTutorialState({
          hasSeenTutorial: hasCompletedTutorial,
          showTutorial: shouldShowTutorial,
          isFirstVisit
        })
      } catch (error) {
        console.error('Error checking tutorial status:', error)
        // Fallback to showing tutorial on error
        setTutorialState({
          hasSeenTutorial: false,
          showTutorial: true,
          isFirstVisit: true
        })
      }
    }

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(checkTutorialStatus, 500)
    return () => clearTimeout(timeoutId)
  }, [isAuthenticated, user])

  // Mark tutorial as completed
  const completeTutorial = () => {
    if (!user) return
    
    try {
      const userTutorialKey = `${TUTORIAL_STORAGE_KEY}_${user.email || user.id || 'guest'}`
      localStorage.setItem(userTutorialKey, 'true')
      
      setTutorialState(prev => ({
        ...prev,
        hasSeenTutorial: true,
        showTutorial: false
      }))
    } catch (error) {
      console.error('Error saving tutorial completion:', error)
    }
  }

  // Close tutorial without marking as completed
  const closeTutorial = () => {
    setTutorialState(prev => ({
      ...prev,
      showTutorial: false
    }))
  }

  // Manually start tutorial (from settings)
  const startTutorial = () => {
    setTutorialState(prev => ({
      ...prev,
      showTutorial: true
    }))
  }

  // Reset tutorial status (for testing or user preference)
  const resetTutorial = () => {
    if (!user) return
    
    try {
      const userTutorialKey = `${TUTORIAL_STORAGE_KEY}_${user.email || user.id || 'guest'}`
      const userFirstVisitKey = `${FIRST_VISIT_KEY}_${user.email || user.id || 'guest'}`
      
      localStorage.removeItem(userTutorialKey)
      localStorage.removeItem(userFirstVisitKey)
      
      setTutorialState({
        hasSeenTutorial: false,
        showTutorial: true,
        isFirstVisit: true
      })
    } catch (error) {
      console.error('Error resetting tutorial:', error)
    }
  }

  return {
    ...tutorialState,
    completeTutorial,
    closeTutorial,
    startTutorial,
    resetTutorial
  }
}

export default useTutorial