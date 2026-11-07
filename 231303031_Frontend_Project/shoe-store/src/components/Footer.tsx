import { Link } from 'react-router';
import '../styles/footer.css';

type FooterLink = {
  name: string;
  path: string;
};

const exploreLinks: FooterLink[] = [
  { name: 'Trang chủ', path: '/' },
  { name: 'Sản phẩm', path: '/products' },
  { name: 'Blog về giày', path: '/blog' },
];

const accountLinks: FooterLink[] = [
  { name: 'Đăng nhập', path: '/login' },
  { name: 'Giỏ hàng', path: '/cart' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            SHOE STORE
          </Link>
          <p>Giày cho phong cách của bạn.</p>
          <p>GIÀY CHÍNH HÃNG!</p>
          <p>
            Hotline: <a href="tel:88888888">8888 8888</a>
          </p>
        </div>

        <div className="footer-column">
          <h3 className="footer-title">Khám phá</h3>
          <ul className="footer-list">
            {exploreLinks.map((item) => (
              <li key={item.path}>
                <Link to={item.path}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer-title">Tài khoản</h3>
          <ul className="footer-list">
            {accountLinks.map((item) => (
              <li key={item.path}>
                <Link to={item.path}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {year} Shoe Store.</p>
      </div>
    </footer>
  );
}