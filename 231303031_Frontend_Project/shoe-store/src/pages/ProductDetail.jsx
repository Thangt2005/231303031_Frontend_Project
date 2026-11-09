import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigation, useParams } from 'react-router';
import { useCart } from '../context/CartContext';
import '../styles/products.css';

function formatPrice(value) {
  return Number(value).toLocaleString('vi-VN') + ' đ';
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigation = useNavigation();
  const { addToCart } = useCart();
  const products = useSelector((state) => state.products || []);
  const product = products.find((item) => String(item.id) === String(id));

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    setSelectedSize(null);
    setSelectedColor('');
    setNotice('');
  }, [id, product]);

  if (navigation.state === 'loading') {
    return (
      <div className="product-detail-status">
        <p className="product-loading">Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  if (!product) {
    if (products.length === 0) {
      return (
        <div className="product-detail-status">
          <p className="product-loading">Đang tải thông tin sản phẩm...</p>
        </div>
      );
    }

    return (
      <div className="product-detail-status">
        <p className="product-error">Không tìm thấy sản phẩm hoặc đã xảy ra lỗi khi tải dữ liệu.</p>
        <div className="product-detail-actions">
          <button type="button" className="product-detail-btn" onClick={() => window.location.reload()}>
            Thử lại
          </button>
          <Link to="/products" className="product-detail-back">
            ← Quay lại danh sách sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  const activeSize = selectedSize ?? product.sizes?.[0] ?? null;
  const activeColor = selectedColor || product.colors?.[0] || '';
  const hasDiscount = product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;
  const isAvailable = Number(product.stock) > 0;

  const handleAddToCart = () => {
    if (!isAvailable) return;
    addToCart(product, 1);
    setNotice(`Đã thêm "${product.name}" vào giỏ hàng.`);
  };

  return (
    <div className="product-detail">
      <Link to="/products" className="product-detail-back">
        ← Quay lại danh sách sản phẩm
      </Link>

      <div className="product-detail-grid">
        <div className="product-detail-media">
          <img src={product.image} alt={product.name} className="product-detail-image" />
        </div>

        <div className="product-detail-info">
          <p className="product-detail-brand">
            {product.brand} · {product.category} · {product.gender}
          </p>

          <h1 className="product-detail-name">{product.name}</h1>

          <div className="product-detail-meta">
            <span>⭐ {product.rating}/5</span>
            <span>Đã bán {product.sold}</span>
            <span>Còn {product.stock} sản phẩm</span>
          </div>

          <p className="product-detail-description">{product.description}</p>

          <div className="product-detail-price">
            <strong>{formatPrice(product.price)}</strong>
            {hasDiscount && (
              <>
                <span className="product-detail-original">{formatPrice(product.originalPrice)}</span>
                <span className="product-detail-discount">-{discountPercent}%</span>
              </>
            )}
          </div>

          <div className="product-detail-option">
            <p className="product-detail-option-label">
              Kích thước: <strong>{activeSize}</strong>
            </p>
            <div className="product-detail-sizes">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={activeSize === size ? 'product-detail-size active' : 'product-detail-size'}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="product-detail-option">
            <p className="product-detail-option-label">
              Màu sắc: <strong>{activeColor}</strong>
            </p>
            <div className="product-detail-colors">
              {product.colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={activeColor === color ? 'product-detail-color active' : 'product-detail-color'}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="product-detail-actions">
            <button
              type="button"
              className="product-detail-btn"
              onClick={handleAddToCart}
              disabled={!isAvailable}
            >
              {isAvailable ? 'Thêm vào giỏ' : 'Hết hàng'}
            </button>
          </div>

          {notice && <p className="product-detail-notice">{notice}</p>}
        </div>
      </div>
    </div>
  );
}
