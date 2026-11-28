import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getVouchers, getSaved, toggleSave } from '../services/voucherService';

export function useVouchers() {
  const { user, openLogin } = useAuth();
  const uid = user?.id;
  const list = getVouchers(uid);
  const [saved, setSaved] = useState<string[]>(() => getSaved(uid));
  const [copied, setCopied] = useState('');

  useEffect(() => {
    setSaved(getSaved(uid));
  }, [uid]);

  const toggle = (id: string) => {
    if (!uid) {
      openLogin('Vui lòng đăng nhập để lưu mã giảm giá');
      return;
    }
    setSaved(toggleSave(uid, id));
  };

  const copy = (code: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    setCopied(code);
    setTimeout(() => {
      setCopied((cur) => (cur === code ? '' : cur));
    }, 1800);
  };

  return { list, saved, copied, toggle, copy };
}
