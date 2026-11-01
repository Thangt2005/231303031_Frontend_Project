import { translate } from '../utils/translations';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import ProductItems from '../components/ProductItems';
import { getProducts } from '../services/productService';
import '../styles/products.css';
import '../styles/home.css';

export default function Home() {
  const language = useSelector((state) => state.language);
  const t = (text) => translate(text, language);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function loadProducts() {
      try {
        const data = await getProducts();
        if (!Array.isArray(data))
          throw new Error('Dữ liệu sản phẩm không hợp lệ.');
        if (active) setProducts(data);
      } catch (error) {
        if (active) setError(error.message || 'Không tải được sản phẩm.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadProducts();
    return () => {
      active = false;
    };
  }, []);

  const featuredProducts = products
    .filter((product) => product.featured)
    .slice(0, 4);
  const displayedProducts = featuredProducts.length
    ? featuredProducts
    : products.slice(0, 4);

  return (
    <>
      <section className="home-hero">
        <div>
          <p className="home-eyebrow">SHOE STORE / EVERYDAY STYLE</p>
          <h1>{t("Tự tin trên")}<br />{t("từng bước chân.")}</h1>
          <p>{t("Đôi giày bạn yêu thích. Phong cách bạn lựa chọn.")}</p>
          <Link className="store-button" to="/products">{t("Khám phá giày →")}</Link>
        </div>
        <div className="home-hero-visual" aria-hidden="true">
          <span>
            YOUR NEXT
            <br />
            FAVORITE PAIR.
          </span>
          <div className="home-hero-number">01 / SHOE STORE</div>
        </div>
      </section>
      <section className="home-products">
        <div className="home-section-heading">
          <div>
            <p className="home-eyebrow">{t("ĐƯỢC LỰA CHỌN CHO BẠN")}</p>
            <h2>{t("Sản phẩm nổi bật")}</h2>
          </div>
          <Link to="/products">{t("Xem tất cả →")}</Link>
        </div>
        {loading && <p role="status">{t("Đang tải sản phẩm...")}</p>}
        {error && <p role="alert">{t(error)}</p>}
        {!loading && !error && displayedProducts.length === 0 && (
          <p>{t("Chưa có sản phẩm.")}</p>
        )}
        <div className="product-list">
          {displayedProducts.map((product) => (
            <ProductItems key={product.id} product={product} />
          ))}
        </div>
      </section>
      <section className="home-journal">
        <div>
          <p className="home-eyebrow">SHOE STORE JOURNAL</p>
          <h2>{t("Mỗi đôi giày, một câu chuyện.")}</h2>
          <p>{t("Gợi ý chọn giày, phối đồ và chăm sóc đôi giày của bạn.")}</p>
        </div>
        <Link className="store-button" to="/blog">{t("Khám phá Blog →")}</Link>
      </section>
    </>
  );
}
