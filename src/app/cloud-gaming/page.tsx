'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Gamepad2, Star, Play, X, Menu, Grid, List, Heart, Clock, Users, User, UserPlus, UserMinus, Settings } from 'lucide-react'
import AuthGuard from '@/components/AuthGuard'
import { FavoritesProvider, useFavorites } from '@/contexts/FavoritesContext'
import { useAuth } from '@/contexts/AuthContext'



// Dati dei giochi aggiornati per cloud gaming
const gamesData = [
  {
    id: 1,
    title: 'GTA 6',
    category: 'Azione',
    rating: 5.0,
    players: 'TBA',
    playtime: 'TBA',
    isFree: false,
    isInstalled: false,
    isFavorite: false,
    isMobile: false,
    isComingSoon: true,
    releaseYear: 2026,
    description: 'Il capitolo più atteso della saga Grand Theft Auto.',
    tags: ['Azione', 'Open World', 'Crime', 'In Arrivo']
  },
  {
    id: 2,
    title: 'GTA 5',
    category: 'Azione',
    rating: 4.9,
    players: '170M',
    playtime: '300h',
    isFree: false,
    isInstalled: true,
    isFavorite: false,
    isMobile: false,
    isComingSoon: false,
    description: 'Il capolavoro open world di Rockstar Games ambientato a Los Santos.',
    tags: ['Azione', 'Open World', 'Crime', 'Multiplayer']
  },
  {
    id: 3,
    title: 'EA Sports FC 26',
    category: 'Sport',
    rating: 4.7,
    players: 'TBA',
    playtime: 'TBA',
    isFree: false,
    isInstalled: false,
    isFavorite: false,
    isMobile: false,
    isComingSoon: true,
    releaseYear: 2025,
    description: 'La nuova edizione del simulatore di calcio più realistico al mondo.',
    tags: ['Sport', 'Calcio', 'Simulazione', 'In Arrivo']
  },
  {
    id: 4,
    title: 'Cyberpunk 2077',
    category: 'RPG',
    rating: 4.6,
    players: '25M',
    playtime: '180h',
    isFree: false,
    isInstalled: false,
    isFavorite: false,
    isMobile: false,
    isComingSoon: false,
    description: 'Un RPG futuristico ambientato nella megalopoli di Night City.',
    tags: ['RPG', 'Futuristico', 'Open World', 'Azione']
  },
  {
    id: 5,
    title: 'The Witcher 3: Wild Hunt',
    category: 'RPG',
    rating: 4.9,
    players: '50M',
    playtime: '200h',
    isFree: false,
    isInstalled: false,
    isFavorite: false,
    isMobile: false,
    isComingSoon: false,
    description: 'Un epico RPG fantasy con Geralt di Rivia in un mondo aperto mozzafiato.',
    tags: ['RPG', 'Fantasy', 'Open World', 'Avventura']
  },
  {
    id: 6,
    title: 'Red Dead Redemption 2',
    category: 'Azione',
    rating: 4.8,
    players: '38M',
    playtime: '250h',
    isFree: false,
    isInstalled: false,
    isFavorite: false,
    isMobile: false,
    isComingSoon: false,
    description: 'Un western epico ambientato nel selvaggio West americano.',
    tags: ['Azione', 'Western', 'Open World', 'Avventura']
  },
  {
    id: 7,
    title: 'Fortnite',
    category: 'Battle Royale',
    rating: 4.5,
    players: '350M',
    playtime: '120h',
    isFree: true,
    isInstalled: true,
    isFavorite: true,
    isMobile: true,
    description: 'Il battle royale più popolare al mondo.',
    tags: ['Battle Royale', 'Multiplayer', 'Gratuito']
  },
  {
    id: 8,
    title: 'Minecraft',
    category: 'Sandbox',
    rating: 4.8,
    players: '140M',
    playtime: '200h',
    isFree: false,
    isInstalled: false,
    isFavorite: false,
    isMobile: true,
    description: 'Costruisci, esplora e sopravvivi nel mondo infinito di Minecraft.',
    tags: ['Sandbox', 'Creatività', 'Multiplayer', 'Avventura']
  },
  {
    id: 9,
    title: 'Assassin\'s Creed Valhalla',
    category: 'Azione',
    rating: 4.5,
    players: '20M',
    playtime: '150h',
    isFree: false,
    isInstalled: false,
    isFavorite: false,
    isMobile: false,
    isComingSoon: false,
    description: 'Vivi l\'epica saga vichinga di Eivor.',
    tags: ['Azione', 'Avventura', 'Open World', 'Storia']
  },
  {
    id: 10,
    title: 'Call of Duty: Modern Warfare II',
    category: 'FPS',
    rating: 4.3,
    players: '100M',
    playtime: '80h',
    isFree: false,
    isInstalled: false,
    isFavorite: false,
    isMobile: false,
    isComingSoon: false,
    description: 'Il ritorno della serie Modern Warfare.',
    tags: ['FPS', 'Multiplayer', 'Azione', 'Guerra']
  },
  {
    id: 11,
    title: 'Hogwarts Legacy',
    category: 'RPG',
    rating: 4.7,
    players: '15M',
    playtime: '120h',
    isFree: false,
    isInstalled: false,
    isFavorite: false,
    isMobile: false,
    isComingSoon: false,
    description: 'Vivi la tua avventura magica a Hogwarts.',
    tags: ['RPG', 'Magia', 'Avventura', 'Fantasy']
  }
]

