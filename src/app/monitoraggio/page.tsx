'use client';

import { useState, useEffect } from 'react';
import StatCard from '@/components/StatCard';

interface ServerMetrics {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'warning' | 'offline';
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  uptime: number;
  responseTime: number;
  lastUpdate: Date;
}

interface AlertItem {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  server: string;
  timestamp: Date;
}

export default function Monitoraggio() {
  const [servers, setServers] = useState<ServerMetrics[]>([
    {
      id: 'srv-001',
      name: 'Web Server EU-West',
      location: 'Amsterdam, NL',
      status: 'online',
      cpu: 45,
      memory: 62,
      disk: 38,
      network: 23,
      uptime: 99.98,
      responseTime: 120,
      lastUpdate: new Date()
    },
    {
      id: 'srv-002',
      name: 'Database Server US-East',
      location: 'New York, US',
      status: 'online',
      cpu: 78,
      memory: 84,
      disk: 45,
      network: 67,
      uptime: 99.95,
      responseTime: 89,
      lastUpdate: new Date()
    },
    {
      id: 'srv-003',
      name: 'CDN Node Asia',
      location: 'Singapore, SG',
      status: 'warning',
      cpu: 92,
      memory: 76,
      disk: 23,
      network: 45,
      uptime: 99.87,
      responseTime: 156,
      lastUpdate: new Date()
    },
    {
      id: 'srv-004',
      name: 'Backup Server EU-Central',
      location: 'Frankfurt, DE',
      status: 'online',
      cpu: 34,
      memory: 45,
      disk: 67,
      network: 12,
      uptime: 99.99,
      responseTime: 98,
      lastUpdate: new Date()
    }
  ]);

  const [alerts] = useState<AlertItem[]>([
    {
      id: 'alert-001',
      type: 'warning',
      message: 'CPU usage elevato (>90%)',
      server: 'CDN Node Asia',
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: 'alert-002',
      type: 'info',
      message: 'Backup completato con successo',
      server: 'Backup Server EU-Central',
      timestamp: new Date(Date.now() - 600000)
    },
    {
      id: 'alert-003',
      type: 'error',
      message: 'Connessione database temporaneamente interrotta',
      server: 'Database Server US-East',
      timestamp: new Date(Date.now() - 1800000)
    }
  ]);

  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  // Simula aggiornamento dati in tempo reale
  useEffect(() => {
    if (!isAutoRefresh) return;

    const interval = setInterval(() => {
      setServers(prevServers => 
        prevServers.map(server => ({
          ...server,
          cpu: Math.max(10, Math.min(95, server.cpu + (Math.random() - 0.5) * 15)),
          memory: Math.max(20, Math.min(90, server.memory + (Math.random() - 0.5) * 10)),
          disk: Math.max(10, Math.min(80, server.disk + (Math.random() - 0.5) * 5)),
          network: Math.max(5, Math.min(80, server.network + (Math.random() - 0.5) * 20)),
          responseTime: Math.max(50, Math.min(300, server.responseTime + (Math.random() - 0.5) * 30)),
          status: server.cpu > 90 ? 'warning' : server.cpu > 95 ? 'offline' : 'online',
          lastUpdate: new Date()
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoRefresh]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'offline': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return '🟢';
      case 'warning': return '🟡';
      case 'offline': return '🔴';
      default: return '⚪';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error': return 'border-l-red-500 bg-red-50';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'info': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📋';
    }
  };

  const MetricCard = ({ title, value, unit, status }: {
    title: string;
    value: number;
    unit: string;
    status: 'good' | 'warning' | 'critical';
  }) => {
    const statusColors = {
      good: 'text-green-600',
      warning: 'text-yellow-600',
      critical: 'text-red-600'
    };

    return (
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium text-gray-600">{title}</h4>
          <span className={`text-lg font-bold ${statusColors[status]}`}>
            {value}{unit}
          </span>
        </div>
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                status === 'good' ? 'bg-green-500' :
                status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(100, value)}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 1) return 'Ora';
    if (diffMins < 60) return `${diffMins}m fa`;
    if (diffHours < 24) return `${diffHours}h fa`;
    return `${Math.floor(diffHours / 24)}g fa`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Monitoraggio Server</h1>
            <p className="text-gray-600 mt-1">Stato in tempo reale dell&apos;infrastruttura NebulaTech</p>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="1h">Ultima ora</option>
              <option value="6h">Ultime 6 ore</option>
              <option value="24h">Ultime 24 ore</option>
              <option value="7d">Ultimi 7 giorni</option>
            </select>
            <button
              onClick={() => setIsAutoRefresh(!isAutoRefresh)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isAutoRefresh 
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {isAutoRefresh ? '🔄 Auto-refresh ON' : '⏸️ Auto-refresh OFF'}
            </button>
          </div>
        </div>

        {/* Panoramica Generale */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Server Attivi"
            value={`${servers.filter(s => s.status === 'online').length}/${servers.length}`}
            icon={<span>🖥️</span>}
            color="text-green-600"
            className="animate-fade-in-up"
          />
          
          <StatCard
            title="Uptime Medio"
            value={(servers.reduce((acc, s) => acc + s.uptime, 0) / servers.length).toFixed(2)}
            unit="%"
            icon={<span>⚡</span>}
            color="text-blue-600"
            className="animate-fade-in-up animation-delay-200"
          />
          
          <StatCard
            title="Response Time"
            value={Math.round(servers.reduce((acc, s) => acc + s.responseTime, 0) / servers.length)}
            unit="ms"
            icon={<span>⏱️</span>}
            color="text-purple-600"
            className="animate-fade-in-up animation-delay-400"
          />
          
          <StatCard
            title="Allerte Attive"
            value={alerts.filter(a => a.type === 'error' || a.type === 'warning').length}
            icon={<span>🚨</span>}
            color="text-orange-600"
            className="animate-fade-in-up animation-delay-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista Server */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Server Status</h3>
              <div className="space-y-6">
                {servers.map((server) => (
                  <div key={server.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-gray-900">{server.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(server.status)}`}>
                            {getStatusIcon(server.status)} {server.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{server.location}</p>
                        <p className="text-xs text-gray-500">Ultimo aggiornamento: {formatTimeAgo(server.lastUpdate)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">Uptime: {server.uptime}%</p>
                        <p className="text-sm text-gray-600">{server.responseTime}ms</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <MetricCard 
                        title="CPU" 
                        value={Math.round(server.cpu)} 
                        unit="%" 
                        status={server.cpu > 80 ? 'critical' : server.cpu > 60 ? 'warning' : 'good'}
                      />
                      <MetricCard 
                        title="Memory" 
                        value={Math.round(server.memory)} 
                        unit="%" 
                        status={server.memory > 85 ? 'critical' : server.memory > 70 ? 'warning' : 'good'}
                      />
                      <MetricCard 
                        title="Disk" 
                        value={Math.round(server.disk)} 
                        unit="%" 
                        status={server.disk > 90 ? 'critical' : server.disk > 75 ? 'warning' : 'good'}
                      />
                      <MetricCard 
                        title="Network" 
                        value={Math.round(server.network)} 
                        unit="%" 
                        status={server.network > 80 ? 'critical' : server.network > 60 ? 'warning' : 'good'}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pannello Allerte */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Allerte Recenti</h3>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`border-l-4 p-4 rounded-r-lg ${getAlertColor(alert.type)}`}>
                    <div className="flex items-start space-x-3">
                      <span className="text-lg">{getAlertIcon(alert.type)}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                        <p className="text-xs text-gray-600 mt-1">{alert.server}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(alert.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-6 text-blue-600 hover:text-blue-800 text-sm font-medium border border-blue-200 rounded-lg py-2 hover:bg-blue-50 transition-colors">
                Visualizza Tutte le Allerte →
              </button>
            </div>

            {/* Azioni Rapide */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Azioni Rapide</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  🔄 Riavvia Tutti i Server
                </button>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm">
                  💾 Backup Immediato
                </button>

                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm">
                  📊 Report Dettagliato
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}