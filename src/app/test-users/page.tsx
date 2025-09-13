'use client';

import { useState } from 'react';

interface User {
  id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  role: string;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  last_login?: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  user?: User;
  users?: User[];
  error?: string;
}

export default function TestUsersPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Form states
  const [registerForm, setRegisterForm] = useState({
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [updateForm, setUpdateForm] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  const makeRequest = async (url: string, options: RequestInit = {}) => {
    setLoading(true);
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        ...options,
      });
      
      const data: ApiResponse = await response.json();
      
      if (data.success) {
        setResult(`✅ ${data.message || 'Operazione completata'}\n${JSON.stringify(data, null, 2)}`);
        return data;
      } else {
        setResult(`❌ Errore: ${data.error}`);
        return null;
      }
    } catch (error) {
      setResult(`❌ Errore di rete: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const initDatabase = async () => {
    await makeRequest('/api/init-users/', { method: 'POST' });
  };

  const testConnection = async () => {
    await makeRequest('/api/test-users/');
  };

  const registerUser = async () => {
    if (!registerForm.email || !registerForm.username || !registerForm.password) {
      setResult('❌ Email, username e password sono obbligatori');
      return;
    }

    const data = await makeRequest('/api/test-users/', {
      method: 'POST',
      body: JSON.stringify({
        action: 'register',
        ...registerForm
      })
    });

    if (data?.user) {
      setCurrentUser(data.user);
      // Reset form
      setRegisterForm({ email: '', username: '', password: '', firstName: '', lastName: '' });
    }
  };

  const loginUser = async () => {
    if (!loginForm.email || !loginForm.password) {
      setResult('❌ Email e password sono obbligatori');
      return;
    }

    const data = await makeRequest('/api/test-users/', {
      method: 'POST',
      body: JSON.stringify({
        action: 'login',
        ...loginForm
      })
    });

    if (data?.user) {
      setCurrentUser(data.user);
      // Reset form
      setLoginForm({ email: '', password: '' });
    }
  };

  const updateProfile = async () => {
    if (!currentUser) {
      setResult('❌ Devi essere loggato per aggiornare il profilo');
      return;
    }

    const updates = Object.fromEntries(
      Object.entries(updateForm).filter(([_, value]) => value.trim() !== '')
    );

    if (Object.keys(updates).length === 0) {
      setResult('❌ Inserisci almeno un campo da aggiornare');
      return;
    }

    const data = await makeRequest('/api/test-users/', {
      method: 'POST',
      body: JSON.stringify({
        action: 'update_profile',
        userId: currentUser.id.toString(),
        updates
      })
    });

    if (data?.user) {
      setCurrentUser(data.user);
      // Reset form
      setUpdateForm({ firstName: '', lastName: '', email: '' });
    }
  };

  const verifyEmail = async () => {
    if (!currentUser) {
      setResult('❌ Devi essere loggato per verificare l\'email');
      return;
    }

    const data = await makeRequest('/api/test-users/', {
      method: 'POST',
      body: JSON.stringify({
        action: 'verify_email',
        userId: currentUser.id.toString()
      })
    });

    if (data?.user) {
      setCurrentUser({ ...currentUser, email_verified: true });
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setResult('👋 Logout effettuato');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test Sistema Utenti - Database Neon
          </h1>
          <p className="text-gray-600 mb-6">
            Testa le funzionalità di registrazione, login e gestione utenti
          </p>

          {/* Stato utente corrente */}
          {currentUser && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-green-800 mb-2">👤 Utente Loggato</h3>
              <div className="text-sm text-green-700">
                <p><strong>ID:</strong> {currentUser.id}</p>
                <p><strong>Email:</strong> {currentUser.email} {currentUser.email_verified ? '✅' : '❌'}</p>
                <p><strong>Username:</strong> {currentUser.username}</p>
                <p><strong>Nome:</strong> {currentUser.first_name} {currentUser.last_name}</p>
                <p><strong>Ruolo:</strong> {currentUser.role}</p>
                <p><strong>Attivo:</strong> {currentUser.is_active ? 'Sì' : 'No'}</p>
                <p><strong>Ultimo Login:</strong> {currentUser.last_login || 'Mai'}</p>
              </div>
              <button
                onClick={logout}
                className="mt-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          )}

          {/* Sezione Inizializzazione */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">🔧 Inizializzazione Database</h2>
            <div className="flex gap-4">
              <button
                onClick={initDatabase}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Caricamento...' : 'Inizializza Tabella Users'}
              </button>
              <button
                onClick={testConnection}
                disabled={loading}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Caricamento...' : 'Testa Connessione'}
              </button>
            </div>
          </div>

          {/* Sezione Registrazione */}
          {!currentUser && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">📝 Registrazione Nuovo Utente</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="email"
                  placeholder="Email *"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Username *"
                  value={registerForm.username}
                  onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="password"
                  placeholder="Password *"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Nome"
                  value={registerForm.firstName}
                  onChange={(e) => setRegisterForm({...registerForm, firstName: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Cognome"
                  value={registerForm.lastName}
                  onChange={(e) => setRegisterForm({...registerForm, lastName: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={registerUser}
                disabled={loading}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Registrazione...' : 'Registra Utente'}
              </button>
            </div>
          )}

          {/* Sezione Login */}
          {!currentUser && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">🔐 Login Utente</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={loginUser}
                disabled={loading}
                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Login...' : 'Accedi'}
              </button>
            </div>
          )}

          {/* Sezione Gestione Profilo */}
          {currentUser && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">⚙️ Gestione Profilo</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Nuovo Nome"
                  value={updateForm.firstName}
                  onChange={(e) => setUpdateForm({...updateForm, firstName: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Nuovo Cognome"
                  value={updateForm.lastName}
                  onChange={(e) => setUpdateForm({...updateForm, lastName: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Nuova Email"
                  value={updateForm.email}
                  onChange={(e) => setUpdateForm({...updateForm, email: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={updateProfile}
                  disabled={loading}
                  className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Aggiornamento...' : 'Aggiorna Profilo'}
                </button>
                {!currentUser.email_verified && (
                  <button
                    onClick={verifyEmail}
                    disabled={loading}
                    className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Verifica...' : 'Verifica Email'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Risultati */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Risultati</h2>
            <div className="bg-gray-100 rounded-lg p-4 min-h-[200px]">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {result || 'Nessun test eseguito ancora...'}
              </pre>
            </div>
          </div>

          {/* Informazioni */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">ℹ️ Informazioni</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Database:</strong> Neon PostgreSQL (configurato con Netlify)</li>
              <li>• <strong>Sicurezza:</strong> Password hashate con bcrypt (12 rounds)</li>
              <li>• <strong>Funzionalità:</strong> Registrazione, Login, Aggiornamento profilo, Verifica email</li>
              <li>• <strong>Validazione:</strong> Email e username unici, controlli di sicurezza</li>
              <li>• <strong>Gestione:</strong> Ruoli utente, stato attivo/inattivo, timestamp</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}