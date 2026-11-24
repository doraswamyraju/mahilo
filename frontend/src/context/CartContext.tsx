import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartData } from '../types/index.js';
import { api } from '../services/api.js';
import { useAuth } from './AuthContext.js';

interface CartContextType {
  cart: CartData | null;
  isLoading: boolean;
  itemCount: number;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const [cart, setCart] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshCart = async () => {
    if (!token) {
      setCart(null);
      return;
    }
    try {
      setIsLoading(true);
      const res: any = await api.get('/cart');
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (err) {
      console.error('Failed to load cart', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [user, token]);

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!token) {
      alert('Please log in or register to add items to your cart.');
      return;
    }
    try {
      setIsLoading(true);
      await api.post('/cart/items', { productId, quantity });
      await refreshCart();
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      setIsLoading(true);
      await api.put(`/cart/items/${productId}`, { quantity });
      await refreshCart();
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (productId: string) => {
    try {
      setIsLoading(true);
      await api.delete(`/cart/items/${productId}`);
      await refreshCart();
    } finally {
      setIsLoading(false);
    }
  };

  const itemCount = cart?.summary?.itemCount || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        itemCount,
        addToCart,
        updateQuantity,
        removeItem,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
