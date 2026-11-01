import { changeLanguage } from '../store/slice/LanguageSlice';
import { translate } from '../utils/translations';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import '../styles/footer.css';

export default function Footer() {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.language);
  const t = (text) => translate(text, language);
  return (
    <footer className="store-footer">
      <div className="store-container">
        <div className="store-footer-columns">
          <section className="store-footer-intro">
            <Link to="/" className="store-footer-brand">
              SHOE STORE
            </Link>
            <p>{t("Giày chính hãng. Phong cách của bạn.")}</p>
          </section>
          <section>
            <h2>{t("KHÁM PHÁ")}</h2>
            <ul>
              <li>
                <Link to="/">{t("Trang chủ")}</Link>
              </li>
              <li>
                <Link to="/products">{t("Tất cả sản phẩm")}</Link>
              </li>
              <li>
                <Link to="/compare">{t("So sánh sản phẩm")}</Link>
              </li>
            </ul>
          </section>
          <section>
            <h2>{t("CẨM NANG GIÀY")}</h2>
            <ul>
              <li>
                <Link to="/blog/chon-giay-den-truong">{t("Chọn giày đến trường")}</Link>
              </li>
              <li>
                <Link to="/blog/doc-nhan-ve-sinh-giay">{t("Chăm sóc giày")}</Link>
              </li>
              <li>
                <Link to="/blog/sneaker-trang-va-jeans">{t("Gợi ý phối đồ")}</Link>
              </li>
            </ul>
          </section>
          <section>
            <h2>SHOE STORE JOURNAL</h2>
            <ul>
              <li>
                <Link to="/blog">{t("Tất cả bài viết")}</Link>
              </li>
              <li>
                <Link to="/blog/thong-tin-giay-online">{t("Kinh nghiệm chọn giày online")}</Link>
              </li>
              <li>
                <Link to="/blog/tieu-chi-chon-giay">{t("Tiêu chí so sánh giày")}</Link>
              </li>
            </ul>
          </section>
        </div>
        <div className="store-footer-address">
          <strong>SHOE STORE · NLU</strong>
          <p>NLU, Linh Trung, Thủ Đức, TP HCM</p>
        </div>
        <div className="store-footer-bottom">
          <span>
            © {new Date().getFullYear()} SHOE STORE. All rights reserved.
          </span>
          <div className="store-language">
            <select aria-label={language === 'en' ? 'Language' : 'Ngôn ngữ'} value={language} onChange={(event) => dispatch(changeLanguage(event.target.value))}>
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
            <span>| VNĐ</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
