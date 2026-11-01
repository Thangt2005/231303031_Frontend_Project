import { translate } from '../utils/translations';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import '../styles/header.css';

// Danh mục giày dùng trong menu sản phẩm.
const shoeCategories = [
  'Giày sneaker',
  'Giày chạy bộ',
  'Sandal',
  'Dép',
  'Dép sục',
];

// Danh mục bài viết dùng trong menu Blog.
const blogCategories = [
  'Chọn giày',
  'Phối đồ',
  'Chăm sóc giày',
  'Bảo quản',
  'Kinh nghiệm',
  'So sánh',
];

// Tạo đường dẫn danh mục, mã hóa tên tiếng Việt trong URL.
function makeCategoryLink(path, category) {
  return path + '?category=' + encodeURIComponent(category);
}

export default function Header() {
  const language = useSelector((state) => state.language);
  const t = (text) => translate(text, language);
  const compareCount = useSelector((state) => state.compare.length);
  const [menuOpen, setMenuOpen] = useState(false);

  const [openCategory, setOpenCategory] = useState('');

  // Mỗi lần chỉ mở một menu danh mục.
  function toggleCategory(category) {
    setOpenCategory((currentCategory) => currentCategory === category ? '' : category);
  }

  // Đóng menu sau khi chọn liên kết.
  function closeMenu() {
    setMenuOpen(false);
    setOpenCategory('');
  }

  return (
    <header className="store-header">
      <div className="store-topbar">{t("GIAO HÀNG TOÀN QUỐC · HỖ TRỢ ĐỔI SIZE · TỰ TIN TRÊN TỪNG BƯỚC CHÂN")}</div>

      <div className="store-container store-header-row">
        <Link to="/" className="store-brand" onClick={closeMenu}>
          SHOE STORE
        </Link>

        <button
          className="store-menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="store-navigation"
          onClick={() => {
            setMenuOpen(!menuOpen);
            setOpenCategory('');
          }}
        >
          {menuOpen ? t('Đóng menu') : 'Menu ☰'}
        </button>

        <nav
          id="store-navigation"
          className={`store-nav ${menuOpen ? 'is-open' : ''}`}
          aria-label={t("Điều hướng chính")}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setOpenCategory('');
          }}
        >
          <div className="store-nav-item">
            <button type="button" className="store-category-button" aria-expanded={openCategory === 'products'} aria-controls="products-submenu" onClick={() => toggleCategory('products')}>{t("GIÀY")}</button>

            <ul id="products-submenu" className="store-submenu" hidden={openCategory !== 'products'}>
              <li>
                <Link to="/products" onClick={closeMenu}>{t("Tất cả giày")}</Link>
              </li>

              {shoeCategories.map((category) => (
                <li key={t(category)}>
                  <Link
                    to={makeCategoryLink('/products', category)}
                    onClick={closeMenu}
                  >
                    {t(category)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="store-nav-item">
            <button type="button" className="store-category-button" aria-expanded={openCategory === 'blog'} aria-controls="blog-submenu" onClick={() => toggleCategory('blog')}>
              BLOG
            </button>

            <ul id="blog-submenu" className="store-submenu" hidden={openCategory !== 'blog'}>
              <li>
                <Link to="/blog" onClick={closeMenu}>{t("Tất cả bài viết")}</Link>
              </li>

              {blogCategories.map((category) => (
                <li key={t(category)}>
                  <Link
                    to={makeCategoryLink('/blog', category)}
                    onClick={closeMenu}
                  >
                    {t(category)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="store-header-actions">
          <Link
            to="/compare"
            className="store-compare-link"
            onClick={closeMenu}
          >
            {t('So sánh')} ({compareCount})
          </Link>

          <Link
            to="/cart"
            className="store-icon-button"
            aria-label={t("Giỏ hàng")}
            onClick={closeMenu}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M2 3h3l3 12h11l3-9H6M8 15l-1 3h13" />
              <circle cx="9" cy="21" r="1" />
              <circle cx="18" cy="21" r="1" />
            </svg>
          </Link>

          <Link to="/login" className="store-account" onClick={closeMenu}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="7" r="4" />
              <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
            </svg>
            <span>{t("Tài khoản")}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
