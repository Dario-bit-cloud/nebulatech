'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Clock, Activity, Server, Database, Globe, Shield, Zap } from 'lucide-react';
import StatCard from '@/components/StatCard';
import PageHero from '@/components/PageHero';

interface ServiceStatus {
  id: string;
  name: string;
  description: string;
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  uptime: number;
  responseTime: number;
  icon: any;
  lastIncident?: string;
}

interface Incident {
  id: string;
  title: string;
  description: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  severity: 'low' | 'medium' | 'high' | 'critical';
  startTime: string;
  endTime?: string;
  affectedServices: string[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'operational':
      return 'text-green-600 bg-green-100';
    case 'degraded':
      return 'text-yellow-600 bg-yellow-100';
    case 'outage':
      return 'text-red-600 bg-red-100';
    case 'maintenance':
      return 'text-blue-600 bg-blue-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'operational':
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    case 'degraded':
      return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    case 'outage':
      return <XCircle className="w-5 h-5 text-red-600" />;
    case 'maintenance':
      return <Clock className="w-5 h-5 text-blue-600" />;
    default:
      return <CheckCircle className="w-5 h-5 text-gray-600" />;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'operational':
      return 'Operativo';
    case 'degraded':
      return 'Prestazioni Ridotte';
    case 'outage':
      return 'Fuori Servizio';
    case 'maintenance':
      return 'Manutenzione';
    default:
      return 'Sconosciuto';
  }
};

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
      lastIncident: '15 giorni fa'
    },
    {
      id: 'storage',
      name: 'Cloud Storage',
      description: 'Archiviazione oggetti e file',
      status: 'operational',
      uptime: 98.8,
      responseTime: 189,
      icon: Database,
      lastIncident: '32 giorni fa'
    },
    {
      id: 'network',
      name: 'Rete Globale',
      description: 'CDN e bilanciamento del carico',
      status: 'degraded',
      uptime: 97.5,
      responseTime: 312,
      icon: Globe,
      lastIncident: '2 ore fa'
    },
    {
      id: 'security',
      name: 'Servizi di Sicurezza',
      description: 'Firewall e protezione DDoS',
      status: 'operational',
      uptime: 99.1,
      responseTime: 156,
      icon: Shield,
      lastIncident: '8 giorni fa'
    },
    {
      id: 'api',
      name: 'API Gateway',
      description: 'Endpoint API e autenticazione',
      status: 'operational',
      uptime: 98.9,
      responseTime: 203,
      icon: Zap,
      lastIncident: '5 giorni fa'
    },
    {
      id: 'monitoring',
      name: 'Sistema di Monitoraggio',
      description: 'Metriche e alerting',
      status: 'maintenance',
      uptime: 95.2,
      responseTime: 445,
      icon: Activity,
      lastIncident: 'In corso'
    }
  ]);

  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: '1',
      title: 'Latenza elevata nella rete globale',
      description: 'Stiamo riscontrando latenza elevata in alcune regioni europee. Il team sta investigando.',
      status: 'monitoring',
      severity: 'medium',
      startTime: '2024-01-15 14:30',
      affectedServices: ['network']
    },
    {
      id: '2',
      title: 'Manutenzione programmata sistema di monitoraggio',
      description: 'Manutenzione programmata per aggiornamenti di sicurezza. Durata stimata: 2 ore.',
      status: 'identified',
      severity: 'low',
      startTime: '2024-01-15 12:00',
      affectedServices: ['monitoring']
    }
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Simula aggiornamenti casuali dei tempi di risposta
      setServices(prev => prev.map(service => ({
        ...service,
        responseTime: service.responseTime + (Math.random() - 0.5) * 10
      })));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const overallStatus = services.every(s => s.status === 'operational') 
    ? 'operational' 
    : services.some(s => s.status === 'outage') 
    ? 'outage' 
    : 'degraded';

  const averageUptime = services.reduce((acc, service) => acc + service.uptime, 0) / services.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <PageHero
        title="Status Servizi"
        subtitle="Monitoraggio in tempo reale dello stato dei nostri servizi cloud"
        backgroundGradient="from-blue-600 to-purple-600"
      />

      {/* Overall Stats */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Uptime Medio"
              value="99.2"
              unit="%"
              icon={<CheckCircle className="w-6 h-6 text-green-600" />}
              color="text-green-600"
              description="Ultimi 30 giorni"
              className="animate-fade-in-up"
            />
            
            <StatCard
              title="Servizi Attivi"
              value="4/6"
              icon={<Activity className="w-6 h-6 text-blue-600" />}
              color="text-blue-600"
              description="Completamente operativi"
              className="animate-fade-in-up animation-delay-200"
            />
            
            <StatCard
              title="Tempo Risposta"
              value="245"
              unit="ms"
              icon={<Clock className="w-6 h-6 text-purple-600" />}
              color="text-purple-600"
              description="Tempo medio globale"
              className="animate-fade-in-up animation-delay-400"
            />
          </div>
        </div>
      </div>

      {/* Services Status */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Stato dei Servizi</h2>
        
        <div className="space-y-4">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <div key={service.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <IconComponent className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{service.name}</h3>
                      <p className="text-sm text-gray-600">{service.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Uptime</div>
                      <div className="font-semibold text-gray-900">{service.uptime.toFixed(2)}%</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Tempo Risposta</div>
                      <div className="font-semibold text-gray-900">{Math.round(service.responseTime)}ms</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Ultimo Incidente</div>
                      <div className="font-semibold text-gray-900">{service.lastIncident}</div>
                    </div>
                    
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(service.status)}`}>
                      {getStatusIcon(service.status)}
                      <span>{getStatusText(service.status)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Incidents */}
      {incidents.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Incidenti Attuali</h2>
          
          <div className="space-y-4">
            {incidents.map((incident) => (
              <div key={incident.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{incident.title}</h3>
                    <p className="text-gray-600 mb-3">{incident.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Iniziato: {incident.startTime}</span>
                      <span>Servizi interessati: {incident.affectedServices.join(', ')}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      incident.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      incident.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                      incident.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {incident.severity === 'critical' ? 'Critico' :
                       incident.severity === 'high' ? 'Alto' :
                       incident.severity === 'medium' ? 'Medio' : 'Basso'}
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      incident.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      incident.status === 'monitoring' ? 'bg-blue-100 text-blue-800' :
                      incident.status === 'identified' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {incident.status === 'resolved' ? 'Risolto' :
                       incident.status === 'monitoring' ? 'Monitoraggio' :
                       incident.status === 'identified' ? 'Identificato' : 'Investigazione'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historical Data */}
      <div className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Cronologia Uptime (Ultimi 90 giorni)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const IconComponent = service.icon;
              // Simula dati storici
              const historicalData = Array.from({ length: 90 }, (_, i) => ({
                day: i,
                uptime: Math.random() > 0.05 ? 100 : Math.random() * 100
              }));
              
              return (
                <div key={service.id} className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <IconComponent className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">{service.name}</h3>
                  </div>
                  
                  <div className="grid grid-cols-30 gap-1 mb-4">
                    {historicalData.slice(-30).map((day, index) => (
                      <div
                        key={index}
                        className={`h-3 rounded-sm ${
                          day.uptime === 100 ? 'bg-green-500' :
                          day.uptime > 95 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        title={`Giorno ${day.day}: ${day.uptime.toFixed(1)}% uptime`}
                      />
                    ))}
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>30 giorni fa</span>
                      <span>Oggi</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex items-center justify-center gap-6 mt-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-sm" />
              <span>100% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-sm" />
              <span>95-99% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-sm" />
              <span>&lt;95% Uptime</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subscribe to Updates */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Rimani Aggiornato sullo Stato dei Servizi
          </h2>
          <p className="text-blue-100 mb-6">
            Iscriviti per ricevere notifiche in tempo reale su incidenti e manutenzioni
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="la-tua-email@esempio.com"
              className="flex-1 px-4 py-2 rounded-lg border-0 focus:ring-2 focus:ring-white"
            />
            <button
              onClick={() => alert('Iscrizione alle notifiche non implementata in questa demo')}
              className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Iscriviti
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}