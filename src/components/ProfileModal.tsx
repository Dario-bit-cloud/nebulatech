'use client'

import { useState, useEffect } from 'react'
import { X, User, Mail, Phone, MapPin, Camera, Save, Eye, EyeOff } from 'lucide-react'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: { name: string; email: string } | null
  onUpdateUser: (userData: any) => void
}

interface UserProfile {
  name: string
  email: string
  phone: string
  location: string
  bio: string
  company: string
  website: string
  avatar: string
}

export default function ProfileModal({ isOpen, onClose, user, onUpdateUser }: ProfileModalProps) {
  const [profile, setProfile] = useState<UserProfile>({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    bio: '',
    company: '',
    website: '',
    avatar: ''
  })
  const [isLoading, setSaveLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences'>('profile')
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    theme: 'light',
    language: 'it'
  })

  useEffect(() => {
    if (user) {
      // Carica dati profilo dal localStorage o API
      const savedProfile = localStorage.getItem(`profile_${user.email}`)
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile)
        setProfile({ ...profile, ...parsedProfile })
      }
      
      const savedPreferences = localStorage.getItem(`preferences_${user.email}`)
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences))
      }
    }
  }, [user])

  const handleSaveProfile = async () => {
    setSaveLoading(true)
    try {
      // Simula chiamata API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Salva nel localStorage
      localStorage.setItem(`profile_${profile.email}`, JSON.stringify(profile))
      
      // Aggiorna i dati utente nel componente padre
      onUpdateUser({ name: profile.name, email: profile.email })
      
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Errore nel salvataggio:', error)
    } finally {
      setSaveLoading(false)
    }
  }

  const handleSavePreferences = async () => {
    setSaveLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      localStorage.setItem(`preferences_${user?.email}`, JSON.stringify(preferences))
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Errore nel salvataggio preferenze:', error)
    } finally {
      setSaveLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Le password non coincidono')
      return
    }
    
    setSaveLoading(true)
    try {
      // Simula cambio password
      await new Promise(resolve => setTimeout(resolve, 1200))
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Errore nel cambio password:', error)
    } finally {
      setSaveLoading(false)
    }
  }

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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-2xl font-bold text-gray-900">Gestione Account</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 m-4 rounded-lg">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-green-700 font-medium">
                  ✅ Modifiche salvate con successo!
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row h-full">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 bg-gray-50 p-4">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all ${
                  activeTab === 'profile'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-white hover:shadow-md'
                }`}
              >
                <User className="w-5 h-5 mr-3" />
                Profilo
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all ${
                  activeTab === 'security'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-white hover:shadow-md'
                }`}
              >
                <Eye className="w-5 h-5 mr-3" />
                Sicurezza
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all ${
                  activeTab === 'preferences'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-white hover:shadow-md'
                }`}
              >
                <Mail className="w-5 h-5 mr-3" />
                Preferenze
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Informazioni Profilo</h3>
                
                {/* Avatar Section */}
                <div className="flex items-center space-x-6 p-4 bg-gray-50 rounded-xl">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl font-bold">
                        {profile.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <button className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow">
                      <Camera className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{profile.name}</h4>
                    <p className="text-gray-500">{profile.email}</p>
                    <button className="text-blue-600 text-sm hover:underline mt-1">
                      Cambia foto profilo
                    </button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome completo
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefono
                    </label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="+39 123 456 7890"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Località
                    </label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Milano, Italia"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Azienda
                    </label>
                    <input
                      type="text"
                      value={profile.company}
                      onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Nome azienda"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sito web
                    </label>
                    <input
                      type="url"
                      value={profile.website}
                      onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="https://esempio.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Raccontaci qualcosa di te..."
                  />
                </div>

                <button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="w-5 h-5 mr-2" />
                  )}
                  {isLoading ? 'Salvataggio...' : 'Salva Modifiche'}
                </button>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Sicurezza Account</h3>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        🔒 Mantieni il tuo account sicuro cambiando regolarmente la password.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password attuale
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nuova password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Conferma nuova password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePasswordChange}
                  disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  className="w-full md:w-auto bg-gradient-to-r from-red-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="w-5 h-5 mr-2" />
                  )}
                  {isLoading ? 'Aggiornamento...' : 'Cambia Password'}
                </button>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Preferenze</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Notifiche</h4>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                          <span className="font-medium text-gray-900">Notifiche email</span>
                          <p className="text-sm text-gray-500">Ricevi aggiornamenti via email</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.emailNotifications}
                          onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </label>
                      
                      <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                          <span className="font-medium text-gray-900">Notifiche push</span>
                          <p className="text-sm text-gray-500">Notifiche desktop in tempo reale</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.pushNotifications}
                          onChange={(e) => setPreferences({ ...preferences, pushNotifications: e.target.checked })}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </label>
                      
                      <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                          <span className="font-medium text-gray-900">Email marketing</span>
                          <p className="text-sm text-gray-500">Offerte e novità sui prodotti</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.marketingEmails}
                          onChange={(e) => setPreferences({ ...preferences, marketingEmails: e.target.checked })}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Aspetto</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tema
                        </label>
                        <select
                          value={preferences.theme}
                          onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="light">Chiaro</option>
                          <option value="dark">Scuro</option>
                          <option value="auto">Automatico</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Lingua
                        </label>
                        <select
                          value={preferences.language}
                          onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="it">Italiano</option>
                          <option value="en">English</option>
                          <option value="es">Español</option>
                          <option value="fr">Français</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSavePreferences}
                  disabled={isLoading}
                  className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="w-5 h-5 mr-2" />
                  )}
                  {isLoading ? 'Salvataggio...' : 'Salva Preferenze'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}