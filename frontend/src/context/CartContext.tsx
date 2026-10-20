import React, { createContext, useContext, useState, useEffect } from 'react';
import { FoodItem, CartItem } from '../types/index.js';
import { useSocket } from './SocketContext.js';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totalAmount: number;
  addToCart: (food: FoodItem, quantity?: number) => void;
  updateQuantity: (foodId: string, quantity: number) => void;
  removeFromCart: (foodId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { socket } = useSocket();
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('campusbite_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('campusbite_cart', JSON.stringify(items));
  }, [items]);

  // Real-time stock listener to update cart items if stock changes or sells out
  useEffect(() => {
    if (!socket) return;

    const handleStockUpdate = (data: { foodItemId: string; stockQuantity: number; available: boolean }) => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.food.id === data.foodItemId) {
            const isAvailable = data.available && data.stockQuantity > 0;
            return {
              ...item,
              food: {
                ...item.food,
                stockQuantity: data.stockQuantity,
                available: isAvailable,
              },
              quantity: data.stockQuantity > 0 ? Math.min(item.quantity, data.stockQuantity) : item.quantity,
            };
          }
          return item;
        })
      );
    };

    socket.on('food:stock_updated', handleStockUpdate);
    return () => {
      socket.off('food:stock_updated', handleStockUpdate);
    };
  }, [socket]);

  const addToCart = (food: FoodItem, quantity: number = 1) => {
    if (!food.available || food.stockQuantity <= 0) {
      alert(`"${food.name}" is currently sold out.`);
      return;
    }

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.food.id === food.id);
      if (existingIndex > -1) {
        const currentQty = prev[existingIndex].quantity;
        const requestedTotal = currentQty + quantity;

        if (requestedTotal > food.stockQuantity) {
          alert(`Cannot add more "${food.name}". Available stock: ${food.stockQuantity}, already in cart: ${currentQty}.`);
          const updated = [...prev];
          updated[existingIndex].quantity = food.stockQuantity;
          return updated;
        }

        const updated = [...prev];
        updated[existingIndex].quantity = requestedTotal;
        return updated;
      }

      if (quantity > food.stockQuantity) {
        alert(`Cannot add ${quantity} units of "${food.name}". Only ${food.stockQuantity} available.`);
        return [...prev, { food, quantity: food.stockQuantity }];
      }

      return [...prev, { food, quantity }];
    });
  };

  const updateQuantity = (foodId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(foodId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.food.id === foodId) {
          if (quantity > item.food.stockQuantity) {
            alert(`Cannot order ${quantity} units of "${item.food.name}". Maximum available stock is ${item.food.stockQuantity}.`);
            return { ...item, quantity: Math.max(1, item.food.stockQuantity) };
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (foodId: string) => {
    setItems((prev) => prev.filter((item) => item.food.id !== foodId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.food.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        totalAmount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
