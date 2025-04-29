'use client';

import { useAuth } from './AuthContext';
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Game } from '@/types/game.types';
import { useRouter } from 'next/navigation';

type CartItem = Game & {
  quantity: number;
};

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (game: Game, quantity?: number) => void;
  removeFromCart: (gameId: number) => void;
  updateQuantity: (gameId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalPrice: 0,
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useAuth();
  const router = useRouter();

  // Load cart from localStorage when component mounts and user changes
  useEffect(() => {
    if (user) {
      const storedCart = localStorage.getItem(`cart_${user.uid}`);
      if (storedCart) {
        try {
          setCartItems(JSON.parse(storedCart));
        } catch (e) {
          console.error('Error parsing cart data:', e);
          setCartItems([]);
        }
      }
    } else {
      // Clear cart when user logs out
      setCartItems([]);
    }
  }, [user]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart_${user.uid}`, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = (game: Game, quantity: number = 1) => {
    // Require authentication to add to cart
    if (!user) {
      // This shouldn't be reachable if UI is properly guarded, but serves as a safeguard
      router.push(`/login?redirect=game/${game.slug}`);
      return;
    }
    
    setCartItems(prevItems => {
      // Check if the item exists
      const existingItemIndex = prevItems.findIndex(item => item.id === game.id);
      
      if (existingItemIndex !== -1) {
        // Item exists, update quantity
        const updatedItems = [...prevItems];
        const newQuantity = Math.min(updatedItems[existingItemIndex].quantity + quantity, 10);
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: newQuantity,
        };
        return updatedItems;
      } else {
        // Item does not exist, add new item
        return [...prevItems, { ...game, quantity: Math.min(quantity, 10) }];
      }
    });
  };

  const removeFromCart = (gameId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== gameId));
  };

  const updateQuantity = (gameId: number, quantity: number) => {
    // Limit quantity to between 1 and 10
    const limitedQuantity = Math.max(1, Math.min(10, quantity));
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === gameId ? { ...item, quantity: limitedQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate total items and price
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
