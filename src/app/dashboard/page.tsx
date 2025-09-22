'use client'

import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import type { JSX } from 'react'
import { useRouter } from 'next/navigation'
import AuthGuard from '@/components/AuthGuard'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Server, 
  Database, 
  Shield, 
  Plus, 
  BarChart3, 
  HardDrive, 
  Cloud,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Zap,
  Globe,
  Eye,
  Loader,
  Clock
} from 'lucide-react'
import TutorialOverlay from '@/components/TutorialOverlay'


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

// User interface is now imported from UserContext

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

// Memoized components for better performance
const ServerCard = memo(({ server, index, getTypeIcon, getStatusColor, getStatusIcon, getStatusText, handleDeleteServer }: {
  server: Server
  index: number
  getTypeIcon: (type: Server['type']) => JSX.Element
  getStatusColor: (status: Server['status']) => string
  getStatusIcon: (status: Server['status']) => JSX.Element
  getStatusText: (status: Server['status']) => string
  handleDeleteServer: (id: number) => void
}) => (
  <div 
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
          className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
          style={{ width: `${server.cpu}%` }}
        ></div>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Memory</span>
        <span className="font-medium">{server.memory}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-green-500 h-2 rounded-full transition-all duration-500" 
          style={{ width: `${server.memory}%` }}
        ></div>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Storage</span>
        <span className="font-medium">{server.storage} GB</span>
      </div>
      
      <div className="flex items-center justify-between text-sm pt-2 border-t">
        <span className="text-gray-600">Uptime</span>
        <span className="font-medium text-green-600">{server.uptime}</span>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Location</span>
        <span className="font-medium">{server.location}</span>
      </div>
    </div>

    <div className="mt-4 pt-4 border-t flex space-x-2">
      <button className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
        <Eye className="w-4 h-4 inline mr-1" />
        Gestisci
      </button>
      <button 
        onClick={() => handleDeleteServer(server.id)}
        className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
      >
        Elimina
      </button>
    </div>
  </div>
))

ServerCard.displayName = 'ServerCard'

