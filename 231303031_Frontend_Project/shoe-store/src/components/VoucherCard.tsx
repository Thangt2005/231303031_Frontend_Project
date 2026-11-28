import { fmtOff, isActive, isExpired } from '../services/voucherService';
import type { Voucher } from '../types/voucher';

interface Props {
  v: Voucher;
  saved?: boolean;
  copied?: boolean;
  onSave?: (id: string) => void;
  onCopy?: (code: string) => void;
  onPick?: (v: Voucher) => void;
  pickLabel?: string;
}

export default function VoucherCard({
  v,
  saved = false,
  copied = false,
  onSave,
  onCopy,
  onPick,
  pickLabel = 'Dùng mã',
}: Props) {
  const active = isActive(v);
  const expired = isExpired(v);
  const status = expired ? 'Hết hạn' : v.left <= 0 ? 'Hết lượt' : `Còn ${v.left} lượt`;

  return (
    <div className={`vc-card ${active ? '' : 'vc-off'}`}>
      <div className="vc-left">
        <span className="vc-val">{fmtOff(v)}</span>
        <span className="vc-code">{v.code}</span>
      </div>

      <div className="vc-body">
        <div className="vc-top">
          <h3 className="vc-title">{v.title}</h3>
          <span className={`vc-status ${active ? 'active' : ''}`}>{status}</span>
        </div>

        <p className="vc-desc">{v.desc}</p>

        <div className="vc-meta">
          <span>
            Đơn tối thiểu:{' '}
            {v.minOrder > 0 ? `${v.minOrder.toLocaleString('vi-VN')}đ` : '0đ'}
          </span>
          <span>HSD: {v.exp}</span>
        </div>

        <div className="vc-actions">
          {onCopy && (
            <button
              type="button"
              className="vc-btn vc-btn-dark"
              disabled={!active}
              onClick={() => onCopy(v.code)}
            >
              {copied ? 'Đã chép' : 'Sao chép'}
            </button>
          )}

          {onSave && (
            <button
              type="button"
              className={`vc-btn ${saved ? 'vc-btn-saved' : ''}`}
              disabled={!active && !saved}
              onClick={() => onSave(v.id)}
            >
              {saved ? 'Đã lưu' : 'Lưu mã'}
            </button>
          )}

          {onPick && (
            <button
              type="button"
              className="vc-btn vc-btn-dark"
              disabled={!active}
              onClick={() => onPick(v)}
            >
              {pickLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
