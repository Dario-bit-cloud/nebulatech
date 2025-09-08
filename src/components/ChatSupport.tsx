'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  typing?: boolean;
}

const BOT_RESPONSES = {
  greetings: [
    "Ciao! Sono Alex, il tuo assistente virtuale NebulaTech. Come posso aiutarti oggi?",
    "Benvenuto! Sono qui per rispondere alle tue domande sui nostri servizi cloud.",
    "Salve! Sono l'assistente NebulaTech. In cosa posso esserti utile?"
  ],
  pricing: [
    "Per informazioni sui prezzi, ti consiglio di utilizzare il nostro calcolatore interattivo. Puoi configurare i servizi di cui hai bisogno e ottenere un preventivo personalizzato.",
    "I nostri piani partono da €9.99/mese per il piano Basic. Vuoi che ti mostri le opzioni disponibili?",
    "Offriamo soluzioni flessibili per ogni budget. Il calcolatore prezzi ti aiuterà a trovare la configurazione perfetta per le tue esigenze."
  ],
  technical: [
    "Per supporto tecnico avanzato, posso metterti in contatto con un nostro specialista. Nel frattempo, puoi controllare lo stato dei servizi nella sezione Monitoraggio.",
    "Che tipo di problema tecnico stai riscontrando? Posso fornirti alcune soluzioni immediate o escalare la richiesta al team tecnico.",
    "Il nostro team tecnico è disponibile 24/7. Descrivi il problema e ti fornirò assistenza immediata o ti metterò in contatto con uno specialista."
  ],
  services: [
    "NebulaTech offre hosting web, storage cloud, servizi di compute e CDN globale. Quale servizio ti interessa di più?",
    "I nostri servizi principali includono hosting professionale, storage scalabile e soluzioni di backup. Vuoi saperne di più su qualcuno in particolare?",
    "Offriamo una gamma completa di servizi cloud: hosting, database, storage, CDN e molto altro. Cosa stai cercando?"
  ],
  contact: [
    "Puoi contattarci tramite il form nella pagina Contatti, via email a info@nebulatech.com o chiamando il +39 02 1234 5678.",
    "Il nostro team commerciale è disponibile dal lunedì al venerdì, 9:00-18:00. Vuoi che programmi una chiamata?",
    "Per richieste urgenti, usa il numero verde 800-NEBULA. Per tutto il resto, il form contatti è il modo più veloce."
  ],
  default: [
    "Interessante domanda! Lascia che controlli le informazioni più aggiornate per te.",
    "Capisco la tua richiesta. Ti metto in contatto con uno specialista che potrà aiutarti meglio.",
    "Grazie per la domanda. Per una risposta dettagliata, ti consiglio di contattare il nostro team commerciale."
  ]
};

const QUICK_ACTIONS = [
  { text: "💰 Prezzi e piani", category: "pricing" },
  { text: "🔧 Supporto tecnico", category: "technical" },
  { text: "☁️ I nostri servizi", category: "services" },
  { text: "📞 Come contattarci", category: "contact" }
];

export default function ChatSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Ciao! Sono Alex, il tuo assistente virtuale NebulaTech. Come posso aiutarti oggi?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('prezzo') || message.includes('costo') || message.includes('piano')) {
      return BOT_RESPONSES.pricing[Math.floor(Math.random() * BOT_RESPONSES.pricing.length)];
    }
    if (message.includes('tecnico') || message.includes('problema') || message.includes('errore')) {
      return BOT_RESPONSES.technical[Math.floor(Math.random() * BOT_RESPONSES.technical.length)];
    }
    if (message.includes('servizio') || message.includes('hosting') || message.includes('storage')) {
      return BOT_RESPONSES.services[Math.floor(Math.random() * BOT_RESPONSES.services.length)];
    }
    if (message.includes('contatto') || message.includes('telefono') || message.includes('email')) {
      return BOT_RESPONSES.contact[Math.floor(Math.random() * BOT_RESPONSES.contact.length)];
    }
    if (message.includes('ciao') || message.includes('salve') || message.includes('buongiorno')) {
      return BOT_RESPONSES.greetings[Math.floor(Math.random() * BOT_RESPONSES.greetings.length)];
    }
    
    return BOT_RESPONSES.default[Math.floor(Math.random() * BOT_RESPONSES.default.length)];
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simula tempo di risposta del bot
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(text),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
      
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }
    }, 1000 + Math.random() * 2000);
  };

  const handleQuickAction = (category: string) => {
    const responses = BOT_RESPONSES[category as keyof typeof BOT_RESPONSES] || BOT_RESPONSES.default;
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    const botMessage: Message = {
      id: Date.now().toString(),
      text: response,
      sender: 'bot',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, botMessage]);
  };

  const handleOpen = () => {
    setIsOpen(true);
    setUnreadCount(0);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('it-IT', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 z-50 group"
        >
          <div className="relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 21l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Hai bisogno di aiuto?
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-4 sm:bottom-6 sm:right-6 sm:inset-auto sm:w-80 sm:h-96 w-auto h-auto bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50 max-h-[calc(100vh-2rem)] sm:max-h-96">
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 sm:p-4 rounded-t-lg flex justify-between items-center flex-shrink-0">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                A
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm sm:text-base truncate">Alex - Assistente NebulaTech</h3>
                <p className="text-xs text-blue-100 truncate">🟢 Online - Risponde in ~2 min</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 min-h-0">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] sm:max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p>{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 px-3 py-2 rounded-lg text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="px-3 sm:px-4 pb-2 flex-shrink-0">
              <p className="text-xs text-gray-500 mb-2">Domande frequenti:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {QUICK_ACTIONS.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.category)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-2 sm:py-1 rounded transition-colors text-left"
                  >
                    {action.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 sm:p-4 border-t border-gray-200 flex-shrink-0">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputText)}
                placeholder="Scrivi un messaggio..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
              />
              <button
                onClick={() => sendMessage(inputText)}
                disabled={!inputText.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-3 py-2 rounded-lg transition-colors flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Powered by NebulaTech AI Assistant
            </p>
          </div>
        </div>
      )}
    </>
  );
}