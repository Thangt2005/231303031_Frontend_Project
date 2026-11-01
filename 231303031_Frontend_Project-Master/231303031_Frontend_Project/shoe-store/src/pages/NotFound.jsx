import { translate } from '../utils/translations';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import '../styles/not-found.css';

export default function NotFound() {
  const language = useSelector((state) => state.language);
  const t = (text) => translate(text, language);
  return (
    <section className="not-found">
      <p className="not-found-code">404</p>
      <h1>{t("Không tìm thấy trang")}</h1>
      <p>{t("Đường dẫn bạn truy cập không tồn tại. Hãy trở về trang chủ để tiếp tục khám phá.")}</p>
      <Link to="/">{t("← Quay lại trang chủ")}</Link>
    </section>
  );
}
