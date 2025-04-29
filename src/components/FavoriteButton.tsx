'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { useRouter } from 'next/navigation';

interface FavoriteButtonProps {
  gameId: number;
  gameName: string;
  gameSlug: string;
  gameImage: string;
  gameRating: number;
  gamePrice: number;
  className?: string;
}

export default function FavoriteButton({
  gameId,
  gameName,
  gameSlug,
  gameImage,
  gameRating,
  gamePrice,
  className = ''
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  // Check if the game is already in favorites
  useEffect(() => {
    const checkIfFavorite = async () => {
      // If no user is logged in, the game cannot be in favorites
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const favoritesQuery = query(
          collection(db, 'favorites'),
          where('userId', '==', user.uid),
          where('gameId', '==', gameId)
        );
        
        const querySnapshot = await getDocs(favoritesQuery);
        
        if (!querySnapshot.empty) {
          setIsFavorite(true);
          setFavoriteId(querySnapshot.docs[0].id);
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkIfFavorite();
  }, [gameId, user]);

  const toggleFavorite = async () => {
    // Redirect to login if user is not authenticated
    if (!user) {
      const toast = document.getElementById('toast');
      if (toast) {
        toast.textContent = 'Debes iniciar sesión para añadir a favoritos';
        toast.className = 'visible fixed bottom-4 right-4 bg-indigo-600 text-white py-2 px-4 rounded shadow-lg z-50';
        setTimeout(() => {
          toast.className = 'hidden';
        }, 3000);
      }
      
      router.push(`/login?redirect=game/${gameSlug}`);
      return;
    }

    setIsLoading(true);

    try {
      if (isFavorite && favoriteId) {
        // Remove from favorites
        await deleteDoc(doc(db, 'favorites', favoriteId));
        setIsFavorite(false);
        setFavoriteId(null);
        
        const toast = document.getElementById('toast');
        if (toast) {
          toast.textContent = `${gameName} eliminado de favoritos`;
          toast.className = 'visible fixed bottom-4 right-4 bg-indigo-600 text-white py-2 px-4 rounded shadow-lg z-50';
          setTimeout(() => {
            toast.className = 'hidden';
          }, 3000);
        }
      } else {
        // Add to favorites
        const docRef = await addDoc(collection(db, 'favorites'), {
          userId: user.uid,
          gameId,
          gameName,
          gameSlug,
          gameImage,
          gameRating,
          gamePrice,
          addedAt: new Date().toISOString()
        });
        
        setIsFavorite(true);
        setFavoriteId(docRef.id);
        
        const toast = document.getElementById('toast');
        if (toast) {
          toast.textContent = `${gameName} añadido a favoritos`;
          toast.className = 'visible fixed bottom-4 right-4 bg-green-600 text-white py-2 px-4 rounded shadow-lg z-50';
          setTimeout(() => {
            toast.className = 'hidden';
          }, 3000);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      
      const toast = document.getElementById('toast');
      if (toast) {
        toast.textContent = 'Error al actualizar favoritos';
        toast.className = 'visible fixed bottom-4 right-4 bg-red-600 text-white py-2 px-4 rounded shadow-lg z-50';
        setTimeout(() => {
          toast.className = 'hidden';
        }, 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`flex items-center justify-center gap-2 transition-colors ${className}`}
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-slate-300'}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={isFavorite ? 0 : 2} 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </svg>
      )}
      {isFavorite ? 'En favoritos' : 'Añadir a favoritos'}
    </button>
  );
}
