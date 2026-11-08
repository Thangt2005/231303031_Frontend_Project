import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import LoginDropdown from './LoginDropdown';
import '../styles/header.css';

type MenuItem = {
  title: string;
  path: string;
  children?: { name: string; path: string }[];
};

const menuList: MenuItem[] = [
  { title: 'Trang chủ', path: '/' },
  {
    title: 'Giày',
    path: '/products',
    children: [
      { name: 'Giày sneaker', path: '/products?category=Giày sneaker' },
      { name: 'Giày chạy bộ', path: '/products?category=Giày chạy bộ' },
    ],
  },
  {
    title: 'Dép & Sandal',
    path: '/products',
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
];

export default function Header({ cartCount = 0 }: { cartCount?: number }) {
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

  const closeAllMenu = () => {
    setOpenMenu('');
    setShowMobileMenu(false);
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (keyword.trim() === '') {
      return;
    }

    navigate(`/products?search=${keyword}`);
    setKeyword('');
    setShowSearch(false);
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-hotline">
          HOTLINE: <a href="tel:88888888">8888 8888</a>
        </div>

        <Link
          to="/"
          className="header-logo"
          onClick={closeAllMenu}
        >
          <span className="logo-name">SHOE STORE</span>
          <span className="logo-slogan">GIÀY CHÍNH HÃNG</span>
        </Link>

        <div className="header-actions">
          <div className="hide-mobile">
            <LoginDropdown />
          </div>

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

              <span className="cart-count">{cartCount}</span>
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

          <button
            type="button"
            className="icon-button menu-button"
            aria-label="Mở menu"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {showSearch && (
        <form
          className="header-search"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            placeholder="Tìm kiếm ..."
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <button type="submit">TÌM</button>
        </form>
      )}

      <nav className={showMobileMenu ? 'header-nav show' : 'header-nav'}>
        <ul className="nav-list">
          {menuList.map((menu) => (
            <li
              key={menu.title}
              className="nav-item"
              onMouseEnter={() => setOpenMenu(menu.title)}
              onMouseLeave={() => setOpenMenu('')}
            >
              <Link
                to={menu.path}
                className="nav-link"
                onClick={closeAllMenu}
              >
                {menu.title}
              </Link>

              {menu.children && (
                <button
                  type="button"
                  className="arrow-button"
                  aria-label={`Mở menu ${menu.title}`}
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
                      <Link
                        to={child.path}
                        className="sub-link"
                        onClick={closeAllMenu}
                      >
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}

          <li className="nav-item show-mobile">
            <Link
              to="/login"
              className="nav-link"
              onClick={closeAllMenu}
            >
              Tài khoản
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
