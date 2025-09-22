'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FavoritesContextType {
  favorites: string[];
  isLoading: boolean;
  addToFavorites: (gameId: string) => Promise<boolean>;
  removeFromFavorites: (gameId: string) => Promise<boolean>;
  isFavorite: (gameId: string) => boolean;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
  userId?: string;
}

export function FavoritesProvider({ children, userId = 'demo-user' }: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Funzione per caricare i preferiti dal server
  const loadFavorites = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/favorites?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setFavorites(data.favorites);
      } else {
        console.error('Errore nel caricamento dei preferiti:', data.error);
      }
    } catch (error) {
      console.error('Errore nella richiesta dei preferiti:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Aggiungere un gioco ai preferiti
  const addToFavorites = async (gameId: string): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, gameId }),
      });

      const data = await response.json();
      
      if (data.success) {
        setFavorites(prev => [...prev, gameId]);
        return true;
      } else {
        console.error('Errore nell\'aggiunta ai preferiti:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Errore nella richiesta di aggiunta:', error);
      return false;
    }
  };

  // Rimuovere un gioco dai preferiti
  const removeFromFavorites = async (gameId: string): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      const response = await fetch(`/api/favorites?userId=${userId}&gameId=${gameId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        setFavorites(prev => prev.filter(id => id !== gameId));
        return true;
      } else {
        console.error('Errore nella rimozione dai preferiti:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Errore nella richiesta di rimozione:', error);
      return false;
    }
  };

  // Verificare se un gioco è nei preferiti
  const isFavorite = (gameId: string): boolean => {
    return favorites.includes(gameId);
  };

  // Ricaricare i preferiti
  const refreshFavorites = async () => {
    await loadFavorites();
  };

  // Caricare i preferiti all'avvio
  useEffect(() => {
    loadFavorites();
  }, [userId]);

  const value: FavoritesContextType = {
    favorites,
    isLoading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    refreshFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

// Hook personalizzato per utilizzare il context
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites deve essere utilizzato all\'interno di un FavoritesProvider');
  }
  return context;
}