import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { getProducts } from '../services/productService';
import { useCart } from '../context/CartContext';
import '../styles/products.css';

function formatPrice(value: number) {
  return Number(value).toLocaleString('vi-VN') + ' đ';
}

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadProduct() {
      try {
        setLoading(true);
        setError('');
        setNotice('');

        const data = await getProducts();
        const list = Array.isArray(data) ? data : [];
        const found = list.find((item: any) => String(item.id) === String(id));

        if (!ignore) {
          setProduct(found || null);
          setQuantity(1);
        }
      } catch (err: any) {
        if (!ignore) {
          setError(err?.message || 'Không tải được thông tin sản phẩm.');
          setProduct(null);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      ignore = true;
    };
  }, [id]);

  const changeQuantity = (delta: number) => {
    if (!product) return;
    const max = Number(product.stock) > 0 ? Number(product.stock) : 1;
    setQuantity((current) => Math.min(Math.max(current + delta, 1), max));
  };

  const handleAddToCart = () => {
    if (!product || Number(product.stock) <= 0) return;
    addToCart(product, quantity);
    setNotice(`Đã thêm ${quantity} sản phẩm vào giỏ hàng.`);
  };

  if (loading) {
    return (
      <div className="product-detail-status">
        <p className="product-loading">Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail-status">
        <p className="product-error">{error}</p>
        <Link to="/products" className="product-detail-back">
          ← Quay lại danh sách sản phẩm
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-status">
        <p className="product-error">Không tìm thấy sản phẩm.</p>
        <Link to="/products" className="product-detail-back">
          ← Quay lại danh sách sản phẩm
        </Link>
      </div>
    );
  }

  const hasDiscount = Number(product.originalPrice) > Number(product.price);
  const discountPercent = hasDiscount
    ? Math.round((1 - Number(product.price) / Number(product.originalPrice)) * 100)
    : 0;
  const maxQty = Number(product.stock) > 0 ? Number(product.stock) : 1;

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
            <span>Đánh giá: {product.rating}/5</span>
            <span>Đã bán: {product.sold}</span>
            <span>Còn lại: {product.stock}</span>
          </div>

          <p className="product-detail-description">{product.description}</p>

          <div className="product-detail-price">
            <strong>{formatPrice(Number(product.price))}</strong>
            {hasDiscount && (
              <>
                <span className="product-detail-original">{formatPrice(Number(product.originalPrice))}</span>
                <span className="product-detail-discount">-{discountPercent}%</span>
              </>
            )}
          </div>

          <div className="product-detail-option">
            <p className="product-detail-option-label">Số lượng:</p>
            <div className="product-detail-quantity">
              <button
                type="button"
                className="product-detail-size"
                onClick={() => changeQuantity(-1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                className="product-detail-quantity-input"
                value={quantity}
                min={1}
                max={maxQty}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (!Number.isFinite(value)) return;
                  setQuantity(Math.min(Math.max(Math.trunc(value), 1), maxQty));
                }}
              />
              <button
                type="button"
                className="product-detail-size"
                onClick={() => changeQuantity(1)}
                disabled={quantity >= maxQty}
              >
                +
              </button>
            </div>
          </div>

          <div className="product-detail-actions">
            <button
              type="button"
              className="product-detail-btn"
              onClick={handleAddToCart}
              disabled={Number(product.stock) <= 0}
            >
              {Number(product.stock) > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
            </button>
          </div>

          {notice && <p className="product-detail-notice">{notice}</p>}
        </div>
      </div>
    </div>
  );
}
