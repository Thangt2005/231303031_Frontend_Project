import { Link, NavLink } from 'react-router';

export default function Header() {
  return (
    <header className="store-header">
      <div className="store-topbar">
        <div className="store-container">Shoe Store — Giày cho phong cách của bạn</div>
      </div>
      <div className="store-container store-header-row">
        <Link className="store-brand" to="/" aria-label="Shoe Store - Trang chủ">
          SHOE <span>STORE</span>
          <small>GIÀY CHÍNH HÃNG!</small>
        </Link>
        <div className="store-header-search" role="search">
          <svg className="store-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m16 16 4.5 4.5" />
          </svg>
          <input
            type="search"
            placeholder="Tìm kiếm giày..."
            aria-label="Tìm kiếm giày"
            title="Ô tìm kiếm giao diện, sẽ kết nối dữ liệu sản phẩm sau."
          />
        </div>
        <div className="store-header-links">
          <Link to="/login">
            <svg className="store-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="12" cy="7" r="4" />
              <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
            </svg>
            <span>Tài Khoản</span>
          </Link>
          <Link className="store-cart-link" to="/cart">
            <svg className="store-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M2 3h3l3 12h11l3-9H6M8 15l-1 3h13" />
              <circle cx="9" cy="21" r="1" />
              <circle cx="18" cy="21" r="1" />
            </svg>
            <span>Giỏ hàng</span>
          </Link>
        </div>
      </div>
      <div className="store-nav-bar">
        <nav className="store-container store-nav" aria-label="Điều hướng chính">
          <NavLink to="/" end>Trang chủ</NavLink>
          <NavLink to="/products">Sản phẩm</NavLink>
          <NavLink to="/blog">Blog</NavLink>
        </nav>
      </div>
    </header>
  );
}

