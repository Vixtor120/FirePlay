'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Game } from '../types/game.types';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { FavoriteItem, FavoriteCache } from '@/types/favorite.types';

export default function GameCard({ game }: { game: Game }) {
  // Use useMemo to prevent the completeGame object from changing on every render
  const completeGame = useMemo(() => ({
    ...game,
    originalPrice: game.originalPrice ?? null,
    discountPercentage: game.discountPercentage ?? null
  } as Game), [game]);

  const { user } = useAuth();
  const { addToCart } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingOperation, setPendingOperation] = useState(false); // Track background operations
  const [addedToCart, setAddedToCart] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const isMounted = useRef(true);
  const operationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Verificar el estado de conectividad
  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // Verificar si el juego está en favoritos cuando se monta el componente
  useEffect(() => {
    isMounted.current = true;
    
    // Primero verificamos en localStorage para una respuesta instantánea
    try {
      const userFavoritesKey = `fireplay_favorites_${user?.uid || 'guest'}`;
      const cachedFavoritesJson = localStorage.getItem(userFavoritesKey);
      if (cachedFavoritesJson && user) {
        const cachedFavorites = JSON.parse(cachedFavoritesJson) as FavoriteCache;
        const isFav = cachedFavorites.data.some((fav: FavoriteItem) => fav.gameId === completeGame.id);
        setIsFavorite(isFav);
      }
    } catch (error) {
      console.error('Error checking favorite in cache:', error);
    }
    
    // Luego verificamos en Firebase para asegurar datos actualizados
    const checkIfFavorite = async () => {
      if (!user) {
        setIsFavorite(false);
        return;
      }

      try {
        const favoriteRef = doc(db, 'favorites', `${user.uid}_${completeGame.id}`);
        const favoriteSnap = await getDoc(favoriteRef);
        
        if (isMounted.current) {
          setIsFavorite(favoriteSnap.exists());
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    // Solo consultamos Firebase si tenemos un usuario
    if (user) {
      checkIfFavorite();
    }
    
    return () => {
      isMounted.current = false;
    };
  }, [completeGame.id, user]);

  // Actualizar el caché local cuando se cambia el estado de favorito
  const updateLocalFavoritesCache = useCallback((isFav: boolean) => {
    if (!user) return;
    
    try {
      const userFavoritesKey = `fireplay_favorites_${user.uid}`;
      const cachedFavoritesJson = localStorage.getItem(userFavoritesKey);
      
      if (cachedFavoritesJson) {
        const cachedFavorites = JSON.parse(cachedFavoritesJson) as FavoriteCache;
        
        if (isFav) {
          // Añadir a favoritos en caché
          const newFavorite: FavoriteItem = {
            id: `${user.uid}_${completeGame.id}`,
            gameId: completeGame.id,
            gameName: completeGame.name,
            gameSlug: completeGame.slug,
            gameImage: completeGame.background_image || '',
            gameRating: completeGame.rating || 0,
            gamePrice: completeGame.price || 0,
            addedAt: new Date().toISOString(),
          };
          
          // Verificar que no exista ya
          const exists = cachedFavorites.data.some((fav: FavoriteItem) => fav.gameId === completeGame.id);
          
          if (!exists) {
            cachedFavorites.data.unshift(newFavorite);
            cachedFavorites.timestamp = new Date().toISOString();
            localStorage.setItem(userFavoritesKey, JSON.stringify(cachedFavorites));
          }
        } else {
          // Eliminar de favoritos en caché
          cachedFavorites.data = cachedFavorites.data.filter(
            (fav: FavoriteItem) => fav.gameId !== completeGame.id
          );
          cachedFavorites.timestamp = new Date().toISOString();
          localStorage.setItem(userFavoritesKey, JSON.stringify(cachedFavorites));
        }
      } else if (isFav) {
        // Si no existe caché, crear uno nuevo solo si estamos añadiendo
        const newCache = {
          data: [{
            id: `${user.uid}_${completeGame.id}`,
            gameId: completeGame.id,
            gameName: completeGame.name,
            gameSlug: completeGame.slug,
            gameImage: completeGame.background_image || '',
            gameRating: completeGame.rating || 0,
            gamePrice: completeGame.price || 0,
            addedAt: new Date().toISOString(),
          }],
          timestamp: new Date().toISOString()
        };
        localStorage.setItem(userFavoritesKey, JSON.stringify(newCache));
      }
    } catch (error) {
      console.error('Error updating favorites cache:', error);
    }
  }, [completeGame, user]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      showToast('Debes iniciar sesión para guardar favoritos');
      return;
    }

    if (!isOnline) {
      showToast('No hay conexión a Internet. Intenta más tarde');
      return;
    }

    // Prevent multiple rapid clicks
    if (pendingOperation) return;

    // Optimistic UI update - update immediately for better UX
    const previousState = isFavorite;
    setIsFavorite(!previousState);
    
    // Actualizar caché local instantáneamente para mejorar UX
    updateLocalFavoritesCache(!previousState);
    
    // Show minimal loading indication (just a small visual cue)
    setIsLoading(true);
    setPendingOperation(true);
    
    // Clear any existing timeout
    if (operationTimeoutRef.current) clearTimeout(operationTimeoutRef.current);
    
    // Set a timeout to hide loading indicator even if Firebase is slow
    operationTimeoutRef.current = setTimeout(() => {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }, 600); // Reduced to 600ms for faster visual feedback

    try {
      const documentId = `${user.uid}_${completeGame.id}`;
      const favoriteRef = doc(db, 'favorites', documentId);

      // Show feedback immediately
      showToast(previousState ? 
        `${completeGame.name} eliminado de favoritos` : 
        `${completeGame.name} añadido a favoritos`
      );

      // Perform Firebase operation in background
      if (previousState) {
        await deleteDoc(favoriteRef);
      } else {
        const favoriteData = {
          userId: user.uid,
          gameId: completeGame.id,
          gameName: completeGame.name,
          gameSlug: completeGame.slug,
          gameImage: completeGame.background_image || '',
          gameRating: completeGame.rating || 0,
          gamePrice: completeGame.price || 0,
          addedAt: new Date().toISOString(),
        };
        await setDoc(favoriteRef, favoriteData);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      
      // Only revert UI state if still mounted
      if (isMounted.current) {
        setIsFavorite(previousState);
        
        // Also revert local cache
        updateLocalFavoritesCache(previousState);
        
        showToast(`Error: No se pudo ${previousState ? 'eliminar de' : 'añadir a'} favoritos`);
      }
    } finally {
      // Cleanup
      if (isMounted.current) {
        setTimeout(() => {
          if (isMounted.current) setPendingOperation(false);
        }, 200);
      }
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is authenticated first
    if (!user) {
      showToast('Debes iniciar sesión para añadir juegos al carrito');
      return;
    }

    // Actualización inmediata de UI
    setAddedToCart(true);
    
    // Añadir al carrito (operación rápida porque es local)
    addToCart(completeGame);
    
    showToast(`${completeGame.name} añadido al carrito`);
    
    // Resetear el estado visual después de un breve período
    setTimeout(() => {
      if (isMounted.current) {
        setAddedToCart(false);
      }
    }, 1500);
  };

  // Función para mostrar toast
  const showToast = (message: string) => {
    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = message;
      toast.className = 'visible fixed bottom-4 right-4 bg-indigo-600 text-white py-2 px-4 rounded shadow-lg z-50';
      setTimeout(() => {
        toast.className = 'hidden';
      }, 3000);
    }
  };

  // Replace the getDiscount function with this streamlined approach
  const hasDiscount = completeGame.originalPrice && completeGame.discountPercentage;

  const releaseYear = completeGame.released ? new Date(completeGame.released).getFullYear() : "N/A";
  
  // Limitar plataformas a mostrar máximo 3 (con verificación de nulidad)
  const displayPlatforms = (completeGame.platforms || []).slice(0, 3);
  
  // Obtener géneros (máximo 2) (con verificación de nulidad)
  const displayGenres = (completeGame.genres || []).slice(0, 2);

  return (
    <div className="group relative h-full">
      {/* Card con efecto de elevación pero sin cambios estructurales en hover */}
      <Link href={`/game/${completeGame.slug}`} className="block h-full">
        <div className="h-full rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg border border-slate-700/50 transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
          
          {/* Imagen principal */}
          <div className="relative h-48 overflow-hidden">
            <Image
              src={completeGame.background_image || '/placeholder-game.jpg'}
              alt={completeGame.name}
              fill
              className="object-cover transition-all duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Gradiente superpuesto estable */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
            
            {/* Año de lanzamiento */}
            <div className="absolute top-3 right-3 px-2 py-1 bg-slate-800/80 backdrop-blur text-xs text-slate-300 rounded">
              {releaseYear}
            </div>
            
            {/* Descuento si existe */}
            {hasDiscount && (
              <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                -{completeGame.discountPercentage}%
              </div>
            )}
            
            {/* Plataformas como iconos */}
            <div className="absolute bottom-3 left-3 flex space-x-1">
              {displayPlatforms.map((p) => {
                let platformIcon = '🎮'; // Default
                
                if (p.platform.name.includes('PC')) platformIcon = '💻';
                else if (p.platform.name.includes('PlayStation')) platformIcon = '🎮';
                else if (p.platform.name.includes('Xbox')) platformIcon = '🎯';
                else if (p.platform.name.includes('Nintendo')) platformIcon = '🕹️';
                else if (p.platform.name.includes('iOS') || p.platform.name.includes('Android')) platformIcon = '📱';
                
                return (
                  <span 
                    key={p.platform.id} 
                    className="inline-block w-6 h-6 bg-slate-800/80 rounded-full flex items-center justify-center text-xs"
                    title={p.platform.name}
                  >
                    {platformIcon}
                  </span>
                );
              })}
            </div>
          </div>
          
          {/* Información del juego - siempre visible de forma consistente */}
          <div className="p-4">
            <div className="flex items-center mb-2">
              <div className="flex items-center bg-amber-500/20 text-amber-400 text-xs px-1.5 py-0.5 rounded mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 mr-0.5">
                  <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" />
                </svg>
                <span>{completeGame.rating.toFixed(1)}</span>
              </div>
              
              {/* Género principal */}
              <div className="flex flex-wrap flex-1 justify-end">
                {displayGenres.length > 0 ? displayGenres.map(genre => (
                  <span key={genre.id} className="inline-block bg-violet-900/30 text-violet-300 text-xs px-2 py-0.5 rounded ml-1">
                    {genre.name}
                  </span>
                )) : (
                  <span className="inline-block bg-violet-900/30 text-violet-300 text-xs px-2 py-0.5 rounded ml-1">
                    Sin categoría
                  </span>
                )}
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mb-2 text-white line-clamp-1 group-hover:text-violet-400 transition-colors">
              {completeGame.name}
            </h3>
            
            <div className="flex items-end justify-between">
              <div>
                {hasDiscount ? (
                  <>
                    <span className="text-xs text-slate-400 line-through block">
                      €{completeGame.originalPrice?.toFixed(2)}
                    </span>
                    <span className="text-lg font-bold text-violet-400">
                      €{(completeGame.price ?? 0).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-violet-400">
                    €{(completeGame.price ?? 0).toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Botones de acción fuera del link para evitar problemas de navegación */}
      <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Botón de favoritos */}
        <button
          onClick={toggleFavorite}
          disabled={pendingOperation}
          className={`w-8 h-8 bg-slate-800/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-slate-700 ${
            pendingOperation ? 'cursor-wait' : ''
          }`}
          aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
        >
          {isLoading ? (
            <span className="w-4 h-4 border-2 border-t-transparent border-violet-500 rounded-full animate-spin"></span>
          ) : isFavorite ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#ec4899" className="w-5 h-5">
              <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 01-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          )}
        </button>
        
        {/* Botón de añadir al carrito */}
        <button
          onClick={handleAddToCart}
          className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-colors ${addedToCart ? 'bg-green-600' : 'bg-slate-800/90 backdrop-blur hover:bg-slate-700'}`}
          aria-label="Añadir al carrito"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
