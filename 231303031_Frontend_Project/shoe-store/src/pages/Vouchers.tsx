import VoucherList from '../components/VoucherList';
import { useVouchers } from '../hooks/useVouchers';
import '../styles/voucher.css';

export default function Vouchers() {
  const { list, saved, copied, toggle, copy } = useVouchers();

  return (
    <div className="vc-page">
      <div className="vc-header">
        <h1>MÃ GIẢM GIÁ</h1>
      </div>

      <VoucherList
        list={list}
        saved={saved}
        copied={copied}
        onSave={toggle}
        onCopy={copy}
      />
    </div>
  );
}
