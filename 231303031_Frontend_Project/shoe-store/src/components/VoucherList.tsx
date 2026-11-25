import { useState } from 'react';
import { isActive } from '../services/voucherService';
import type { Voucher } from '../types/voucher';
import VoucherCard from './VoucherCard';

interface Props {
  list: Voucher[];
  saved?: string[];
  copied?: string;
  onSave?: (id: string) => void;
  onCopy?: (code: string) => void;
  onPick?: (v: Voucher) => void;
  pickLabel?: string;
  showFilter?: boolean;
}

type Tab = 'all' | 'active' | 'saved';

export default function VoucherList({
  list,
  saved = [],
  copied = '',
  onSave,
  onCopy,
  onPick,
  pickLabel,
  showFilter = true,
}: Props) {
  const [q, setQ] = useState('');
  const [tab, setTab] = useState<Tab>('all');

  const key = q.trim().toLowerCase();
  const items = list.filter((v) => {
    if (tab === 'active' && !isActive(v)) return false;
    if (tab === 'saved' && !saved.includes(v.id)) return false;
    if (!key) return true;
    return (
      v.code.toLowerCase().includes(key) ||
      v.title.toLowerCase().includes(key) ||
      v.desc.toLowerCase().includes(key)
    );
  });

  return (
    <div className="vc-wrap">
      {showFilter && (
        <div className="vc-toolbar">
          <div className="vc-tabs">
            <button
              type="button"
              className={`vc-tab ${tab === 'all' ? 'active' : ''}`}
              onClick={() => setTab('all')}
            >
              Tất cả ({list.length})
            </button>
            <button
              type="button"
              className={`vc-tab ${tab === 'active' ? 'active' : ''}`}
              onClick={() => setTab('active')}
            >
              Còn hiệu lực
            </button>
            <button
              type="button"
              className={`vc-tab ${tab === 'saved' ? 'active' : ''}`}
              onClick={() => setTab('saved')}
            >
              Đã lưu ({saved.length})
            </button>
          </div>

          <input
            type="text"
            className="vc-search"
            placeholder="Tìm mã giảm giá..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      )}

      {items.length === 0 ? (
        <p className="vc-empty">Không tìm thấy mã giảm giá phù hợp.</p>
      ) : (
        <div className="vc-grid">
          {items.map((v) => (
            <VoucherCard
              key={v.id}
              v={v}
              saved={saved.includes(v.id)}
              copied={copied === v.code}
              onSave={onSave}
              onCopy={onCopy}
              onPick={onPick}
              pickLabel={pickLabel}
            />
          ))}
        </div>
      )}
    </div>
  );
}
