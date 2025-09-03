import Link from 'next/link';
import { Cloud, Shield, Zap, Database, Globe, Users, ArrowRight, CheckCircle } from 'lucide-react';
import PageHero from '@/components/PageHero';

export const metadata = {
  title: 'Servizi Cloud - NebulaTech',
  description: 'Scopri i nostri servizi cloud: hosting professionale, storage sicuro e scalabilità infinita per la tua azienda.',
};

export default function Servizi() {
  return (
    <div className="min-h-screen pt-20">
      <PageHero
        title={<>I Nostri <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Servizi Cloud</span></>}
        subtitle="Soluzioni complete per ogni esigenza aziendale, dalla migrazione cloud alla gestione dell'infrastruttura"
        backgroundGradient="from-blue-600 via-indigo-700 to-purple-800"
      />

      {/* Hosting Section */}
      <section id="hosting" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Hosting Professionale</h2>
              <p className="text-lg text-gray-600 mb-6">
                Hosting web veloce, sicuro e affidabile per siti web, applicazioni e e-commerce. 
                Infrastruttura ottimizzata per prestazioni eccezionali.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">SSD NVMe ultra-veloci</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">CDN globale inclusa</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">SSL gratuito e automatico</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Backup giornalieri automatici</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Piani Hosting</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-900">Starter</h4>
                  <p className="text-gray-600 text-sm">Perfetto per siti web personali</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">€7.99/mese</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-blue-500">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">Business</h4>
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Popolare</span>
                  </div>
                  <p className="text-gray-600 text-sm">Ideale per aziende in crescita</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">€19.99/mese</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-900">Enterprise</h4>
                  <p className="text-gray-600 text-sm">Soluzioni su misura</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">Su richiesta</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Storage Section */}
      <section id="storage" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Storage Cloud Sicuro</h2>
              <p className="text-lg text-gray-600 mb-6">
                Archiviazione cloud scalabile e sicura per tutti i tuoi dati. Accesso da qualsiasi 
                dispositivo con sincronizzazione in tempo reale.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Crittografia end-to-end</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Sincronizzazione multi-dispositivo</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Versioning e ripristino file</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">API per integrazione</span>
                </li>
              </ul>
            </div>
            <div className="order-1 lg:order-2 bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Piani Storage</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-900">Personal</h4>
                  <p className="text-gray-600 text-sm">100 GB di spazio</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">€3.99/mese</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-green-500">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">Team</h4>
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Consigliato</span>
                  </div>
                  <p className="text-gray-600 text-sm">1 TB di spazio condiviso</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">€12.99/mese</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-900">Unlimited</h4>
                  <p className="text-gray-600 text-sm">Spazio illimitato</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">€29.99/mese</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scalabilità Section */}
      <section id="scalabilita" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Scalabilità Infinita</h2>
              <p className="text-lg text-gray-600 mb-6">
                Infrastruttura che cresce con la tua azienda. Auto-scaling intelligente e 
                risorse on-demand per gestire qualsiasi carico di lavoro.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Auto-scaling automatico</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Load balancing intelligente</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Monitoraggio in tempo reale</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Paghi solo quello che usi</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Soluzioni Scalabili</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-900">Startup</h4>
                  <p className="text-gray-600 text-sm">Fino a 5.000 utenti/mese</p>
                  <p className="text-2xl font-bold text-purple-600 mt-2">€49/mese</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-purple-500">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">Growth</h4>
                    <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded">Flessibile</span>
                  </div>
                  <p className="text-gray-600 text-sm">Fino a 50.000 utenti/mese</p>
                  <p className="text-2xl font-bold text-purple-600 mt-2">€149/mese</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-900">Enterprise</h4>
                  <p className="text-gray-600 text-sm">Scalabilità illimitata</p>
                  <p className="text-2xl font-bold text-purple-600 mt-2">Personalizzato</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto a Trasformare la Tua Infrastruttura?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Inizia oggi stesso con una consulenza gratuita e scopri come i nostri servizi 
            possono accelerare la crescita della tua azienda.
          </p>

        </div>
      </section>
    </div>
  );
}