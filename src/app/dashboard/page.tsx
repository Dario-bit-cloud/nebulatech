'use client';

import { useState, useEffect } from 'react';

interface ServerStats {
  cpu: number;
  memory: number;
  storage: number;
  network: number;
}

interface ServiceMetrics {
  uptime: string;
  requests: number;
  bandwidth: string;
  activeUsers: number;
}

export default function Dashboard() {
  const [serverStats, setServerStats] = useState<ServerStats>({
    cpu: 45,
    memory: 62,
    storage: 38,
    network: 23
  });

  const [metrics, setMetrics] = useState<ServiceMetrics>({
    uptime: '99.98%',
    requests: 1247893,
    bandwidth: '2.4 TB',
    activeUsers: 1834
  });

  const [isLoading, setIsLoading] = useState(true);

  // Simula aggiornamento dati in tempo reale
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    
    const interval = setInterval(() => {
      setServerStats(prev => ({
        cpu: Math.max(20, Math.min(80, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(30, Math.min(90, prev.memory + (Math.random() - 0.5) * 8)),
        storage: Math.max(20, Math.min(70, prev.storage + (Math.random() - 0.5) * 5)),
        network: Math.max(10, Math.min(60, prev.network + (Math.random() - 0.5) * 15))
      }));
      
      setMetrics(prev => ({
        ...prev,
        requests: prev.requests + Math.floor(Math.random() * 50),
        activeUsers: Math.max(1500, Math.min(2500, prev.activeUsers + Math.floor((Math.random() - 0.5) * 100)))
      }));
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const StatCard = ({ title, value, unit, color, icon }: {
    title: string;
    value: number | string;
    unit?: string;
    color: string;
    icon: string;
  }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`text-2xl font-bold ${color} mt-1`}>
            {value}{unit && <span className="text-lg">{unit}</span>}
          </p>
        </div>
        <div className={`text-3xl ${color}`}>{icon}</div>
      </div>
    </div>
  );

  const ProgressBar = ({ label, value, color }: {
    label: string;
    value: number;
    color: string;
  }) => (
    <div className="mb-4">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-500">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Benvenuto nel tuo pannello di controllo NebulaTech</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                🟢 Tutti i servizi operativi
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Aggiorna
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metriche principali */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Uptime" 
            value={metrics.uptime} 
            color="text-green-600" 
            icon="⚡" 
          />
          <StatCard 
            title="Richieste Totali" 
            value={metrics.requests.toLocaleString()} 
            color="text-blue-600" 
            icon="📊" 
          />
          <StatCard 
            title="Bandwidth Utilizzata" 
            value={metrics.bandwidth} 
            color="text-purple-600" 
            icon="🌐" 
          />
          <StatCard 
            title="Utenti Attivi" 
            value={metrics.activeUsers.toLocaleString()} 
            color="text-orange-600" 
            icon="👥" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Utilizzo Risorse Server */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Utilizzo Risorse Server</h3>
            <ProgressBar label="CPU" value={Math.round(serverStats.cpu)} color="bg-blue-500" />
            <ProgressBar label="Memoria RAM" value={Math.round(serverStats.memory)} color="bg-green-500" />
            <ProgressBar label="Storage" value={Math.round(serverStats.storage)} color="bg-yellow-500" />
            <ProgressBar label="Rete" value={Math.round(serverStats.network)} color="bg-purple-500" />
          </div>

          {/* Attività Recente */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Attività Recente</h3>
            <div className="space-y-4">
              {[
                { time: '2 min fa', action: 'Backup automatico completato', status: 'success' },
                { time: '15 min fa', action: 'Nuovo utente registrato', status: 'info' },
                { time: '1 ora fa', action: 'Aggiornamento sicurezza installato', status: 'success' },
                { time: '3 ore fa', action: 'Picco di traffico gestito', status: 'warning' },
                { time: '6 ore fa', action: 'Manutenzione programmata completata', status: 'success' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Servizi Attivi */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">I Tuoi Servizi Attivi</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Cloud Hosting Pro', status: 'Attivo', usage: '45%', color: 'green' },
              { name: 'Storage Avanzato', status: 'Attivo', usage: '62%', color: 'green' },
              { name: 'CDN Globale', status: 'Attivo', usage: '28%', color: 'green' }
            ].map((service, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-gray-900">{service.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    service.color === 'green' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {service.status}
                  </span>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Utilizzo</span>
                    <span>{service.usage}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: service.usage }}
                    ></div>
                  </div>
                </div>
                <button className="w-full mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Gestisci Servizio →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}