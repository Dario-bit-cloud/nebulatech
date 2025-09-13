'use client'

import { useState, useEffect } from 'react'
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Activity, 
  Server, 
  Database, 
  Globe, 
  Shield, 
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Calendar,
  AlertCircle
} from 'lucide-react'

interface ServiceStatus {
  id: string
  name: string
  description: string
  status: 'operational' | 'degraded' | 'outage'
  uptime: number
  responseTime: number
  icon: any
  lastIncident?: string
  location: string
}

interface Incident {
  id: string
  title: string
  description: string
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved'
  severity: 'low' | 'medium' | 'high' | 'critical'
  startTime: string
  endTime?: string
  affectedServices: string[]
}

interface UptimeData {
  date: string
  uptime: number
  status: 'operational' | 'degraded' | 'outage'
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'operational':
      return 'text-green-600 bg-green-100'
    case 'degraded':
      return 'text-yellow-600 bg-yellow-100'
    case 'outage':
      return 'text-red-600 bg-red-100'

    default:
      return 'text-gray-600 bg-gray-100'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'operational':
      return <CheckCircle className="w-5 h-5 text-green-600" />
    case 'degraded':
      return <AlertTriangle className="w-5 h-5 text-yellow-600" />
    case 'outage':
      return <XCircle className="w-5 h-5 text-red-600" />

    default:
      return <CheckCircle className="w-5 h-5 text-gray-600" />
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'operational':
      return 'Operativo'
    case 'degraded':
      return 'Prestazioni Ridotte'
    case 'outage':
      return 'Fuori Servizio'