// Game Card Component
function GameCard({ game, viewMode = 'grid' }: { game: typeof gamesData[0], viewMode?: 'grid' | 'list' }) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites()
  const isGameFavorite = isFavorite(String(game.id))
  const [showComingSoonModal, setShowComingSoonModal] = useState(false)

  const handleToggleFavorite = async () => {
    if (isGameFavorite) {
      await removeFromFavorites(String(game.id))
    } else {
      await addToFavorites(String(game.id))
    }
  }

  const handlePlayClick = () => {
    if (game.isComingSoon) {
      setShowComingSoonModal(true)
    } else {
      // Logica normale per giocare
      // Avvia il gioco
    }
  }

  if (viewMode === 'list') {
    return (
      <>
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 hover:bg-slate-700/50 transition-all duration-300 border border-slate-700/50">
        <div className="flex items-center space-x-4">
          {/* Game Icon */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 relative">
            {/* Game Number */}
            <div className="absolute top-1 left-1 bg-black/70 text-white text-xs font-bold px-1.5 py-0.5 rounded z-10">
              {game.id}
            </div>
            {game.title === 'GTA 6' ? (
              <img 
                src="https://assets.codmunity.gg/profiles/1d91d3d0-59df-11ef-9c5b-c3bf4ad2f2a8.png" 
                alt="GTA 6 Cover"
                className="w-full h-full object-cover"
              />
            ) : game.title === 'GTA 5' ? (
              <img 
                src="https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/1c/13/4f/1c134f87-d15c-0ea6-f8fc-fe7f48475d46/AppIcon-1x_U007emarketing-0-7-0-85-220-0.png/256x256bb.jpg" 
                alt="GTA 5 Cover"
                className="w-full h-full object-cover"
              />
            ) : game.title === 'EA Sports FC 26' ? (
              <img 
                src="https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/EA_FC_26_Cover.jpg/250px-EA_FC_26_Cover.jpg" 
                alt="EA Sports FC 26 Cover"
                className="w-full h-full object-cover"
              />
            ) : game.title === 'Cyberpunk 2077' ? (
              <img 
                src="https://cdn.boosteroid.com/media/boostore/022239a9673a747fed6f50be0e0da132.jpg?width=200&height=200&fit=cover&progressive=1&quality=90" 
                alt="Cyberpunk 2077 Cover"
                className="w-full h-full object-cover"
              />
            ) : game.title === 'The Witcher 3: Wild Hunt' ? (
              <img 
                src="https://cdn.boosteroid.com/media/boostore/e037d21d1baa3bf3999944914a239214.jpg?width=200&height=200&fit=cover&progressive=1&quality=90" 
                alt="The Witcher 3 Cover"
                className="w-full h-full object-cover"
              />
            ) : game.title === 'Red Dead Redemption 2' ? (
              <img 
                src="https://cdn.boosteroid.com/media/boostore/ede138d818a53d4e84d8539e2a6880ee.jpg?width=200&height=200&fit=cover&progressive=1&quality=90" 
                alt="Red Dead Redemption 2 Cover"
                className="w-full h-full object-cover"
              />
            ) : game.title === 'Fortnite' ? (
              <img 
                src="/games/covers/thumbnails/fortnite-cover.webp" 
                alt="Fortnite Cover"
                className="w-full h-full object-cover"
              />
            ) : game.title === 'Minecraft' ? (
              <img 
                src="https://play-lh.googleusercontent.com/27O5tpaYE82W6m30rJ_MX3-UvshlDM6O8oXDxb6GseYW2T7P8UNT19727MGmz-0q3w=s256-rw" 
                alt="Minecraft Cover"
                className="w-full h-full object-cover"
              />
            ) : game.title === 'Assassin\'s Creed Valhalla' ? (
              <img 
                src="https://cdn.boosteroid.com/media/boostore/e00788103d232ac587a0df7a45a19896.jpg?width=200&height=200&fit=cover&progressive=1&quality=90" 
                alt="Assassin's Creed Valhalla Cover"
                className="w-full h-full object-cover"
              />
            ) : game.title === 'Call of Duty: Modern Warfare II' ? (
              <img 
                src="https://cdn.boosteroid.com/media/boostore/fbd0c0f8dada1137c015bd338f17270b.jpg?width=200&height=200&fit=cover&progressive=1&quality=90" 
                alt="Call of Duty: Modern Warfare II Cover"
                className="w-full h-full object-cover"
              />
            ) : game.title === 'Hogwarts Legacy' ? (
              <img 
                src="https://cdn.boosteroid.com/media/boostore/567da3818a8da85acf29cf049fc79770.jpg?width=200&height=200&fit=cover&progressive=1&quality=90" 
                alt="Hogwarts Legacy Cover"
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
                onClick={handleToggleFavorite}
                className={`p-1 rounded-full transition-colors ${
                  isGameFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart size={16} className={isGameFavorite ? 'fill-current' : ''} />
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
                onClick={handlePlayClick}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  game.isComingSoon 
                    ? 'bg-orange-600 hover:bg-orange-700 text-white cursor-pointer' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {game.isComingSoon ? 'In Arrivo' : 'Gioca'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal per giochi in arrivo */}
      {showComingSoonModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-white mb-2">
              {game.title}
            </h3>
            <p className="text-gray-300 mb-4">
              In arrivo nel 2026
            </p>
            <button
              onClick={() => setShowComingSoonModal(false)}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
      </>
    )
  }

  return (
    <>
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-slate-700/50 transition-all duration-300 border border-slate-700/50 group relative">
      {/* Game Image - Square aspect ratio */}
      <div className="relative aspect-square bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        {/* Game Number */}
        <div className="absolute top-2 left-2 bg-black/70 text-white text-sm font-bold px-2 py-1 rounded z-10">
          {game.id}
        </div>
        {game.title === 'GTA 6' ? (
          <img 
            src="https://assets.codmunity.gg/profiles/1d91d3d0-59df-11ef-9c5b-c3bf4ad2f2a8.png" 
            alt="GTA 6 Cover"
            className="w-full h-full object-cover"
          />
        ) : game.title === 'GTA 5' ? (
          <img 
            src="https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/1c/13/4f/1c134f87-d15c-0ea6-f8fc-fe7f48475d46/AppIcon-1x_U007emarketing-0-7-0-85-220-0.png/256x256bb.jpg" 
            alt="GTA 5 Cover"
            className="w-full h-full object-cover"
          />
        ) : game.title === 'EA Sports FC 26' ? (
          <img 
            src="https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/EA_FC_26_Cover.jpg/250px-EA_FC_26_Cover.jpg" 
            alt="EA Sports FC 26 Cover"
            className="w-full h-full object-cover"
          />
        ) : game.title === 'Cyberpunk 2077' ? (
          <img 
            src="https://cdn.boosteroid.com/media/boostore/022239a9673a747fed6f50be0e0da132.jpg?width=200&height=200&fit=cover&progressive=1&quality=90" 
            alt="Cyberpunk 2077 Cover"
            className="w-full h-full object-cover"
          />
        ) : game.title === 'The Witcher 3: Wild Hunt' ? (
          <img 
            src="https://cdn.boosteroid.com/media/boostore/e037d21d1baa3bf3999944914a239214.jpg?width=200&height=200&fit=cover&progressive=1&quality=90" 
            alt="The Witcher 3 Cover"
            className="w-full h-full object-cover"
          />
        ) : game.title === 'Red Dead Redemption 2' ? (
          <img 
            src="https://cdn.boosteroid.com/media/boostore/ede138d818a53d4e84d8539e2a6880ee.jpg?width=200&height=200&fit=cover&progressive=1&quality=90" 
            alt="Red Dead Redemption 2 Cover"
            className="w-full h-full object-cover"
          />
        ) : game.title === 'Fortnite' ? (
          <img 
            src="/games/covers/medium/fortnite-cover.webp" 
            alt="Fortnite Cover"
            className="w-full h-full object-cover"
          />
        ) : game.title === 'Minecraft' ? (
          <img 
            src="https://play-lh.googleusercontent.com/27O5tpaYE82W6m30rJ_MX3-UvshlDM6O8oXDxb6GseYW2T7P8UNT19727MGmz-0q3w=s256-rw" 
            alt="Minecraft Cover"
            className="w-full h-full object-cover"
          />
        ) : game.title === 'Assassin\'s Creed Valhalla' ? (
          <img 
            src="https://cdn.boosteroid.com/media/boostore/e00788103d232ac587a0df7a45a19896.jpg?width=200&height=200&fit=cover&progressive=1&quality=90" 
            alt="Assassin's Creed Valhalla Cover"
            className="w-full h-full object-cover"
          />
        ) : game.title === 'Call of Duty: Modern Warfare II' ? (
          <img 
            src="https://cdn.boosteroid.com/media/boostore/fbd0c0f8dada1137c015bd338f17270b.jpg?width=200&height=200&fit=cover&progressive=1&quality=90" 
            alt="Call of Duty: Modern Warfare II Cover"
            className="w-full h-full object-cover"
          />
        ) : game.title === 'Hogwarts Legacy' ? (
          <img 
            src="https://cdn.boosteroid.com/media/boostore/567da3818a8da85acf29cf049fc79770.jpg?width=200&height=200&fit=cover&progressive=1&quality=90" 
            alt="Hogwarts Legacy Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <Gamepad2 size={48} className="text-white/80" />
        )}
        
        {/* Favorite button - appears on hover in top right */}
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 ${
            isGameFavorite 
              ? 'bg-red-500/80 text-white' 
              : 'bg-black/50 text-gray-300 hover:text-red-500 hover:bg-red-500/20'
          }`}
        >
          <Heart size={16} className={isGameFavorite ? 'fill-current' : ''} />
        </button>
      </div>
      
      {/* Play button - outside the cover */}
      <div className="p-3">
        <button
          onClick={handlePlayClick}
          className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
            game.isComingSoon 
              ? 'bg-orange-600 hover:bg-orange-700 text-white cursor-pointer' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {game.isComingSoon ? 'In Arrivo' : 'Gioca'}
        </button>
      </div>
    </div>

    {/* Modal per giochi in arrivo */}
    {showComingSoonModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg p-6 max-w-sm mx-4">
          <h3 className="text-lg font-semibold text-white mb-2">
            {game.title}
          </h3>
          <p className="text-gray-300 mb-4">
            In arrivo nel 2026
          </p>
          <button
            onClick={() => setShowComingSoonModal(false)}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    )}
  </>
  )
}

function CloudGamingContent() {
  const { user, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState('libreria')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tutti')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showMenu, setShowMenu] = useState(false)
  
  // Social Section State
  const [friends, setFriends] = useState<Array<{
    id: string
    gamertag: string
    status: 'online' | 'away' | 'offline'
    lastSeen: string
    game: string | null
  }>>([])
  const [newFriendGamertag, setNewFriendGamertag] = useState('')
  const [nebulaTagStatus, setNebulaTagStatus] = useState<'online' | 'away' | 'offline'>('online')
  
 
  const { isFavorite } = useFavorites()

  // Load friends and status from localStorage when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      const savedFriends = localStorage.getItem(`friends_${user.id}`)
      if (savedFriends) {
        setFriends(JSON.parse(savedFriends))
      }
      
      const savedStatus = localStorage.getItem(`status_${user.id}`)
      if (savedStatus) {
        setNebulaTagStatus(savedStatus as 'online' | 'away' | 'offline')
      }
    }
  }, [isAuthenticated, user])

  // Save friends to localStorage when they change
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(`friends_${user.id}`, JSON.stringify(friends))
    }
  }, [friends, isAuthenticated, user])

  // Save status to localStorage when it changes
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(`status_${user.id}`, nebulaTagStatus)
    }
  }, [nebulaTagStatus, isAuthenticated, user])

  // Dynamic tabs based on authentication
  const tabs = [
    { id: 'libreria', label: 'Libreria', icon: Grid },
    { id: 'preferiti', label: 'Preferiti', icon: Heart },
    ...(isAuthenticated ? [
      { id: 'social', label: 'Social', icon: Users },
      { id: 'nebula-tag', label: 'NebulaTag', icon: User }
    ] : [])
  ]

  // Reset to libreria if user logs out and is on social tabs
  useEffect(() => {
    if (!isAuthenticated && (activeTab === 'social' || activeTab === 'nebula-tag')) {
      setActiveTab('libreria')
    }
  }, [isAuthenticated, activeTab])

  const categories = ['Tutti', 'RPG', 'Battle Royale', 'FPS', 'Sandbox', 'Azione', 'Sport', 'Party', 'Giochi in Arrivo']

  const filteredGames = gamesData.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Gestione speciale per la categoria "Giochi in Arrivo"
    let matchesCategory = true
    if (selectedCategory === 'Giochi in Arrivo') {
      matchesCategory = game.isComingSoon === true
    } else if (selectedCategory !== 'Tutti') {
      matchesCategory = game.category === selectedCategory
    }
    
    let matchesTab = true
    if (activeTab === 'preferiti') matchesTab = isFavorite(String(game.id))
    
    return matchesSearch && matchesCategory && matchesTab
  })

  // Social Functions - Improved Gamertag System
  const validateGamertag = (gamertag: string): { isValid: boolean; error?: string } => {
    // Gamertag requirements:
    // - 3-20 characters
    // - Only letters, numbers, and underscores
    // - Must start with a letter
    // - Cannot end with underscore
    // - Cannot have consecutive underscores
    
    if (!gamertag || gamertag.length < 3) {
      return { isValid: false, error: 'Il Gamertag deve essere di almeno 3 caratteri' }
    }
    
    if (gamertag.length > 20) {
      return { isValid: false, error: 'Il Gamertag non può superare i 20 caratteri' }
    }
    
    // Must start with a letter
    if (!/^[a-zA-Z]/.test(gamertag)) {
      return { isValid: false, error: 'Il Gamertag deve iniziare con una lettera' }
    }
    
    // Cannot end with underscore
    if (gamertag.endsWith('_')) {
      return { isValid: false, error: 'Il Gamertag non può terminare con underscore' }
    }
    
    // Only letters, numbers, and underscores
    if (!/^[a-zA-Z0-9_]+$/.test(gamertag)) {
      return { isValid: false, error: 'Il Gamertag può contenere solo lettere, numeri e underscore' }
    }
    
    // Cannot have consecutive underscores
    if (/__/.test(gamertag)) {
      return { isValid: false, error: 'Il Gamertag non può avere underscore consecutivi' }
    }
    
    // Simulate user database - expanded list
    const existingGamertags = [
      'GamerPro2024', 'ShadowHunter', 'CyberNinja', 'PixelMaster', 'DragonSlayer',
      'NightWolf', 'StarCrusher', 'ThunderBolt', 'IceQueen', 'FireStorm',
      'MysticSage', 'BattleAxe', 'StealthMode', 'PowerUser', 'EliteGamer',
      'NebulaMaster', 'CloudGamer', 'QuantumPlayer', 'VirtualHero', 'DigitalWarrior',
      'CyberKnight', 'TechNinja', 'GameMaster', 'ProPlayer', 'SkillShot',
      'LegendaryGamer', 'UltimatePlayer', 'SuperNova', 'CosmicGamer', 'StarPlayer'
    ]
    
    // Check if gamertag exists (case insensitive)
    const gamertagExists = existingGamertags.some(existing => 
      existing.toLowerCase() === gamertag.toLowerCase()
    )
    
    if (gamertagExists) {
      return { isValid: true, error: undefined }
    }
    
    // Simulate 80% chance of finding a valid user for other gamertags
    const userExists = Math.random() > 0.2
    return { isValid: userExists, error: userExists ? undefined : 'Utente non trovato' }
  }

  const addFriend = async () => {
    if (!isAuthenticated) {
      alert('Devi essere loggato per aggiungere amici!')
      return
    }
    
    const nebulatag = newFriendGamertag.trim()
    if (!nebulatag) {
      alert('Inserisci un Nebulatag valido!')
      return
    }
    
    // Validate email format (since Nebulatag = email)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(nebulatag)) {
      alert('Il Nebulatag deve essere un indirizzo email valido!')
      return
    }
    
    // Check if friend already exists
    const existingFriend = friends.find(f => f.gamertag.toLowerCase() === nebulatag.toLowerCase())
    if (existingFriend) {
      alert('Questo utente è già nella tua lista amici!')
      return
    }
    
    // Check if trying to add yourself
    if (user && nebulatag.toLowerCase() === user.email.toLowerCase()) {
      alert('Non puoi aggiungere te stesso come amico!')
      return
    }
    
    // Add friend directly to the list
    const newFriend = {
      id: Date.now().toString(),
      gamertag: nebulatag,
      status: Math.random() > 0.5 ? 'online' : Math.random() > 0.5 ? 'away' : 'offline' as 'online' | 'away' | 'offline',
      lastSeen: Math.random() > 0.5 ? 'Ora' : `${Math.floor(Math.random() * 60) + 1} min fa`,
      game: Math.random() > 0.5 ? ['GTA 5', 'Fortnite', 'Cyberpunk 2077', 'Minecraft', 'Call of Duty'][Math.floor(Math.random() * 5)] : null
    }
    setFriends(prev => [...prev, newFriend])
    setNewFriendGamertag('')
    alert(`${nebulatag} è stato aggiunto alla tua lista amici!`)
  }

  const removeFriend = (friendId: string) => {
    if (!isAuthenticated) return
    setFriends(friends.filter(f => f.id !== friendId))
  }



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }



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
              onClick={() => setShowMenu(!showMenu)}
              className="md:hidden bg-slate-700/50 text-white p-2 rounded-lg"
            >
              <Menu size={20} />
            </button>
          </div>


        </div>
      </div>

      {/* Mobile Menu */}
       {showMenu && (
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
                  className={`flex items-center space-x-2 py-4 px-3 sm:px-2 border-b-2 transition-colors whitespace-nowrap relative ${
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
        {(activeTab === 'libreria' || activeTab === 'preferiti') && (
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
        )}

        {/* Content based on active tab */}
        {activeTab === 'social' ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800/50 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Users className="w-8 h-8" />
                Social - Lista Amici
              </h2>

              {/* Gamertag System Explanation */}
              <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-6">
                <h3 className="text-blue-300 font-semibold mb-2 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Sistema Nebulatag
                </h3>
                <div className="text-blue-100 text-sm space-y-2">
                  <p><strong>Come funziona:</strong> Il Nebulatag corrisponde all'email con cui ti sei registrato. Inserisci l'email di un utente per aggiungerlo direttamente come amico.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="font-medium text-blue-200">Sistema semplificato:</p>
                      <ul className="list-disc list-inside text-xs space-y-1 mt-1">
                        <li>Nebulatag = Email di registrazione</li>
                        <li>Aggiunta amici istantanea</li>
                        <li>Nessuna richiesta da accettare</li>
                        <li>Sistema di autenticazione unificato</li>
                        <li>Amicizie memorizzate permanentemente</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-blue-200">Esempi di Nebulatag:</p>
                      <ul className="list-disc list-inside text-xs space-y-1 mt-1">
                        <li>mario.rossi@email.com</li>
                        <li>gamer123@gmail.com</li>
                        <li>player@nebulatech.it</li>
                        <li>user@example.com</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Add Friend Section */}
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-400" />
                  Aggiungi Nuovo Amico
                </h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Inserisci Nebulatag dell'utente..."
                    value={newFriendGamertag}
                    onChange={(e) => setNewFriendGamertag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addFriend()}
                    className="flex-1 bg-slate-700/50 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-slate-600/50 focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    onClick={addFriend}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <UserPlus className="w-5 h-5" />
                    Aggiungi Amico
                  </button>
                </div>
              </div>



              {/* Friends List */}
              <div>
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-400" />
                  I Tuoi Amici ({friends.length})
                </h3>
                <div className="space-y-3">
                {friends.map(friend => (
                  <div key={friend.id} className="bg-slate-700/30 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(friend.status)} rounded-full border-2 border-slate-800`}></div>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{friend.gamertag}</h3>
                        <p className="text-gray-400 text-sm">
                          {friend.status === 'online' && friend.game ? `Giocando a ${friend.game}` : 
                           friend.status === 'online' ? 'Online' :
                           friend.status === 'away' ? `Assente - ${friend.lastSeen}` :
                           `Offline - ${friend.lastSeen}`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFriend(friend.id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-2"
                    >
                      <UserMinus className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                {friends.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Nessun amico aggiunto</p>
                    <p className="text-gray-500 text-sm mt-2">Aggiungi amici per iniziare a giocare insieme!</p>
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'nebula-tag' ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <User className="w-6 h-6" />
                Il Tuo Profilo
              </h2>
              
              {/* Profile Card */}
              <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-blue-500/30">
                <div className="flex items-center gap-6 mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${getStatusColor(nebulaTagStatus)} rounded-full border-2 border-slate-800`}></div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{user?.username || 'NebulaTag'}</h3>
                    <p className="text-blue-400 font-medium">Il tuo Gamertag unico</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Stato: <span className="capitalize">{nebulaTagStatus === 'online' ? 'Online' : nebulaTagStatus === 'away' ? 'Assente' : 'Offline'}</span>
                    </p>
                    {user?.email && (
                      <p className="text-gray-500 text-xs mt-1">{user.email}</p>
                    )}
                  </div>
                </div>

                {/* Status Controls */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Cambia Stato</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setNebulaTagStatus('online')}
                        className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                          nebulaTagStatus === 'online' ? 'bg-green-600 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        }`}
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Online
                      </button>
                      <button
                        onClick={() => setNebulaTagStatus('away')}
                        className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                          nebulaTagStatus === 'away' ? 'bg-yellow-600 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        }`}
                      >
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        Assente
                      </button>
                      <button
                        onClick={() => setNebulaTagStatus('offline')}
                        className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                          nebulaTagStatus === 'offline' ? 'bg-gray-600 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        }`}
                      >
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        Offline
                      </button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-600/50">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{friends.length}</div>
                      <div className="text-gray-400 text-sm">Amici</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{friends.filter(f => f.status === 'online').length}</div>
                      <div className="text-gray-400 text-sm">Online</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">247h</div>
                      <div className="text-gray-400 text-sm">Tempo Gioco</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Games Section for libreria and preferiti */
          <>
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
                <div>
                  <div className="text-4xl sm:text-6xl mb-4">
                    {activeTab === 'preferiti' ? '❤️' : '🎮'}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                    {activeTab === 'preferiti' && 'Nessun gioco preferito'}
                    {activeTab === 'libreria' && 'Nessun gioco trovato'}
                  </h3>
                  <p className="text-gray-400 mb-6 text-sm sm:text-base max-w-md mx-auto">
                    {activeTab === 'preferiti' && 'Aggiungi giochi ai preferiti per trovarli facilmente qui.'}
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
              </div>
            )}
          </>
        )}
      </div>

    </div>
  )
}

export default function CloudGamingPage() {
  return (
    <AuthGuard>
      <FavoritesProvider userId="gamer_test">
        <CloudGamingContent />
      </FavoritesProvider>
    </AuthGuard>
  )
}