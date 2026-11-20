import { Link } from 'react-router';
import '../styles/not-found.css';

export default function NotFound() {
  return (
    <section className="not-found">
      <p className="not-found-code">404</p>

      <h1>Không tìm thấy trang</h1>

      <p className="not-found-message">
        Đường dẫn không đúng hoặc trang bạn tìm không còn tồn tại.
      </p>

      <Link to="/" className="not-found-button">
        Về trang chủ
      </Link>
    </section>
  );
}