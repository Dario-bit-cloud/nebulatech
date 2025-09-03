import Hero from '@/components/Hero';
import Link from 'next/link';
import { ArrowRight, Cloud, Shield, Zap, Users, CheckCircle, Star } from 'lucide-react';
import PageHero from '@/components/PageHero';

export default function Home() {
  return (
    <div className="min-h-screen">
      <PageHero
        title={<>Il Futuro del <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Cloud Computing</span></>}
        subtitle="Soluzioni cloud innovative, sicure e scalabili per trasformare il tuo business nell'era digitale"
        backgroundGradient="from-blue-600 via-indigo-700 to-purple-800"
        className="py-20"
      >
        <div className="flex justify-center animate-fade-in-up animation-delay-600">
          <Link href="/servizi" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 hover:scale-105 inline-flex items-center gap-2">
            Scopri i Servizi
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </PageHero>
      
      {/* Service Description Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Perché Scegliere NebulaTech?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Offriamo soluzioni cloud innovative che trasformano il modo in cui la tua azienda 
              gestisce dati, applicazioni e infrastrutture.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Tecnologia All&apos;Avanguardia
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900">Infrastruttura Globale</h4>
                    <p className="text-gray-600">Data center distribuiti in tutto il mondo per prestazioni ottimali</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900">Monitoraggio 24/7</h4>
                    <p className="text-gray-600">Supporto tecnico sempre disponibile e monitoraggio continuo</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900">API Avanzate</h4>
                    <p className="text-gray-600">Integrazione semplice con le tue applicazioni esistenti</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl">
              <div className="text-center">
                <div className="bg-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Pronto a Iniziare?</h3>
                <p className="text-gray-600 mb-6">
                  Scopri come NebulaTech può trasformare la tua infrastruttura IT
                </p>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">99.2%</div>
              <div className="text-gray-600">Uptime Medio</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">23</div>
              <div className="text-gray-600">Clienti Attivi</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">1</div>
              <div className="text-gray-600">Data Center Locale</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">9-18</div>
              <div className="text-gray-600">Supporto Tecnico</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
