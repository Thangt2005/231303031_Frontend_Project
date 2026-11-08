import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../store/slice/ProductListSlice';

export type CartItem = {
  product: Product;
  size: number;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  addToCart: (product: Product, size: number, quantity?: number) => void;
  removeFromCart: (productId: number, size: number) => void;
  updateQuantity: (productId: number, size: number, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const CART_STORAGE_KEY = 'shoe-store-cart';

function readStoredCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const items = JSON.parse(raw);
    return Array.isArray(items) ? (items as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readStoredCart);

  const addToCart = (product: Product, size: number, quantity = 1) => {
    setItems((current) => {
      const index = current.findIndex(
        (item) => item.product.id === product.id && item.size === size
      );

      if (index === -1) {
        return [...current, { product, size, quantity }];
      }

      const next = [...current];
      next[index] = {
        ...next[index],
        quantity: next[index].quantity + quantity,
      };
      return next;
    });
  };

  const removeFromCart = (productId: number, size: number) => {
    setItems((current) =>
      current.filter((item) => !(item.product.id === productId && item.size === size))
    );
  };

  const updateQuantity = (productId: number, size: number, quantity: number) => {
    setItems((current) =>
      current.map((item) =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Bỏ qua khi trình duyệt không cho lưu trữ.
    }
  }, [items]);

  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        totalQuantity,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart phải được dùng bên trong CartProvider');
  }

  return context;
}
