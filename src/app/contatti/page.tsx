'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefono: '',
    azienda: '',
    servizio: '',
    messaggio: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const servizi = [
    'Hosting Web',
    'Cloud Storage',
    'Servizi di Compute',
    'CDN Globale',
    'Database Management',
    'Backup e Recovery',
    'Consulenza Cloud',
    'Altro'
  ];

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Il nome è obbligatorio';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email è obbligatoria';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Inserisci un\'email valida';
    }
    
    if (!formData.messaggio.trim()) {
      newErrors.messaggio = 'Il messaggio è obbligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulazione invio form
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitted(true);
      setFormData({
        nome: '',
        email: '',
        telefono: '',
        azienda: '',
        servizio: '',
        messaggio: ''
      });
    } catch (error) {
      console.error('Errore invio form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Rimuovi errore quando l'utente inizia a digitare
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-16 sm:pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">Messaggio Inviato!</h1>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 px-4">
              Grazie per averci contattato. Il nostro team ti risponderà entro 24 ore.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              Invia un Altro Messaggio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-16 sm:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
            Contatta
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> NebulaTech</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Siamo qui per aiutarti a trasformare la tua infrastruttura IT. 
            Contattaci per una consulenza gratuita e scopri come possiamo supportare la crescita della tua azienda.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Informazioni di Contatto */}
          <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">Informazioni di Contatto</h2>
              <div className="space-y-4 sm:space-y-6">
                {/* Telefono */}
                <div className="flex items-start space-x-3 sm:space-x-4 px-2">
                  <div className="bg-green-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Telefono</h3>
                    <p className="text-gray-600 text-sm sm:text-base">
                      <a href="tel:+390212345678" className="hover:text-blue-600 transition-colors block sm:inline">
                        +39 02 1234 5678
                      </a>
                      <span className="block sm:inline"><span className="text-xs sm:text-sm text-gray-500">Numero Verde: </span>
                      <a href="tel:800638852" className="hover:text-blue-600 transition-colors">
                        800-NEBULA
                      </a></span>
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-3 sm:space-x-4 px-2">
                  <div className="bg-purple-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Email</h3>
                    <p className="text-gray-600 text-sm sm:text-base">
                      <a href="mailto:info@nebulatech.com" className="hover:text-blue-600 transition-colors block break-all">
                        info@nebulatech.com
                      </a>
                      <a href="mailto:supporto@nebulatech.com" className="hover:text-blue-600 transition-colors text-xs sm:text-sm block break-all">
                        supporto@nebulatech.com
                      </a>
                    </p>
                  </div>
                </div>

                {/* Orari */}
                <div className="flex items-start space-x-3 sm:space-x-4 px-2">
                  <div className="bg-orange-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Orari di Ufficio</h3>
                    <p className="text-gray-600 text-sm sm:text-base">
                      <span className="block">Lunedì - Venerdì: 9:00 - 18:00</span>
                      <span className="block">Sabato: 9:00 - 13:00</span>
                      <span className="text-xs sm:text-sm text-blue-600 font-medium block mt-1">Supporto 24/7 disponibile</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>


          </div>

          {/* Modulo di Contatto */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 order-1 lg:order-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Invia un Messaggio</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Nome */}
              <div>
                <label htmlFor="nome" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base ${
                    errors.nome ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Il tuo nome completo"
                />
                {errors.nome && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.nome}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="la-tua-email@esempio.com"
                />
                {errors.email && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Telefono */}
              <div>
                <label htmlFor="telefono" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Telefono
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                  placeholder="+39 123 456 7890"
                />
              </div>

              {/* Azienda */}
              <div>
                <label htmlFor="azienda" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Azienda
                </label>
                <input
                  type="text"
                  id="azienda"
                  name="azienda"
                  value={formData.azienda}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                  placeholder="Nome della tua azienda"
                />
              </div>

              {/* Servizio */}
              <div>
                <label htmlFor="servizio" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Servizio di Interesse
                </label>
                <select
                  id="servizio"
                  name="servizio"
                  value={formData.servizio}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                >
                  <option value="">Seleziona un servizio</option>
                  {servizi.map((servizio) => (
                    <option key={servizio} value={servizio}>
                      {servizio}
                    </option>
                  ))}
                </select>
              </div>

              {/* Messaggio */}
              <div>
                <label htmlFor="messaggio" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Messaggio *
                </label>
                <textarea
                  id="messaggio"
                  name="messaggio"
                  value={formData.messaggio}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical text-sm sm:text-base ${
                    errors.messaggio ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Descrivi le tue esigenze o fai una domanda..."
                />
                {errors.messaggio && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.messaggio}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base font-medium"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Invio in corso...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Invia Messaggio</span>
                  </>
                )}
              </button>
            </form>

            <p className="text-sm text-gray-500 mt-4 text-center">
              I tuoi dati sono protetti e non verranno condivisi con terze parti.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}