'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/contexts/UserContext'
import { Loader2 } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
  fallback?: React.ReactNode
}

export default function AuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/login',
  fallback 
}: AuthGuardProps) {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      // Wait for user context to load
      if (isLoading) return

      if (requireAuth && !user) {
        // Store the current URL to redirect back after login
        const currentUrl = window.location.pathname + window.location.search
        const loginUrl = `${redirectTo}?returnUrl=${encodeURIComponent(currentUrl)}`
        router.push(loginUrl)
        return
      }

      setIsChecking(false)
    }

    checkAuth()
  }, [user, isLoading, requireAuth, redirectTo, router])

  // Show loading state while checking authentication
  if (isLoading || isChecking) {
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifica autenticazione...</h2>
          <p className="text-gray-600">Attendere prego</p>
        </div>
      </div>
    )
  }

  // If auth is required but user is not authenticated, don't render children
  if (requireAuth && !user) {
    return null
  }

  // If auth is not required or user is authenticated, render children
  return <>{children}</>
}

// Higher-order component for protecting pages
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<AuthGuardProps, 'children'> = {}
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    )
  }
}

// Hook for checking authentication status in components
export function useAuthGuard(requireAuth = true) {
  const { user, isLoading } = useUser()
  const router = useRouter()

  const checkAuth = () => {
    if (requireAuth && !isLoading && !user) {
      const currentUrl = window.location.pathname + window.location.search
      const loginUrl = `/login?returnUrl=${encodeURIComponent(currentUrl)}`
      router.push(loginUrl)
      return false
    }
    return true
  }

  return {
    isAuthenticated: !!user,
    isLoading,
    checkAuth,
    user
  }
}