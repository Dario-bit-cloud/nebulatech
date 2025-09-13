import DatabaseTest from '@/components/DatabaseTest';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🧪 Test Database Neon
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Testa la connessione e le funzionalità del database Neon integrato con NebulaTech.
            Puoi verificare la connessione e creare post di esempio.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <DatabaseTest />
        </div>
        
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              📚 Informazioni Database
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <strong>Database:</strong> Neon PostgreSQL
              </div>
              <div>
                <strong>Provider:</strong> Netlify
              </div>
              <div>
                <strong>Regione:</strong> US East (Ohio)
              </div>
              <div>
                <strong>Connessione:</strong> Serverless
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}