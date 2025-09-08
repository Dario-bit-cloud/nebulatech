'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Mic, MicOff, Volume2, VolumeX, Bot, User, Loader2 } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'assistant'
  timestamp: Date
  isTyping?: boolean
  audioUrl?: string
}

interface AssistenteVirtualeProps {
  isOpen: boolean
  onClose: () => void
}

const AssistenteVirtuale = ({ isOpen, onClose }: AssistenteVirtualeProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Ciao! Sono Alex, il tuo assistente virtuale NebulaTech. Come posso aiutarti oggi?',
      sender: 'assistant',
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'it-IT'

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputText(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    // Initialize speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [])

  // AI Response Generator
  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()
    
    // Saluti
    if (message.includes('ciao') || message.includes('salve') || message.includes('buongiorno') || message.includes('buonasera')) {
      const greetings = [
        'Ciao! È un piacere parlare con te. Come posso esserti utile?',
        'Salve! Sono qui per aiutarti con qualsiasi domanda tu abbia.',
        'Buongiorno! Spero tu stia avendo una giornata fantastica. Di cosa hai bisogno?'
      ]
      return greetings[Math.floor(Math.random() * greetings.length)]
    }
    
    // Servizi NebulaTech
    if (message.includes('servizi') || message.includes('hosting') || message.includes('cloud')) {
      return 'NebulaTech offre una gamma completa di servizi cloud: hosting web, storage sicuro, server virtuali, backup automatici e molto altro. Vuoi sapere di più su un servizio specifico?'
    }
    
    // Prezzi
    if (message.includes('prezzo') || message.includes('costo') || message.includes('piano') || message.includes('tariff')) {
      return 'I nostri piani partono da €9.99/mese per l\'hosting base. Abbiamo soluzioni per ogni esigenza: Basic, Professional ed Enterprise. Vuoi che ti mostri i dettagli dei piani?'
    }
    
    // Supporto tecnico
    if (message.includes('problema') || message.includes('errore') || message.includes('aiuto') || message.includes('supporto')) {
      return 'Sono qui per aiutarti! Puoi descrivermi il problema che stai riscontrando? Il nostro team di supporto è disponibile 24/7 per assisterti.'
    }
    
    // Informazioni azienda
    if (message.includes('nebulatech') || message.includes('azienda') || message.includes('chi siete')) {
      return 'NebulaTech è un provider cloud innovativo che offre soluzioni scalabili e sicure per aziende di ogni dimensione. Siamo specializzati in hosting, storage e servizi cloud enterprise.'
    }
    
    // Contatti
    if (message.includes('contatto') || message.includes('telefono') || message.includes('email')) {
      return 'Puoi contattarci via email a info@nebulatech.com o tramite il nostro sistema di ticket. Il nostro team risponde entro 2 ore durante gli orari lavorativi.'
    }
    
    // Sicurezza
    if (message.includes('sicurezza') || message.includes('backup') || message.includes('protezione')) {
      return 'La sicurezza è la nostra priorità! Offriamo crittografia SSL, backup automatici giornalieri, firewall avanzati e monitoraggio 24/7 per proteggere i tuoi dati.'
    }
    
    // Risposta generica intelligente
    const genericResponses = [
      'Interessante domanda! Puoi fornirmi più dettagli così posso aiutarti meglio?',
      'Capisco la tua richiesta. Lascia che ti aiuti a trovare la soluzione migliore.',
      'Ottima domanda! Sono qui per fornirti tutte le informazioni di cui hai bisogno.',
      'Perfetto! Dimmi di più così posso darti una risposta più precisa e utile.'
    ]
    
    return genericResponses[Math.floor(Math.random() * genericResponses.length)]
  }

  // Text-to-Speech function
  const speakText = (text: string) => {
    if (!voiceEnabled || !synthRef.current) return
    
    synthRef.current.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'it-IT'
    utterance.rate = 0.9
    utterance.pitch = 1
    
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    
    synthRef.current.speak(utterance)
  }

  // Send message function
  const sendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputText)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
      
      // Speak the response if voice is enabled
      if (voiceEnabled) {
        speakText(aiResponse)
      }
    }, 1000 + Math.random() * 2000) // Random delay between 1-3 seconds
  }

  // Voice input toggle
  const toggleVoiceInput = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-[600px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Alex - Assistente NebulaTech</h3>
              <div className="text-blue-100 text-sm flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Online
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`p-2 rounded-full transition-colors ${
                voiceEnabled ? 'bg-white bg-opacity-20' : 'bg-red-500 bg-opacity-80'
              }`}
              title={voiceEnabled ? 'Disabilita audio' : 'Abilita audio'}
            >
              {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-md'
                    : 'bg-white text-gray-800 rounded-bl-md shadow-sm border'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.sender === 'assistant' && (
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p className={`text-xs mt-2 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString('it-IT', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  {message.sender === 'user' && (
                    <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border max-w-[80%]">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Scrivi un messaggio..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isListening}
              />
              {isListening && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                </div>
              )}
            </div>
            
            <button
              onClick={toggleVoiceInput}
              className={`p-3 rounded-full transition-all duration-200 ${
                isListening
                  ? 'bg-red-500 text-white shadow-lg scale-110'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={isListening ? 'Stop registrazione' : 'Inizia registrazione vocale'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            
            <button
              onClick={sendMessage}
              disabled={!inputText.trim() || isListening}
              className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Invia messaggio"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          {isSpeaking && (
            <div className="mt-2 flex items-center justify-center text-sm text-blue-600">
              <Volume2 className="w-4 h-4 mr-2 animate-pulse" />
              Alex sta parlando...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AssistenteVirtuale