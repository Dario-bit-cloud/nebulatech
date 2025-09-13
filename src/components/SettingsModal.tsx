'use client'

import React, { useState, useEffect } from 'react'
import { X, Settings, Moon, Sun, Globe, Shield, Bell, Eye, Database, Download, Trash2, Save, Check, Play, RefreshCw } from 'lucide-react'
import { useTutorial } from '@/hooks/useTutorial'
import { useTheme } from '@/contexts/ThemeContext'
import DeleteAccountModal from './DeleteAccountModal'

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
    analytics: false,
    cookies: false,
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const { startTutorial, resetTutorial, hasSeenTutorial } = useTutorial()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    if (isOpen) {
      // Carica impostazioni dal localStorage
      const savedSettings = localStorage.getItem('userSettings')
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings)
        setSettings(parsedSettings)
      } else {
        // Sincronizza il tema dal ThemeContext se non ci sono impostazioni salvate
        setSettings(prev => ({ ...prev, theme }))
      }
      setHasChanges(false)
    }
  }, [isOpen, theme])

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
    { id: 'tutorial', label: 'Tutorial', icon: Play },
    { id: 'data', label: 'Dati', icon: Database }
  ]

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-2 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <style jsx>{`
        .mobile-tabs::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] sm:max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200" style={{backgroundColor: 'var(--bg-primary)'}}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b" style={{borderColor: 'var(--border-primary)', background: `linear-gradient(to right, var(--gradient-header-from), var(--gradient-header-to))`}}>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 rounded-lg" style={{backgroundColor: 'var(--primary-100)'}}>
              <Settings className="w-5 h-5 sm:w-6 sm:h-6" style={{color: 'var(--primary-600)'}} />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold" style={{color: 'var(--text-primary)'}}>Impostazioni</h2>
              <p className="text-sm sm:text-base hidden sm:block" style={{color: 'var(--text-secondary)'}}>Personalizza la tua esperienza Nebula</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            style={{color: 'var(--text-secondary)'}}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Mobile Tabs */}
        <div className="block sm:hidden border-b" style={{borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-secondary)'}}>
          <div className="flex overflow-x-auto mobile-tabs" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                  style={{
                    color: activeTab === tab.id ? 'var(--primary-600)' : 'var(--text-secondary)',
                    backgroundColor: activeTab === tab.id ? 'var(--bg-primary)' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== tab.id) {
                      e.currentTarget.style.color = 'var(--text-primary)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== tab.id) {
                      e.currentTarget.style.color = 'var(--text-secondary)'
                    }
                  }}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)] sm:h-[calc(85vh-120px)]">
          {/* Desktop Sidebar */}
          <div className="hidden sm:block w-64 border-r p-4" style={{backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)'}}>
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'shadow-sm'
                        : ''
                    }`}
                    style={{
                      backgroundColor: activeTab === tab.id ? 'var(--primary-100)' : 'transparent',
                      color: activeTab === tab.id ? 'var(--primary-700)' : 'var(--text-secondary)'
                    }}
                    onMouseEnter={(e) => {
                      if (activeTab !== tab.id) {
                        e.currentTarget.style.backgroundColor = 'var(--bg-hover)'
                        e.currentTarget.style.color = 'var(--text-primary)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== tab.id) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = 'var(--text-secondary)'
                      }
                    }}
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
            <div className="p-4 sm:p-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4" style={{color: 'var(--text-primary)'}}>Aspetto</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-primary)'}}>Tema</label>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                          {[
                            { value: 'light', label: 'Chiaro', icon: Sun },
                            { value: 'dark', label: 'Scuro', icon: Moon },
                            { value: 'system', label: 'Sistema', icon: Settings }
                          ].map((theme) => {
                            const Icon = theme.icon
                            return (
                              <button
                                key={theme.value}
                                onClick={() => {
                                  handleSettingChange('theme', 'theme', theme.value)
                                  setTheme(theme.value as 'light' | 'dark' | 'system')
                                }}
                                className={`flex items-center justify-center sm:justify-start px-4 py-3 sm:py-2 rounded-lg border transition-all ${
                                  settings.theme === theme.value
                                    ? 'border-blue-500'
                                    : ''
                                }`}
                                style={{
                                  borderColor: settings.theme === theme.value ? 'var(--primary-500)' : 'var(--border-primary)',
                                  backgroundColor: settings.theme === theme.value ? 'var(--primary-50)' : 'var(--bg-secondary)',
                                  color: settings.theme === theme.value ? 'var(--primary-700)' : 'var(--text-primary)'
                                }}
                                onMouseEnter={(e) => {
                                  if (settings.theme !== theme.value) {
                                    e.currentTarget.style.borderColor = 'var(--border-hover)'
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (settings.theme !== theme.value) {
                                    e.currentTarget.style.borderColor = 'var(--border-primary)'
                                  }
                                }}
                              >
                                <Icon className="w-4 h-4 mr-2" />
                                {theme.label}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-primary)'}}>Lingua</label>
                        <select
                          value={settings.language}
                          onChange={(e) => handleSettingChange('language', 'language', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          style={{
                            borderColor: 'var(--border-primary)',
                            backgroundColor: 'var(--bg-primary)',
                            color: 'var(--text-primary)'
                          }}
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
                    <h3 className="text-lg font-semibold mb-4" style={{color: 'var(--text-primary)'}}>Preferenze Notifiche</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'email', label: 'Notifiche Email', description: 'Ricevi aggiornamenti via email' },
                        { key: 'push', label: 'Notifiche Push', description: 'Notifiche del browser in tempo reale' },
                        { key: 'marketing', label: 'Marketing', description: 'Offerte e novità sui prodotti' },
                        { key: 'security', label: 'Sicurezza', description: 'Avvisi di sicurezza e accessi' }
                      ].map((notification) => (
                        <div key={notification.key} className="flex items-center justify-between p-4 rounded-lg" style={{backgroundColor: 'var(--bg-secondary)'}}>
                          <div>
                            <div className="font-medium" style={{color: 'var(--text-primary)'}}>{notification.label}</div>
                            <div className="text-sm" style={{color: 'var(--text-secondary)'}}>{notification.description}</div>
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
                    <h3 className="text-lg font-semibold mb-4" style={{color: 'var(--text-primary)'}}>Privacy e Sicurezza</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'analytics', label: 'Analytics', description: 'Aiutaci a migliorare con dati anonimi' },
                        { key: 'cookies', label: 'Cookie Funzionali', description: 'Cookie per migliorare l\'esperienza' },
                        { key: 'dataSharing', label: 'Condivisione Dati', description: 'Condividi dati con partner selezionati' }
                      ].map((privacy) => (
                        <div key={privacy.key} className="flex items-center justify-between p-4 rounded-lg" style={{backgroundColor: 'var(--bg-secondary)'}}>
                          <div>
                            <div className="font-medium" style={{color: 'var(--text-primary)'}}>{privacy.label}</div>
                            <div className="text-sm" style={{color: 'var(--text-secondary)'}}>{privacy.description}</div>
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
                    <h3 className="text-lg font-semibold mb-4" style={{color: 'var(--text-primary)'}}>Configurazione Dashboard</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg" style={{backgroundColor: 'var(--bg-secondary)'}}>
                        <div>
                          <div className="font-medium" style={{color: 'var(--text-primary)'}}>Aggiornamento Automatico</div>
                          <div className="text-sm" style={{color: 'var(--text-secondary)'}}>Aggiorna automaticamente le metriche</div>
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

                      <div className="p-4 rounded-lg" style={{backgroundColor: 'var(--bg-secondary)'}}>
                        <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-primary)'}}>
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
                        <div className="flex justify-between text-xs mt-1" style={{color: 'var(--text-secondary)'}}>
                          <span>10s</span>
                          <span className="font-medium">{settings.dashboard.refreshInterval}s</span>
                          <span>5min</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg" style={{backgroundColor: 'var(--bg-secondary)'}}>
                        <div>
                          <div className="font-medium" style={{color: 'var(--text-primary)'}}>Vista Compatta</div>
                          <div className="text-sm" style={{color: 'var(--text-secondary)'}}>Mostra più informazioni in meno spazio</div>
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

              {/* Tutorial Management */}
              {activeTab === 'tutorial' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4" style={{color: 'var(--text-primary)'}}>Tutorial Guidato</h3>
                    
                    <div className="border rounded-lg p-6 mb-6" style={{backgroundColor: 'var(--primary-50)', borderColor: 'var(--primary-200)'}}>
                      <div className="flex items-start space-x-4">
                        <div className="p-3 rounded-lg" style={{backgroundColor: 'var(--primary-100)'}}>
                          <Play className="w-6 h-6" style={{color: 'var(--primary-600)'}} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-2" style={{color: 'var(--primary-900)'}}>Tutorial Interattivo</h4>
                          <p className="mb-4 leading-relaxed" style={{color: 'var(--primary-700)'}}>
                            Il tutorial ti guida attraverso tutte le funzionalità principali della dashboard. 
                            È perfetto per iniziare o per ripassare le funzionalità disponibili.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <button
                              onClick={() => {
                                startTutorial()
                                onClose()
                              }}
                              className="flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-colors font-medium shadow-md hover:shadow-lg"
                              style={{backgroundColor: 'var(--primary-600)', color: 'white'}}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-700)'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-600)'}
                            >
                              <Play className="w-4 h-4" />
                              <span>Avvia Tutorial</span>
                            </button>
                            {hasSeenTutorial && (
                              <button
                                onClick={() => {
                                  resetTutorial()
                                  onClose()
                                }}
                                className="flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-colors font-medium"
                                style={{backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)'}}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                              >
                                <RefreshCw className="w-4 h-4" />
                                <span>Ripristina Tutorial</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="border rounded-lg p-4" style={{backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)'}}>
                        <h4 className="font-medium mb-3" style={{color: 'var(--text-primary)'}}>Stato Tutorial</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span style={{color: 'var(--text-secondary)'}}>Completato:</span>
                            <span className={`font-medium ${
                              hasSeenTutorial ? 'text-green-600' : 'text-gray-500'
                            }`}>
                              {hasSeenTutorial ? '✅ Sì' : '❌ No'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span style={{color: 'var(--text-secondary)'}}>Durata stimata:</span>
                            <span className="font-medium" style={{color: 'var(--text-primary)'}}>2-3 minuti</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span style={{color: 'var(--text-secondary)'}}>Passi totali:</span>
                            <span className="font-medium" style={{color: 'var(--text-primary)'}}>7 passi</span>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4" style={{backgroundColor: 'var(--success-50)', borderColor: 'var(--success-200)'}}>
                        <h4 className="font-medium mb-3" style={{color: 'var(--success-900)'}}>Caratteristiche</h4>
                        <ul className="space-y-2 text-sm" style={{color: 'var(--success-700)'}}>
                          <li className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: 'var(--success-500)'}}></div>
                            <span>Interattivo e guidato</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: 'var(--success-500)'}}></div>
                            <span>Adattivo per tutti i dispositivi</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: 'var(--success-500)'}}></div>
                            <span>Facilmente interrompibile</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: 'var(--success-500)'}}></div>
                            <span>Ripetibile quando vuoi</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4" style={{backgroundColor: 'var(--warning-50)', borderColor: 'var(--warning-200)'}}>
                      <div className="flex items-start space-x-3">
                        <Globe className="w-5 h-5 mt-0.5 flex-shrink-0" style={{color: 'var(--warning-600)'}} />
                        <div>
                          <h4 className="font-medium mb-1" style={{color: 'var(--warning-900)'}}>Suggerimenti</h4>
                          <ul className="text-sm space-y-1" style={{color: 'var(--warning-700)'}}>
                            <li>• Il tutorial si adatta automaticamente alle dimensioni del tuo schermo</li>
                            <li>• Puoi interromperlo in qualsiasi momento premendo ESC o cliccando la X</li>
                            <li>• Ogni passo evidenzia l'elemento corrispondente nella dashboard</li>
                            <li>• Il progresso viene salvato automaticamente</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Data Management */}
              {activeTab === 'data' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4" style={{color: 'var(--text-primary)'}}>Gestione Dati</h3>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg border" style={{backgroundColor: 'var(--primary-50)', borderColor: 'var(--primary-200)'}}>
                        <h4 className="font-medium mb-2" style={{color: 'var(--primary-900)'}}>Esporta Dati</h4>
                        <p className="text-sm mb-3" style={{color: 'var(--primary-700)'}}>
                          Scarica una copia delle tue impostazioni e preferenze
                        </p>
                        <button
                          onClick={handleExportData}
                          className="flex items-center px-4 py-2 rounded-lg transition-colors"
                          style={{backgroundColor: 'var(--primary-600)', color: 'white'}}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-700)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-600)'}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Esporta Impostazioni
                        </button>
                      </div>

                      <div className="p-4 rounded-lg border" style={{backgroundColor: 'var(--warning-50)', borderColor: 'var(--warning-200)'}}>
                        <h4 className="font-medium mb-2" style={{color: 'var(--warning-900)'}}>Reset Impostazioni</h4>
                        <p className="text-sm mb-3" style={{color: 'var(--warning-700)'}}>
                          Ripristina tutte le impostazioni ai valori predefiniti
                        </p>
                        <button
                          onClick={handleReset}
                          className="flex items-center px-4 py-2 rounded-lg transition-colors"
                          style={{backgroundColor: 'var(--warning-600)', color: 'white'}}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--warning-700)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--warning-600)'}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Reset Impostazioni
                        </button>
                      </div>

                      <div className="p-4 rounded-lg border" style={{backgroundColor: 'var(--danger-50)', borderColor: 'var(--danger-200)'}}>
                        <h4 className="font-medium mb-2" style={{color: 'var(--danger-900)'}}>Elimina Account</h4>
                        <p className="text-sm mb-3" style={{color: 'var(--danger-700)'}}>
                          Elimina permanentemente il tuo account e tutti i dati associati. Questa azione è irreversibile.
                        </p>
                        <button
                          onClick={() => setIsDeleteModalOpen(true)}
                          className="flex items-center px-4 py-2 rounded-lg transition-colors"
                          style={{backgroundColor: 'var(--danger-600)', color: 'white'}}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--danger-700)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--danger-600)'}
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
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-t space-y-3 sm:space-y-0" style={{borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-secondary)'}}>
          <div className="text-sm order-2 sm:order-1" style={{color: 'var(--text-secondary)'}}>
            {hasChanges && 'Modifiche non salvate'}
          </div>
          <div className="flex space-x-3 order-1 sm:order-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 transition-colors text-center"
              style={{color: 'var(--text-secondary)'}}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              Annulla
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className={`flex-1 sm:flex-none flex items-center justify-center px-6 py-2 rounded-lg transition-all ${
                hasChanges && !isSaving
                  ? ''
                  : 'cursor-not-allowed'
              }`}
              style={{
                backgroundColor: hasChanges && !isSaving ? 'var(--primary-600)' : 'var(--bg-disabled)',
                color: hasChanges && !isSaving ? 'white' : 'var(--text-disabled)'
              }}
              onMouseEnter={(e) => {
                if (hasChanges && !isSaving) {
                  e.currentTarget.style.backgroundColor = 'var(--primary-700)'
                }
              }}
              onMouseLeave={(e) => {
                if (hasChanges && !isSaving) {
                  e.currentTarget.style.backgroundColor = 'var(--primary-600)'
                }
              }}
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : showSuccess ? (
                <Check className="w-4 h-4 mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              <span className="hidden sm:inline">{isSaving ? 'Salvataggio...' : showSuccess ? 'Salvato!' : 'Salva Modifiche'}</span>
              <span className="sm:hidden">{isSaving ? 'Salva...' : showSuccess ? 'Salvato!' : 'Salva'}</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Delete Account Modal */}
      <DeleteAccountModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
      />
    </div>
  )
}