import { useState, FormEvent } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { addOrder, fmtPay, itemColor, itemSize } from '../services/orderService';
import type { Order, PayMethod } from '../types/order';
import '../styles/checkout.css';

export default function Checkout() {
  const { user } = useAuth();
  const { cart, totalPrice, voucher, off, finalPrice, clearCart } = useCart();

  const [name, setName] = useState(user?.name || '');
  const [sdt, setSdt] = useState(user?.sdt || '');
  const [address, setAddress] = useState(user?.address || '');
  const [note, setNote] = useState('');
  const [pay, setPay] = useState<PayMethod>('cod');
  const [err, setErr] = useState('');
  const [done, setDone] = useState<Order | null>(null);

  if (!user) return null;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setErr('Giỏ hàng đang trống.');
      return;
    }
    if (!name.trim() || !sdt.trim() || !address.trim()) {
      setErr('Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ.');
      return;
    }
    if (!/^[0-9]{9,11}$/.test(sdt.trim())) {
      setErr('Số điện thoại không hợp lệ.');
      return;
    }

    const order = addOrder({
      uid: user.id,
      name: name.trim(),
      sdt: sdt.trim(),
      address: address.trim(),
      note: note.trim(),
      pay,
      items: cart.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        qty: i.quantity,
        size: itemSize(i),
        color: itemColor(i),
        image: i.image,
      })),
      total: totalPrice,
      code: voucher?.code || '',
      off,
      final: finalPrice,
    });

    clearCart();
    setErr('');
    setDone(order);
  };

  if (done) {
    return (
      <div className="co-page">
        <div className="co-box co-done">
          <h2>ĐẶT HÀNG THÀNH CÔNG</h2>
          <p className="co-done-id">
            Mã đơn: <strong>{done.id}</strong> — {done.status}
          </p>
          <div className="co-items">
            {done.items.map((item) => (
              <div key={item.id} className="co-item">
                <span>
                  {item.name} ({item.size} / {item.color}) × {item.qty}
                </span>
                <span>{(item.price * item.qty).toLocaleString('vi-VN')}đ</span>
              </div>
            ))}
          </div>
          <div className="co-row">
            <span>Người nhận</span>
            <span>{done.name} ({done.sdt})</span>
          </div>
          <div className="co-row">
            <span>Địa chỉ</span>
            <span>{done.address}</span>
          </div>
          <div className="co-row">
            <span>Thanh toán</span>
            <span>{fmtPay(done.pay)}</span>
          </div>
          <div className="co-row">
            <span>Giảm giá {done.code ? `(${done.code})` : ''}</span>
            <span>{done.off > 0 ? `-${done.off.toLocaleString('vi-VN')}đ` : '-'}</span>
          </div>
          <div className="co-total">
            <span>Tổng thanh toán</span>
            <span>{done.final.toLocaleString('vi-VN')}đ</span>
          </div>
          <Link to="/orders" className="co-btn">
            XEM ĐƠN HÀNG
          </Link>
          <Link to="/products" className="co-btn co-btn-sub">
            TIẾP TỤC MUA SẮM
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="co-page">
      <div className="co-top">
        <h1>THANH TOÁN</h1>
        <Link to="/cart" className="co-back">
          Quay lại giỏ hàng
        </Link>
      </div>

      {cart.length === 0 ? (
        <div className="co-box co-done">
          <h2>Giỏ hàng đang trống</h2>
          <p>Vui lòng chọn sản phẩm trước khi thanh toán.</p>
          <Link to="/products" className="co-btn">
            XEM SẢN PHẨM
          </Link>
        </div>
      ) : (
        <form className="co-grid" onSubmit={onSubmit}>
          <div className="co-box">
            <h2>THÔNG TIN GIAO HÀNG</h2>
            <div className="co-form">
              {err && <div className="co-err">{err}</div>}

              <div className="co-field">
                <label htmlFor="co-name">Họ tên</label>
                <input
                  id="co-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập họ tên người nhận"
                />
              </div>

              <div className="co-field">
                <label htmlFor="co-sdt">Số điện thoại</label>
                <input
                  id="co-sdt"
                  type="text"
                  value={sdt}
                  onChange={(e) => setSdt(e.target.value)}
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div className="co-field">
                <label htmlFor="co-addr">Địa chỉ nhận hàng</label>
                <input
                  id="co-addr"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                />
              </div>

              <div className="co-field">
                <label htmlFor="co-note">Ghi chú</label>
                <textarea
                  id="co-note"
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ghi chú giao hàng (nếu có)"
                />
              </div>

              <div className="co-field">
                <label>Phương thức thanh toán</label>
                <div className="co-pay-list">
                  <label className={`co-pay-item ${pay === 'cod' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="pay"
                      checked={pay === 'cod'}
                      onChange={() => setPay('cod')}
                    />
                    Thanh toán khi nhận (COD)
                  </label>
                  <label className={`co-pay-item ${pay === 'bank' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="pay"
                      checked={pay === 'bank'}
                      onChange={() => setPay('bank')}
                    />
                    Chuyển khoản
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="co-box">
            <h2>ĐƠN HÀNG CỦA BẠN</h2>
            <div className="co-items">
              {cart.map((item) => (
                <div key={item.id} className="co-item">
                  <span>
                    {item.name} ({itemSize(item)} / {itemColor(item)}) × {item.quantity}
                  </span>
                  <span>{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                </div>
              ))}
            </div>

            <div className="co-row">
              <span>Tạm tính</span>
              <span>{totalPrice.toLocaleString('vi-VN')}đ</span>
            </div>

            <div className="co-row">
              <span>Khuyến mãi {voucher ? `(${voucher.code})` : ''}</span>
              <span>{off > 0 ? `-${off.toLocaleString('vi-VN')}đ` : '-'}</span>
            </div>

            <div className="co-row">
              <span>Phí vận chuyển</span>
              <span>Miễn phí</span>
            </div>

            <div className="co-total">
              <span>Tổng thanh toán</span>
              <span>{finalPrice.toLocaleString('vi-VN')}đ</span>
            </div>

            <button type="submit" className="co-btn">
              ĐẶT HÀNG
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
