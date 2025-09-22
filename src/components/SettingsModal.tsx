'use client'

import React, { useState, useEffect } from 'react'
import { X, Settings, Moon, Sun, Globe, Shield, Bell, Eye, Database, Download, Trash2, Save, Check, ChevronLeft, Menu } from 'lucide-react'

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
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Carica impostazioni dal localStorage
      const savedSettings = localStorage.getItem('userSettings')
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      }
      setHasChanges(false)
      setShowMobileMenu(false)
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
    { id: 'general', label: 'Generale', icon: Settings, description: 'Tema e lingua' },
    { id: 'notifications', label: 'Notifiche', icon: Bell, description: 'Email e push' },
    { id: 'privacy', label: 'Privacy', icon: Shield, description: 'Dati e cookies' },
    { id: 'dashboard', label: 'Dashboard', icon: Eye, description: 'Visualizzazione' },
    { id: 'data', label: 'Dati', icon: Database, description: 'Backup e reset' }
  ]

  const currentTab = tabs.find(tab => tab.id === activeTab)

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      {/* Mobile-first Modal */}
      <div className="bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:w-full sm:max-w-4xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-300">
        
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 sm:hidden">
          <div className="flex items-center space-x-3">
            {showMobileMenu ? (
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
            ) : (
              <button
                onClick={() => setShowMobileMenu(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {showMobileMenu ? 'Impostazioni' : currentTab?.label}
              </h2>
              {!showMobileMenu && (
                <p className="text-sm text-gray-600">{currentTab?.description}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden sm:flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Impostazioni</h2>
              <p className="text-base text-gray-600">Personalizza la tua esperienza Nebula</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row h-[calc(100vh-80px)] sm:h-[calc(90vh-140px)]">
          {/* Mobile Menu Overlay */}
          {showMobileMenu && (
            <div className="absolute inset-0 bg-white z-10 sm:hidden">
              <div className="p-4 space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id)
                        setShowMobileMenu(false)
                      }}
                      className={`w-full flex items-center p-4 rounded-xl text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700 shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-6 h-6 mr-4" />
                      <div>
                        <div className="font-medium">{tab.label}</div>
                        <div className="text-sm opacity-75">{tab.description}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Desktop Sidebar */}
          <div className="hidden sm:block w-72 bg-gray-50 border-r border-gray-200 p-4 flex-shrink-0">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center p-4 rounded-xl text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <div>
                      <div className="font-medium">{tab.label}</div>
                      <div className="text-sm opacity-75">{tab.description}</div>
                    </div>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Aspetto</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Tema</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                                className={`flex items-center justify-center p-4 rounded-xl border-2 transition-all ${
                                  settings.theme === theme.value
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                <Icon className="w-5 h-5 mr-3" />
                                <span className="font-medium">{theme.label}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Lingua</label>
                        <select
                          value={settings.language}
                          onChange={(e) => handleSettingChange('language', 'language', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Preferenze Notifiche</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'email', label: 'Notifiche Email', description: 'Ricevi aggiornamenti via email' },
                        { key: 'push', label: 'Notifiche Push', description: 'Notifiche del browser in tempo reale' },
                        { key: 'marketing', label: 'Marketing', description: 'Offerte e novità sui prodotti' },
                        { key: 'security', label: 'Sicurezza', description: 'Avvisi di sicurezza e accessi' }
                      ].map((notification) => (
                        <div key={notification.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{notification.label}</div>
                            <div className="text-sm text-gray-600">{notification.description}</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer ml-4">
                            <input
                              type="checkbox"
                              checked={settings.notifications[notification.key as keyof typeof settings.notifications]}
                              onChange={(e) => handleSettingChange('notifications', notification.key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Controlli Privacy</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'analytics', label: 'Analytics', description: 'Aiutaci a migliorare con dati anonimi' },
                        { key: 'cookies', label: 'Cookies', description: 'Salva preferenze e sessioni' },
                        { key: 'dataSharing', label: 'Condivisione Dati', description: 'Condividi dati con partner selezionati' }
                      ].map((privacy) => (
                        <div key={privacy.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{privacy.label}</div>
                            <div className="text-sm text-gray-600">{privacy.description}</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer ml-4">
                            <input
                              type="checkbox"
                              checked={settings.privacy[privacy.key as keyof typeof settings.privacy]}
                              onChange={(e) => handleSettingChange('privacy', privacy.key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Dashboard Settings */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Configurazione Dashboard</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">Aggiornamento Automatico</div>
                          <div className="text-sm text-gray-600">Aggiorna automaticamente le metriche</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer ml-4">
                          <input
                            type="checkbox"
                            checked={settings.dashboard.autoRefresh}
                            onChange={(e) => handleSettingChange('dashboard', 'autoRefresh', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      {settings.dashboard.autoRefresh && (
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                          <label className="block text-sm font-medium text-blue-900 mb-2">
                            Intervallo di aggiornamento (secondi)
                          </label>
                          <select
                            value={settings.dashboard.refreshInterval}
                            onChange={(e) => handleSettingChange('dashboard', 'refreshInterval', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          >
                            <option value={15}>15 secondi</option>
                            <option value={30}>30 secondi</option>
                            <option value={60}>1 minuto</option>
                            <option value={300}>5 minuti</option>
                          </select>
                        </div>
                      )}

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">Vista Compatta</div>
                          <div className="text-sm text-gray-600">Mostra più informazioni in meno spazio</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer ml-4">
                          <input
                            type="checkbox"
                            checked={settings.dashboard.compactView}
                            onChange={(e) => handleSettingChange('dashboard', 'compactView', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">Tutorial Dashboard</div>
                          <div className="text-sm text-gray-600">Riavvia il tutorial introduttivo della dashboard</div>
                        </div>
                        <button
                          onClick={() => {
                            localStorage.removeItem('nebula-tutorial-completed')
                            localStorage.removeItem('nebula-tutorial-step')
                            window.location.reload()
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Riavvia Tutorial
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Data Management */}
              {activeTab === 'data' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Gestione Dati</h3>
                    <div className="space-y-6">
                      <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                        <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                          <Download className="w-5 h-5 mr-2" />
                          Esporta Dati
                        </h4>
                        <p className="text-sm text-blue-700 mb-4">
                          Scarica una copia delle tue impostazioni e preferenze
                        </p>
                        <button
                          onClick={handleExportData}
                          className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Esporta Impostazioni
                        </button>
                      </div>

                      <div className="p-6 bg-yellow-50 rounded-xl border border-yellow-200">
                        <h4 className="font-semibold text-yellow-900 mb-2 flex items-center">
                          <Settings className="w-5 h-5 mr-2" />
                          Reset Impostazioni
                        </h4>
                        <p className="text-sm text-yellow-700 mb-4">
                          Ripristina tutte le impostazioni ai valori predefiniti
                        </p>
                        <button
                          onClick={handleReset}
                          className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Reset Impostazioni
                        </button>
                      </div>

                      <div className="p-6 bg-red-50 rounded-xl border border-red-200">
                        <h4 className="font-semibold text-red-900 mb-2 flex items-center">
                          <Trash2 className="w-5 h-5 mr-2" />
                          Elimina Account
                        </h4>
                        <p className="text-sm text-red-700 mb-4">
                          Elimina permanentemente il tuo account e tutti i dati associati
                        </p>
                        <button
                          onClick={() => alert('Funzionalità non ancora implementata')}
                          className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
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
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-t border-gray-200 bg-gray-50 space-y-3 sm:space-y-0">
          <div className="text-sm text-gray-600 order-2 sm:order-1">
            {hasChanges && (
              <span className="flex items-center text-amber-600">
                <div className="w-2 h-2 bg-amber-500 rounded-full mr-2 animate-pulse"></div>
                Modifiche non salvate
              </span>
            )}
          </div>
          <div className="flex space-x-3 order-1 sm:order-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors text-center rounded-lg font-medium"
            >
              Annulla
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className={`flex-1 sm:flex-none flex items-center justify-center px-8 py-3 rounded-lg transition-all font-medium ${
                hasChanges && !isSaving
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : showSuccess ? (
                <Check className="w-5 h-5 mr-2" />
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              <span>
                {isSaving ? 'Salvataggio...' : showSuccess ? 'Salvato!' : 'Salva Modifiche'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}