import { useState } from 'react';
import { Link } from 'react-router';
import VoucherList from '../components/VoucherList';
import { useCart } from '../context/CartContext';
import { useVouchers } from '../hooks/useVouchers';
import '../styles/cart.css';
import '../styles/voucher.css';

export default function Cart() {
  const {
    cart,
    totalPrice,
    voucher,
    off,
    finalPrice,
    updateQuantity,
    removeFromCart,
    applyVoucher,
    dropVoucher,
  } = useCart();
  const { list, saved } = useVouchers();
  const [code, setCode] = useState('');
  const [pickOpen, setPickOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState(false);

  const onApply = (val = code) => {
    const res = applyVoucher(val);
    setMsg(res.msg);
    setOk(res.ok);
    if (res.ok) {
      setCode(res.voucher?.code || val);
      setPickOpen(false);
    }
  };

  const onDrop = () => {
    dropVoucher();
    setCode('');
    setMsg('');
    setOk(false);
  };

  return (
    <div className="cart-page">
      <div className="cart-header-row">
        <h1 className="cart-title">GIỎ HÀNG</h1>
        {cart.length > 0 && (
          <div className="cart-header-subtotal">
            Thành tiền : <strong>{totalPrice.toLocaleString('vi-VN')}đ</strong>
          </div>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="cart-empty">
          <svg
            className="cart-empty-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M2 3h3l3 12h11l3-9H6" />
            <circle cx="9" cy="20" r="1.5" />
            <circle cx="18" cy="20" r="1.5" />
          </svg>
          <p className="cart-empty-text">Giỏ hàng của bạn đang trống.</p>
          <Link to="/products" className="cart-continue-btn">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-table-wrapper">
            <table className="cart-table">
              <thead>
                <tr>
                  <th style={{ width: '45%' }}>Mô tả sản phẩm</th>
                  <th className="text-center" style={{ width: '20%' }}>Số lượng</th>
                  <th className="text-center" style={{ width: '25%' }}>Thành tiền</th>
                  <th className="text-center" style={{ width: '10%' }}>Xoá</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => {
                  const itemTotal = item.price * item.quantity;
                  const itemSizes = Array.isArray(item.sizes) && item.sizes.length > 0
                    ? item.sizes
                    : [38, 39, 40, 41, 42, 43, 44, 45];
                  const itemColor = (Array.isArray(item.colors) && item.colors[0]) || 'Đen';
                  const defVariant = `${itemSizes[0]} / ${itemColor}`;

                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="cart-item-desc">
                          <img
                            src={item.image || 'https://via.placeholder.com/90'}
                            alt={item.name}
                            className="cart-item-img"
                          />
                          <div className="cart-item-info">
                            <Link to={`/products/${item.id}`} className="cart-item-name">
                              {item.name}
                            </Link>
                            <select className="cart-item-select" defaultValue={defVariant}>
                              {itemSizes.map((size: number | string) => (
                                <option key={size} value={`${size} / ${itemColor}`}>
                                  {size} / {itemColor}
                                </option>
                              ))}
                            </select>
                            <span className="cart-item-price-unit">
                              {item.price.toLocaleString('vi-VN')}đ
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="text-center">
                        <div className="cart-quantity-control">
                          <button
                            type="button"
                            className="cart-qty-btn"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span className="cart-qty-val">{item.quantity}</span>
                          <button
                            type="button"
                            className="cart-qty-btn"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td className="cart-item-total text-center">
                        {itemTotal.toLocaleString('vi-VN')}đ
                      </td>

                      <td className="text-center">
                        <button
                          type="button"
                          className="cart-remove-btn"
                          aria-label="Xoá sản phẩm"
                          onClick={() => removeFromCart(item.id)}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <aside className="cart-sidebar">
            <div className="cart-promo-box">
              <div className="cart-promo-header">
                <span>NHẬP KHUYẾN MÃI</span>
              </div>
              <div className="cart-promo-body">
                  <div className="cart-promo-input-group">
                    <input
                      type="text"
                      className="cart-promo-input"
                      placeholder="Nhập mã khuyến mãi"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                    <button
                      type="button"
                      className="cart-promo-btn"
                      onClick={() => onApply()}
                    >
                      Áp dụng
                    </button>
                  </div>

                  {msg && (
                    <p className={`cart-promo-msg ${ok ? 'ok' : ''}`}>{msg}</p>
                  )}

                  {voucher && (
                    <div className="cart-promo-tag">
                      <span>
                        Đang áp: <strong>{voucher.code}</strong> (-{off.toLocaleString('vi-VN')}đ)
                      </span>
                      <button
                        type="button"
                        className="cart-promo-drop"
                        onClick={onDrop}
                      >
                        Gỡ
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    className="cart-promo-pick-btn"
                    onClick={() => setPickOpen(!pickOpen)}
                  >
                    {pickOpen ? 'Ẩn danh sách mã' : 'Chọn mã có sẵn'}
                  </button>

                  {pickOpen && (
                    <div className="cart-promo-list">
                      <VoucherList
                        list={list}
                        saved={saved}
                        onPick={(v) => onApply(v.code)}
                        showFilter={false}
                        compact
                      />
                    </div>
                  )}
              </div>
            </div>

            <div className="cart-summary-card">
              <h2 className="cart-summary-title">TẠM TÍNH</h2>

              <div className="cart-summary-row">
                <span>Thành tiền</span>
                <span>{totalPrice.toLocaleString('vi-VN')}đ</span>
              </div>

              <div className="cart-summary-row">
                <span>Khuyến mãi</span>
                <span>{off > 0 ? `-${off.toLocaleString('vi-VN')}đ` : '-'}</span>
              </div>

              <div className="cart-summary-row">
                <span>Vận chuyển</span>
                <span>-</span>
              </div>

              <div className="cart-summary-divider" />

              <div className="cart-summary-total-row">
                <div>
                  <span className="cart-summary-total-label">Tổng</span>
                  <small className="cart-summary-total-sub">(Đã bao gồm VAT)</small>
                </div>
                <span className="cart-summary-total-val">
                  {finalPrice.toLocaleString('vi-VN')}đ
                </span>
              </div>

              <Link to="/checkout" className="cart-checkout-btn">
                THANH TOÁN
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
