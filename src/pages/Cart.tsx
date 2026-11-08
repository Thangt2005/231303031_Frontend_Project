import { useState } from 'react';
import { Link } from 'react-router';
import { useCart } from '../context/CartContext';
import '../styles/cart.css';

function formatPrice(value: number) {
  return Number(value).toLocaleString('vi-VN') + ' đ';
}

export default function Cart() {
  const {
    items,
    totalQuantity,
    totalPrice,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const [notice, setNotice] = useState('');

  if (items.length === 0) {
    return (
      <div className="cart-page cart-page--empty">
        <h1 className="cart-page__title">Giỏ hàng</h1>
        <p className="cart-page__empty-text">Giỏ hàng của bạn đang trống.</p>
        <Link to="/products" className="cart-page__btn cart-page__btn--primary">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  const handleCheckout = () => {
    setNotice('chưa có chức năng thanh toán');
  };

  return (
    <div className="cart-page">
      <nav className="cart-page__breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Trang chủ</Link>
        <span aria-hidden="true">/</span>
        <span className="cart-page__breadcrumb-current" aria-current="page">
          Giỏ hàng
        </span>
      </nav>

      <div className="cart-page__heading">
        <h1 className="cart-page__title">Giỏ hàng</h1>
        <span className="cart-page__count">{totalQuantity} sản phẩm</span>
      </div>

      <div className="cart-page__layout">
        <div className="cart-page__items">
          {items.map((item) => (
            <div className="cart-page__item" key={`${item.product.id}-${item.size}`}>
              <Link to={`/products/${item.product.id}`} className="cart-page__media">
                <img src={item.product.image} alt={item.product.name} />
              </Link>

              <div className="cart-page__info">
                <p className="cart-page__brand">{item.product.brand}</p>
                <Link to={`/products/${item.product.id}`} className="cart-page__name">
                  {item.product.name}
                </Link>
                <p className="cart-page__meta">
                  Size {item.size} · {item.product.category}
                </p>

                <div className="cart-page__quantity">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                    aria-label="Giảm số lượng"
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                    aria-label="Tăng số lượng"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="cart-page__side">
                <strong className="cart-page__price">
                  {formatPrice(item.product.price * item.quantity)}
                </strong>
                <button
                  type="button"
                  className="cart-page__remove"
                  onClick={() => removeFromCart(item.product.id, item.size)}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="cart-page__summary">
          <h2 className="cart-page__summary-title">Tóm tắt đơn hàng</h2>

          <div className="cart-page__summary-row">
            <span>Tạm tính</span>
            <strong>{formatPrice(totalPrice)}</strong>
          </div>

          <div className="cart-page__summary-row">
            <span>Phí vận chuyển</span>
            <span>Miễn phí</span>
          </div>

          <div className="cart-page__summary-row cart-page__summary-row--total">
            <span>Tổng cộng</span>
            <strong>{formatPrice(totalPrice)}</strong>
          </div>

          <button
            type="button"
            className="cart-page__btn cart-page__btn--primary"
            onClick={handleCheckout}
          >
            Thanh toán
          </button>

          <button
            type="button"
            className="cart-page__btn cart-page__btn--secondary"
            onClick={clearCart}
          >
            Xóa giỏ hàng
          </button>

          {notice && (
            <p className="cart-page__notice" role="status">
              {notice}
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
