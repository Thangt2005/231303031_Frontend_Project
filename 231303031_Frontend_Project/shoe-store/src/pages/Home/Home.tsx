import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import ProductItems from '../../components/ProductItems';
import { getProducts } from '../../services/productService';
import type { Product } from '../../store/slice/ProductListSlice';
import '../../styles/products.css';
import '../../styles/home.css';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Lấy sản phẩm để hiển thị trên trang chủ
  useEffect(() => {
    let ignore = false;

    async function loadProducts() {
      try {
        const data: Product[] = await getProducts();

        if (!ignore) {
          setProducts(data);
        }
      } catch (err) {
        console.log(err);

        if (!ignore) {
          setError('Không tải được sản phẩm.');
        }
      }

      if (!ignore) {
        setLoading(false);
      }
    }

    loadProducts();

    return () => {
      ignore = true;
    };
  }, []);

  // Ưu tiên sản phẩm nổi bật, nếu không có thì lấy tất cả
  let homeProducts = products.filter((product) => product.featured);

  if (homeProducts.length === 0) {
    homeProducts = products;
  }

  // Chỉ hiện tối đa 4 sản phẩm
  homeProducts = homeProducts.slice(0, 4);

  // Nội dung phần sản phẩm theo từng trạng thái
  let productContent = <p>Đang tải sản phẩm...</p>;

  if (!loading && error !== '') {
    productContent = <p className="product-error">{error}</p>;
  } else if (!loading && homeProducts.length === 0) {
    productContent = <p>Chưa có sản phẩm.</p>;
  } else if (!loading) {
    productContent = (
      <div className="product-list home-products">
        {homeProducts.map((product) => (
          <ProductItems key={product.id} product={product} />
        ))}
      </div>
    );
  }

  return (
    <div className="home-page">
      <section className="home-banner">
        <p className="home-label">SHOE STORE</p>
        <h1>Đôi giày đẹp, hành trình mới
</h1>
        <p className="home-description">
          Tự tin xuống phố với những mẫu giày thời trang, dễ phối đồ và phù hợp với mọi khoảnh khắc trong cuộc sống.
        </p>
        <Link to="/products" className="home-button">
          Khám phá sản phẩm
        </Link>
      </section>

      <section className="home-section">
        <div className="home-section-heading">
          <div>
            <h2>Sản phẩm nổi bật</h2>
            <p>Gợi ý dành cho bạn.</p>
          </div>
          <Link to="/products" className="home-link">
            Xem tất cả →
          </Link>
        </div>

        {productContent}
      </section>

      <section className="home-blog">
        <div>
          <p className="home-label">BLOG VỀ GIÀY</p>
          <h2>Chọn giày dễ hơn, chăm sóc giày đúng cách</h2>
          <p>
            Tìm hiểu cách chọn size, phối đồ và vệ sinh giày
            qua các bài viết của Shoe Store.
          </p>
        </div>
        <Link to="/blog" className="home-button">
          Đọc bài viết
        </Link>
      </section>
    </div>
  );
}