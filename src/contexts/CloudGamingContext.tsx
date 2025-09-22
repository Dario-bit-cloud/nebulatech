'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface CloudGamingContextType {
  isCloudGamingEnabled: boolean
  enableCloudGaming: () => void
  disableCloudGaming: () => void
}

const CloudGamingContext = createContext<CloudGamingContextType | undefined>(undefined)

export function CloudGamingProvider({ children }: { children: React.ReactNode }) {
  const [isCloudGamingEnabled, setIsCloudGamingEnabled] = useState(false)

  // Carica lo stato dal localStorage al mount
  useEffect(() => {
    const saved = localStorage.getItem('cloudGamingEnabled')
    if (saved === 'true') {
      setIsCloudGamingEnabled(true)
    }
  }, [])

  const enableCloudGaming = () => {
    setIsCloudGamingEnabled(true)
    localStorage.setItem('cloudGamingEnabled', 'true')
  }

  const disableCloudGaming = () => {
    setIsCloudGamingEnabled(false)
    localStorage.setItem('cloudGamingEnabled', 'false')
  }

  return (
    <CloudGamingContext.Provider value={{
      isCloudGamingEnabled,
      enableCloudGaming,
      disableCloudGaming
    }}>
      {children}
    </CloudGamingContext.Provider>
  )
}

export function useCloudGaming() {
  const context = useContext(CloudGamingContext)
  if (context === undefined) {
    throw new Error('useCloudGaming must be used within a CloudGamingProvider')
  }
  return context
}