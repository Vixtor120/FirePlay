'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { collection, doc, setDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { useAuth } from './AuthContext';
import { Genre } from '@/types/game.types';

interface CartItem {
  id: number;
  slug: string;
  name: string;
  background_image: string;
  price: number;
  genres: Genre[];
  rating: number;
  released: string;
  platforms: {
    platform: {
      id: number;
      name: string;
    }
  }[];
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (game: {
    id: number;
    slug: string;
    name: string;
    background_image: string;
    price: number;
    genres: Genre[];
    released: string;
    rating: number;
    platforms: {
      platform: {
        id: number;
        name: string;
      }
    }[];
  }, quantity?: number) => void;
  removeFromCart: (gameId: number) => void;
  updateQuantity: (gameId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [syncInProgress, setSyncInProgress] = useState(false);

  const loadCartItems = useCallback(async () => {
    setIsLoading(true);
    try {
      if (user) {
        const cartQuery = query(
          collection(db, 'carts'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(cartQuery);
        const items: CartItem[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          items.push({
            id: data.gameId,
            slug: data.gameSlug,
            name: data.gameName,
            background_image: data.gameImage,
            price: data.gamePrice,
            genres: data.genres,
            rating: data.rating,
            released: data.released,
            platforms: data.platforms,
            quantity: data.quantity
          });
        });
        setCartItems(items);
      } else {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadCartItems();
  }, [loadCartItems]);

  useEffect(() => {
    if (!isLoading && !user) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoading, user]);

  const syncCartWithFirestore = useCallback(async () => {
    if (!user || syncInProgress) return;

    setSyncInProgress(true);
    try {
      const cartQuery = query(
        collection(db, 'carts'),
        where('userId', '==', user.uid)
      );
      const querySnapshot = await getDocs(cartQuery);

      const batchSize = 10;
      const batches = Math.ceil(querySnapshot.size / batchSize);

      for (let i = 0; i < batches; i++) {
        const batch = querySnapshot.docs.slice(i * batchSize, (i + 1) * batchSize);
        await Promise.all(batch.map((doc) => deleteDoc(doc.ref)));
      }

      for (let i = 0; i < cartItems.length; i += batchSize) {
        const batch = cartItems.slice(i, i + batchSize);
        await Promise.all(batch.map(item => 
          setDoc(doc(db, 'carts', `${user.uid}_${item.id}`), {
            userId: user.uid,
            gameId: item.id,
            gameSlug: item.slug,
            gameName: item.name,
            gameImage: item.background_image,
            gamePrice: item.price,
            genres: item.genres,
            rating: item.rating,
            released: item.released,
            platforms: item.platforms,
            quantity: item.quantity,
            updatedAt: new Date().toISOString()
          })
        ));
      }
    } catch (error) {
      console.error('Error syncing cart with Firestore:', error);
    } finally {
      setSyncInProgress(false);
    }
  }, [cartItems, user, syncInProgress]);

  useEffect(() => {
    if (!isLoading && user) {
      const timer = setTimeout(() => {
        syncCartWithFirestore();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [cartItems, isLoading, user, syncCartWithFirestore]);

  const updateQuantity = useCallback((id: number, quantity: number) => {
    const validQuantity = Math.max(1, Math.min(10, quantity));
    
    const newCartItems = cartItems.map(item => {
      if (item.id === id) {
        return { ...item, quantity: validQuantity };
      }
      return item;
    });
    
    setCartItems(newCartItems);
    localStorage.setItem('cartItems', JSON.stringify(newCartItems));
  }, [cartItems]);

  const addToCart = (game: {
    id: number;
    slug: string;
    name: string;
    background_image: string;
    price: number;
    genres: Genre[];
    released: string;
    rating: number;
    platforms: {
      platform: {
        id: number;
        name: string;
      }
    }[];
  }, quantity = 1) => {
    const validQuantity = Math.max(1, Math.min(10, quantity));
    
    const existingItem = cartItems.find(item => item.id === game.id);

    if (existingItem) {
      const newQuantity = Math.min(10, existingItem.quantity + validQuantity);
      updateQuantity(game.id, newQuantity);
    } else {
      const newCart = [...cartItems, { ...game, quantity: validQuantity }];
      setCartItems(newCart);
      localStorage.setItem('cartItems', JSON.stringify(newCart));
    }
  };

  const removeFromCart = useCallback((gameId: number) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== gameId));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      totalItems,
      totalPrice,
      isCartLoading: isLoading || syncInProgress
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
