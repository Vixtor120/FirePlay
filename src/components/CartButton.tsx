'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Game } from '@/types/game.types';
import { useRouter } from 'next/navigation';

interface CartButtonProps {
  game: Game;
}

export default function CartButton({ game }: CartButtonProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // Check if user is authenticated
    if (!user) {
      const toast = document.getElementById('toast');
      if (toast) {
        toast.textContent = 'Debes iniciar sesión para añadir juegos al carrito';
        toast.className = 'visible fixed bottom-4 right-4 bg-indigo-600 text-white py-2 px-4 rounded shadow-lg z-50';
        setTimeout(() => {
          toast.className = 'hidden';
        }, 3000);
      }
      
      router.push(`/login?redirect=game/${game.slug}`);
      return;
    }

    setLoading(true);
    
    // Simulamos una pequeña demora para dar feedback visual
    setTimeout(() => {
      try {
        addToCart(game, quantity);
        setAdded(true);
        
        // Mostrar retroalimentación visual
        const toast = document.getElementById('toast');
        if (toast) {
          toast.textContent = `${quantity} ${quantity === 1 ? 'copia' : 'copias'} de ${game.name} añadidas al carrito`;
          toast.className = 'visible fixed bottom-4 right-4 bg-green-600 text-white py-2 px-4 rounded shadow-lg z-50';
          setTimeout(() => {
            toast.className = 'hidden';
          }, 3000);
        }
        
        // Resetear estado después de un tiempo
        setTimeout(() => {
          setAdded(false);
          setQuantity(1);
        }, 2000);
      } catch (error) {
        console.error('Error adding to cart:', error);
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center space-x-3">
        <label htmlFor="quantity" className="text-gray-700">Cantidad:</label>
        <select
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border rounded px-2 py-1"
          disabled={loading || added}
        >
          {[1, 2, 3, 4, 5].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>
      
      <button
        onClick={handleAddToCart}
        disabled={loading || added}
        className={`w-full py-2 px-4 rounded-md transition-all duration-300 ${
          added 
            ? 'bg-green-600 text-white cursor-default' 
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
        } ${loading ? 'opacity-70' : ''}`}
      >
        {loading ? 'Añadiendo...' : added ? '¡Añadido al carrito!' : 'Añadir al carrito'}
      </button>
    </div>
  );
}
