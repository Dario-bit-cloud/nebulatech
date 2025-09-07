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
  Clock,
  Zap,
  Globe,
  Eye,
  Loader
} from 'lucide-react'

interface Server {
  id: number
  name: string
  type: 'web' | 'database' | 'storage' | 'api'
  plan: 'basic' | 'pro' | 'enterprise'
  status: 'online' | 'offline' | 'creating' | 'maintenance' | 'demo' | 'initializing'
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
  const [newServer, setNewServer] = useState({
    name: '',
    type: 'web' as const,
    plan: 'basic' as const
  })
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

  const handleDeleteServer = (serverId: number) => {
    const updatedServers = servers.filter(server => server.id !== serverId)
    setServers(updatedServers)
    saveServersToStorage(updatedServers)
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
      case 'maintenance': return 'text-orange-600 bg-orange-100'
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
      case 'maintenance': return <Settings className="w-4 h-4" />
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
      case 'maintenance': return 'Manutenzione'
      case 'demo': return 'Demo'
      case 'initializing': return 'Avvio in corso...'
      default: return 'Sconosciuto'
    }
  }

  const getTypeIcon = (type: Server['type']) => {
    switch (type) {
      case 'web': return <Globe className="w-5 h-5" />
      case 'database': return <Database className="w-5 h-5" />
      case 'storage': return <HardDrive className="w-5 h-5" />
      case 'api': return <Zap className="w-5 h-5" />
      default: return <Server className="w-5 h-5" />
    }
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
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="btn btn-primary flex items-center space-x-2 hover-lift"
                >
                  <Plus className="w-5 h-5" />
                  <span>Nuovo Server</span>
                </button>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 hover-lift animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Server Attivi</p>
                <p className="text-3xl font-bold text-gray-900">
                  {servers.filter(s => s.status === 'online').length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <Server className="w-6 h-6 text-blue-600" />
              </div>
            </div>

          </div>

          <div className="card p-6 hover-lift animate-fade-in-up animation-delay-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Database</p>
                <p className="text-3xl font-bold text-gray-900">
                  {servers.filter(s => s.type === 'database').length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <Database className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">Tutti online</span>
            </div>
          </div>

          <div className="card p-6 hover-lift animate-fade-in-up animation-delay-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Storage Totale</p>
                <p className="text-3xl font-bold text-gray-900">
                  {servers.reduce((acc, s) => acc + s.storage, 0)}
                  <span className="text-lg text-gray-600 ml-1">GB</span>
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <HardDrive className="w-6 h-6 text-purple-600" />
              </div>
            </div>

          </div>

          <div className="card p-6 hover-lift animate-fade-in-up animation-delay-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Uptime Medio</p>
                <p className="text-3xl font-bold text-gray-900">
                  {servers.length > 0 ? '99.9%' : 'N/A'}
                </p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-xl">
                <Shield className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            {servers.length > 0 && (
              <div className="mt-4 flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600 font-medium">Eccellente</span>
              </div>
            )}
          </div>
        </div>

        {/* Servers Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 animate-fade-in-up">
            I Tuoi Server
          </h2>
          
          {servers.length === 0 ? (
            <div className="card p-12 text-center animate-fade-in-up">
              <Cloud className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nessun server configurato
              </h3>
              <p className="text-gray-600 mb-6">
                Inizia creando il tuo primo server cloud
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="btn btn-primary"
              >
                Crea il tuo primo server
              </button>
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
                      Piano {server.plan} - Storage fisso
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <span>Uptime: {server.uptime}</span>
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
                            onClick={() => handleDeleteServer(server.id)}
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
                          onClick={() => handleDeleteServer(server.id)}
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
            <div className="glass rounded-2xl p-6 w-full max-w-md animate-scale-in">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Crea Nuovo Server</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome Server
                  </label>
                  <input
                    type="text"
                    value={newServer.name}
                    onChange={(e) => setNewServer(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Es. Web Server Produzione"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipo Server
                  </label>
                  <select
                    value={newServer.type}
                    onChange={(e) => setNewServer(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="web">Web Server</option>
                    <option value="database">Database</option>
                    <option value="storage">Storage</option>
                    <option value="api">API Server</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Piano
                  </label>
                  <select
                    value={newServer.plan}
                    onChange={(e) => setNewServer(prev => ({ ...prev, plan: e.target.value as any }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="basic">Basic - €9.99/mese (50 GB storage)</option>
                    <option value="pro">Pro - €29.99/mese (200 GB storage)</option>
                    <option value="enterprise">Enterprise - €99.99/mese (1 TB storage)</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="btn btn-secondary flex-1"
                >
                  Annulla
                </button>
                <button
                  onClick={handleCreateServer}
                  className="btn btn-primary flex-1"
                  disabled={!newServer.name.trim()}
                >
                  Crea Server
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}