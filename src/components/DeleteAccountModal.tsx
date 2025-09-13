'use client'

import { useState } from 'react'
import { AlertTriangle, Lock, Trash2, X, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function DeleteAccountModal({ isOpen, onClose }: DeleteAccountModalProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState(1) // 1: Avviso, 2: Conferma password, 3: Conferma finale
  const [password, setPassword] = useState('')
  const [confirmText, setConfirmText] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')

  const requiredConfirmText = 'ELIMINA IL MIO ACCOUNT'

  const handleClose = () => {
    if (!isDeleting) {
      setStep(1)
      setPassword('')
      setConfirmText('')
      setError('')
      onClose()
    }
  }

  const handleNextStep = () => {
    setError('')
    setStep(step + 1)
  }

  const handleDeleteAccount = async () => {
    if (!user?.id || !password) {
      setError('Dati mancanti per l\'eliminazione')
      return
    }

    if (confirmText !== requiredConfirmText) {
      setError('Testo di conferma non corretto')
      return
    }

    setIsDeleting(true)
    setError('')

    try {
      const response = await fetch('/api/account/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          confirmPassword: password
        })
      })

      const data = await response.json()

      if (data.success) {
        // Account eliminato con successo
        alert('Account eliminato con successo. Verrai reindirizzato alla home page.')
        logout() // Effettua il logout
        router.push('/') // Reindirizza alla home
      } else {
        setError(data.error || 'Errore durante l\'eliminazione dell\'account')
      }
    } catch (error) {
      setError('Errore di connessione. Riprova più tardi.')
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Elimina Account
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Avviso */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 mb-2">⚠️ Attenzione!</h3>
                <p className="text-red-700 text-sm leading-relaxed">
                  Questa azione è <strong>irreversibile</strong>. Eliminando il tuo account:
                </p>
                <ul className="mt-3 space-y-1 text-red-700 text-sm">
                  <li>• Tutti i tuoi dati verranno eliminati permanentemente</li>
                  <li>• Non potrai più accedere ai tuoi servizi</li>
                  <li>• Tutte le configurazioni andranno perse</li>
                  <li>• Non sarà possibile recuperare l'account</li>
                </ul>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Account da eliminare:</h4>
                <div className="text-sm text-gray-600">
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Nome utente:</strong> {user?.username}</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Annulla
                </button>
                <button
                  onClick={handleNextStep}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Continua
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Conferma password */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Conferma la tua password</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Per sicurezza, inserisci la tua password attuale per continuare.
                </p>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Inserisci la tua password"
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Indietro
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={!password}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continua
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Conferma finale */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Conferma finale</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Per completare l'eliminazione, digita esattamente:
                </p>
                <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 mb-4">
                  <code className="text-red-600 font-mono font-semibold">{requiredConfirmText}</code>
                </div>
                
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Digita il testo di conferma"
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm font-medium">
                  ⚠️ Ultima possibilità di annullare!
                </p>
                <p className="text-red-600 text-xs mt-1">
                  Una volta cliccato "Elimina Account", non sarà più possibile tornare indietro.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep(2)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                >
                  Indietro
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={confirmText !== requiredConfirmText || isDeleting}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Elimina Account
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}