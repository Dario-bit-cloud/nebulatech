'use client';

import { useState } from 'react';
import { useToastHelpers } from '@/components/Toast';
import PageHero from '@/components/PageHero';

export default function Contatti() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToastHelpers();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simula invio del form
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(
        'Messaggio inviato con successo!',
        'Ti contatteremo entro 24 ore per discutere delle tue esigenze.',
        { duration: 6000 }
      );
      
      // Reset form
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast.error(
        'Errore nell\'invio del messaggio',
        'Si è verificato un problema. Riprova più tardi o contattaci direttamente.',
        { duration: 8000 }
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen pt-20">
      <PageHero
        title="Contattaci"
        subtitle="Siamo qui per aiutarti a trovare la soluzione cloud perfetta per la tua azienda. Richiedi una consulenza gratuita oggi stesso."
        backgroundGradient="from-blue-600 to-indigo-700"
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Richiedi Informazioni</h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                      Nome *
                    </label>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Il tuo nome"
                    />
                  </div>
                  <div>
                    <label htmlFor="cognome" className="block text-sm font-medium text-gray-700 mb-2">
                      Cognome *
                    </label>
                    <input
                      type="text"
                      id="cognome"
                      name="cognome"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Il tuo cognome"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="la-tua-email@esempio.com"
                  />
                </div>

                <div>
                  <label htmlFor="azienda" className="block text-sm font-medium text-gray-700 mb-2">
                    Azienda
                  </label>
                  <input
                    type="text"
                    id="azienda"
                    name="azienda"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Nome della tua azienda"
                  />
                </div>

                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefono
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="+39 123 456 7890"
                  />
                </div>

                <div>
                  <label htmlFor="servizio" className="block text-sm font-medium text-gray-700 mb-2">
                    Servizio di Interesse
                  </label>
                  <select
                    id="servizio"
                    name="servizio"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Seleziona un servizio</option>
                    <option value="hosting">Hosting Professionale</option>
                    <option value="storage">Storage Cloud</option>
                    <option value="scalabilita">Scalabilità</option>
                    <option value="consulenza">Consulenza Generale</option>
                    <option value="migrazione">Migrazione Cloud</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="messaggio" className="block text-sm font-medium text-gray-700 mb-2">
                    Messaggio *
                  </label>
                  <textarea
                    id="messaggio"
                    name="messaggio"
                    rows={5}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical"
                    placeholder="Descrivi le tue esigenze o fai una domanda..."
                  ></textarea>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="privacy"
                    name="privacy"
                    required
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="privacy" className="ml-3 text-sm text-gray-600">
                    Accetto la{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                      Privacy Policy
                    </a>{' '}
                    e autorizzo il trattamento dei miei dati personali *
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Invio in corso...
                    </>
                  ) : (
                    'Invia Richiesta'
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Details */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl animate-fade-in-up animation-delay-400">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Informazioni di Contatto</h3>
                <div className="space-y-4">
                  <div className="flex items-center animate-slide-in-left animation-delay-600">
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4 transition-all duration-300 hover:scale-110">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Email</p>
                      <p className="text-gray-600">info@nebulatech.it</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center animate-slide-in-left animation-delay-800">
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4 transition-all duration-300 hover:scale-110">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Telefono</p>
                      <p className="text-gray-600">+39 02 1234 5678</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center animate-slide-in-left animation-delay-1000">
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4 transition-all duration-300 hover:scale-110">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Indirizzo</p>
                      <p className="text-gray-600">Via Tecnologia 123<br />20100 Milano, Italia</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center animate-slide-in-left animation-delay-1200">
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4 transition-all duration-300 hover:scale-110">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Orari</p>
                      <p className="text-gray-600">Lun-Ven: 9:00-18:00<br />Supporto 24/7</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why Choose Us */}
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Perché Scegliere NebulaTech?</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-gray-900">Consulenza Gratuita</h4>
                      <p className="text-gray-600 text-sm">Analisi completa delle tue esigenze senza impegno</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-gray-900">Supporto Dedicato</h4>
                      <p className="text-gray-600 text-sm">Team di esperti sempre a tua disposizione</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-gray-900">Migrazione Assistita</h4>
                      <p className="text-gray-600 text-sm">Ti aiutiamo a migrare senza interruzioni</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-gray-900">Garanzia 99.9%</h4>
                      <p className="text-gray-600 text-sm">Uptime garantito con SLA trasparenti</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Domande Frequenti</h2>
            <p className="text-lg text-gray-600">Risposte alle domande più comuni sui nostri servizi</p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quanto tempo richiede la migrazione?</h3>
              <p className="text-gray-600">I tempi di migrazione dipendono dalla complessità del progetto. Generalmente, una migrazione standard richiede 2-5 giorni lavorativi con zero downtime.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Offrite supporto 24/7?</h3>
              <p className="text-gray-600">Sì, il nostro team di supporto tecnico è disponibile 24 ore su 24, 7 giorni su 7 per tutti i clienti Business ed Enterprise.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Posso cambiare piano in qualsiasi momento?</h3>
              <p className="text-gray-600">Assolutamente sì. Puoi fare upgrade o downgrade del tuo piano in qualsiasi momento senza penali o costi aggiuntivi.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">I miei dati sono sicuri?</h3>
              <p className="text-gray-600">La sicurezza è la nostra priorità. Utilizziamo crittografia end-to-end, backup automatici e rispettiamo tutti gli standard GDPR.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}