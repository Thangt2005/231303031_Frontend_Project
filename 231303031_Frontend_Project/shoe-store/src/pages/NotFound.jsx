import { Link } from 'react-router';

export default function NotFound() {
  return (
    <section className="not-found">
      <p className="not-found-code">404</p>
      <h1>Không tìm thấy trang</h1>
      <p>Đường dẫn bạn truy cập không tồn tại. Hãy trở về trang chủ để tiếp tục khám phá.</p>
      <Link to="/">← Quay lại trang chủ</Link>
    </section>
  );
}
