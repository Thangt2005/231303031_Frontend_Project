import { Link } from 'react-router';

export default function Footer() {
  return (
    <footer className="store-footer">
      <div className="store-container store-footer-columns">
        <div>
          <h2 className="store-footer-brand">SHOE <span>STORE</span></h2>
          <p>Giày cho phong cách của bạn.</p>
          <p>GIÀY CHÍNH HÃNG!</p>
        </div>
        <div>
          <h2>Khám phá</h2>
          <Link to="/">Trang chủ</Link>
          <Link to="/products">Sản phẩm</Link>
          <Link to="/blog">Blog về giày</Link>
        </div>
        <div>
          <h2>Tài khoản</h2>
          <Link to="/login">Đăng nhập</Link>
          <Link to="/cart">Giỏ hàng</Link>
        </div>
      </div>
      <div className="store-footer-bottom">
        <div className="store-container">© {new Date().getFullYear()} Shoe Store.</div>
      </div>
    </footer>
  );
}
