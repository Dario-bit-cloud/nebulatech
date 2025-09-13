'use client';

import { useState } from 'react';

interface DatabaseTestResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  timestamp?: string;
}

export default function DatabaseTest() {
  const [testResult, setTestResult] = useState<DatabaseTestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: ''
  });

  const initDatabase = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      const response = await fetch('/api/init-db', {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        setTestResult({
          success: true,
          message: 'Database inizializzato! Ora puoi creare post.',
          data: data.tables
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || 'Errore nell\'inizializzazione'
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `Errore nella richiesta: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`
      });
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      const response = await fetch('/api/test-db');
      const data = await response.json();
      
      if (data.success) {
        setTestResult({
          success: true,
          message: data.message,
          data: data.data
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || 'Errore nella connessione'
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `Errore nella richiesta: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`
      });
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/test-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      setTestResult(result);
      
      if (result.success) {
        setFormData({ title: '', content: '', author: '' });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Errore nella creazione del post',
        error: error instanceof Error ? error.message : 'Errore sconosciuto'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Test Database Neon</h2>
      
      {/* Inizializzazione Database */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Inizializza Database</h3>
        <button
          onClick={initDatabase}
          disabled={loading}
          className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white px-4 py-2 rounded-md transition-colors mr-4"
        >
          {loading ? 'Inizializzando...' : 'Inizializza DB'}
        </button>
      </div>

      {/* Test Connessione */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Test Connessione</h3>
        <button
          onClick={testConnection}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-md transition-colors"
        >
          {loading ? 'Testing...' : 'Testa Connessione'}
        </button>
      </div>

      {/* Form Creazione Post */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Crea Post di Test</h3>
        <form onSubmit={createPost} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titolo
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contenuto
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Autore
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-4 py-2 rounded-md transition-colors"
          >
            {loading ? 'Creando...' : 'Crea Post'}
          </button>
        </form>
      </div>

      {/* Risultati */}
      {testResult && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Risultato</h3>
          <div className={`p-4 rounded-md ${
            testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className={`font-medium ${
              testResult.success ? 'text-green-800' : 'text-red-800'
            }`}>
              {testResult.message}
            </div>
            
            {testResult.data && (
              <div className="mt-2">
                <pre className="text-sm text-gray-600 bg-gray-100 p-2 rounded overflow-x-auto">
                  {JSON.stringify(testResult.data, null, 2)}
                </pre>
              </div>
            )}
            
            {testResult.error && (
              <div className="mt-2 text-sm text-red-600">
                Errore: {testResult.error}
              </div>
            )}
            
            {testResult.timestamp && (
              <div className="mt-2 text-xs text-gray-500">
                {testResult.timestamp}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}