'use client'

import Link from 'next/link'
import { Server, Database, Shield, Cloud, CheckCircle, Globe, BarChart3, HardDrive, Phone, Mail } from 'lucide-react'
import { Suspense, lazy } from 'react'

// Componente per il lazy loading delle sezioni
interface LazySectionProps {
  children: React.ReactNode;
  className?: string;
}

const LazySection = ({ children, className = '' }: LazySectionProps) => (
  <Suspense fallback={<div className={`animate-pulse bg-gray-200 rounded-lg h-32 ${className}`}></div>}>
    {children}
  </Suspense>
);

export default function Servizi() {
  return (
    <>
      {/* Mobile-First Layout */}
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        


        {/* Mobile Services Section - Reorganized */}
        <LazySection>
        <section id="servizi" className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 animate-fade-in-up">
                I Nostri Servizi
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
                Tecnologie all'avanguardia per il successo del tuo progetto digitale
              </p>
            </div>

          {/* Services Grid - Mobile-First Responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Hosting Web Card */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 animate-fade-in-up animation-delay-200">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                  <Server className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Hosting Web</h3>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Server dedicati con SSD NVMe, SSL gratuito e CDN globale
              </p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>SSD NVMe Ultra-veloce</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>SSL Certificato Gratuito</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Backup Automatici</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <span className="text-xs text-gray-500">Da</span>
                  <div className="text-xl font-bold text-blue-600">€29</div>
                </div>
                <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Inizia
                </Link>
              </div>
            </div>

            {/* Database Gestiti Card */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 animate-fade-in-up animation-delay-400">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-br from-green-500 to-green-600 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Database Gestiti</h3>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                MySQL, PostgreSQL e MongoDB con backup automatici
              </p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>MySQL & PostgreSQL</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Backup Automatici</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Alta Disponibilità</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <span className="text-xs text-gray-500">Da</span>
                  <div className="text-xl font-bold text-green-600">€15</div>
                </div>
                <Link href="/login" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                  Inizia
                </Link>
              </div>
            </div>

            {/* Storage Scalabile Card */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 animate-fade-in-up animation-delay-600">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                  <HardDrive className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Storage Scalabile</h3>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Archiviazione cloud sicura con crittografia avanzata
              </p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Crittografia AES-256</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Scalabilità Automatica</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>API RESTful</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <span className="text-xs text-gray-500">Da</span>
                  <div className="text-xl font-bold text-purple-600">€49</div>
                </div>
                <Link href="/login" className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                  Inizia
                </Link>
              </div>
            </div>

            {/* API & Microservizi Card */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 animate-fade-in-up animation-delay-800">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">API & Microservizi</h3>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Piattaforma per API scalabili con monitoraggio avanzato
              </p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Load Balancing</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Rate Limiting</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Analytics Avanzate</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <span className="text-xs text-gray-500">Da</span>
                  <div className="text-xl font-bold text-orange-600">€25</div>
                </div>
                <Link href="/login" className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">
                  Inizia
                </Link>
              </div>
            </div>

            {/* Sicurezza Avanzata Card */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 animate-fade-in-up animation-delay-1000">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-br from-red-500 to-red-600 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Sicurezza Avanzata</h3>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Protezione completa con firewall e DDoS protection
              </p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>DDoS Protection</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>WAF Integrato</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>GDPR Compliant</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <span className="text-xs text-gray-500">Incluso</span>
                  <div className="text-xl font-bold text-red-600">Gratis</div>
                </div>
                <Link href="/login" className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                  Attiva
                </Link>
              </div>
            </div>

            {/* Monitoraggio 24/7 Card */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 animate-fade-in-up animation-delay-1200">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Monitoraggio 24/7</h3>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Dashboard avanzate per monitorare prestazioni in tempo reale
              </p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Metriche Real-time</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Alerting Automatico</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Report Dettagliati</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <span className="text-xs text-gray-500">Incluso</span>
                  <div className="text-xl font-bold text-cyan-600">Gratis</div>
                </div>
                <Link href="/monitoraggio" className="bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cyan-700 transition-colors">
                  Vedi
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      </LazySection>



      {/* Mobile-First CTA Section */}
      <LazySection>
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Pronto a Iniziare?
              </h2>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                Trasforma la tua infrastruttura con NebulaTech. Supporto dedicato e soluzioni cloud professionali per far crescere il tuo business.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Link 
                  href="/login" 
                  className="bg-white text-blue-600 py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
                >
                  <Cloud className="w-5 h-5" />
                  Inizia Subito
                </Link>
                
                <Link 
                  href="/contatti" 
                  className="border-2 border-white text-white py-3 px-6 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Contattaci
                </Link>
              </div>
              
              {/* Quick Contact */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6 pt-6 border-t border-white/20">
                <a 
                  href="tel:+390123456789" 
                  className="flex items-center justify-center gap-2 text-blue-100 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  +39 012 345 6789
                </a>
                <a 
                  href="mailto:info@nebulatech.it" 
                  className="flex items-center justify-center gap-2 text-blue-100 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  info@nebulatech.it
                </a>
              </div>
            </div>
          </div>
        </section>
      </LazySection>
      </div>
    </>
  )
}