    default:
      return 'Sconosciuto'
  }
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'low':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export default function StatusPage() {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      id: 'compute',
      name: 'Cloud Compute',
      description: 'Istanze virtuali e container',
      status: 'operational',
      uptime: 99.2,
      responseTime: 245,
      icon: Server,
      lastIncident: '15 giorni fa',
      location: 'Milano'
    },
    {
      id: 'storage',
      name: 'Cloud Storage',
      description: 'Archiviazione oggetti e file',
      status: 'operational',
      uptime: 99.8,
      responseTime: 189,
      icon: Database,
      lastIncident: '32 giorni fa',
      location: 'Roma'
    },
    {
      id: 'network',
      name: 'Rete Globale',
      description: 'CDN e bilanciamento del carico',
      status: 'degraded',
      uptime: 97.5,
      responseTime: 312,
      icon: Globe,
      lastIncident: '2 ore fa',
      location: 'Europa'
    },
    {
      id: 'security',
      name: 'Servizi di Sicurezza',
      description: 'Firewall e protezione DDoS',
      status: 'operational',
      uptime: 99.1,
      responseTime: 156,
      icon: Shield,
      lastIncident: '8 giorni fa',
      location: 'Globale'
    },
    {
      id: 'api',
      name: 'API Gateway',
      description: 'Endpoint API e autenticazione',
      status: 'operational',
      uptime: 98.9,
      responseTime: 203,
      icon: Zap,
      lastIncident: '5 giorni fa',
      location: 'Milano'
    },

  ])

  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: '1',
      title: 'Latenza elevata nella rete globale',
      description: 'Stiamo riscontrando latenza elevata in alcune regioni europee. Il team sta investigando la causa e implementando soluzioni temporanee.',
      status: 'monitoring',
      severity: 'medium',
      startTime: '2024-01-15 14:30',
      affectedServices: ['network']
    },

  ])

  const [currentTime, setCurrentTime] = useState(new Date())
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Generate uptime history for the last 90 days
  const [uptimeHistory] = useState<UptimeData[]>(() => {
    const history: UptimeData[] = []
    for (let i = 89; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const uptime = Math.random() > 0.1 ? 
        (Math.random() > 0.05 ? 100 : Math.random() * 20 + 80) : 
        Math.random() * 60 + 20
      
      history.push({
        date: date.toISOString().split('T')[0],
        uptime,
        status: uptime > 99 ? 'operational' : uptime > 80 ? 'degraded' : 'outage'
      })
    }
    return history
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      
      // Simulate random response time updates
      setServices(prev => prev.map(service => ({
        ...service,
        responseTime: Math.max(50, service.responseTime + (Math.random() - 0.5) * 20)
      })))
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLastUpdate(new Date())
    setIsRefreshing(false)
  }

  const overallStatus = services.every(s => s.status === 'operational') 
    ? 'operational' 
    : services.some(s => s.status === 'outage') 
    ? 'outage' 
    : 'degraded'

  const averageUptime = services.reduce((acc, service) => acc + service.uptime, 0) / services.length
  const averageResponseTime = services.reduce((acc, service) => acc + service.responseTime, 0) / services.length

  const getOverallStatusMessage = () => {
    switch (overallStatus) {
      case 'operational':
        return 'Tutti i sistemi sono operativi'
      case 'degraded':
        return 'Alcuni servizi hanno prestazioni ridotte'
      case 'outage':
        return 'Alcuni servizi sono attualmente non disponibili'
      default:
        return 'Stato dei servizi in aggiornamento'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-24 pb-12 overflow-x-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="mb-6">
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(overallStatus)}`}>
              {getStatusIcon(overallStatus)}
              <span>{getOverallStatusMessage()}</span>
            </div>
          </div>
          <h1 className="text-3xl xs:text-4xl md:text-5xl font-bold gradient-text mb-4">
            Status Servizi
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Monitoraggio in tempo reale dello stato dei nostri servizi cloud e infrastruttura
          </p>
          
          {/* Last Update Info */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Ultimo aggiornamento: {lastUpdate.toLocaleTimeString('it-IT')}</span>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Aggiornamento...' : 'Aggiorna'}</span>
            </button>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card p-6 hover-lift animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Uptime Medio</p>
                <p className="text-2xl xs:text-3xl font-bold text-gray-900">
                  {averageUptime.toFixed(1)}%
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">Eccellente</span>
            </div>
          </div>

          <div className="card p-6 hover-lift animate-fade-in-up animation-delay-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Tempo di Risposta</p>
                <p className="text-2xl xs:text-3xl font-bold text-gray-900">
                  {Math.round(averageResponseTime)}
                  <span className="text-lg text-gray-600 ml-1">ms</span>
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Minus className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-gray-600">Media globale</span>
            </div>
          </div>

          <div className="card p-6 hover-lift animate-fade-in-up animation-delay-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Servizi Attivi</p>
                <p className="text-2xl xs:text-3xl font-bold text-gray-900">
                  {services.filter(s => s.status === 'operational').length}/{services.length}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <Server className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">Operativi</span>
            </div>
          </div>

          <div className="card p-6 hover-lift animate-fade-in-up animation-delay-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Incidenti Attivi</p>
                <p className="text-2xl xs:text-3xl font-bold text-gray-900">
                  {incidents.filter(i => i.status !== 'resolved').length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-xl">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <AlertTriangle className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-yellow-600 font-medium">In monitoraggio</span>
            </div>
          </div>
        </div>

        {/* Services Status */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 animate-fade-in-up">
            Stato dei Servizi
          </h2>
          
          <div className="space-y-4">
            {services.map((service, index) => {
              const IconComponent = service.icon
              return (
                <div 
                  key={service.id} 
                  className="card p-6 hover-lift animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start space-x-4 mb-4 lg:mb-0">
                      <div className="bg-blue-100 p-3 rounded-xl flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(service.status)} mt-2 sm:mt-0`}>
                            {getStatusIcon(service.status)}
                            <span>{getStatusText(service.status)}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-3">{service.description}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>Uptime: {service.uptime}%</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Activity className="w-4 h-4" />
                            <span>Risposta: {Math.round(service.responseTime)}ms</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Globe className="w-4 h-4" />
                            <span>Regione: {service.location}</span>
                          </div>
                          {service.lastIncident && (
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>Ultimo incidente: {service.lastIncident}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Uptime History */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 animate-fade-in-up">
            Storico Uptime (90 giorni)
          </h2>
          
          <div className="card p-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Operativo</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Prestazioni Ridotte</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Fuori Servizio</span>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                90 giorni fa ← → Oggi
              </div>
            </div>
            
            <div className="grid grid-cols-15 xs:grid-cols-30 sm:grid-cols-45 lg:grid-cols-90 gap-1">
              {uptimeHistory.map((day, index) => {
                const color = day.status === 'operational' ? 'bg-green-500' : 
                            day.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                return (
                  <div
                    key={index}
                    className={`aspect-square rounded-sm ${color} hover:scale-110 transition-transform cursor-pointer`}
                    title={`${day.date}: ${day.uptime.toFixed(1)}% uptime`}
                  ></div>
                )
              })}
            </div>
            
            <div className="mt-4 text-center text-sm text-gray-600">
              Uptime medio degli ultimi 90 giorni: {(uptimeHistory.reduce((acc, day) => acc + day.uptime, 0) / uptimeHistory.length).toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Current Incidents */}
        {incidents.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 animate-fade-in-up">
              Incidenti Attuali
            </h2>
            
            <div className="space-y-4">
              {incidents.map((incident, index) => (
                <div 
                  key={incident.id} 
                  className="card p-6 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0">
                          {incident.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(incident.severity)}`}>
                            {incident.severity.toUpperCase()}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200 capitalize">
                            {incident.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{incident.description}</p>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Iniziato: {incident.startTime}</span>
                        </div>
                        {incident.affectedServices.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <Server className="w-4 h-4" />
                            <span>Servizi interessati: {incident.affectedServices.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subscribe to Updates */}
        <div className="text-center animate-fade-in-up">
          <div className="card p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Rimani Aggiornato
            </h3>
            <p className="text-gray-600 mb-6">
              Ricevi notifiche in tempo reale sullo stato dei nostri servizi
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <input
                type="email"
                placeholder="La tua email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="btn btn-primary px-6 py-3">
                Iscriviti
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}