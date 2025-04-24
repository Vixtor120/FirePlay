'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { FavoriteItem, FavoriteCache } from '@/types/favorite.types';

interface FavoriteButtonProps {
  gameId: number;
  gameName: string;
  gameSlug: string;
  gameImage: string;
  gameRating: number;
  gamePrice: number;
  onSuccess?: (isFavorite: boolean) => void;
  className?: string;
  showText?: boolean;
}

export default function FavoriteButton({
  gameId,
  gameName,
  gameSlug,
  gameImage,
  gameRating,
  gamePrice,
  onSuccess,
  className = '',
  showText = true
}: FavoriteButtonProps) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const localCacheKey = useRef(`fireplay_favorites_${user?.uid || 'guest'}`);

  // Verificar estado inicial
  useEffect(() => {
    isMounted.current = true;
    
    // Primero verificar en localStorage para respuesta instantánea
    try {
      const cachedFavoritesJson = localStorage.getItem(localCacheKey.current);
      if (cachedFavoritesJson && user) {
        const cachedFavorites = JSON.parse(cachedFavoritesJson) as FavoriteCache;
        const isFav = cachedFavorites.data.some((fav: FavoriteItem) => fav.gameId === gameId);
        setIsFavorite(isFav);
      }
    } catch (error) {
      console.error('Error checking favorite in cache:', error);
    }
    
    // Luego verificar en Firebase para datos definitivos
    const checkIfFavorite = async () => {
      if (!user) return;

      try {
        const favoriteRef = doc(db, 'favorites', `${user.uid}_${gameId}`);
        const favoriteSnap = await getDoc(favoriteRef);
        
        if (isMounted.current) {
          setIsFavorite(favoriteSnap.exists());
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    if (user) {
      checkIfFavorite();
    }
    
    return () => {
      isMounted.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [gameId, user]);

  // Actualizar caché local
  const updateLocalFavoritesCache = useCallback((isFav: boolean) => {
    if (!user) return;
    
    try {
      const cachedFavoritesJson = localStorage.getItem(localCacheKey.current);
      
      if (cachedFavoritesJson) {
        const cachedFavorites = JSON.parse(cachedFavoritesJson) as FavoriteCache;
        
        if (isFav) {
          // Añadir a favoritos en caché
          const newFavorite: FavoriteItem = {
            id: `${user.uid}_${gameId}`,
            gameId,
            gameName,
            gameSlug,
            gameImage: gameImage || '',
            gameRating: gameRating || 0,
            gamePrice: gamePrice || 0,
            addedAt: new Date().toISOString(),
          };
          
          // Verificar que no exista ya
          const exists = cachedFavorites.data.some((fav: FavoriteItem) => fav.gameId === gameId);
          
          if (!exists) {
            cachedFavorites.data.unshift(newFavorite);
            cachedFavorites.timestamp = new Date().toISOString();
            localStorage.setItem(localCacheKey.current, JSON.stringify(cachedFavorites));
          }
        } else {
          // Eliminar de favoritos en caché
          cachedFavorites.data = cachedFavorites.data.filter(
            (fav: FavoriteItem) => fav.gameId !== gameId
          );
          cachedFavorites.timestamp = new Date().toISOString();
          localStorage.setItem(localCacheKey.current, JSON.stringify(cachedFavorites));
        }
      } else if (isFav) {
        // Si no existe caché, crear uno nuevo solo si estamos añadiendo
        const newCache: FavoriteCache = {
          data: [{
            id: `${user.uid}_${gameId}`,
            gameId,
            gameName,
            gameSlug,
            gameImage: gameImage || '',
            gameRating: gameRating || 0,
            gamePrice: gamePrice || 0,
            addedAt: new Date().toISOString(),
          }],
          timestamp: new Date().toISOString()
        };
        localStorage.setItem(localCacheKey.current, JSON.stringify(newCache));
      }
    } catch (error) {
      console.error('Error updating favorites cache:', error);
    }
  }, [gameId, gameName, gameSlug, gameImage, gameRating, gamePrice, user]);

  const toggleFavorite = async () => {
    if (!user) {
      showToast('Debes iniciar sesión para guardar favoritos', 'error');
      return;
    }

    // Prevenir múltiples clics
    if (isLoading) return;
    
    // Optimistic UI update
    const previousState = isFavorite;
    setIsFavorite(!previousState);
    setIsLoading(true);
    
    // Asegurar tiempo máximo de carga visual
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (isMounted.current) setIsLoading(false);
    }, 3000);
    
    // Actualizar caché local para feedback instantáneo
    updateLocalFavoritesCache(!previousState);
    
    // Feedback al usuario
    showToast(
      previousState ? `${gameName} eliminado de favoritos` : `${gameName} añadido a favoritos`,
      previousState ? 'info' : 'success'
    );

    try {
      const documentId = `${user.uid}_${gameId}`;
      const favoriteRef = doc(db, 'favorites', documentId);

      if (previousState) {
        await deleteDoc(favoriteRef);
      } else {
        const favoriteData = {
          userId: user.uid,
          gameId,
          gameName,
          gameSlug,
          gameImage: gameImage || '',
          gameRating: gameRating || 0,
          gamePrice: gamePrice || 0,
          addedAt: new Date().toISOString(),
        };

        await setDoc(favoriteRef, favoriteData);
      }
      
      // Callback si es necesario
      if (onSuccess) onSuccess(!previousState);
      
      // Limpiar timeout si todo va bien
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      
      // Revertir cambios en caso de error
      if (isMounted.current) {
        setIsFavorite(previousState);
        updateLocalFavoritesCache(previousState);
        showToast(`Error: No se pudo ${previousState ? 'eliminar de' : 'añadir a'} favoritos`, 'error');
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = message;
      
      let bgColor = 'bg-indigo-600';
      if (type === 'error') bgColor = 'bg-red-600';
      if (type === 'success') bgColor = 'bg-green-600';
      
      toast.className = `visible fixed bottom-4 right-4 ${bgColor} text-white py-2 px-4 rounded shadow-lg z-50`;
      setTimeout(() => {
        toast.className = 'hidden';
      }, 3000);
    }
  };

  // Para uso en páginas o componentes diferentes
  if (!showText) {
    return (
      <button
        onClick={toggleFavorite}
        disabled={isLoading}
        className={`w-8 h-8 rounded-full flex items-center justify-center ${className}`}
        aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-t-transparent border-violet-500 rounded-full animate-spin"></span>
        ) : isFavorite ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ec4899" className="w-5 h-5">
            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
        )}
      </button>
    );
  }

  // Botón completo con texto para páginas de detalle
  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`py-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${className}`}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-violet-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Procesando...
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          {isFavorite ? 
            <span className="text-red-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1">
                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
              </svg>
              Quitar de favoritos
            </span> : 
            <span className="text-slate-200 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
              Añadir a favoritos
            </span>
          }
        </span>
      )}
    </button>
  );
}
