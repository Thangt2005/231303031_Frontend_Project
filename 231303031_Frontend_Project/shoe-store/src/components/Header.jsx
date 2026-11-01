import { useState } from 'react';
import { Link, NavLink } from 'react-router';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="store-header">
      <div className="store-topbar">GIAO HÀNG TOÀN QUỐC · HỖ TRỢ ĐỔI SIZE · TỰ TIN TRÊN TỪNG BƯỚC CHÂN</div>
      <div className="store-container store-header-row">
        <Link to="/" className="store-brand" onClick={closeMenu}>SHOE STORE</Link>
        <button className="store-menu-button" type="button" aria-expanded={menuOpen} aria-controls="store-navigation" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? 'Đóng menu' : 'Menu ☰'}
        </button>
        <nav id="store-navigation" className={`store-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Điều hướng chính">
          <span className="store-pending" title="Chức năng đang được phát triển">HÀNG MỚI</span>
          <NavLink to="/products" onClick={closeMenu}>GIÀY</NavLink>
          <span className="store-pending" title="Chức năng đang được phát triển">THƯƠNG HIỆU</span>
          <NavLink to="/blog" onClick={closeMenu}>BLOG</NavLink>
          <span className="store-sale store-pending" title="Chức năng đang được phát triển">SALE</span>
        </nav>
        <div className="store-search">
          <span aria-hidden="true">⌕</span>
          <input type="search" placeholder="Tìm kiếm sneaker, phụ kiện..." aria-label="Tìm kiếm (chưa sẵn sàng)" title="Tìm kiếm sẽ được kết nối với phần sản phẩm" disabled />
        </div>
        <div className="store-header-actions">
          <button type="button" className="store-icon-button" disabled aria-label="Yêu thích (chưa sẵn sàng)" title="Danh sách yêu thích chưa sẵn sàng">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" /></svg>
          </button>
          <Link to="/cart" className="store-icon-button" aria-label="Giỏ hàng" onClick={closeMenu}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 3h3l3 12h11l3-9H6M8 15l-1 3h13" /><circle cx="9" cy="21" r="1" /><circle cx="18" cy="21" r="1" /></svg>
          </Link>
          <Link to="/login" className="store-account" onClick={closeMenu}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></svg>
            <span>Tài khoản</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
