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

const STORAGE_KEY = 'shoe-store-cart';

const CartContext = createContext<CartContextValue | null>(null);

function isValidItem(value: unknown): value is CartItem {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const item = value as Partial<CartItem>;

  return (
    Boolean(item.product) &&
    typeof item.product?.id === 'number' &&
    typeof item.size === 'number' &&
    typeof item.quantity === 'number' &&
    item.quantity > 0
  );
}

function readInitialCart(): CartItem[] {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed.filter(isValidItem) : [];
  } catch {
    return [];
  }
}

function clampQuantity(quantity: number, stock: number): number {
  const max = stock > 0 ? stock : 1;
  return Math.min(Math.max(Math.trunc(quantity) || 1, 1), max);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readInitialCart);

  useEffect(() => {
    try {
      globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      return;
    }
  }, [items]);

  const addToCart = (product: Product, size: number, quantity = 1) => {
    setItems((current) => {
      const index = current.findIndex(
        (item) => item.product.id === product.id && item.size === size
      );

      const safeQuantity = clampQuantity(quantity, product.stock);

      if (index === -1) {
        return [...current, { product, size, quantity: safeQuantity }];
      }

      const next = [...current];
      next[index] = {
        ...next[index],
        quantity: clampQuantity(
          next[index].quantity + safeQuantity,
          product.stock
        ),
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
          ? { ...item, quantity: clampQuantity(quantity, item.product.stock) }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

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
