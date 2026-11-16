import { useState } from 'react';
import { Link } from 'react-router';
import { useCart } from '../context/CartContext';
import '../styles/cart.css';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [showPromoInput, setShowPromoInput] = useState(false);

  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const discount = 0;
  const finalTotal = totalPrice - discount;

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
                            <select className="cart-item-select" defValue={defVariant}>
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
              <div
                className="cart-promo-header"
                onClick={() => setShowPromoInput(!showPromoInput)}
              >
                <span>NHẬP KHUYẾN MÃI</span>
                <span>{showPromoInput ? '▼' : '›'}</span>
              </div>
              {showPromoInput && (
                <div className="cart-promo-body">
                  <div className="cart-promo-input-group">
                    <input
                      type="text"
                      className="cart-promo-input"
                      placeholder="Nhập mã khuyến mãi"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <button
                      type="button"
                      className="cart-promo-btn"
                    >
                      Áp dụng
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="cart-summary-card">
              <h2 className="cart-summary-title">TẠM TÍNH</h2>

              <div className="cart-summary-row">
                <span>Thành tiền</span>
                <span>{totalPrice.toLocaleString('vi-VN')}đ</span>
              </div>

              <div className="cart-summary-row">
                <span>Khuyến mãi</span>
                <span>-</span>
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
                  {finalTotal.toLocaleString('vi-VN')}đ
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
