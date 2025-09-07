'use client'

import { useState, useEffect } from 'react'
import UpdateNotificationPopup from './UpdateNotificationPopup'

export default function UpdateNotificationWrapper() {
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    // Controlla se il popup è già stato mostrato in questa sessione
    const hasSeenUpdate = sessionStorage.getItem('hasSeenUpdateNotification')
    
    if (!hasSeenUpdate) {
      // Mostra il popup dopo un breve delay per permettere il caricamento della pagina
      const timer = setTimeout(() => {
        setShowPopup(true)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleClosePopup = () => {
    setShowPopup(false)
    // Segna che l'utente ha visto il popup in questa sessione
    sessionStorage.setItem('hasSeenUpdateNotification', 'true')
  }

  return (
    <UpdateNotificationPopup 
      isVisible={showPopup} 
      onClose={handleClosePopup} 
    />
  )
}