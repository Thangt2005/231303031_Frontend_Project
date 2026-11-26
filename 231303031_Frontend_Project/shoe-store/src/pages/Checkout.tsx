import { Link, useLocation } from 'react-router';
import { useCart } from '../context/CartContext';
import '../styles/cart.css';

interface Bill {
  count: number;
  total: number;
  code: string;
  off: number;
  final: number;
}

export default function Checkout() {
  const { cart, totalItems, totalPrice, voucher, off, finalPrice, clearCart } = useCart();
  const { state } = useLocation();
  const paid = state as Bill | null;

  const bill: Bill | null = paid || (cart.length > 0
    ? {
        count: totalItems,
        total: totalPrice,
        code: voucher?.code || '',
        off,
        final: finalPrice,
      }
    : null);

  return (
    <div className="cart-page">
      <div className="cart-header-row">
        <h1 className="cart-title">THANH TOÁN</h1>
        <Link to="/cart" className="cart-promo-pick-btn">
          Quay lại giỏ hàng
        </Link>
      </div>

      {!bill ? (
        <div className="cart-empty">
          <p className="cart-empty-text">Giỏ hàng của bạn đang trống.</p>
          <Link to="/products" className="cart-continue-btn">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="cart-summary-card" style={{ maxWidth: '480px', margin: '0 auto' }}>
          <h2 className="cart-summary-title">
            {paid ? 'ĐÃ THANH TOÁN THÀNH CÔNG' : 'TÓM TẮT ĐƠN HÀNG'}
          </h2>

          <div className="cart-summary-row">
            <span>Số sản phẩm</span>
            <span>{bill.count}</span>
          </div>

          <div className="cart-summary-row">
            <span>Tạm tính</span>
            <span>{bill.total.toLocaleString('vi-VN')}đ</span>
          </div>

          <div className="cart-summary-row">
            <span>Mã giảm giá {bill.code ? `(${bill.code})` : ''}</span>
            <span>{bill.off > 0 ? `-${bill.off.toLocaleString('vi-VN')}đ` : '-'}</span>
          </div>

          <div className="cart-summary-divider" />

          <div className="cart-summary-total-row">
            <div>
              <span className="cart-summary-total-label">Tổng thanh toán</span>
              <small className="cart-summary-total-sub">(Đã bao gồm VAT)</small>
            </div>
            <span className="cart-summary-total-val">
              {bill.final.toLocaleString('vi-VN')}đ
            </span>
          </div>

          {paid ? (
            <Link to="/products" className="cart-checkout-btn">
              TIẾP TỤC MUA SẮM
            </Link>
          ) : (
            <button
              type="button"
              className="cart-checkout-btn"
              style={{ border: 'none', cursor: 'pointer' }}
              onClick={clearCart}
            >
              XÁC NHẬN THANH TOÁN
            </button>
          )}
        </div>
      )}
    </div>
  );
}
