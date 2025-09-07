'use client'

import Link from 'next/link'
import { Server, Database, Shield, Cloud, Zap, CheckCircle, ArrowRight, Globe, Lock, BarChart3, Users, HardDrive, Cpu } from 'lucide-react'

export default function Servizi() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 px-4 sm:px-6 lg:px-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-400"></div>
          <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl animate-pulse animation-delay-800"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto text-center">
          <div className="animate-fade-in-up space-y-6 sm:space-y-8">
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight px-2">
                Servizi Cloud
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                  di Nuova Generazione
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-white max-w-4xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200 px-4 text-center font-medium">
                Soluzioni cloud professionali per ogni esigenza. Hosting, database, storage e API scalabili 
                con prestazioni enterprise e supporto 24/7.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-fade-in-up animation-delay-400 px-4 w-full">
              <Link 
                href="#pricing" 
                className="w-full sm:w-auto group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl inline-flex items-center justify-center gap-3 text-base sm:text-lg touch-manipulation"
              >
                <Cloud className="w-5 h-5 sm:w-6 sm:h-6" />
                Vedi i Prezzi
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/login" 
                className="w-full sm:w-auto group border-2 border-white/30 text-white px-6 sm:px-8 py-4 rounded-xl font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-3 text-base sm:text-lg backdrop-blur-sm touch-manipulation"
              >
                <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                Inizia Ora
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-12 sm:mt-20 animate-fade-in-up animation-delay-600 px-2">
            <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">99.9%</div>
              <div className="text-blue-200 text-xs sm:text-sm">Uptime SLA</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">5</div>
              <div className="text-blue-200 text-xs sm:text-sm">Data Center</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">24/7</div>
              <div className="text-blue-200 text-xs sm:text-sm">Supporto</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">SSL</div>
              <div className="text-blue-200 text-xs sm:text-sm">Gratuito</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Features Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
              Perché Scegliere i Nostri 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Servizi Cloud</span>?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
              Tecnologie all'avanguardia, infrastruttura globale e supporto dedicato 
              per garantire il successo del tuo progetto.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Hosting Web */}
            <div className="group bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Server className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Hosting Web Professionale</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                Server dedicati con SSD NVMe, SSL gratuito e CDN globale per prestazioni ottimali.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />SSD NVMe Ultra-veloce</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />SSL Certificato Gratuito</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Backup Automatici</li>
              </ul>
            </div>

            {/* Database */}
            <div className="group bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Database className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Database Gestiti</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                MySQL, PostgreSQL e MongoDB completamente gestiti con backup automatici e alta disponibilità.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />MySQL & PostgreSQL</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Backup Automatici</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Alta Disponibilità</li>
              </ul>
            </div>

            {/* Storage */}
            <div className="group bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <HardDrive className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Storage Scalabile</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                Archiviazione cloud sicura e scalabile per tutti i tuoi dati con crittografia avanzata.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Crittografia AES-256</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Scalabilità Automatica</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />API RESTful</li>
              </ul>
            </div>

            {/* API Services */}
            <div className="group bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">API & Microservizi</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                Piattaforma per sviluppare e distribuire API scalabili con monitoraggio avanzato.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Load Balancing</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Rate Limiting</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Analytics Avanzate</li>
              </ul>
            </div>

            {/* Security */}
            <div className="group bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-br from-red-500 to-red-600 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Sicurezza Avanzata</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                Protezione completa con firewall, DDoS protection e conformità alle normative.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />DDoS Protection</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />WAF Integrato</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />GDPR Compliant</li>
              </ul>
            </div>

            {/* Monitoring */}
            <div className="group bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Monitoraggio 24/7</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                Dashboard avanzate per monitorare prestazioni, utilizzo risorse e metriche in tempo reale.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Metriche Real-time</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Alerting Automatico</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Report Dettagliati</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
              Piani 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Trasparenti</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
              Scegli il piano perfetto per le tue esigenze. Tutti i piani includono supporto 24/7 e SSL gratuito.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Hosting Web */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center">
                    <Server className="w-8 h-8 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">Hosting Web</h3>
                    <p className="text-blue-600 font-medium">Siti Professionali</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-blue-500 mr-3" />
                    <span className="text-gray-700">SSD NVMe 50GB</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-blue-500 mr-3" />
                    <span className="text-gray-700">SSL Certificato Gratuito</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-blue-500 mr-3" />
                    <span className="text-gray-700">Backup Giornalieri</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-blue-500 mr-3" />
                    <span className="text-gray-700">CDN Globale</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-600">A partire da</span>
                      <div className="text-2xl font-bold text-blue-600">€29/mese</div>
                    </div>
                    <Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Inizia Ora
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Database */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center">
                    <Database className="w-8 h-8 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">Database</h3>
                    <p className="text-green-600 font-medium">Gestiti e Sicuri</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">MySQL & PostgreSQL</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Backup Automatici</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Alta Disponibilità</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Monitoraggio 24/7</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-600">A partire da</span>
                      <div className="text-2xl font-bold text-green-600">€15/mese</div>
                    </div>
                    <Link href="/login" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      Inizia Ora
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Storage */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center">
                    <HardDrive className="w-8 h-8 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">Storage</h3>
                    <p className="text-purple-600 font-medium">Scalabile e Sicuro</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-purple-500 mr-3" />
                    <span className="text-gray-700">Crittografia AES-256</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-purple-500 mr-3" />
                    <span className="text-gray-700">API RESTful</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-purple-500 mr-3" />
                    <span className="text-gray-700">Scalabilità Automatica</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-purple-500 mr-3" />
                    <span className="text-gray-700">CDN Integrato</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-600">A partire da</span>
                      <div className="text-2xl font-bold text-purple-600">€49/mese</div>
                    </div>
                    <Link href="/login" className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                      Inizia Ora
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* API Services */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">API Services</h3>
                    <p className="text-orange-600 font-medium">Microservizi</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-orange-500 mr-3" />
                    <span className="text-gray-700">Load Balancing</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-orange-500 mr-3" />
                    <span className="text-gray-700">Rate Limiting</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-orange-500 mr-3" />
                    <span className="text-gray-700">Analytics Avanzate</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-orange-500 mr-3" />
                    <span className="text-gray-700">Auto-scaling</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-600">A partire da</span>
                      <div className="text-2xl font-bold text-orange-600">€25/mese</div>
                    </div>
                    <Link href="/login" className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                      Inizia Ora
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pronto a Trasformare la Tua Infrastruttura?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Inizia oggi stesso con NebulaTech e scopri come possiamo aiutarti a crescere 
              con soluzioni cloud professionali e supporto dedicato.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/login" 
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-3"
              >
                <Cloud className="w-5 h-5" />
                Inizia Subito
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/status" 
                className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-3"
              >
                <BarChart3 className="w-5 h-5" />
                Vedi Status
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}