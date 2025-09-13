'use client'

import { useState, useEffect } from 'react'
import { X, Bell, Check, Trash2, Filter, AlertCircle, Info, CheckCircle, Clock, Server, Database, Shield } from 'lucide-react'

interface NotificationsModalProps {
  isOpen: boolean
  onClose: () => void
  onNotificationCountChange: (count: number) => void
}

interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  read: boolean
  category: 'system' | 'security' | 'billing'
  actionUrl?: string
}

const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Server creato con successo',
    message: 'Il tuo nuovo server "Web-Server-01" è stato creato e configurato correttamente.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minuti fa
    read: false,
    category: 'system',
    actionUrl: '/dashboard'
  },
  {
    id: '2',
    type: 'warning',
    title: 'Utilizzo storage elevato',
    message: 'Il database "ProductionDB" ha raggiunto l\'85% della capacità. Considera un upgrade.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 ore fa
    read: false,
    category: 'system'
  },

  {
    id: '4',
    type: 'error',
    title: 'Tentativo di accesso sospetto',
    message: 'Rilevato tentativo di accesso non autorizzato dal IP 192.168.1.100.',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 ore fa
    read: true,
    category: 'security'
  },
  {
    id: '5',
    type: 'info',
    title: 'Fattura disponibile',
    message: 'La fattura di gennaio è disponibile nella sezione billing.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 giorno fa
    read: true,
    category: 'billing'
  }
]

export default function NotificationsModal({ isOpen, onClose, onNotificationCountChange }: NotificationsModalProps) {
  const [notifications, setNotifications] = useState<Notification[]>(DEMO_NOTIFICATIONS)
  const [filter, setFilter] = useState<'all' | 'unread' | 'system' | 'security' | 'billing'>('all')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const unreadCount = notifications.filter(n => !n.read).length
    onNotificationCountChange(unreadCount)
  }, [notifications, onNotificationCountChange])

  const getIcon = (type: string, category: string) => {
    if (category === 'security') return <Shield className="w-5 h-5" />
    if (category === 'system') return <Server className="w-5 h-5" />
    if (category === 'billing') return <Database className="w-5 h-5" />
    
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5" />
      case 'warning': return <AlertCircle className="w-5 h-5" />
      case 'error': return <AlertCircle className="w-5 h-5" />
      default: return <Info className="w-5 h-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200'
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'error': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-blue-600 bg-blue-50 border-blue-200'
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) return `${minutes}m fa`
    if (hours < 24) return `${hours}h fa`
    return `${days}g fa`
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = async () => {
    setIsLoading(true)
    // Simula chiamata API
    await new Promise(resolve => setTimeout(resolve, 500))
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setIsLoading(false)
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    setNotifications([])
    setIsLoading(false)
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notification.read
    return notification.category === filter
  })

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-xl">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Notifiche</h2>
              <p className="text-gray-600 text-sm">
                {notifications.filter(n => !n.read).length} non lette di {notifications.length} totali
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Actions Bar */}
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Filters */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tutte</option>
                <option value="unread">Non lette</option>
                <option value="system">Sistema</option>
                <option value="security">Sicurezza</option>
                <option value="billing">Fatturazione</option>

              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={markAllAsRead}
                disabled={isLoading || notifications.every(n => n.read)}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Check className="w-4 h-4 mr-2" />
                )}
                Segna tutte come lette
              </button>
              <button
                onClick={clearAll}
                disabled={isLoading || notifications.length === 0}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                Cancella tutte
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto max-h-96">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'unread' ? 'Nessuna notifica non letta' : 'Nessuna notifica'}
              </h3>
              <p className="text-gray-500">
                {filter === 'unread' 
                  ? 'Tutte le notifiche sono state lette!' 
                  : 'Le tue notifiche appariranno qui.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50/30 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className={`p-2 rounded-lg border ${getTypeColor(notification.type)}`}>
                      {getIcon(notification.type, notification.category)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`font-semibold text-gray-900 ${
                            !notification.read ? 'font-bold' : ''
                          }`}>
                            {notification.title}
                            {!notification.read && (
                              <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                            )}
                          </h4>
                          <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                            {notification.message}
                          </p>
                          <div className="flex items-center mt-2 space-x-4">
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              notification.category === 'system' ? 'bg-blue-100 text-blue-700' :
                              notification.category === 'security' ? 'bg-red-100 text-red-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {notification.category === 'system' ? 'Sistema' :
                               notification.category === 'security' ? 'Sicurezza' :
                               'Fatturazione'}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Segna come letta"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Elimina notifica"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Action Button */}
                      {notification.actionUrl && (
                        <button
                          onClick={() => {
                            markAsRead(notification.id)
                            // Qui potresti navigare all'URL
                            // Navigate to notification URL
                          }}
                          className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                        >
                          Visualizza dettagli →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {filteredNotifications.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Mostrando {filteredNotifications.length} di {notifications.length} notifiche
              </span>
              <button
                onClick={() => {
                  // Qui potresti implementare la paginazione o "carica altre"
                  // Load more notifications
                }}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                Visualizza cronologia completa
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}