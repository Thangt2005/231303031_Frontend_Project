import { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { fmtPay, getOrders } from '../services/orderService';
import '../styles/checkout.css';

const TABS = ['Tất cả', 'Đang xử lý', 'Đang giao hàng', 'Đã giao', 'Đã hủy'];

export default function Orders() {
  const { user } = useAuth();
  const [tab, setTab] = useState('Tất cả');
  const all = getOrders(user?.id);
  const list = tab === 'Tất cả' ? all : all.filter((o) => o.status === tab);

  return (
    <div className="co-page">
      <div className="co-top">
        <h1>ĐƠN HÀNG CỦA TÔI</h1>
        <Link to="/products" className="co-back">
          Tiếp tục mua sắm
        </Link>
      </div>

      <div className="ord-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            className={`ord-tab ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="co-box co-done">
          <h2>Chưa có đơn hàng nào</h2>
          <Link to="/products" className="co-btn">
            MUA SẮM NGAY
          </Link>
        </div>
      ) : (
        <div className="ord-list">
          {list.map((o) => (
            <div key={o.id} className="co-box">
              <div className="ord-head">
                <div>
                  <strong>{o.id}</strong> — {o.createdAt}
                </div>
                <span className="ord-status">{o.status}</span>
              </div>

              <div className="co-items">
                {o.items.map((item) => (
                  <div key={item.id} className="co-item">
                    <span>
                      {item.name}
                      {item.size || item.color
                        ? ` (${item.size || '-'} / ${item.color || '-'})`
                        : ''}{' '}
                      × {item.qty}
                    </span>
                    <span>{(item.price * item.qty).toLocaleString('vi-VN')}đ</span>
                  </div>
                ))}
              </div>

              <div className="co-row">
                <span>Người nhận</span>
                <span>{o.name} ({o.sdt}) - {o.address}</span>
              </div>

              <div className="co-row">
                <span>Thanh toán</span>
                <span>{fmtPay(o.pay)}</span>
              </div>

              {o.off > 0 && (
                <div className="co-row">
                  <span>Giảm giá ({o.code})</span>
                  <span>-{o.off.toLocaleString('vi-VN')}đ</span>
                </div>
              )}

              <div className="co-total" style={{ marginBottom: 0 }}>
                <span>Tổng tiền</span>
                <span>{o.final.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
