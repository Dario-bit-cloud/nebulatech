'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useCloudGaming } from '@/contexts/CloudGamingContext'
import { Terminal, Maximize2, Minimize2, X, Power } from 'lucide-react'

interface TerminalLine {
  id: string
  type: 'input' | 'output' | 'error' | 'system'
  content: string
  timestamp: Date
}

interface CommandHistory {
  commands: string[]
  currentIndex: number
}

export default function TerminalePage() {
  const [lines, setLines] = useState<TerminalLine[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [commandHistory, setCommandHistory] = useState<CommandHistory>({
    commands: [],
    currentIndex: -1
  })
  
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { isCloudGamingEnabled, enableCloudGaming, disableCloudGaming } = useCloudGaming()

  // Generate unique ID for lines
  const generateId = useCallback(() => {
    return `line_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }, [])

  // Auto-scroll to bottom when new lines are added
  useEffect(() => {
    if (terminalRef.current) {
      const scrollElement = terminalRef.current
      scrollElement.scrollTop = scrollElement.scrollHeight
    }
  }, [lines])

  // Focus input on mount and when clicking terminal
  useEffect(() => {
    const focusInput = () => {
      if (inputRef.current && !isTyping) {
        inputRef.current.focus()
      }
    }
    
    focusInput()
    
    // Add click listener to terminal
    const terminal = terminalRef.current
    if (terminal) {
      terminal.addEventListener('click', focusInput)
      return () => terminal.removeEventListener('click', focusInput)
    }
  }, [isTyping])

  // Initialize terminal with welcome message
  useEffect(() => {
    const initializeTerminal = () => {
      const welcomeLines: TerminalLine[] = [
        {
          id: generateId(),
          type: 'system',
          content: '╔══════════════════════════════════════════════════════════════╗',
          timestamp: new Date()
        },
        {
          id: generateId(),
          type: 'system',
          content: '║                    NebulaTech Terminal v3.0                  ║',
          timestamp: new Date()
        },
        {
          id: generateId(),
          type: 'system',
          content: '║                  Sistema Operativo Cloud                     ║',
          timestamp: new Date()
        },
        {
          id: generateId(),
          type: 'system',
          content: '╚══════════════════════════════════════════════════════════════╝',
          timestamp: new Date()
        },
        {
          id: generateId(),
          type: 'output',
          content: '',
          timestamp: new Date()
        },
        {
          id: generateId(),
          type: 'output',
          content: '🚀 Benvenuto nel terminale di NebulaTech!',
          timestamp: new Date()
        },
        {
          id: generateId(),
          type: 'output',
          content: '📋 Comandi disponibili:',
          timestamp: new Date()
        },
        {
          id: generateId(),
          type: 'output',
          content: '   • help           - Mostra tutti i comandi disponibili',
          timestamp: new Date()
        },
        {
          id: generateId(),
          type: 'output',
          content: '   • clear          - Pulisce il terminale',
          timestamp: new Date()
        },
        {
          id: generateId(),
          type: 'output',
          content: '   • date           - Mostra data e ora corrente',
          timestamp: new Date()
        },
        {
          id: generateId(),
          type: 'output',
          content: '   • version        - Informazioni sulla versione',
          timestamp: new Date()
        },
        {
          id: generateId(),
          type: 'output',
          content: '   • echo [testo]   - Ripete il testo inserito',
          timestamp: new Date()
        },
        {
          id: generateId(),
          type: 'output',
          content: '   • history        - Mostra cronologia comandi',
          timestamp: new Date()
        },
        {
          id: generateId(),
          type: 'output',
          content: '🎮 Cloud Gaming:',
          timestamp: new Date()
        },
        {
          id: generateId(),
          type: 'output',
          content: '   • cloud enable   - Abilita Cloud Gaming',
          timestamp: new Date()
        },
        {
          id: generateId(),
          type: 'output',
          content: '   • cloud disable  - Disabilita Cloud Gaming',
          timestamp: new Date()
        },
        {
          id: generateId(),
          type: 'output',
          content: '   • cloud status   - Stato Cloud Gaming',
          timestamp: new Date()
        },
        {
          id: generateId(),
          type: 'output',
          content: '',
          timestamp: new Date()
        },
        {
          id: generateId(),
          type: 'output',
          content: '💡 Suggerimento: Usa le frecce ↑↓ per navigare nella cronologia',
          timestamp: new Date()
        },
        {
          id: generateId(),
          type: 'output',
          content: '',
          timestamp: new Date()
        }
      ]
      
      setLines(welcomeLines)
    }

    initializeTerminal()
  }, [generateId])

  const addLine = useCallback((type: TerminalLine['type'], content: string) => {
    const newLine: TerminalLine = {
      id: generateId(),
      type,
      content,
      timestamp: new Date()
    }
    
    setLines(prev => [...prev, newLine])
  }, [generateId])

  const typewriterEffect = useCallback((text: string, type: 'output' | 'error' = 'output') => {
    setIsTyping(true)
    const words = text.split(' ')
    let currentText = ''
    let lineId = generateId()
    
    // Add initial empty line
    setLines(prev => [...prev, {
      id: lineId,
      type,
      content: '',
      timestamp: new Date()
    }])
    
    words.forEach((word, index) => {
      setTimeout(() => {
        currentText += (index > 0 ? ' ' : '') + word
        
        setLines(prev => {
          const newLines = [...prev]
          const lineIndex = newLines.findIndex(line => line.id === lineId)
          if (lineIndex !== -1) {
            newLines[lineIndex] = {
              ...newLines[lineIndex],
              content: currentText
            }
          }
          return newLines
        })
        
        if (index === words.length - 1) {
          setIsTyping(false)
        }
      }, index * 80)
    })
  }, [generateId])

  const executeCommand = useCallback((command: string) => {
    const trimmedCommand = command.trim()
    const lowerCommand = trimmedCommand.toLowerCase()
    
    // Add command to history
    if (trimmedCommand) {
      setCommandHistory(prev => ({
        commands: [...prev.commands, trimmedCommand],
        currentIndex: -1
      }))
    }
    
    // Add input line
    addLine('input', `nebulatech@cloud:~$ ${trimmedCommand}`)
    
    // Process command
    switch (lowerCommand) {
      case 'help':
        addLine('output', '')
        addLine('output', '📋 COMANDI DISPONIBILI:')
        addLine('output', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        addLine('output', '🔧 SISTEMA:')
        addLine('output', '   help           - Mostra questo messaggio di aiuto')
        addLine('output', '   clear          - Pulisce il terminale')
        addLine('output', '   date           - Mostra data e ora corrente')
        addLine('output', '   version        - Informazioni sulla versione del sistema')
        addLine('output', '   history        - Mostra cronologia dei comandi')
        addLine('output', '')
        addLine('output', '💬 UTILITÀ:')
        addLine('output', '   echo [testo]   - Ripete il testo inserito')
        addLine('output', '')
        addLine('output', '🎮 CLOUD GAMING:')
        addLine('output', '   cloud enable   - Abilita la sezione Cloud Gaming')
        addLine('output', '   cloud disable  - Disabilita la sezione Cloud Gaming')
        addLine('output', '   cloud status   - Mostra lo stato del Cloud Gaming')
        addLine('output', '')
        addLine('output', '💡 SUGGERIMENTI:')
        addLine('output', '   • Usa ↑↓ per navigare nella cronologia comandi')
        addLine('output', '   • Usa Tab per completamento automatico (futuro)')
        addLine('output', '   • Usa Ctrl+C per interrompere operazioni')
        addLine('output', '')
        break
        
      case 'clear':
        setLines([])
        break
        
      case 'cloud enable':
        if (!isCloudGamingEnabled) {
          enableCloudGaming()
          typewriterEffect('✅ Cloud Gaming abilitato con successo!')
          setTimeout(() => {
            addLine('output', '🎮 La sezione Cloud Gaming è ora visibile nel menu di navigazione.')
            addLine('output', '⚠️  Nota: Questa funzionalità è ancora in versione BETA.')
            addLine('output', '🔗 Vai alla sezione Cloud Gaming per iniziare a giocare!')
          }, 1500)
        } else {
          addLine('error', '❌ Cloud Gaming è già abilitato!')
          addLine('output', '💡 Usa "cloud status" per verificare lo stato corrente.')
        }
        break
        
      case 'cloud disable':
        if (isCloudGamingEnabled) {
          disableCloudGaming()
          typewriterEffect('🔒 Cloud Gaming disabilitato.')
          setTimeout(() => {
            addLine('output', '📱 La sezione Cloud Gaming è stata rimossa dal menu.')
            addLine('output', '💡 Usa "cloud enable" per riabilitarla quando necessario.')
          }, 1200)
        } else {
          addLine('error', '❌ Cloud Gaming è già disabilitato!')
          addLine('output', '💡 Usa "cloud enable" per abilitarlo.')
        }
        break
        
      case 'cloud status':
        addLine('output', '')
        addLine('output', '🎮 ═══════════ STATO CLOUD GAMING ═══════════')
        addLine('output', `📊 Stato: ${isCloudGamingEnabled ? '✅ ABILITATO' : '❌ DISABILITATO'}`)
        addLine('output', `🔧 Modalità: ${isCloudGamingEnabled ? 'Attiva' : 'Inattiva'}`)
        addLine('output', `📱 Menu: ${isCloudGamingEnabled ? 'Visibile' : 'Nascosto'}`)
        addLine('output', `🚀 Versione: BETA v1.2.0`)
        addLine('output', `⚡ Performance: ${isCloudGamingEnabled ? 'Ottimizzata' : 'Standby'}`)
        addLine('output', '═══════════════════════════════════════════════')
        addLine('output', '')
        break
        
      case 'date':
        const now = new Date()
        addLine('output', '')
        addLine('output', `📅 Data: ${now.toLocaleDateString('it-IT', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}`)
        addLine('output', `🕐 Ora: ${now.toLocaleTimeString('it-IT')}`)
        addLine('output', `🌍 Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`)
        addLine('output', '')
        break
        
      case 'version':
        addLine('output', '')
        addLine('output', '🚀 ═══════════ INFORMAZIONI SISTEMA ═══════════')
        addLine('output', '   NebulaTech Terminal v3.0.0')
        addLine('output', '   Sistema Operativo Cloud')
        addLine('output', '   Build: 2024.01.15-stable')
        addLine('output', '   Architettura: x64')
        addLine('output', '   Runtime: Next.js 14 + React 18')
        addLine('output', '   Copyright (c) 2024 NebulaTech S.r.l.')
        addLine('output', '   Tutti i diritti riservati.')
        addLine('output', '═══════════════════════════════════════════════')
        addLine('output', '')
        break
        
      case 'history':
        addLine('output', '')
        if (commandHistory.commands.length === 0) {
          addLine('output', '📝 Cronologia comandi vuota.')
        } else {
          addLine('output', '📝 CRONOLOGIA COMANDI:')
          addLine('output', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
          commandHistory.commands.forEach((cmd, index) => {
            addLine('output', `   ${(index + 1).toString().padStart(3, ' ')}. ${cmd}`)
          })
        }
        addLine('output', '')
        break
        
      default:
        if (lowerCommand.startsWith('echo ')) {
          const text = trimmedCommand.substring(5)
          if (text.trim()) {
            addLine('output', text)
          } else {
            addLine('output', '')
          }
        } else if (trimmedCommand === '') {
          // Empty command, just add a new line
          addLine('output', '')
        } else {
          addLine('error', `❌ Comando '${trimmedCommand}' non riconosciuto.`)
          addLine('output', '💡 Digita "help" per vedere tutti i comandi disponibili.')
        }
        break
    }
    
    // Add empty line after command execution
    if (lowerCommand !== 'clear') {
      addLine('output', '')
    }
  }, [addLine, typewriterEffect, isCloudGamingEnabled, enableCloudGaming, disableCloudGaming, commandHistory])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (isTyping) return

    switch (e.key) {
      case 'Enter':
        if (currentInput.trim() || currentInput === '') {
          executeCommand(currentInput)
          setCurrentInput('')
          setCommandHistory(prev => ({ ...prev, currentIndex: -1 }))
        }
        break
        
      case 'ArrowUp':
        e.preventDefault()
        if (commandHistory.commands.length > 0) {
          const newIndex = commandHistory.currentIndex === -1 
            ? commandHistory.commands.length - 1
            : Math.max(0, commandHistory.currentIndex - 1)
          setCommandHistory(prev => ({ ...prev, currentIndex: newIndex }))
          setCurrentInput(commandHistory.commands[newIndex] || '')
        }
        break
        
      case 'ArrowDown':
        e.preventDefault()
        if (commandHistory.currentIndex !== -1) {
          const newIndex = commandHistory.currentIndex + 1
          if (newIndex >= commandHistory.commands.length) {
            setCommandHistory(prev => ({ ...prev, currentIndex: -1 }))
            setCurrentInput('')
          } else {
            setCommandHistory(prev => ({ ...prev, currentIndex: newIndex }))
            setCurrentInput(commandHistory.commands[newIndex])
          }
        }
        break
        
      case 'Tab':
        e.preventDefault()
        // Future: implement command completion
        break
        
      case 'c':
        if (e.ctrlKey) {
          e.preventDefault()
          if (isTyping) {
            setIsTyping(false)
          }
          setCurrentInput('')
          addLine('output', '^C')
        }
        break
    }
  }, [currentInput, executeCommand, isTyping, commandHistory, addLine])

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev)
  }, [])

  const handleTerminalClick = useCallback(() => {
    if (inputRef.current && !isTyping) {
      inputRef.current.focus()
    }
  }, [isTyping])

  return (
    <div className={`bg-slate-900 text-green-400 font-mono transition-all duration-300 ${
      isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen'
    }`}>
      <div className={`${isFullscreen ? 'h-full' : 'container mx-auto'} p-2 sm:p-4 lg:p-6`}>
        <div className={`bg-gray-900 rounded-lg border border-gray-700 shadow-2xl overflow-hidden ${
          isFullscreen ? 'h-full' : 'h-[calc(100vh-4rem)] sm:h-[calc(100vh-6rem)] lg:h-[calc(100vh-8rem)]'
        }`}>
          {/* Terminal Header */}
          <div className="bg-gray-800 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1.5 sm:space-x-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full hover:bg-red-400 transition-colors cursor-pointer"></div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-colors cursor-pointer"></div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full hover:bg-green-400 transition-colors cursor-pointer"></div>
              </div>
              <div className="flex items-center space-x-2">
                <Terminal size={16} className="text-green-400" />
                <span className="text-gray-300 text-xs sm:text-sm font-medium">
                  NebulaTech Terminal v3.0
                </span>
              </div>
            </div>
            
            {/* Terminal Controls */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="hidden sm:flex items-center space-x-2 mr-2">
                <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${
                  isCloudGamingEnabled 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-600 text-gray-300'
                }`}>
                  <Power size={10} />
                  <span>Gaming: {isCloudGamingEnabled ? 'ON' : 'OFF'}</span>
                </div>
              </div>
              
              <button
                onClick={toggleFullscreen}
                className="p-1 sm:p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                title={isFullscreen ? 'Esci da schermo intero' : 'Schermo intero'}
              >
                {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
              <button
                onClick={() => window.history.back()}
                className="p-1 sm:p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition-colors"
                title="Chiudi terminale"
              >
                <X size={14} />
              </button>
            </div>
          </div>
          
          {/* Terminal Content */}
          <div className="flex flex-col h-full">
            <div 
              ref={terminalRef}
              className="flex-1 p-3 sm:p-4 overflow-y-auto cursor-text text-xs sm:text-sm leading-relaxed"
              onClick={handleTerminalClick}
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#374151 #1f2937'
              }}
            >
              {lines.map((line) => (
                <div key={line.id} className="mb-1">
                  {line.type === 'input' && (
                    <div className="text-cyan-300 font-semibold break-all">{line.content}</div>
                  )}
                  {line.type === 'output' && (
                    <div className="text-green-400 break-words">{line.content}</div>
                  )}
                  {line.type === 'error' && (
                    <div className="text-red-400 break-words font-medium">{line.content}</div>
                  )}
                  {line.type === 'system' && (
                    <div className="text-blue-400 break-words font-medium">{line.content}</div>
                  )}
                </div>
              ))}
              
              {/* Current Input Line */}
              <div className="flex items-center mt-2">
                <span className="text-cyan-300 mr-2 flex-shrink-0 text-xs sm:text-sm font-semibold">
                  nebulatech@cloud:~$
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent border-none outline-none text-green-400 flex-1 text-xs sm:text-sm"
                  disabled={isTyping}
                  autoComplete="off"
                  spellCheck="false"
                  placeholder={isTyping ? "Elaborazione..." : "Inserisci comando..."}
                />
                <span className="text-green-400 animate-pulse ml-1 font-bold">|</span>
              </div>
            </div>
            
            {/* Mobile Status Bar */}
            <div className="bg-gray-800 px-3 sm:px-4 py-2 border-t border-gray-700 sm:hidden">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>💡 Tocca per digitare • ↑↓ per cronologia</span>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded ${
                  isCloudGamingEnabled ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                }`}>
                  <Power size={8} />
                  <span>Gaming: {isCloudGamingEnabled ? 'ON' : 'OFF'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Instructions - Hidden on mobile when fullscreen */}
        {!isFullscreen && (
          <div className="mt-3 sm:mt-4 text-center text-gray-500 text-xs sm:text-sm">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-6">
              <p>💡 Digita "help" per vedere tutti i comandi</p>
              <p className="hidden sm:block">🎮 "cloud enable" per abilitare Cloud Gaming</p>
              <p className="hidden lg:block">⌨️ Usa ↑↓ per navigare nella cronologia</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        div::-webkit-scrollbar {
          width: 8px;
        }
        div::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 4px;
        }
        div::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 4px;
          border: 1px solid #1f2937;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: #4b5563;
        }
        div::-webkit-scrollbar-corner {
          background: #1f2937;
        }
      `}</style>
    </div>
  )
}