function DashboardContent() {
  const { user, isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [servers, setServers] = useState<Server[]>(() => loadServersFromStorage())

  const updateDemoServerMetrics = useCallback((server: Server): Server => {
    if (!server.isDemo) return server
    
    return {
      ...server,
      cpu: Math.round(simulateMetricVariation(server.cpu, 15, 85)),
      memory: Math.round(simulateMetricVariation(server.memory, 20, 80))
      // Storage rimane fisso basato sul piano
    }
  }, [])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState(0)
  const [currentStep, setCurrentStep] = useState(1)
  const [showTutorial, setShowTutorial] = useState(true)
  const [newServer, setNewServer] = useState<{
    name: string
    type: Server['type']
    plan: Server['plan']
    os: string
    cpu: string
    ram: string
    storage: string
    network: string
    security: string
  }>({
    name: '',
    type: 'web',
    plan: 'basic',
    os: '',
    cpu: '2',
    ram: '4',
    storage: '50',
    network: 'standard',
    security: 'basic'
  })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [serverToDelete, setServerToDelete] = useState<number | null>(null)
  const router = useRouter()

  // Memoized calculations for performance
  const serverStats = useMemo(() => {
    const onlineServers = servers.filter(s => s.status === 'online').length
    const databaseServers = servers.filter(s => s.type === 'database').length
    const totalStorage = servers.reduce((acc, s) => acc + s.storage, 0)
    const storagePercentage = Math.min((totalStorage / 1000) * 100, 100)
    
    return {
      onlineServers,
      databaseServers,
      totalStorage,
      storagePercentage,
      totalServers: servers.length
    }
  }, [servers])

  useEffect(() => {
    // Check if user should see onboarding
    if (user && !localStorage.getItem('onboardingCompleted')) {
      setShowOnboarding(true)
    }
    setIsLoading(false)
  }, [user])



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

  // Blocca/sblocca scrolling quando il popup è aperto
  useEffect(() => {
    if (showCreateForm) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    // Cleanup quando il componente viene smontato
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showCreateForm])

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
      setNewServer({
        name: '',
        type: 'web',
        plan: 'basic',
        os: '',
        cpu: '2',
        ram: '4',
        storage: '50',
        network: 'standard',
        security: 'basic'
      })
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-24 pb-12 overflow-x-hidden">
      <TutorialOverlay isVisible={showTutorial} />
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="tutorial-welcome mb-8 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl xs:text-4xl font-bold gradient-text">
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
                    className="tutorial-add-server btn btn-primary flex items-center space-x-2 hover-lift focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
                    aria-label="Crea un nuovo servizio cloud"
                    type="button"
                  >
                    <Plus className="w-5 h-5" aria-hidden="true" />
                    <span>Nuovo Servizio</span>
                  </button>

                </div>

              </div>
            </div>
          </div>
        </div>



        {/* Stats Grid */}
        <div className="tutorial-stats grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-8" role="region" aria-label="Statistiche dashboard">
          {/* Server Attivi Card */}
          <div className="card p-6 hover-lift animate-fade-in-up group hover:shadow-xl transition-all duration-300" role="article" aria-labelledby="server-attivi-title">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1" id="server-attivi-title">Server Attivi</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-2xl xs:text-3xl font-bold text-gray-900 transition-all duration-500" aria-label={`${serverStats.onlineServers} server attivi su ${serverStats.totalServers} totali`}>
                    {serverStats.onlineServers}
                  </p>
                  {serverStats.totalServers > 0 && (
                    <span className="text-sm text-gray-500" aria-hidden="true">/ {serverStats.totalServers}</span>
                  )}
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                <Server className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            
            {/* Status indicator */}
            <div className="mt-4">
              {serverStats.totalServers === 0 ? (
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mr-2 animate-pulse"></div>
                  <span>Nessun server configurato</span>
                </div>
              ) : (
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-green-600 font-medium">
                    {serverStats.onlineServers > 0 ? 'Operativi' : 'In configurazione'}
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
                  <p className="text-2xl xs:text-3xl font-bold text-gray-900 transition-all duration-500" aria-label={`${serverStats.databaseServers} database configurati`}>
                    {serverStats.databaseServers}
                  </p>
                  {serverStats.databaseServers > 0 && (
                    <span className="text-sm text-green-600 font-medium" aria-hidden="true">attivi</span>
                  )}
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-green-200 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                <Database className="w-6 h-6 text-green-600" />
              </div>
            </div>
            
            <div className="mt-4">
              {serverStats.databaseServers === 0 ? (
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
                  <p className="text-2xl xs:text-3xl font-bold text-gray-900 transition-all duration-500" aria-label={`${servers.reduce((acc, s) => acc + s.storage, 0)} gigabyte di storage utilizzato`}>
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
            <div className="tutorial-server-list grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {servers.map((server, index) => (
                <ServerCard
                  key={server.id}
                  server={server}
                  index={index}
                  getTypeIcon={getTypeIcon}
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                  getStatusText={getStatusText}
                  handleDeleteServer={showDeleteConfirmation}
                />
              ))}
            </div>
          )}
        </div>

        {/* Create Server Modal - 5 Step Configuration */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[95vh] overflow-y-auto transform transition-all duration-300 animate-slide-up">
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Nuovo Servizio</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">Step {currentStep} di 5</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowCreateForm(false)
                      setCurrentStep(1)
                      setNewServer({ 
                        name: '', 
                        type: 'web', 
                        plan: 'basic',
                        os: '',
                        cpu: '2',
                        ram: '4',
                        storage: '50',
                        network: 'standard',
                        security: 'basic'
                      })
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((step) => (
                      <div key={step} className="flex-1">
                        <div className={`h-2 rounded-full transition-all duration-300 ${
                          step <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
                        }`} />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>Tipo</span>
                    <span>OS</span>
                    <span>Risorse</span>
                    <span>Rete</span>
                    <span>Riepilogo</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Step 1: Service Type Selection */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Seleziona il tipo di servizio</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div 
                        onClick={() => setNewServer(prev => ({ ...prev, type: 'web' }))}
                        className={`group p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
                          newServer.type === 'web' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50/50'
                        }`}
                      >
                        <div className="text-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                            <Globe className="w-6 h-6 text-blue-600" />
                          </div>
                          <h5 className="font-medium text-gray-900">Hosting Web</h5>
                          <p className="text-sm text-gray-500 mt-1">Siti web e applicazioni</p>
                        </div>
                      </div>
                      
                      <div 
                        onClick={() => setNewServer(prev => ({ ...prev, type: 'storage' }))}
                        className={`group p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
                          newServer.type === 'storage' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-500 hover:bg-green-50/50'
                        }`}
                      >
                        <div className="text-center">
                          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors">
                            <Cloud className="w-6 h-6 text-green-600" />
                          </div>
                          <h5 className="font-medium text-gray-900">Storage Cloud</h5>
                          <p className="text-sm text-gray-500 mt-1">Archiviazione sicura</p>
                        </div>
                      </div>
                      
                      <div 
                        onClick={() => setNewServer(prev => ({ ...prev, type: 'api' }))}
                        className={`group p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
                          newServer.type === 'api' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-500 hover:bg-purple-50/50'
                        }`}
                      >
                        <div className="text-center">
                          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
                            <Zap className="w-6 h-6 text-purple-600" />
                          </div>
                          <h5 className="font-medium text-gray-900">API Server</h5>
                          <p className="text-sm text-gray-500 mt-1">Servizi scalabili</p>
                        </div>
                      </div>
                      
                      <div 
                        onClick={() => setNewServer(prev => ({ ...prev, type: 'database' }))}
                        className={`group p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
                          newServer.type === 'database' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-500 hover:bg-orange-50/50'
                        }`}
                      >
                        <div className="text-center">
                          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-200 transition-colors">
                            <Database className="w-6 h-6 text-orange-600" />
                          </div>
                          <h5 className="font-medium text-gray-900">Database</h5>
                          <p className="text-sm text-gray-500 mt-1">Gestione dati</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Operating System Selection */}
                 {currentStep === 2 && (
                   <div className="space-y-4">
                     <h4 className="text-lg font-medium text-gray-900 mb-4">Seleziona il sistema operativo</h4>
                     <div className="grid grid-cols-1 gap-3">
                       {['Ubuntu 22.04 LTS', 'CentOS 8', 'Windows Server 2022', 'Debian 11', 'Rocky Linux 9'].map((os) => (
                         <div 
                           key={os}
                           onClick={() => setNewServer(prev => ({ ...prev, os }))}
                           className={`p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                             newServer.os === os ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                           }`}
                         >
                           <div className="flex items-center justify-between">
                             <div className="flex items-center space-x-3">
                               <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                 <span className="text-sm font-mono">{os.split(' ')[0].substring(0, 2).toUpperCase()}</span>
                               </div>
                               <div>
                                 <h5 className="font-medium text-gray-900">{os}</h5>
                                 <p className="text-sm text-gray-500">
                                   {os.includes('Ubuntu') && 'Sistema stabile e user-friendly'}
                                   {os.includes('CentOS') && 'Perfetto per applicazioni enterprise'}
                                   {os.includes('Windows') && 'Compatibilità con tecnologie Microsoft'}
                                   {os.includes('Debian') && 'Leggero e sicuro'}
                                   {os.includes('Rocky') && 'Alternativa enterprise a CentOS'}
                                 </p>
                               </div>
                             </div>
                             <div className={`w-5 h-5 rounded-full border-2 ${
                               newServer.os === os ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                             }`}>
                               {newServer.os === os && (
                                 <div className="w-full h-full rounded-full bg-white scale-50"></div>
                               )}
                             </div>
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}

                 {/* Step 3: Resource Configuration */}
                 {currentStep === 3 && (
                   <div className="space-y-6">
                     <h4 className="text-lg font-medium text-gray-900 mb-4">Configura le risorse</h4>
                     
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       {/* CPU */}
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">CPU (vCores)</label>
                         <select 
                           value={newServer.cpu}
                           onChange={(e) => setNewServer(prev => ({ ...prev, cpu: e.target.value }))}
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         >
                           <option value="1">1 vCore</option>
                           <option value="2">2 vCores</option>
                           <option value="4">4 vCores</option>
                           <option value="8">8 vCores</option>
                           <option value="16">16 vCores</option>
                         </select>
                       </div>

                       {/* RAM */}
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">RAM (GB)</label>
                         <select 
                           value={newServer.ram}
                           onChange={(e) => setNewServer(prev => ({ ...prev, ram: e.target.value }))}
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         >
                           <option value="2">2 GB</option>
                           <option value="4">4 GB</option>
                           <option value="8">8 GB</option>
                           <option value="16">16 GB</option>
                           <option value="32">32 GB</option>
                           <option value="64">64 GB</option>
                         </select>
                       </div>

                       {/* Storage */}
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">Storage (GB)</label>
                         <select 
                           value={newServer.storage}
                           onChange={(e) => setNewServer(prev => ({ ...prev, storage: e.target.value }))}
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         >
                           <option value="25">25 GB SSD</option>
                           <option value="50">50 GB SSD</option>
                           <option value="100">100 GB SSD</option>
                           <option value="250">250 GB SSD</option>
                           <option value="500">500 GB SSD</option>
                           <option value="1000">1 TB SSD</option>
                         </select>
                       </div>
                     </div>

                     <div className="bg-blue-50 p-4 rounded-lg">
                       <h5 className="font-medium text-blue-900 mb-2">Configurazione selezionata:</h5>
                       <p className="text-sm text-blue-700">
                         {newServer.cpu} vCore{parseInt(newServer.cpu) > 1 ? 's' : ''} • {newServer.ram} GB RAM • {newServer.storage} GB SSD
                       </p>
                     </div>
                   </div>
                 )}

                 {/* Step 4: Network & Security */}
                 {currentStep === 4 && (
                   <div className="space-y-6">
                     <h4 className="text-lg font-medium text-gray-900 mb-4">Rete e sicurezza</h4>
                     
                     <div className="space-y-4">
                       {/* Network Configuration */}
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">Configurazione di rete</label>
                         <div className="space-y-2">
                           {['standard', 'premium', 'dedicated'].map((network) => (
                             <div 
                               key={network}
                               onClick={() => setNewServer(prev => ({ ...prev, network }))}
                               className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                 newServer.network === network ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                               }`}
                             >
                               <div className="flex items-center justify-between">
                                 <div>
                                   <h5 className="font-medium text-gray-900 capitalize">{network}</h5>
                                   <p className="text-sm text-gray-500">
                                     {network === 'standard' && 'Rete condivisa - Perfetta per la maggior parte dei casi'}
                                     {network === 'premium' && 'Rete ottimizzata - Migliori prestazioni'}
                                     {network === 'dedicated' && 'Rete dedicata - Massima sicurezza e controllo'}
                                   </p>
                                 </div>
                                 <div className={`w-4 h-4 rounded-full border-2 ${
                                   newServer.network === network ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                                 }`}>
                                   {newServer.network === network && (
                                     <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                   )}
                                 </div>
                               </div>
                             </div>
                           ))}
                         </div>
                       </div>

                       {/* Security Level */}
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">Livello di sicurezza</label>
                         <div className="space-y-2">
                           {['basic', 'advanced', 'enterprise'].map((security) => (
                             <div 
                               key={security}
                               onClick={() => setNewServer(prev => ({ ...prev, security }))}
                               className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                 newServer.security === security ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                               }`}
                             >
                               <div className="flex items-center justify-between">
                                 <div>
                                   <h5 className="font-medium text-gray-900 capitalize">{security}</h5>
                                   <p className="text-sm text-gray-500">
                                     {security === 'basic' && 'Firewall base e protezione standard'}
                                     {security === 'advanced' && 'DDoS protection e monitoraggio avanzato'}
                                     {security === 'enterprise' && 'Sicurezza enterprise con audit completo'}
                                   </p>
                                 </div>
                                 <div className={`w-4 h-4 rounded-full border-2 ${
                                   newServer.security === security ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                                 }`}>
                                   {newServer.security === security && (
                                     <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                   )}
                                 </div>
                               </div>
                             </div>
                           ))}
                         </div>
                       </div>
                     </div>
                   </div>
                 )}

                 {/* Step 5: Summary and Name */}
                 {currentStep === 5 && (
                   <div className="space-y-6">
                     <h4 className="text-lg font-medium text-gray-900 mb-4">Riepilogo e nome servizio</h4>
                     
                     {/* Service Name */}
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Nome Servizio</label>
                       <input
                         type="text"
                         value={newServer.name}
                         onChange={(e) => {
                           const value = e.target.value;
                           if (value.length <= 10) {
                             setNewServer(prev => ({ ...prev, name: value }));
                           }
                         }}
                         className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                         placeholder="Es. WebServer01"
                         maxLength={10}
                         autoFocus
                       />
                       <div className="text-xs text-gray-500 mt-1">
                         {newServer.name.length}/10 caratteri
                       </div>
                     </div>

                     {/* Configuration Summary */}
                     <div className="bg-gray-50 p-4 rounded-2xl">
                       <h5 className="font-medium text-gray-900 mb-3">Configurazione selezionata:</h5>
                       <div className="space-y-2 text-sm">
                         <div className="flex justify-between">
                           <span className="text-gray-600">Tipo servizio:</span>
                           <span className="font-medium capitalize">{newServer.type}</span>
                         </div>
                         <div className="flex justify-between">
                           <span className="text-gray-600">Sistema operativo:</span>
                           <span className="font-medium">{newServer.os}</span>
                         </div>
                         <div className="flex justify-between">
                           <span className="text-gray-600">Risorse:</span>
                           <span className="font-medium">{newServer.cpu} vCore, {newServer.ram} GB RAM, {newServer.storage} GB SSD</span>
                         </div>
                         <div className="flex justify-between">
                           <span className="text-gray-600">Rete:</span>
                           <span className="font-medium capitalize">{newServer.network}</span>
                         </div>
                         <div className="flex justify-between">
                           <span className="text-gray-600">Sicurezza:</span>
                           <span className="font-medium capitalize">{newServer.security}</span>
                         </div>
                       </div>
                     </div>
                   </div>
                 )}
              </div>

              {/* Footer */}
              <div className="p-4 sm:p-6 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4">
                  {/* Previous Button */}
                  <button
                    onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                    disabled={currentStep === 1}
                    className="flex-1 px-4 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-xl sm:rounded-2xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm sm:text-base"
                  >
                    Indietro
                  </button>
                  
                  {/* Next/Create Button */}
                  {currentStep < 5 ? (
                    <button
                      onClick={() => {
                        // Validation for each step
                        if (currentStep === 1 && !newServer.type) return;
                        if (currentStep === 2 && !newServer.os) return;
                        setCurrentStep(prev => prev + 1);
                      }}
                      disabled={
                        (currentStep === 1 && !newServer.type) ||
                        (currentStep === 2 && !newServer.os)
                      }
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
                    >
                      Avanti
                    </button>
                  ) : (
                    <button
                      onClick={handleCreateServer}
                      disabled={!newServer.name.trim()}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-medium hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
                    >
                      Crea Servizio
                    </button>
                  )}
                </div>
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

// Export the Dashboard component wrapped with AuthGuard
export default function Dashboard() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}