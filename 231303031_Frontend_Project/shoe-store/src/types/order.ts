export type PayMethod = 'cod' | 'bank';

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  size: string | number;
  color: string;
  image?: string;
}

export interface Order {
  id: string;
  uid: number;
  name: string;
  sdt: string;
  address: string;
  note: string;
  pay: PayMethod;
  items: OrderItem[];
  total: number;
  code: string;
  off: number;
  final: number;
  status: string;
  createdAt: string;
}

export interface NewOrder {
  uid: number;
  name: string;
  sdt: string;
  address: string;
  note: string;
  pay: PayMethod;
  items: OrderItem[];
  total: number;
  code: string;
  off: number;
  final: number;
}
