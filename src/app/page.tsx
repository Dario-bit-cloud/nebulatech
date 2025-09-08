'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link';
import { ArrowRight, Cloud, Shield, Zap, Users, CheckCircle, Star, Server, Database, Globe, Cpu, BarChart3, Lock } from 'lucide-react';

export default function Home() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])
  return (
    <div className="min-h-screen">
      {/* Hero Section - Redesigned */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 px-4 sm:px-6 lg:px-8 pt-20">
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
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight px-2">
                Il Futuro del
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                  Cloud Computing
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white max-w-5xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200 px-4 text-center font-medium" style={{color: '#ffffff !important'}}>
                Trasforma il tuo business con soluzioni cloud innovative, sicure e scalabili. 
                Infrastrutture di nuova generazione per aziende che guardano al futuro.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-fade-in-up animation-delay-400 px-4 w-full">
              <Link 
                href="/servizi" 
                className="w-full sm:w-auto group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl inline-flex items-center justify-center gap-3 text-base sm:text-lg touch-manipulation"
              >
                <Cloud className="w-5 h-5 sm:w-6 sm:h-6" />
                Esplora i Servizi
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              {user && (
                <Link 
                  href="/dashboard" 
                  className="w-full sm:w-auto group border-2 border-white/30 text-white px-6 sm:px-8 py-4 rounded-xl font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-3 text-base sm:text-lg backdrop-blur-sm touch-manipulation"
                >
                  <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-12 sm:mt-20 animate-fade-in-up animation-delay-600 px-2">
            <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">99.9%</div>
              <div className="text-blue-200 text-xs sm:text-sm">Uptime Garantito</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">24/7</div>
              <div className="text-blue-200 text-xs sm:text-sm">Supporto Tecnico</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">50+</div>
              <div className="text-blue-200 text-xs sm:text-sm">Clienti Soddisfatti</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">5</div>
              <div className="text-blue-200 text-xs sm:text-sm">Data Center</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>
      
      {/* Services Section - Redesigned */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
              Perché Scegliere 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">NebulaTech</span>?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
              Trasformiamo il modo in cui la tua azienda gestisce dati, applicazioni e infrastrutture 
              con soluzioni cloud di nuova generazione.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 lg:mb-20">
            {/* Card 1 */}
            <div className="group bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Server className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Infrastruttura Globale</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Data center distribuiti in tutto il mondo per prestazioni ottimali e latenza minima.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Sicurezza Avanzata</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Crittografia end-to-end, backup automatici e conformità alle normative internazionali.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Prestazioni Elevate</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                SSD NVMe, CDN globale e ottimizzazioni automatiche per velocità massime.
              </p>
            </div>

            {/* Card 4 */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Supporto 24/7</h3>
              <p className="text-gray-600 leading-relaxed">
                Team di esperti sempre disponibile per assistenza tecnica e consulenza.
              </p>
            </div>

            {/* Card 5 */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Database className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Scalabilità Infinita</h3>
              <p className="text-gray-600 leading-relaxed">
                Risorse che crescono con il tuo business, senza limiti e senza interruzioni.
              </p>
            </div>

            {/* Card 6 */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">API Moderne</h3>
              <p className="text-gray-600 leading-relaxed">
                Integrazione semplice con le tue applicazioni esistenti tramite API RESTful.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
              <h3 className="text-3xl font-bold mb-6">Pronto a Trasformare il Tuo Business?</h3>
              <p className="text-xl sm:text-2xl text-white mb-8 max-w-3xl mx-auto text-center font-medium leading-relaxed" style={{color: '#ffffff !important'}}>
                Scopri come NebulaTech può accelerare la crescita della tua azienda con soluzioni cloud innovative.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/servizi" 
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 hover:scale-105 inline-flex items-center gap-3"
                >
                  <Cloud className="w-5 h-5" />
                  Esplora i Servizi
                </Link>
                <Link 
                  href="/login" 
                  className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 hover:scale-105 inline-flex items-center gap-3"
                >
                  <Users className="w-5 h-5" />
                  Inizia Subito
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
