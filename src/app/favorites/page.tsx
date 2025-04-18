'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
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
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      router.push('/login?redirect=favorites');
    }
  }, [user, router, loading]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        console.log("Fetching favorites for user:", user.uid);
        
        const favoritesQuery = query(
          collection(db, 'favorites'),
          where('userId', '==', user.uid)
        );
        
        const querySnapshot = await getDocs(favoritesQuery);
        console.log(`Found ${querySnapshot.size} favorites`);
        
        const favoritesData: FavoriteGame[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log("Favorite document:", { id: doc.id, ...data });
          favoritesData.push({ id: doc.id, ...data } as FavoriteGame);
        });
        
        favoritesData.sort((a, b) => 
          new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
        );
        
        setFavorites(favoritesData);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setError('No se pudieron cargar los favoritos. Inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const removeFavorite = async (favoriteId: string) => {
    try {
      await deleteDoc(doc(db, 'favorites', favoriteId));
      setFavorites(favorites.filter(fav => fav.id !== favoriteId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Error al eliminar de favoritos. Inténtalo de nuevo.');
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

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Mis Juegos Favoritos</h1>
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
          onClick={() => window.location.reload()}
          className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Mis Juegos Favoritos</h1>
      
      {favorites.length === 0 ? (
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
              className="bg-slate-800 rounded-lg shadow-lg overflow-hidden flex flex-col border border-slate-700"
            >
              <Link href={`/game/${favorite.gameSlug}`} className="block relative h-48">
                <Image
                  src={favorite.gameImage || '/placeholder-game.jpg'}
                  alt={favorite.gameName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                    onClick={() => removeFavorite(favorite.id)}
                    className="text-red-400 hover:text-red-300 text-sm flex items-center"
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
    </div>
  );
}
