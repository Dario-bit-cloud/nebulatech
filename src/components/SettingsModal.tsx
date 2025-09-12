'use client'

import React, { useState, useEffect } from 'react'
import { X, Settings, Moon, Sun, Globe, Shield, Bell, Eye, Database, Download, Trash2, Save, Check } from 'lucide-react'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

interface UserSettings {
  theme: 'light' | 'dark' | 'system'
  language: 'it' | 'en' | 'es' | 'fr'
  notifications: {
    email: boolean
    push: boolean
    marketing: boolean
    security: boolean
  }
  privacy: {
    analytics: boolean
    cookies: boolean
    dataSharing: boolean
  }
  dashboard: {
    autoRefresh: boolean
    refreshInterval: number
    compactView: boolean
    showMetrics: boolean
  }
}

const defaultSettings: UserSettings = {
  theme: 'system',
  language: 'it',
  notifications: {
    email: true,
    push: true,
    marketing: false,
    security: true
  },
  privacy: {
    analytics: true,
    cookies: true,
    dataSharing: false
  },
  dashboard: {
    autoRefresh: true,
    refreshInterval: 30,
    compactView: false,
    showMetrics: true
  }
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Carica impostazioni dal localStorage
      const savedSettings = localStorage.getItem('userSettings')
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      }
      setHasChanges(false)
    }
  }, [isOpen])

  const handleSettingChange = (category: keyof UserSettings, key: string, value: any) => {
    setSettings(prev => {
      const categorySettings = prev[category]
      if (typeof categorySettings === 'object' && categorySettings !== null) {
        return {
          ...prev,
          [category]: {
            ...categorySettings,
            [key]: value
          }
        }
      }
      return {
        ...prev,
        [category]: value
      }
    })
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    // Simula salvataggio
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    localStorage.setItem('userSettings', JSON.stringify(settings))
    setHasChanges(false)
    setIsSaving(false)
    setShowSuccess(true)
    
    setTimeout(() => setShowSuccess(false), 2000)
  }

  const handleReset = () => {
    setSettings(defaultSettings)
    setHasChanges(true)
  }

  const handleExportData = () => {
    const dataToExport = {
      settings,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `nebula-settings-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!isOpen) return null

  const tabs = [
    { id: 'general', label: 'Generale', icon: Settings },
    { id: 'notifications', label: 'Notifiche', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'dashboard', label: 'Dashboard', icon: Eye },
    { id: 'data', label: 'Dati', icon: Database }
  ]

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Impostazioni</h2>
              <p className="text-gray-600">Personalizza la tua esperienza Nebula</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Aspetto</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
                        <div className="flex space-x-3">
                          {[
                            { value: 'light', label: 'Chiaro', icon: Sun },
                            { value: 'dark', label: 'Scuro', icon: Moon },
                            { value: 'system', label: 'Sistema', icon: Settings }
                          ].map((theme) => {
                            const Icon = theme.icon
                            return (
                              <button
                                key={theme.value}
                                onClick={() => handleSettingChange('theme', 'theme', theme.value)}
                                className={`flex items-center px-4 py-2 rounded-lg border transition-all ${
                                  settings.theme === theme.value
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                              >
                                <Icon className="w-4 h-4 mr-2" />
                                {theme.label}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Lingua</label>
                        <select
                          value={settings.language}
                          onChange={(e) => handleSettingChange('language', 'language', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="it">🇮🇹 Italiano</option>
                          <option value="en">🇺🇸 English</option>
                          <option value="es">🇪🇸 Español</option>
                          <option value="fr">🇫🇷 Français</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferenze Notifiche</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'email', label: 'Notifiche Email', description: 'Ricevi aggiornamenti via email' },
                        { key: 'push', label: 'Notifiche Push', description: 'Notifiche del browser in tempo reale' },
                        { key: 'marketing', label: 'Marketing', description: 'Offerte e novità sui prodotti' },
                        { key: 'security', label: 'Sicurezza', description: 'Avvisi di sicurezza e accessi' }
                      ].map((notification) => (
                        <div key={notification.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">{notification.label}</div>
                            <div className="text-sm text-gray-600">{notification.description}</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.notifications[notification.key as keyof typeof settings.notifications]}
                              onChange={(e) => handleSettingChange('notifications', notification.key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy e Sicurezza</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'analytics', label: 'Analytics', description: 'Aiutaci a migliorare con dati anonimi' },
                        { key: 'cookies', label: 'Cookie Funzionali', description: 'Cookie per migliorare l\'esperienza' },
                        { key: 'dataSharing', label: 'Condivisione Dati', description: 'Condividi dati con partner selezionati' }
                      ].map((privacy) => (
                        <div key={privacy.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">{privacy.label}</div>
                            <div className="text-sm text-gray-600">{privacy.description}</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.privacy[privacy.key as keyof typeof settings.privacy]}
                              onChange={(e) => handleSettingChange('privacy', privacy.key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Dashboard Settings */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurazione Dashboard</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Aggiornamento Automatico</div>
                          <div className="text-sm text-gray-600">Aggiorna automaticamente le metriche</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.dashboard.autoRefresh}
                            onChange={(e) => handleSettingChange('dashboard', 'autoRefresh', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Intervallo Aggiornamento (secondi)
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="300"
                          step="10"
                          value={settings.dashboard.refreshInterval}
                          onChange={(e) => handleSettingChange('dashboard', 'refreshInterval', parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>10s</span>
                          <span className="font-medium">{settings.dashboard.refreshInterval}s</span>
                          <span>5min</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Vista Compatta</div>
                          <div className="text-sm text-gray-600">Mostra più informazioni in meno spazio</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.dashboard.compactView}
                            onChange={(e) => handleSettingChange('dashboard', 'compactView', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Data Management */}
              {activeTab === 'data' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestione Dati</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-medium text-blue-900 mb-2">Esporta Dati</h4>
                        <p className="text-sm text-blue-700 mb-3">
                          Scarica una copia delle tue impostazioni e preferenze
                        </p>
                        <button
                          onClick={handleExportData}
                          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Esporta Impostazioni
                        </button>
                      </div>

                      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <h4 className="font-medium text-yellow-900 mb-2">Reset Impostazioni</h4>
                        <p className="text-sm text-yellow-700 mb-3">
                          Ripristina tutte le impostazioni ai valori predefiniti
                        </p>
                        <button
                          onClick={handleReset}
                          className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Reset Impostazioni
                        </button>
                      </div>

                      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <h4 className="font-medium text-red-900 mb-2">Elimina Account</h4>
                        <p className="text-sm text-red-700 mb-3">
                          Elimina permanentemente il tuo account e tutti i dati associati
                        </p>
                        <button
                          onClick={() => alert('Funzionalità non ancora implementata')}
                          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Elimina Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {hasChanges && 'Modifiche non salvate'}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Annulla
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className={`flex items-center px-6 py-2 rounded-lg transition-all ${
                hasChanges && !isSaving
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : showSuccess ? (
                <Check className="w-4 h-4 mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSaving ? 'Salvataggio...' : showSuccess ? 'Salvato!' : 'Salva Modifiche'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}