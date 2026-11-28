export type VoucherType = 'percent' | 'fixed';

export interface Voucher {
  id: string;
  code: string;
  title: string;
  desc: string;
  type: VoucherType;
  val: number;
  maxOff?: number;
  minOrder: number;
  left: number;
  exp: string;
  uid?: number;
}

export interface VoucherRes {
  ok: boolean;
  msg: string;
  voucher?: Voucher;
  off?: number;
}
