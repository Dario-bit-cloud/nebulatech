'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Server, 
  Database, 
  Shield, 
  Activity, 
  Plus, 
  Settings, 
  BarChart3, 
  Users, 
  HardDrive, 
  Cpu, 
  MemoryStick, 
  Cloud,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Zap,
  Globe,
  Eye,
  Loader,
  Clock,

} from 'lucide-react'


interface Server {
  id: number
  name: string
  type: 'web' | 'database' | 'storage' | 'api'
  plan: 'basic' | 'pro' | 'enterprise'
  status: 'online' | 'offline' | 'creating' | 'demo' | 'initializing'
  cpu: number
  memory: number
  storage: number
  uptime: string
  location: string
  isDemo?: boolean
}

interface User {
  name: string
  email: string
  loginTime: string
  isGuest?: boolean
}

// Configurazione storage predefinito per ogni piano
const PLAN_STORAGE_CONFIG = {
  basic: 50,     // 50 GB per piano Basic
  pro: 200,      // 200 GB per piano Pro
  enterprise: 1000  // 1 TB per piano Enterprise
} as const

// Funzioni per gestire localStorage
const saveServersToStorage = (servers: Server[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('nebulatech-servers', JSON.stringify(servers));
  }
};

const loadServersFromStorage = (): Server[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('nebulatech-servers');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Errore nel caricamento dei server da localStorage:', error);
      }
    }
  }
  return [];
};

// Funzioni per simulare variazioni realistiche delle metriche
const simulateMetricVariation = (currentValue: number, min: number = 10, max: number = 90): number => {
  // Variazione casuale tra -5 e +5
  const variation = (Math.random() - 0.5) * 10
  const newValue = currentValue + variation
  
  // Mantieni i valori entro i limiti realistici
  return Math.max(min, Math.min(max, newValue))
}

const updateDemoServerMetrics = (server: Server): Server => {
  if (!server.isDemo) return server
  
  return {
    ...server,
    cpu: Math.round(simulateMetricVariation(server.cpu, 15, 85)),
    memory: Math.round(simulateMetricVariation(server.memory, 20, 80))
    // Storage rimane fisso basato sul piano
  }
}

