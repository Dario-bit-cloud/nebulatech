'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Gamepad2, Star, Download, Play, X, Menu, Grid, List, Heart, Clock, Trophy, Users, TrendingUp, Zap } from 'lucide-react'
import AuthGuard from '@/components/AuthGuard'



// Dati dei giochi aggiornati - Solo Fortnite per test
const gamesData = [
  {
    id: 2,
    title: 'Fortnite',
    category: 'Battle Royale',
    rating: 4.5,
    players: '350M',
    playtime: '120h',
    isFree: true,
    isInstalled: true,
    isFavorite: true,
    description: 'Il battle royale più popolare al mondo.',
    tags: ['Battle Royale', 'Multiplayer', 'Gratuito']
  }
]

// Game Card Component
function GameCard({ game, viewMode = 'grid' }: { game: typeof gamesData[0], viewMode?: 'grid' | 'list' }) {
  const [isFavorite, setIsFavorite] = useState(game.isFavorite)

  if (viewMode === 'list') {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 hover:bg-slate-700/50 transition-all duration-300 border border-slate-700/50">
        <div className="flex items-center space-x-4">
          {/* Game Icon */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0">
            {game.title === 'Fortnite' ? (
              <img 
                src="/games/covers/thumbnails/fortnite-cover.webp" 
                alt="Fortnite Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Gamepad2 size={24} className="text-white" />
              </div>
            )}
          </div>
          
          {/* Game Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-white font-semibold text-sm sm:text-base truncate">{game.title}</h3>
                <p className="text-gray-400 text-xs sm:text-sm">{game.category}</p>
              </div>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-1 rounded-full transition-colors ${
                  isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart size={16} className={isFavorite ? 'fill-current' : ''} />
              </button>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-gray-400 mb-3">
              <div className="flex items-center space-x-1">
                <Star size={12} className="text-yellow-400 fill-current" />
                <span>{game.rating}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users size={12} />
                <span>{game.players}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock size={12} />
                <span>{game.playtime}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {game.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="bg-slate-700 text-gray-300 px-2 py-1 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
              
              <button
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  game.isInstalled
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {game.isInstalled ? 'Gioca' : 'Installa'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-slate-700/50 transition-all duration-300 border border-slate-700/50 group relative">
      {/* Game Image - Square aspect ratio */}
      <div className="relative aspect-square bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        {game.title === 'Fortnite' ? (
          <img 
            src="/games/covers/medium/fortnite-cover.webp" 
            alt="Fortnite Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <Gamepad2 size={48} className="text-white/80" />
        )}
        
        {/* Play button overlay - always visible at bottom */}
        <div className="absolute bottom-3 left-3 right-3">
          <button
            className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
              game.isInstalled
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {game.isInstalled ? 'Gioca' : 'Installa'}
          </button>
        </div>
      </div>
    </div>
  )
}

