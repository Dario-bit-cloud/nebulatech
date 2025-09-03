'use client';

import { useState } from 'react';
import { Server, Database, Shield, Activity, Plus, Settings, BarChart3, Users, HardDrive, Cpu, MemoryStick, Cloud } from 'lucide-react';
import StatCard from '@/components/StatCard';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [servers, setServers] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newServer, setNewServer] = useState({
    name: '',
    type: 'web',
    plan: 'basic'
  });

  const handleCreateServer = () => {
    if (newServer.name.trim()) {
      const server = {
        id: Date.now(),
        name: newServer.name,
        type: newServer.type,
        plan: newServer.plan,
        status: 'creating',
        cpu: 0,
        memory: 0,
        storage: 0,
        uptime: '0 minuti'
      };
      setServers([...servers, server]);
      setNewServer({ name: '', type: 'web', plan: 'basic' });
      setShowCreateForm(false);
      
      // Simula la creazione del server
      setTimeout(() => {
        setServers(prev => prev.map(s => 
          s.id === server.id ? { ...s, status: 'online' } : s
        ));
      }, 3000);
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Gestisci i tuoi servizi cloud e monitora le prestazioni</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Server Attivi"
            value={servers.filter(s => s.status === 'online').length.toString()}
            icon={Server}
            color="blue"
            className="animate-fade-in-up"
          />
          <StatCard
            title="Database"
            value={servers.filter(s => s.type === 'database').length.toString()}
            icon={Database}
            color="green"
            className="animate-fade-in-up animate-delay-100"
          />
          <StatCard
            title="Storage Totale"
            value="0"
            unit="GB"
            icon={HardDrive}
            color="purple"
            className="animate-fade-in-up animate-delay-200"
          />
          <StatCard
            title="Costo Mensile"
            value="€0"
            icon={BarChart3}
            color="emerald"
            className="animate-fade-in-up animate-delay-300"
          />
        </div>

        {/* Servers List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 animate-fade-in-up animate-delay-400">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">I Tuoi Server</h2>
              <button 
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Crea Server</span>
              </button>
            </div>
          </div>
          <div className="p-6">
            {servers.length === 0 ? (
              <div className="text-center py-12">
                <Cloud className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessun server configurato</h3>
                <p className="text-gray-600 mb-6">Inizia creando il tuo primo server cloud per gestire le tue applicazioni.</p>
                <button 
                  onClick={() => setShowCreateForm(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
                >
                  <Plus className="h-5 w-5" />
                  <span>Crea il tuo primo server</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {servers.map((server) => (
                  <div key={server.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          server.status === 'online' ? 'bg-green-500' :
                          server.status === 'creating' ? 'bg-yellow-500 animate-pulse' :
                          server.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <h3 className="font-semibold text-gray-900">{server.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          server.status === 'online' ? 'bg-green-100 text-green-800' :
                          server.status === 'creating' ? 'bg-yellow-100 text-yellow-800' :
                          server.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {server.status === 'online' ? 'Online' :
                           server.status === 'creating' ? 'Creazione in corso...' :
                           server.status === 'maintenance' ? 'Manutenzione' : 'Offline'}
                        </span>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Settings className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="flex items-center space-x-2">
                        <Cpu className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="text-sm text-gray-600">CPU</p>
                          <p className="font-semibold">{server.cpu}%</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MemoryStick className="h-4 w-4 text-green-500" />
                        <div>
                          <p className="text-sm text-gray-600">Memoria</p>
                          <p className="font-semibold">{server.memory}%</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <HardDrive className="h-4 w-4 text-purple-500" />
                        <div>
                          <p className="text-sm text-gray-600">Storage</p>
                          <p className="font-semibold">{server.storage}%</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Activity className="h-4 w-4 text-emerald-500" />
                        <div>
                          <p className="text-sm text-gray-600">Uptime</p>
                          <p className="font-semibold">{server.uptime}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Create Server Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Crea Nuovo Server</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome Server</label>
                  <input
                    type="text"
                    value={newServer.name}
                    onChange={(e) => setNewServer({...newServer, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="es. Web Server 01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Server</label>
                  <select
                    value={newServer.type}
                    onChange={(e) => setNewServer({...newServer, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="web">Web Server</option>
                    <option value="database">Database Server</option>
                    <option value="storage">Storage Server</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Piano</label>
                  <select
                    value={newServer.plan}
                    onChange={(e) => setNewServer({...newServer, plan: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="basic">Basic - €9.99/mese</option>
                    <option value="pro">Pro - €19.99/mese</option>
                    <option value="enterprise">Enterprise - €49.99/mese</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Annulla
                </button>
                <button
                  onClick={handleCreateServer}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Crea Server
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}