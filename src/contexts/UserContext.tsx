'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

// Interfaccia User
export interface User {
  id: string
  name: string
  email: string
  username: string
}

// Interfaccia del Context
interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  login: (userData: User) => void
  logout: () => void
}

// Creazione del Context
const UserContext = createContext<UserContextType | undefined>(undefined)

// Provider Component
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = (userData: User) => {
    setUser(userData)
    // Salva in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData))
    }
  }

  const logout = () => {
    setUser(null)
    // Rimuovi da localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
    }
  }

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}

// Hook per usare il Context
export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser deve essere usato all\'interno di un UserProvider')
  }
  return context
}