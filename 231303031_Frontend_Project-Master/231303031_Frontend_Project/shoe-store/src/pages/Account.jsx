import { translate } from '../utils/translations';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import '../styles/account.css';

// Nhận thông tin người dùng từ phần đăng nhập của A.
// Chỉ thêm trang vào Router khi đã có ProtectedRoute của A.
export default function Account({ user }) {
  const language = useSelector((state) => state.language);
  const t = (text) => translate(text, language);
  if (!user) {
    return (
      <section>
        <h1>{t("Tài khoản")}</h1>
        <p>{t("Bạn cần đăng nhập để xem thông tin tài khoản.")}</p>
        <Link to="/login">{t("Đến trang đăng nhập")}</Link>
      </section>
    );
  }

  return (
    <section className="account-page">
      <p className="account-eyebrow">SHOE STORE / TÀI KHOẢN</p>
      <h1>{t("Thông tin tài khoản")}</h1>
      <dl className="account-info">
        <div>
          <dt>{t("Họ và tên")}</dt>
          <dd>{user.name || 'Chưa cập nhật'}</dd>
        </div>
        <div>
          <dt>{t("Email")}</dt>
          <dd>{user.email || 'Chưa cập nhật'}</dd>
        </div>
      </dl>
      <Link to="/">{t("← Quay lại trang chủ")}</Link>
    </section>
  );
}
