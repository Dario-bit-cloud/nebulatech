'use client';

import { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Building2, Users, Award } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  rating: number;
  text: string;
  avatar: string;
  companyLogo?: string;
  date: string;
  service: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Marco Rossi",
    role: "CTO",
    company: "TechStart SRL",
    rating: 5,
    text: "NebulaTech ha trasformato completamente la nostra infrastruttura cloud. La migrazione è stata seamless e il supporto tecnico è eccezionale. Abbiamo ridotto i costi del 40% mantenendo performance superiori.",
    avatar: "MR",
    date: "Dicembre 2024",
    service: "Cloud Migration"
  },
  {
    id: 2,
    name: "Laura Bianchi",
    role: "IT Director",
    company: "Innovate Corp",
    rating: 5,
    text: "Il team di NebulaTech è incredibilmente professionale. Hanno implementato una soluzione di backup e disaster recovery che ci ha salvato durante un'emergenza. Consiglio vivamente i loro servizi.",
    avatar: "LB",
    date: "Novembre 2024",
    service: "Disaster Recovery"
  },
  {
    id: 3,
    name: "Alessandro Verde",
    role: "Founder & CEO",
    company: "StartupHub",
    rating: 5,
    text: "Come startup, avevamo bisogno di una soluzione scalabile e cost-effective. NebulaTech ci ha fornito esattamente quello che cercavamo. La loro piattaforma cresce con noi.",
    avatar: "AV",
    date: "Ottobre 2024",
    service: "Cloud Hosting"
  },
  {
    id: 4,
    name: "Giulia Neri",
    role: "DevOps Manager",
    company: "Digital Solutions",
    rating: 5,
    text: "L'automazione e il monitoraggio forniti da NebulaTech hanno rivoluzionato il nostro workflow. Deployment più veloci, meno downtime e una visibilità completa sull'infrastruttura.",
    avatar: "GN",
    date: "Settembre 2024",
    service: "DevOps Automation"
  },
  {
    id: 5,
    name: "Roberto Blu",
    role: "System Administrator",
    company: "Enterprise Ltd",
    rating: 4,
    text: "Ottima esperienza con NebulaTech. Il supporto 24/7 è realmente disponibile e competente. Hanno risolto ogni nostro problema in tempi record. Unico neo: vorrei più opzioni di personalizzazione.",
    avatar: "RB",
    date: "Agosto 2024",
    service: "Managed Services"
  },
  {
    id: 6,
    name: "Francesca Gialli",
    role: "Data Scientist",
    company: "Analytics Pro",
    rating: 5,
    text: "Per i nostri workload di machine learning, NebulaTech offre le performance e la flessibilità che ci servono. GPU on-demand e storage ad alta velocità hanno accelerato i nostri progetti.",
    avatar: "FG",
    date: "Luglio 2024",
    service: "High Performance Computing"
  }
];

const stats = [
  { label: "Clienti Soddisfatti", value: "500+", icon: Users },
  { label: "Uptime Garantito", value: "99.9%", icon: Award },
  { label: "Progetti Completati", value: "1200+", icon: Building2 }
];

export default function TestimonianzePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedService, setSelectedService] = useState('all');

  const services = ['all', 'Cloud Migration', 'Disaster Recovery', 'Cloud Hosting', 'DevOps Automation', 'Managed Services', 'High Performance Computing'];
  
  const filteredTestimonials = selectedService === 'all' 
    ? testimonials 
    : testimonials.filter(t => t.service === selectedService);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredTestimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredTestimonials.length) % filteredTestimonials.length);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const currentTestimonial = filteredTestimonials[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Cosa Dicono i Nostri <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Clienti</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Scopri come NebulaTech ha aiutato aziende di ogni dimensione a trasformare la loro infrastruttura cloud
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Filtra per Servizio</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {services.map((service) => (
              <button
                key={service}
                onClick={() => {
                  setSelectedService(service);
                  setCurrentIndex(0);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedService === service
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:text-blue-600 border border-gray-300 hover:border-blue-300'
                }`}
              >
                {service === 'all' ? 'Tutti i Servizi' : service}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Testimonial */}
      {currentTestimonial && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <Quote className="w-12 h-12 text-blue-600" />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Testimonianza in Evidenza</h3>
                    <p className="text-gray-600">{currentTestimonial.service}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={prevTestimonial}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    disabled={filteredTestimonials.length <= 1}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    disabled={filteredTestimonials.length <= 1}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 items-center">
                <div className="md:col-span-2">
                  <blockquote className="text-xl text-gray-700 leading-relaxed mb-6">
                    "{currentTestimonial.text}"
                  </blockquote>
                  <div className="flex items-center gap-2 mb-4">
                    {renderStars(currentTestimonial.rating)}
                    <span className="text-sm text-gray-600 ml-2">
                      {currentTestimonial.rating}/5 stelle
                    </span>
                  </div>
                </div>
                
                <div className="text-center md:text-right">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white text-2xl font-bold mb-4">
                    {currentTestimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{currentTestimonial.name}</div>
                    <div className="text-gray-600">{currentTestimonial.role}</div>
                    <div className="text-blue-600 font-medium">{currentTestimonial.company}</div>
                    <div className="text-sm text-gray-500 mt-2">{currentTestimonial.date}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Testimonials Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Tutte le Testimonianze
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="flex items-center gap-2 mb-4">
                {renderStars(testimonial.rating)}
                <span className="text-sm text-gray-600 ml-2">
                  {testimonial.rating}/5
                </span>
              </div>
              
              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.text}"
              </blockquote>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-semibold">
                  {testimonial.avatar}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-sm text-blue-600">{testimonial.company}</div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {testimonial.service}
                  </span>
                  <span className="text-gray-500">{testimonial.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Vuoi Essere il Prossimo Cliente Soddisfatto?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Unisciti a centinaia di aziende che hanno trasformato la loro infrastruttura con NebulaTech
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/contatti'}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contattaci Ora
            </button>
            <button
              onClick={() => window.location.href = '/calcolatore'}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Calcola il Tuo Preventivo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}