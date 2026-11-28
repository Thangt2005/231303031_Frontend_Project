import { createContext, useContext, useReducer, useEffect, useState, ReactNode } from 'react';
import { cartReducer } from './cartReducer';
import { useAuth } from './AuthContext';
import { calcOff, checkVoucher } from '../services/voucherService';
import type { Voucher, VoucherRes } from '../types/voucher';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  [key: string]: any;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  voucher: Voucher | null;
  off: number;
  finalPrice: number;
  applyVoucher: (code: string) => VoucherRes;
  dropVoucher: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, openLogin } = useAuth();
  const [cart, dispatch] = useReducer(cartReducer, [], () => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [voucher, setVoucher] = useState<Voucher | null>(null);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const totalItems = cart.reduce((total: number, item: CartItem) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total: number, item: CartItem) => total + item.price * item.quantity, 0);

  useEffect(() => {
    if (!voucher) return;
    if (!user || cart.length === 0 || !checkVoucher(voucher.code, totalPrice, user.id).ok) {
      setVoucher(null);
    }
  }, [voucher, user?.id, totalPrice, cart.length]);

  const addToCart = (product: any, quantity = 1) => {
    if (!user) {
      openLogin('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      return;
    }
    dispatch({ type: 'ADD_TO_CART', payload: { ...product, quantity } });
  };

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const removeFromCart = (id: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    setVoucher(null);
  };

  const applyVoucher = (code: string): VoucherRes => {
    if (!user) {
      openLogin('Vui lòng đăng nhập để sử dụng mã giảm giá');
      return { ok: false, msg: 'Vui lòng đăng nhập để sử dụng mã giảm giá.' };
    }
    const res = checkVoucher(code, totalPrice, user.id);
    if (res.ok && res.voucher) {
      setVoucher(res.voucher);
    }
    return res;
  };

  const dropVoucher = () => {
    setVoucher(null);
  };

  const off = voucher && user ? calcOff(voucher, totalPrice) : 0;
  const finalPrice = Math.max(0, totalPrice - off);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
        voucher,
        off,
        finalPrice,
        applyVoucher,
        dropVoucher,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
