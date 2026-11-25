import type { Voucher, VoucherRes } from '../types/voucher';

export const MOCK_VOUCHERS: Voucher[] = [
  {
    id: 'v1',
    code: 'SHOE10',
    title: 'Giảm 10% toàn bộ đơn',
    desc: 'Giảm tối đa 150.000đ cho đơn từ 500.000đ.',
    type: 'percent',
    val: 10,
    maxOff: 150000,
    minOrder: 500000,
    left: 25,
    exp: '2026-12-31',
  },
  {
    id: 'v2',
    code: 'GIAM50K',
    title: 'Giảm thẳng 50.000đ',
    desc: 'Áp dụng cho mọi sản phẩm, đơn từ 400.000đ.',
    type: 'fixed',
    val: 50000,
    minOrder: 400000,
    left: 40,
    exp: '2026-12-31',
  },
  {
    id: 'v3',
    code: 'GIAM150K',
    title: 'Ưu đãi đơn lớn 150.000đ',
    desc: 'Dành cho đơn hàng từ 2.000.000đ trở lên.',
    type: 'fixed',
    val: 150000,
    minOrder: 2000000,
    left: 12,
    exp: '2026-12-31',
  },
  {
    id: 'v4',
    code: 'TRI20',
    title: 'Ưu đãi riêng thành viên',
    desc: 'Giảm 20% tối đa 200.000đ cho đơn từ 1.000.000đ.',
    type: 'percent',
    val: 20,
    maxOff: 200000,
    minOrder: 1000000,
    left: 5,
    exp: '2026-12-31',
    uid: 1,
  },
  {
    id: 'v5',
    code: 'FLASH30K',
    title: 'Flash Sale 30.000đ',
    desc: 'Không yêu cầu đơn tối thiểu.',
    type: 'fixed',
    val: 30000,
    minOrder: 0,
    left: 0,
    exp: '2026-12-31',
  },
  {
    id: 'v6',
    code: 'OLD2025',
    title: 'Mã ưu đãi cũ 15%',
    desc: 'Giảm 15% tối đa 100.000đ.',
    type: 'percent',
    val: 15,
    maxOff: 100000,
    minOrder: 300000,
    left: 10,
    exp: '2025-12-31',
  },
];

const savedMap: Record<number, string[]> = {
  1: ['v1'],
};

export function getVouchers(uid?: number): Voucher[] {
  return MOCK_VOUCHERS.filter((v) => !v.uid || v.uid === uid);
}

export function isExpired(v: Voucher, now = new Date()): boolean {
  const end = new Date(`${v.exp}T23:59:59`);
  return now.getTime() > end.getTime();
}

export function isActive(v: Voucher, now = new Date()): boolean {
  return !isExpired(v, now) && v.left > 0;
}

export function calcOff(v: Voucher, total: number): number {
  if (total <= 0) return 0;
  let off = v.type === 'percent' ? Math.floor((total * v.val) / 100) : v.val;
  if (v.maxOff && off > v.maxOff) off = v.maxOff;
  return Math.min(off, total);
}

export function findVoucher(code: string): Voucher | undefined {
  const key = code.trim().toUpperCase();
  if (!key) return undefined;
  return MOCK_VOUCHERS.find((v) => v.code.toUpperCase() === key);
}

export function checkVoucher(code: string, total: number, uid?: number): VoucherRes {
  const v = findVoucher(code);
  if (!v) return { ok: false, msg: 'Mã giảm giá không tồn tại.' };
  if (v.uid && v.uid !== uid) {
    return { ok: false, msg: 'Mã giảm giá không áp dụng cho tài khoản này.' };
  }
  if (isExpired(v)) return { ok: false, msg: 'Mã giảm giá đã hết hạn.' };
  if (v.left <= 0) return { ok: false, msg: 'Mã giảm giá đã hết lượt sử dụng.' };
  if (total < v.minOrder) {
    return {
      ok: false,
      msg: `Đơn tối thiểu ${v.minOrder.toLocaleString('vi-VN')}đ để dùng mã này.`,
    };
  }
  return { ok: true, msg: 'Áp dụng mã thành công.', voucher: v, off: calcOff(v, total) };
}

export function fmtOff(v: Voucher): string {
  return v.type === 'percent'
    ? `-${v.val}%`
    : `-${v.val.toLocaleString('vi-VN')}đ`;
}

export function getSaved(uid?: number): string[] {
  if (!uid) return [];
  return savedMap[uid] ? [...savedMap[uid]] : [];
}

export function toggleSave(uid: number, id: string): string[] {
  const cur = savedMap[uid] || [];
  const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
  savedMap[uid] = next;
  return [...next];
}
