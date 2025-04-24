'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { collection, query, where, getDocs, deleteDoc, doc, limit } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FavoriteGame {
  id: string;
  gameId: number;
  gameName: string;
  gameSlug: string;
  gameImage: string;
  gameRating: number;
  gamePrice: number;
  addedAt: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingRemovals, setPendingRemovals] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const router = useRouter();
  const localCacheKey = useRef(`fireplay_favorites_${user?.uid || 'guest'}`);
  const isMounted = useRef(true);

  useEffect(() => {
    if (!user && !loading) {
      router.push('/login?redirect=favorites');
    }
  }, [user, router, loading]);

  useEffect(() => {
    if (user) {
      try {
        const cachedFavoritesJson = localStorage.getItem(localCacheKey.current);
        if (cachedFavoritesJson) {
          const cachedFavorites = JSON.parse(cachedFavoritesJson);
          const cacheDate = new Date(cachedFavorites.timestamp);
          const now = new Date();
          if (now.getDate() === cacheDate.getDate() && now.getMonth() === cacheDate.getMonth()) {
            setFavorites(cachedFavorites.data);
            setLoading(false);
            setInitialLoadComplete(true);
          }
        }
      } catch (error) {
        console.error('Error loading from cache:', error);
      }
    }
  }, [user]);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (!initialLoadComplete) {
      setLoading(true);
    }
    
    setError(null);
    
    try {
      const favoritesQuery = query(
        collection(db, 'favorites'),
        where('userId', '==', user.uid),
        limit(50)
      );
      
      const querySnapshot = await getDocs(favoritesQuery);
      
      const favoritesData: FavoriteGame[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        favoritesData.push({ id: doc.id, ...data } as FavoriteGame);
      });
      
      favoritesData.sort((a, b) => 
        new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      );
      
      setFavorites(favoritesData);
      
      if (isMounted.current) {
        try {
          localStorage.setItem(localCacheKey.current, JSON.stringify({
            data: favoritesData,
            timestamp: new Date().toISOString()
          }));
        } catch (error) {
          console.error('Error saving to cache:', error);
        }
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setError('No se pudieron cargar los favoritos. Inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
      setInitialLoadComplete(true);
    }
  }, [user, initialLoadComplete]);

  useEffect(() => {
    isMounted.current = true;
    fetchFavorites();
    return () => {
      isMounted.current = false;
    };
  }, [fetchFavorites]);

  const removeFavorite = async (favoriteId: string, gameName: string) => {
    setPendingRemovals(prev => new Set(prev).add(favoriteId));
    setFavorites(currentFavorites => 
      currentFavorites.filter(fav => fav.id !== favoriteId)
    );
    
    try {
      const cachedFavoritesJson = localStorage.getItem(localCacheKey.current);
      if (cachedFavoritesJson) {
        const cachedFavorites = JSON.parse(cachedFavoritesJson);
        const updatedCache = {
          data: cachedFavorites.data.filter((fav: FavoriteGame) => fav.id !== favoriteId),
          timestamp: new Date().toISOString()
        };
        localStorage.setItem(localCacheKey.current, JSON.stringify(updatedCache));
      }
    } catch (error) {
      console.error('Error updating cache:', error);
    }
    
    try {
      await deleteDoc(doc(db, 'favorites', favoriteId));
      const toast = document.getElementById('toast');
      if (toast) {
        toast.textContent = `${gameName} eliminado de favoritos`;
        toast.className = 'visible fixed bottom-4 right-4 bg-indigo-600 text-white py-2 px-4 rounded shadow-lg z-50';
        setTimeout(() => {
          toast.className = 'hidden';
        }, 3000);
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      
      if (isMounted.current) {
        setPendingRemovals(prev => {
          const newSet = new Set(prev);
          newSet.delete(favoriteId);
          return newSet;
        });
        
        fetchFavorites();
      }
      
      const toast = document.getElementById('toast');
      if (toast) {
        toast.textContent = 'Error al eliminar de favoritos';
        toast.className = 'visible fixed bottom-4 right-4 bg-red-600 text-white py-2 px-4 rounded shadow-lg z-50';
        setTimeout(() => {
          toast.className = 'hidden';
        }, 3000);
      }
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12 bg-slate-800 rounded-xl border border-slate-700 p-8">
        <p className="text-slate-300 mb-6">Debes iniciar sesión para ver tus favoritos</p>
        <Link 
          href="/login?redirect=favorites" 
          className="bg-violet-600 text-white px-6 py-3 rounded-lg hover:bg-violet-700 transition-colors"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  if (loading && !initialLoadComplete) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Mis Juegos Favoritos</h1>
          <div className="text-sm text-slate-400 animate-pulse">Cargando favoritos...</div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-slate-800 rounded-lg shadow-md animate-pulse border border-slate-700">
              <div className="h-48 bg-slate-700"></div>
              <div className="p-4">
                <div className="h-5 bg-slate-700 rounded-md mb-3 w-3/4"></div>
                <div className="h-4 bg-slate-700 rounded-md w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-slate-800 rounded-xl border border-slate-700">
        <p className="text-red-400 mb-4">{error}</p>
        <button 
          onClick={() => fetchFavorites()}
          className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Mis Juegos Favoritos</h1>
        {loading && initialLoadComplete && (
          <div className="flex items-center text-sm text-slate-400">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-violet-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Actualizando...
          </div>
        )}
      </div>
      
      {favorites.length === 0 && !loading ? (
        <div className="bg-slate-800 p-8 rounded-lg shadow-md text-center border border-slate-700">
          <p className="text-slate-300 mb-6">No tienes juegos favoritos guardados</p>
          <Link 
            href="/search" 
            className="bg-violet-600 text-white px-6 py-3 rounded-lg hover:bg-violet-700 transition-colors"
          >
            Explorar juegos
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((favorite) => (
            <div 
              key={favorite.id} 
              className={`bg-slate-800 rounded-lg shadow-lg overflow-hidden flex flex-col border border-slate-700 ${
                pendingRemovals.has(favorite.id) ? 'opacity-50' : ''
              }`}
            >
              <Link href={`/game/${favorite.gameSlug}`} className="block relative h-48">
                <Image
                  src={favorite.gameImage || '/placeholder-game.jpg'}
                  alt={favorite.gameName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFeAJcUQfaWQAAAABJRU5ErkJggg=="
                />
              </Link>
              
              <div className="p-4 flex-grow flex flex-col">
                <Link href={`/game/${favorite.gameSlug}`}>
                  <h2 className="text-lg font-semibold mb-2 text-white hover:text-violet-300 transition-colors">{favorite.gameName}</h2>
                </Link>
                
                <div className="flex items-center mb-3">
                  <span className="flex items-center text-xs bg-slate-900 backdrop-blur-sm rounded-full px-2 py-1 text-slate-300 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fbbf24" className="w-3 h-3 mr-1">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                    </svg>
                    {favorite.gameRating.toFixed(1)}
                  </span>
                  <span className="text-violet-400 font-medium">${favorite.gamePrice.toFixed(2)}</span>
                </div>
                
                <div className="mt-auto pt-3 flex justify-between border-t border-slate-700">
                  <button 
                    onClick={() => removeFavorite(favorite.id, favorite.gameName)}
                    disabled={pendingRemovals.has(favorite.id)}
                    className={`text-red-400 hover:text-red-300 text-sm flex items-center ${
                      pendingRemovals.has(favorite.id) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    Eliminar
                  </button>
                  
                  <Link 
                    href={`/game/${favorite.gameSlug}`}
                    className="text-violet-400 hover:text-violet-300 text-sm flex items-center"
                  >
                    <span>Ver detalles</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div id="toast" className="hidden"></div>
    </div>
  );
}
