import type { NewOrder, Order, PayMethod } from '../types/order';

const KEY = 'orders_by_user';
const SEED_KEY = 'orders_seeded';

export const MOCK_ORDERS: Record<number, Order[]> = {
  1: [
    {
      id: 'DH100001',
      uid: 1,
      name: 'Trần Đức Trí',
      sdt: '0901234567',
      address: 'Thủ Đức, TP. Hồ Chí Minh',
      note: 'Giao giờ hành chính',
      pay: 'cod',
      items: [
        {
          id: 1,
          name: "Nike Air Force 1 '07",
          price: 2390000,
          qty: 1,
          size: 41,
          color: 'Trắng',
        },
      ],
      total: 2390000,
      code: 'SHOE10',
      off: 150000,
      final: 2240000,
      status: 'Đang giao hàng',
      createdAt: '25/11/2026, 14:20:00',
    },
    {
      id: 'DH100002',
      uid: 1,
      name: 'Trần Đức Trí',
      sdt: '0901234567',
      address: 'Thủ Đức, TP. Hồ Chí Minh',
      note: '',
      pay: 'bank',
      items: [
        {
          id: 2,
          name: 'Adidas Samba OG',
          price: 2650000,
          qty: 1,
          size: 40,
          color: 'Đen',
        },
      ],
      total: 2650000,
      code: 'GIAM50K',
      off: 50000,
      final: 2600000,
      status: 'Đã giao',
      createdAt: '20/11/2026, 09:15:00',
    },
    {
      id: 'DH100003',
      uid: 1,
      name: 'Trần Đức Trí',
      sdt: '0901234567',
      address: 'Thủ Đức, TP. Hồ Chí Minh',
      note: 'Đổi size khác',
      pay: 'cod',
      items: [
        {
          id: 4,
          name: 'Vans Old Skool',
          price: 1650000,
          qty: 1,
          size: 42,
          color: 'Đen',
        },
      ],
      total: 1650000,
      code: '',
      off: 0,
      final: 1650000,
      status: 'Đã hủy',
      createdAt: '15/11/2026, 18:40:00',
    },
  ],
  2: [
    {
      id: 'DH200001',
      uid: 2,
      name: 'Lê Minh Khang',
      sdt: '0912345678',
      address: 'Bình Thạnh, TP. Hồ Chí Minh',
      note: '',
      pay: 'bank',
      items: [
        {
          id: 1,
          name: "Nike Air Force 1 '07",
          price: 2390000,
          qty: 1,
          size: 40,
          color: 'Đen',
        },
      ],
      total: 2390000,
      code: '',
      off: 0,
      final: 2390000,
      status: 'Đang giao hàng',
      createdAt: '26/11/2026, 10:05:00',
    },
  ],
};

function readMap(): Record<number, Order[]> {
  if (typeof localStorage === 'undefined') return { ...MOCK_ORDERS };
  let map: Record<number, Order[]> = {};
  const raw = localStorage.getItem(KEY);
  if (raw) {
    try {
      map = JSON.parse(raw);
    } catch {
      map = {};
    }
  }
  if (!localStorage.getItem(SEED_KEY)) {
    for (const [k, mocks] of Object.entries(MOCK_ORDERS)) {
      const uid = Number(k);
      const cur = map[uid] || [];
      const ids = new Set(cur.map((o) => o.id));
      map[uid] = [...cur, ...mocks.filter((m) => !ids.has(m.id))];
    }
    localStorage.setItem(KEY, JSON.stringify(map));
    localStorage.setItem(SEED_KEY, '1');
  }
  return map;
}

function writeMap(map: Record<number, Order[]>) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(map));
}

export function fmtPay(pay: PayMethod): string {
  return pay === 'bank' ? 'Chuyển khoản' : 'Thanh toán khi nhận hàng (COD)';
}

export function itemSize(item: any): string | number {
  return item.size || (Array.isArray(item.sizes) && item.sizes[0]) || 38;
}

export function itemColor(item: any): string {
  return (item.color && String(item.color).trim()) || (Array.isArray(item.colors) && item.colors[0]) || 'Đen';
}

export function getOrders(uid?: number): Order[] {
  if (!uid) return [];
  const map = readMap();
  return map[uid] ? [...map[uid]] : [];
}

export function addOrder(data: NewOrder): Order {
  const order: Order = {
    ...data,
    id: `DH${Date.now().toString().slice(-6)}`,
    status: 'Đang xử lý',
    createdAt: new Date().toLocaleString('vi-VN'),
  };
  const map = readMap();
  const cur = map[data.uid] || [];
  map[data.uid] = [order, ...cur];
  writeMap(map);
  return order;
}
