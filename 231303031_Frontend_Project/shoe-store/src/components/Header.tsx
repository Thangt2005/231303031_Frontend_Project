import { useState } from 'react';
import type { FormEvent } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import type { RootState } from '../store/store';
import LoginDropdown from './auth/LoginDropdown';
import '../styles/header.css';
import '../styles/wishlist.css';

type HeaderProps = {
  cartCount?: number;
};

type SubMenu = {
  name: string;
  path: string;
};

type Menu = {
  title: string;
  path: string;
  children?: SubMenu[];
};

const menuList: Menu[] = [
  { title: 'Trang chủ', path: '/' },
  {
    title: 'Giày',
    path: '/products?category=Giày sneaker&category=Giày chạy bộ',
    children: [
      { name: 'Giày sneaker', path: '/products?category=Giày sneaker' },
      { name: 'Giày chạy bộ', path: '/products?category=Giày chạy bộ' },
    ],
  },
  {
    title: 'Dép & Sandal',
    path: '/products?category=Dép&category=Sandal&category=Dép sục',
    children: [
      { name: 'Dép', path: '/products?category=Dép' },
      { name: 'Sandal', path: '/products?category=Sandal' },
      { name: 'Dép sục', path: '/products?category=Dép sục' },
    ],
  },
  {
    title: 'Thương hiệu',
    path: '/products',
    children: [
      { name: 'Nike', path: '/products?brand=Nike' },
      { name: 'Adidas', path: '/products?brand=Adidas' },
      { name: 'Converse', path: '/products?brand=Converse' },
      { name: 'Vans', path: '/products?brand=Vans' },
      { name: "Biti's", path: "/products?brand=Biti's" },
    ],
  },
  { title: 'Blog', path: '/blog' },
  { title: 'Mã giảm giá', path: '/vouchers' },
];

export default function Header({ cartCount = 0 }: HeaderProps) {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const wishlistCount = useSelector((state: RootState) => state.wishlist.items.length);
  const [openMenu, setOpenMenu] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navigate = useNavigate();

  const toggleSubMenu = (title: string) => {
    if (openMenu === title) {
      setOpenMenu('');
    } else {
      setOpenMenu(title);
    }
  };

  // Đóng menu sau khi bấm vào một link
  const closeAllMenu = () => {
    setOpenMenu('');
    setShowMobileMenu(false);
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const text = keyword.trim();

    if (text === '') {
      return;
    }

    // Mã hoá từ khoá để ký tự như & hoặc # không làm hỏng đường dẫn
    navigate('/products?search=' + encodeURIComponent(text));
    setKeyword('');
    setShowSearch(false);
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-hotline">
          HOTLINE: <a href="tel:(028) 3896 6780 ">028 3896 6780 </a>
        </div>

        <Link to="/" className="header-logo" onClick={closeAllMenu}>
          <span className="logo-name">SHOE STORE</span>
          <span className="logo-slogan">👟GIÀY CHÍNH HÃNG 👟</span>
        </Link>

        <div className="header-actions">
          <div className="hide-mobile">
            <LoginDropdown />
          </div>

          <Link
            to="/wishlist"
            className="action-link wishlist-link"
            aria-label="Danh sách yêu thích"
            title="Danh sách yêu thích"
          >
            <span className="wishlist-icon">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>

              <span className="wishlist-count">{wishlistCount}</span>
            </span>
          </Link>

          <Link to="/cart" className="action-link">
            <span className="hide-mobile">GIỎ HÀNG</span>

            <span className="cart-icon">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M2 3h3l3 12h11l3-9H6" />
                <circle cx="9" cy="20" r="1.5" />
                <circle cx="18" cy="20" r="1.5" />
              </svg>

              <span className="cart-count">{totalItems || cartCount}</span>
            </span>
          </Link>

          <button
            type="button"
            className="icon-button"
            aria-label="Tìm kiếm"
            onClick={() => setShowSearch(!showSearch)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="M16 16l5 5" />
            </svg>
          </button>

          {/* Nút ☰ chỉ hiện trên điện thoại (xem header.css) */}
          <button
            type="button"
            className="icon-button menu-button"
            aria-label="Menu"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {showSearch && (
        <form className="header-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Tìm kiếm ..."
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />

          <button type="submit">TÌM</button>
        </form>
      )}

      {/* Trên điện thoại, menu chỉ hiện khi có class show */}
      <nav className={showMobileMenu ? 'header-nav show' : 'header-nav'}>
        <ul className="nav-list">
          {menuList.map((menu) => (
            <li key={menu.title} className="nav-item">
              <Link to={menu.path} className="nav-link" onClick={closeAllMenu}>
                {menu.title}
              </Link>

              {menu.children && (
                <button
                  type="button"
                  className="arrow-button"
                  aria-label="Mở menu con"
                  onClick={() => toggleSubMenu(menu.title)}
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
              )}

              {menu.children && openMenu === menu.title && (
                <ul className="sub-menu">
                  {menu.children.map((child) => (
                    <li key={child.name}>
                      <Link to={child.path} className="sub-link" onClick={closeAllMenu}>
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          {/* Đã đăng nhập thì có thêm link tới trang tài khoản */}
          {user && (
            <li className="nav-item show-mobile">
              <Link to="/account" className="nav-link" onClick={closeAllMenu}>
                Tài khoản của tôi
              </Link>
            </li>
          )}
          {/* Tài khoản nằm trong menu khi ở điện thoại */}
          <li className="nav-item show-mobile">
            {user ? (
              <button
                type="button"
                className="nav-link"
                style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', width: '100%' }}
                onClick={() => {
                  logout();
                  closeAllMenu();
                  navigate('/', { replace: true, state: {} });
                }}
              >
                Đăng xuất ({user.username})
              </button>
            ) : (
              <Link
                to="/login"
                className="nav-link"
                onClick={closeAllMenu}
              >
                Tài khoản
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