function CloudGamingContent() {
  const [activeTab, setActiveTab] = useState('libreria')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tutti')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const tabs = [
    { id: 'libreria', label: 'Libreria', icon: Grid },
    { id: 'preferiti', label: 'Preferiti', icon: Heart },
    { id: 'installati', label: 'Installati', icon: Download }
  ]

  const categories = ['Tutti', 'RPG', 'Battle Royale', 'FPS', 'Sandbox', 'Azione']

  const filteredGames = gamesData.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'Tutti' || game.category === selectedCategory
    
    let matchesTab = true
    if (activeTab === 'preferiti') matchesTab = game.isFavorite
    if (activeTab === 'installati') matchesTab = game.isInstalled
    
    return matchesSearch && matchesCategory && matchesTab
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" style={{
      scrollbarWidth: 'none', /* Firefox */
      msOverflowStyle: 'none', /* Internet Explorer 10+ */
    }}>
      <style jsx global>{`
        /* Nasconde le barre di scroll per Webkit browsers (Chrome, Safari, Edge) */
        ::-webkit-scrollbar {
          display: none;
        }
        
        /* Nasconde le barre di scroll per tutti gli elementi */
        * {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* Internet Explorer 10+ */
        }
        
        *::-webkit-scrollbar {
          display: none;
        }
        
        /* Assicura che il body e html non abbiano scroll visibili */
        html, body {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        html::-webkit-scrollbar, body::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {/* Header */}
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo e Titolo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Gamepad2 size={20} className="text-white sm:w-6 sm:h-6" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-white">Nebula Gaming</h1>
                <p className="text-xs text-gray-400 hidden sm:block">Cloud Gaming Platform</p>
              </div>
            </div>
            
            {/* Desktop Controls */}
             <div className="hidden md:flex items-center space-x-2">
               <button
                 onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                 className="bg-slate-700/50 hover:bg-slate-600/50 text-white p-2 rounded-lg transition-colors"
               >
                 {viewMode === 'grid' ? <List size={18} /> : <Grid size={18} />}
               </button>
               
               <button className="bg-slate-700/50 hover:bg-slate-600/50 text-white p-2 rounded-lg transition-colors">
                 <Filter size={18} />
               </button>
               
               <button className="bg-slate-700/50 hover:bg-slate-600/50 text-white p-2 rounded-lg transition-colors">
                 <Search size={18} />
               </button>
             </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden bg-slate-700/50 text-white p-2 rounded-lg"
            >
              <Menu size={20} />
            </button>
          </div>


        </div>
      </div>

      {/* Mobile Menu */}
       {showMobileMenu && (
         <div className="md:hidden bg-slate-800/95 backdrop-blur-sm border-b border-slate-700/50">
           <div className="max-w-7xl mx-auto px-4 py-4">
             <div className="flex items-center justify-between mb-4">
               <span className="text-white font-medium">Controlli</span>
               <div className="flex items-center space-x-2">
                 <button
                   onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                   className="bg-slate-700/50 hover:bg-slate-600/50 text-white p-2 rounded-lg transition-colors"
                 >
                   {viewMode === 'grid' ? <List size={18} /> : <Grid size={18} />}
                 </button>
                 
                 <button className="bg-slate-700/50 hover:bg-slate-600/50 text-white p-2 rounded-lg transition-colors">
                   <Filter size={18} />
                 </button>
                 
                 <button className="bg-slate-700/50 hover:bg-slate-600/50 text-white p-2 rounded-lg transition-colors">
                   <Search size={18} />
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}

      {/* Featured Section */}
      <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">IN EVIDENZA</span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Gamepad2 size={32} className="text-white" />
              </div>
              
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Fortnite</h2>
                <p className="text-gray-300 text-sm sm:text-base mb-3">
                  Il battle royale più popolare al mondo. Gioca gratuitamente con i tuoi amici!
                </p>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    <Star size={16} className="text-yellow-400 fill-current" />
                    <span className="text-white text-sm">4.5</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users size={16} className="text-blue-400" />
                    <span className="text-white text-sm">350M</span>
                  </div>
                  <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                    Gratuito
                  </span>
                </div>
                
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105">
                  <Play size={16} className="inline mr-2" />
                  Gioca Ora
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-800/30 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 sm:space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-3 sm:px-2 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm sm:text-base">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center space-x-4 mb-6 overflow-x-auto">
          <span className="text-gray-400 text-sm whitespace-nowrap">Categorie:</span>
          <div className="flex space-x-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-lg transition-colors text-sm whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Games Grid/List */}
        {filteredGames.length > 0 ? (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6'
              : 'space-y-3 sm:space-y-4'
          }>
            {filteredGames.map((game) => (
              <GameCard key={`${game.id}-${activeTab}`} game={game} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-4xl sm:text-6xl mb-4">
              {activeTab === 'preferiti' ? '❤️' : activeTab === 'installati' ? '📦' : '🎮'}
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
              {activeTab === 'preferiti' && 'Nessun gioco preferito'}
              {activeTab === 'installati' && 'Nessun gioco installato'}
              {activeTab === 'libreria' && 'Nessun gioco trovato'}
            </h3>
            <p className="text-gray-400 mb-6 text-sm sm:text-base max-w-md mx-auto">
              {activeTab === 'preferiti' && 'Aggiungi giochi ai preferiti per trovarli facilmente qui.'}
              {activeTab === 'installati' && 'Installa alcuni giochi per iniziare a giocare.'}
              {activeTab === 'libreria' && 'Prova a modificare i filtri di ricerca.'}
            </p>
            {activeTab !== 'libreria' && (
              <button
                onClick={() => setActiveTab('libreria')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Esplora la Libreria
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  )
}

export default function CloudGamingPage() {
  return (
    <AuthGuard>
      <CloudGamingContent />
    </AuthGuard>
  )
}