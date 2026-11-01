import { Link } from 'react-router';

// Khi A bàn giao AuthContext, lấy user từ Context và truyền vào component này.
// Chỉ gắn Account vào Router bên trong ProtectedRoute của A.
export default function Account({ user }) {
  if (!user) {
    return <section><h1>Tài khoản</h1><p>Bạn cần đăng nhập để xem thông tin tài khoản.</p><Link to="/login">Đến trang đăng nhập</Link></section>;
  }

  return (
    <section className="account-page">
      <p className="account-eyebrow">SHOE STORE / TÀI KHOẢN</p>
      <h1>Thông tin tài khoản</h1>
      <dl className="account-info">
        <div><dt>Họ và tên</dt><dd>{user.name || 'Chưa cập nhật'}</dd></div>
        <div><dt>Email</dt><dd>{user.email || 'Chưa cập nhật'}</dd></div>
      </dl>
      <Link to="/">← Quay lại trang chủ</Link>
    </section>
  );
}