// Cookie utility functions
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null
  const nameEQ = name + "="
  const ca = document.cookie.split(';')
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [servers, setServers] = useState<Server[]>(() => loadServersFromStorage())
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState(0)
  const [newServer, setNewServer] = useState<{
    name: string
    type: Server['type']
    plan: Server['plan']
  }>({
    name: '',
    type: 'web',
    plan: 'basic'
  })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [serverToDelete, setServerToDelete] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in (localStorage first, then cookies)
    let userData = localStorage.getItem('user')
    
    // If not in localStorage, check cookies
    if (!userData) {
      const cookieData = getCookie('user')
      if (cookieData) {
        try {
          userData = cookieData
          // Restore to localStorage from cookie
          localStorage.setItem('user', userData)
          const cookieLoginTime = getCookie('loginTime')
          if (cookieLoginTime) {
            localStorage.setItem('loginTime', cookieLoginTime)
          }
        } catch (error) {
          console.error('Error parsing cookie data:', error)
        }
      }
    }
    
    if (!userData) {
      router.push('/login')
      return
    }
    
    try {
      setUser(JSON.parse(userData))
    } catch (error) {
      console.error('Error parsing user data:', error)
      router.push('/login')
      return
    }
    
    setIsLoading(false)
  }, [router])

  // useEffect per aggiornamento periodico dei server demo
  useEffect(() => {
    if (!user?.isGuest) return
    
    const interval = setInterval(() => {
      setServers(prevServers => {
        const updated = prevServers.map(server => updateDemoServerMetrics(server))
        saveServersToStorage(updated)
        return updated
      })
    }, 3000) // Aggiorna ogni 3 secondi
    
    return () => clearInterval(interval)
  }, [user?.isGuest])

  // Check if user is new and should see onboarding
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('nebula-onboarding-completed')
    if (!hasSeenOnboarding && servers.length === 0 && user) {
      // Delay onboarding slightly to let the UI settle
      const timer = setTimeout(() => {
        setShowOnboarding(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [servers.length, user])

  const completeOnboarding = () => {
    localStorage.setItem('nebula-onboarding-completed', 'true')
    setShowOnboarding(false)
    setOnboardingStep(0)
  }

  const nextOnboardingStep = () => {
    if (onboardingStep < 3) {
      setOnboardingStep(onboardingStep + 1)
    } else {
      completeOnboarding()
    }
  }

  const skipOnboarding = () => {
    completeOnboarding()
  }

  const showDeleteConfirmation = (serverId: number) => {
    setServerToDelete(serverId)
    setShowDeleteConfirm(true)
  }

  const handleDeleteServer = () => {
    if (serverToDelete) {
      const updatedServers = servers.filter(server => server.id !== serverToDelete)
      setServers(updatedServers)
      saveServersToStorage(updatedServers)
      setShowDeleteConfirm(false)
      setServerToDelete(null)
    }
  }

  const cancelDeleteServer = () => {
    setShowDeleteConfirm(false)
    setServerToDelete(null)
  }

  const handleCreateServer = () => {
    if (newServer.name.trim()) {
      const isGuestUser = user?.isGuest || false
      const server: Server = {
        id: Date.now(),
        name: newServer.name,
        type: newServer.type,
        plan: newServer.plan,
        status: 'initializing', // Tutti i server iniziano con 'initializing'
        cpu: isGuestUser ? Math.floor(Math.random() * 50) + 10 : 0,
        memory: isGuestUser ? Math.floor(Math.random() * 70) + 20 : 0,
        storage: PLAN_STORAGE_CONFIG[newServer.plan], // Storage basato sul piano
        uptime: '0 minuti',
        location: 'Milano',
        isDemo: isGuestUser
      }
      
      const updatedServers = [...servers, server]
      setServers(updatedServers)
      saveServersToStorage(updatedServers)
      setNewServer({ name: '', type: 'web', plan: 'basic' })
      setShowCreateForm(false)
      
      // Transizione da 'initializing' allo stato finale dopo 2 secondi
      setTimeout(() => {
        setServers(prev => {
          const updated = prev.map(s => {
            if (s.id === server.id) {
              const finalStatus = (isGuestUser ? 'demo' : 'online') as Server['status']
              const finalUptime = isGuestUser ? `${Math.floor(Math.random() * 30) + 1} giorni` : '1 minuto'
              return { ...s, status: finalStatus, uptime: finalUptime }
            }
            return s
          })
          saveServersToStorage(updated)
          return updated
        })
      }, 2000)
    }
  }

  const getStatusColor = (status: Server['status']) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100'
      case 'offline': return 'text-red-600 bg-red-100'
      case 'creating': return 'text-yellow-600 bg-yellow-100'

      case 'demo': return 'text-purple-600 bg-purple-100'
      case 'initializing': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: Server['status']) => {
    switch (status) {
      case 'online': return <CheckCircle className="w-4 h-4" />
      case 'offline': return <AlertCircle className="w-4 h-4" />
      case 'creating': return <Clock className="w-4 h-4" />

      case 'demo': return <Eye className="w-4 h-4" />
      case 'initializing': return <Loader className="w-4 h-4 animate-spin" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const getStatusText = (status: Server['status']) => {
    switch (status) {
      case 'online': return 'Online'
      case 'offline': return 'Offline'
      case 'creating': return 'Creazione'

      case 'demo': return 'Demo'
      case 'initializing': return 'Avvio in corso...'
      default: return 'Sconosciuto'
    }
  }

  const getTypeIcon = (type: Server['type']) => {
    switch (type) {
      case 'web': return <Globe className="w-5 h-5" /> // Hosting Professionale
      case 'database': return <Database className="w-5 h-5" /> // Database Gestito
      case 'storage': return <Cloud className="w-5 h-5" /> // Storage Cloud
      case 'api': return <Zap className="w-5 h-5" /> // Infrastruttura Scalabile
      default: return <Server className="w-5 h-5" />
    }
  }

  const getServiceFeatures = (type: Server['type'], plan: Server['plan']) => {
    const features = {
      web: {
        basic: 'SSD NVMe, SSL Gratuito',
        pro: 'Backup Automatici, Uptime 99.9%',
        enterprise: 'Prestazioni Elevate'
      },
      storage: {
        basic: 'Crittografia End-to-End',
        pro: 'Sincronizzazione Multi-Device',
        enterprise: 'Versioning Automatico'
      },
      api: {
        basic: 'Auto-Scaling Intelligente',
        pro: 'Load Balancing Avanzato',
        enterprise: 'API RESTful Complete'
      },
      database: {
        basic: 'MySQL/PostgreSQL',
        pro: 'Backup Automatici',
        enterprise: 'Alta Disponibilità'
      }
    }
    return features[type]?.[plan] || 'Caratteristiche standard'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Caricamento dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-24 pb-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-4xl font-bold gradient-text">
                  Dashboard
                </h1>
                {user?.isGuest && (
                  <span className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
                    Modalità Ospite
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-lg">
                Benvenuto, {user?.name}! {user?.isGuest ? 'Stai navigando come ospite' : 'Gestisci i tuoi servizi cloud'}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="btn btn-primary flex items-center space-x-2 hover-lift focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
                    aria-label="Crea un nuovo servizio cloud"
                    type="button"
                  >
                    <Plus className="w-5 h-5" aria-hidden="true" />
                    <span>Nuovo Servizio</span>
                  </button>

                </div>
                {user?.isGuest && (
                  <p className="text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
                    💡 Come ospite puoi creare server demo per esplorare l'interfaccia
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>



        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-8" role="region" aria-label="Statistiche dashboard">
          {/* Server Attivi Card */}
          <div className="card p-6 hover-lift animate-fade-in-up group hover:shadow-xl transition-all duration-300" role="article" aria-labelledby="server-attivi-title">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1" id="server-attivi-title">Server Attivi</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-3xl font-bold text-gray-900 transition-all duration-500" aria-label={`${servers.filter(s => s.status === 'online').length} server attivi su ${servers.length} totali`}>
                    {servers.filter(s => s.status === 'online').length}
                  </p>
                  {servers.length > 0 && (
                    <span className="text-sm text-gray-500" aria-hidden="true">/ {servers.length}</span>
                  )}
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                <Server className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            
            {/* Status indicator */}
            <div className="mt-4">
              {servers.length === 0 ? (
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mr-2 animate-pulse"></div>
                  <span>Nessun server configurato</span>
                </div>
              ) : (
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-green-600 font-medium">
                    {servers.filter(s => s.status === 'online').length > 0 ? 'Operativi' : 'In configurazione'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Database Card */}
          <div className="card p-6 hover-lift animate-fade-in-up animation-delay-100 group hover:shadow-xl transition-all duration-300" role="article" aria-labelledby="database-title">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1" id="database-title">Database</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-3xl font-bold text-gray-900 transition-all duration-500" aria-label={`${servers.filter(s => s.type === 'database').length} database configurati`}>
                    {servers.filter(s => s.type === 'database').length}
                  </p>
                  {servers.filter(s => s.type === 'database').length > 0 && (
                    <span className="text-sm text-green-600 font-medium" aria-hidden="true">attivi</span>
                  )}
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-green-200 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                <Database className="w-6 h-6 text-green-600" />
              </div>
            </div>
            
            <div className="mt-4">
              {servers.filter(s => s.type === 'database').length === 0 ? (
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                  <span>Crea il tuo primo database</span>
                </div>
              ) : (
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600 font-medium">Tutti online</span>
                </div>
              )}
            </div>
          </div>

          {/* Storage Card */}
          <div className="card p-6 hover-lift animate-fade-in-up animation-delay-200 group hover:shadow-xl transition-all duration-300" role="article" aria-labelledby="storage-title">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1" id="storage-title">Storage Totale</p>
                <div className="flex items-baseline space-x-1">
                  <p className="text-3xl font-bold text-gray-900 transition-all duration-500" aria-label={`${servers.reduce((acc, s) => acc + s.storage, 0)} gigabyte di storage utilizzato`}>
                    {servers.reduce((acc, s) => acc + s.storage, 0)}
                  </p>
                  <span className="text-lg text-gray-600" aria-hidden="true">GB</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                <HardDrive className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            
            {/* Storage progress bar */}
            <div className="mt-4">
              {servers.length === 0 ? (
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                  <span>Storage disponibile illimitato</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Utilizzato</span>
                    <span className="text-purple-600 font-medium">
                      {((servers.reduce((acc, s) => acc + s.storage, 0) / 1000) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${Math.min((servers.reduce((acc, s) => acc + s.storage, 0) / 1000) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Servers Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 animate-fade-in-up">
            I Tuoi Server
          </h2>
          
          {servers.length === 0 ? (
            <div className="card p-12 text-center animate-fade-in-up">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
                <Cloud className="w-20 h-20 text-blue-500 mx-auto relative z-10" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Benvenuto in Nebula Cloud! 🚀
              </h3>
              
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Trasforma le tue idee in realtà con la nostra infrastruttura cloud di ultima generazione.
                <br className="hidden sm:block" />
                <span className="text-blue-600 font-medium">Inizia in meno di 2 minuti!</span>
              </p>

              {/* Benefici principali */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                  <div className="bg-blue-500 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Deploy Istantaneo</h4>
                  <p className="text-sm text-gray-600">Il tuo server sarà online in meno di 30 secondi</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <div className="bg-green-500 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Sicurezza Garantita</h4>
                  <p className="text-sm text-gray-600">SSL gratuito, backup automatici e protezione DDoS</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                  <div className="bg-purple-500 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Scalabilità Automatica</h4>
                  <p className="text-sm text-gray-600">Risorse che si adattano al tuo traffico</p>
                </div>
              </div>

              {/* Casi d'uso popolari */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8 max-w-3xl mx-auto">
                <h4 className="font-semibold text-gray-900 mb-4">💡 Cosa puoi creare:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="bg-white p-3 rounded-lg mb-2">
                      <Globe className="w-5 h-5 text-blue-500 mx-auto" />
                    </div>
                    <span className="text-gray-700">Siti Web</span>
                  </div>
                  <div className="text-center">
                    <div className="bg-white p-3 rounded-lg mb-2">
                      <Database className="w-5 h-5 text-orange-500 mx-auto" />
                    </div>
                    <span className="text-gray-700">Database</span>
                  </div>
                  <div className="text-center">
                    <div className="bg-white p-3 rounded-lg mb-2">
                      <Server className="w-5 h-5 text-green-500 mx-auto" />
                    </div>
                    <span className="text-gray-700">API REST</span>
                  </div>
                  <div className="text-center">
                    <div className="bg-white p-3 rounded-lg mb-2">
                      <HardDrive className="w-5 h-5 text-purple-500 mx-auto" />
                    </div>
                    <span className="text-gray-700">Storage</span>
                  </div>
                </div>
              </div>

              {/* Call to Action principale */}
              <div className="space-y-4">
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="btn btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  🚀 Crea il Tuo Primo Server
                </button>
                
                <p className="text-sm text-gray-500">
                  ✨ <span className="font-medium text-green-600">Prova gratuita</span> • Nessuna carta di credito richiesta • Setup in 2 minuti
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {servers.map((server, index) => (
                <div 
                  key={server.id} 
                  className={`card p-6 hover-lift animate-fade-in-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        {getTypeIcon(server.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{server.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{server.type} • {server.plan}</p>
                      </div>
                    </div>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(server.status)}`}>
                      {getStatusIcon(server.status)}
                      <span>{getStatusText(server.status)}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">CPU</span>
                      <span className="font-medium">{server.cpu}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${server.cpu}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Memoria</span>
                      <span className="font-medium">{server.memory}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${server.memory}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Storage</span>
                      <span className="font-medium">{server.storage} GB</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full w-full"></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Piano {server.plan} - {getServiceFeatures(server.type, server.plan)}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <span>{server.location}</span>
                    </div>
                    
                    {server.isDemo ? (
                      <div className="space-y-2">
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                          <p className="text-sm text-purple-800 font-medium mb-1">🎭 Server Demo</p>
                          <p className="text-xs text-purple-600">
                            Questo è un server di dimostrazione. I dati sono simulati e non rappresentano un'infrastruttura reale.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <button 
                            disabled
                            className="w-full bg-gray-100 text-gray-400 py-2 px-4 rounded-lg cursor-not-allowed text-sm font-medium"
                          >
                            🔒 Connessione non disponibile in modalità ospite
                          </button>
                          <button 
                            onClick={() => showDeleteConfirmation(server.id)}
                            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                          >
                            🗑️ Elimina Server Demo
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                          🔗 Connetti al Server
                        </button>
                        <button 
                          onClick={() => showDeleteConfirmation(server.id)}
                          className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          🗑️ Elimina Server
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Server Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="glass rounded-2xl p-6 w-full max-w-4xl animate-scale-in max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Crea Nuovo Servizio</h3>
              
              {!newServer.type ? (
                <div>
                  <p className="text-gray-600 mb-6">Scegli il tipo di servizio che desideri creare:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Hosting Professionale */}
                    <div 
                      onClick={() => setNewServer(prev => ({ ...prev, type: 'web' }))}
                      className="card p-6 hover-lift cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all"
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <Globe className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">Hosting Professionale</h4>
                          <p className="text-sm text-gray-600">Prestazioni Elevate</p>
                        </div>
                      </div>
                      <ul className="text-sm text-gray-600 space-y-2 mb-4">
                        <li>• SSD NVMe Ultra-Veloce</li>
                        <li>• SSL Gratuito Incluso</li>
                        <li>• Uptime 99.9% Garantito</li>
                      </ul>
                      <div className="text-xl font-bold text-blue-600">Da €29/mese</div>
                    </div>

                    {/* Storage Cloud */}
                    <div 
                      onClick={() => setNewServer(prev => ({ ...prev, type: 'storage' }))}
                      className="card p-6 hover-lift cursor-pointer border-2 border-transparent hover:border-green-500 transition-all"
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-green-100 p-3 rounded-lg">
                          <Cloud className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">Storage Cloud</h4>
                          <p className="text-sm text-gray-600">Sicurezza Avanzata</p>
                        </div>
                      </div>
                      <ul className="text-sm text-gray-600 space-y-2 mb-4">
                        <li>• Crittografia End-to-End</li>
                        <li>• Sincronizzazione Multi-Device</li>
                        <li>• Versioning Automatico</li>
                      </ul>
                      <div className="text-xl font-bold text-green-600">Da €15/mese</div>
                    </div>

                    {/* Infrastruttura Scalabile */}
                    <div 
                      onClick={() => setNewServer(prev => ({ ...prev, type: 'api' }))}
                      className="card p-6 hover-lift cursor-pointer border-2 border-transparent hover:border-purple-500 transition-all"
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-purple-100 p-3 rounded-lg">
                          <Zap className="w-8 h-8 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">Infrastruttura Scalabile</h4>
                          <p className="text-sm text-gray-600">Crescita Illimitata</p>
                        </div>
                      </div>
                      <ul className="text-sm text-gray-600 space-y-2 mb-4">
                        <li>• Auto-Scaling Intelligente</li>
                        <li>• Load Balancing Avanzato</li>
                        <li>• API RESTful Complete</li>
                      </ul>
                      <div className="text-xl font-bold text-purple-600">Da €49/mese</div>
                    </div>

                    {/* Database Gestito */}
                    <div 
                      onClick={() => setNewServer(prev => ({ ...prev, type: 'database' }))}
                      className="card p-6 hover-lift cursor-pointer border-2 border-transparent hover:border-orange-500 transition-all"
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-orange-100 p-3 rounded-lg">
                          <Database className="w-8 h-8 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">Database Gestito</h4>
                          <p className="text-sm text-gray-600">Affidabilità Totale</p>
                        </div>
                      </div>
                      <ul className="text-sm text-gray-600 space-y-2 mb-4">
                        <li>• MySQL/PostgreSQL</li>
                        <li>• Backup Automatici</li>
                        <li>• Alta Disponibilità</li>
                      </ul>
                      <div className="text-xl font-bold text-orange-600">Da €25/mese</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Breadcrumb */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <button 
                      onClick={() => setNewServer(prev => ({ ...prev, type: '' as any }))}
                      className="hover:text-blue-600 transition-colors"
                    >
                      Scegli Servizio
                    </button>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">
                      {newServer.type === 'web' && 'Hosting Professionale'}
                      {newServer.type === 'storage' && 'Storage Cloud'}
                      {newServer.type === 'api' && 'Infrastruttura Scalabile'}
                      {newServer.type === 'database' && 'Database Gestito'}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-2">
                         Nome Servizio
                       </label>
                       <input
                          type="text"
                          value={newServer.name}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 10) {
                              setNewServer(prev => ({ ...prev, name: value }));
                            }
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Es. WebServer01"
                          maxLength={10}
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          {newServer.name.length}/10 caratteri
                        </div>
                     </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Scegli Piano
                      </label>
                      <div className="space-y-3">
                        {newServer.type === 'web' && (
                          <>
                            <div 
                              onClick={() => setNewServer(prev => ({ ...prev, plan: 'basic' }))}
                              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                newServer.plan === 'basic' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <h5 className="font-semibold text-gray-900">Hosting Basic</h5>
                                  <p className="text-sm text-gray-600">SSD NVMe, SSL Gratuito</p>
                                </div>
                                <div className="text-lg font-bold text-blue-600">€29/mese</div>
                              </div>
                            </div>
                            <div 
                              onClick={() => setNewServer(prev => ({ ...prev, plan: 'pro' }))}
                              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                newServer.plan === 'pro' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <h5 className="font-semibold text-gray-900">Hosting Pro</h5>
                                  <p className="text-sm text-gray-600">Backup Automatici, Uptime 99.9%</p>
                                </div>
                                <div className="text-lg font-bold text-blue-600">€59/mese</div>
                              </div>
                            </div>
                            <div 
                              onClick={() => setNewServer(prev => ({ ...prev, plan: 'enterprise' }))}
                              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                newServer.plan === 'enterprise' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <h5 className="font-semibold text-gray-900">Hosting Enterprise</h5>
                                  <p className="text-sm text-gray-600">Prestazioni Elevate</p>
                                </div>
                                <div className="text-lg font-bold text-blue-600">€99/mese</div>
                              </div>
                            </div>
                          </>
                        )}
                        {newServer.type === 'storage' && (
                          <>
                            <div 
                              onClick={() => setNewServer(prev => ({ ...prev, plan: 'basic' }))}
                              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                newServer.plan === 'basic' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <h5 className="font-semibold text-gray-900">Storage Basic</h5>
                                  <p className="text-sm text-gray-600">100 GB, Crittografia End-to-End</p>
                                </div>
                                <div className="text-lg font-bold text-green-600">€15/mese</div>
                              </div>
                            </div>
                            <div 
                              onClick={() => setNewServer(prev => ({ ...prev, plan: 'pro' }))}
                              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                newServer.plan === 'pro' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <h5 className="font-semibold text-gray-900">Storage Pro</h5>
                                  <p className="text-sm text-gray-600">500 GB, Sincronizzazione Multi-Device</p>
                                </div>
                                <div className="text-lg font-bold text-green-600">€35/mese</div>
                              </div>
                            </div>
                            <div 
                              onClick={() => setNewServer(prev => ({ ...prev, plan: 'enterprise' }))}
                              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                newServer.plan === 'enterprise' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <h5 className="font-semibold text-gray-900">Storage Enterprise</h5>
                                  <p className="text-sm text-gray-600">2 TB, Versioning Automatico</p>
                                </div>
                                <div className="text-lg font-bold text-green-600">€75/mese</div>
                              </div>
                            </div>
                          </>
                        )}
                        {newServer.type === 'api' && (
                          <>
                            <div 
                              onClick={() => setNewServer(prev => ({ ...prev, plan: 'basic' }))}
                              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                newServer.plan === 'basic' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <h5 className="font-semibold text-gray-900">Infrastruttura Basic</h5>
                                  <p className="text-sm text-gray-600">Auto-Scaling Intelligente</p>
                                </div>
                                <div className="text-lg font-bold text-purple-600">€49/mese</div>
                              </div>
                            </div>
                            <div 
                              onClick={() => setNewServer(prev => ({ ...prev, plan: 'pro' }))}
                              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                newServer.plan === 'pro' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <h5 className="font-semibold text-gray-900">Infrastruttura Pro</h5>
                                  <p className="text-sm text-gray-600">Load Balancing Avanzato</p>
                                </div>
                                <div className="text-lg font-bold text-purple-600">€99/mese</div>
                              </div>
                            </div>
                            <div 
                              onClick={() => setNewServer(prev => ({ ...prev, plan: 'enterprise' }))}
                              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                newServer.plan === 'enterprise' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <h5 className="font-semibold text-gray-900">Infrastruttura Enterprise</h5>
                                  <p className="text-sm text-gray-600">API RESTful Complete</p>
                                </div>
                                <div className="text-lg font-bold text-purple-600">€199/mese</div>
                              </div>
                            </div>
                          </>
                        )}
                        {newServer.type === 'database' && (
                          <>
                            <div 
                              onClick={() => setNewServer(prev => ({ ...prev, plan: 'basic' }))}
                              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                newServer.plan === 'basic' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <h5 className="font-semibold text-gray-900">Database Basic</h5>
                                  <p className="text-sm text-gray-600">MySQL/PostgreSQL</p>
                                </div>
                                <div className="text-lg font-bold text-orange-600">€25/mese</div>
                              </div>
                            </div>
                            <div 
                              onClick={() => setNewServer(prev => ({ ...prev, plan: 'pro' }))}
                              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                newServer.plan === 'pro' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <h5 className="font-semibold text-gray-900">Database Pro</h5>
                                  <p className="text-sm text-gray-600">Backup Automatici</p>
                                </div>
                                <div className="text-lg font-bold text-orange-600">€55/mese</div>
                              </div>
                            </div>
                            <div 
                              onClick={() => setNewServer(prev => ({ ...prev, plan: 'enterprise' }))}
                              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                newServer.plan === 'enterprise' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <h5 className="font-semibold text-gray-900">Database Enterprise</h5>
                                  <p className="text-sm text-gray-600">Alta Disponibilità</p>
                                </div>
                                <div className="text-lg font-bold text-orange-600">€125/mese</div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-3 mt-8">
                <button
                  onClick={() => {
                    setShowCreateForm(false)
                    setNewServer({ name: '', type: 'web', plan: 'basic' })
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Annulla
                </button>
                {newServer.type && newServer.name && (
                  <button
                    onClick={handleCreateServer}
                    className="flex-1 btn btn-primary"
                  >
                    Crea Servizio
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="glass rounded-2xl p-6 w-full max-w-md animate-scale-in">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Conferma Eliminazione Server
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Sei sicuro di voler eliminare questo server? Questa azione è irreversibile e comporterà:
                </p>
                <div className="text-left bg-red-50 rounded-lg p-4 mb-6">
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Perdita permanente di tutti i dati del server</li>
                    <li>• Interruzione immediata di tutti i servizi attivi</li>
                    <li>• Impossibilità di recuperare le configurazioni</li>
                  </ul>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={cancelDeleteServer}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Annulla
                  </button>
                  <button
                    onClick={handleDeleteServer}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Conferma
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Onboarding Tour */}
        {showOnboarding && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="glass rounded-2xl p-8 w-full max-w-2xl animate-scale-in">
              {onboardingStep === 0 && (
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 mb-6">
                    <Cloud className="h-8 w-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Benvenuto in Nebula! 🚀</h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Sei pronto a scoprire la potenza del cloud computing? Ti guideremo attraverso i primi passi per creare e gestire i tuoi server in modo semplice e veloce.
                  </p>
                  <div className="flex justify-between items-center">
                    <button onClick={skipOnboarding} className="text-gray-500 hover:text-gray-700 transition-colors">
                      Salta il tour
                    </button>
                    <button onClick={nextOnboardingStep} className="btn-primary px-6 py-3 rounded-xl font-semibold">
                      Iniziamo! →
                    </button>
                  </div>
                </div>
              )}

              {onboardingStep === 1 && (
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-green-100 to-green-200 mb-6">
                    <BarChart3 className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Overview 📊</h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Questa è la tua dashboard principale. Qui puoi monitorare tutti i tuoi server, database e storage in tempo reale. Le card mostrano statistiche aggiornate sui tuoi servizi attivi.
                  </p>
                  <div className="flex justify-between items-center">
                    <button onClick={skipOnboarding} className="text-gray-500 hover:text-gray-700 transition-colors">
                      Salta il tour
                    </button>
                    <button onClick={nextOnboardingStep} className="btn-primary px-6 py-3 rounded-xl font-semibold">
                      Continua →
                    </button>
                  </div>
                </div>
              )}

              {onboardingStep === 2 && (
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 mb-6">
                    <Plus className="h-8 w-8 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Crea il Tuo Primo Server ⚡</h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Clicca sul pulsante "Nuovo Servizio" per creare il tuo primo server. Puoi scegliere tra diversi tipi: web server, database, storage o API. Ogni server può essere configurato secondo le tue esigenze.
                  </p>
                  <div className="flex justify-between items-center">
                    <button onClick={skipOnboarding} className="text-gray-500 hover:text-gray-700 transition-colors">
                      Salta il tour
                    </button>
                    <button onClick={nextOnboardingStep} className="btn-primary px-6 py-3 rounded-xl font-semibold">
                      Quasi finito →
                    </button>
                  </div>
                </div>
              )}

              {onboardingStep === 3 && (
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 mb-6">
                    <CheckCircle className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Sei Pronto! 🎉</h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Perfetto! Ora hai tutte le informazioni necessarie per iniziare. Ricorda che puoi sempre accedere all'aiuto e alla documentazione dal menu principale. Buon lavoro con Nebula!
                  </p>
                  <div className="flex justify-center">
                    <button onClick={completeOnboarding} className="btn-primary px-8 py-3 rounded-xl font-semibold">
                      Inizia a Usare Nebula! 🚀
                    </button>
                  </div>
                </div>
              )}

              {/* Progress indicator */}
              <div className="flex justify-center mt-8 space-x-2">
                {[0, 1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      step <= onboardingStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        

      </div>
    </div>
  )
}