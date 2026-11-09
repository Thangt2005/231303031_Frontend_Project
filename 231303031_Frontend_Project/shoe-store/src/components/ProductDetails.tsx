import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router';
import { fetchProducts } from '../store/slice/ProductListSlice';
import type { AppDispatch, RootState } from '../store/store';
import { useCart } from '../context/CartContext';
import '../styles/product-detail.css';

function formatPrice(value: number) {
  return Number(value).toLocaleString('vi-VN') + ' đ';
}

const galleryViews = [
  { label: 'Toàn cảnh', position: 'center center', zoom: 1, origin: 'center center' },
  { label: 'Góc trái', position: 'left center', zoom: 1.35, origin: 'left center' },
  { label: 'Góc phải', position: 'right center', zoom: 1.35, origin: 'right center' },
  { label: 'Chi tiết đế', position: 'center bottom', zoom: 1.6, origin: 'center bottom' },
];

const colorSwatches = [
  { match: 'xanh navy', value: '#1f2a44' },
  { match: 'navy', value: '#1f2a44' },
  { match: 'trắng', value: '#f7f7f5' },
  { match: 'đen', value: '#1d1d1f' },
  { match: 'đỏ', value: '#c62828' },
  { match: 'xanh', value: '#3b82f6' },
  { match: 'xám', value: '#9ca3af' },
  { match: 'be', value: '#d8c3a5' },
  { match: 'kem', value: '#efe3cc' },
  { match: 'nâu', value: '#7b4b2a' },
  { match: 'panda', value: '#111111' },
];

function getColorStyle(color: string): CSSProperties {
  const normalized = color.toLowerCase();

  if (normalized.includes('trắng') && normalized.includes('đen')) {
    return { background: 'linear-gradient(135deg, #ffffff 0 50%, #1d1d1f 50% 100%)' };
  }

  const swatch = colorSwatches.find((item) => normalized.includes(item.match));
  return { background: swatch ? swatch.value : '#d1d5db' };
}

const sizeGuideRows = [
  { eu: 35, cm: '22.5', note: 'Chân 22 - 22.5 cm' },
  { eu: 36, cm: '23', note: 'Chân 22.5 - 23 cm' },
  { eu: 37, cm: '23.5', note: 'Chân 23 - 23.5 cm' },
  { eu: 38, cm: '24', note: 'Chân 23.5 - 24 cm' },
  { eu: 39, cm: '24.5', note: 'Chân 24 - 24.5 cm' },
  { eu: 40, cm: '25', note: 'Chân 24.5 - 25 cm' },
  { eu: 41, cm: '25.5', note: 'Chân 25 - 25.5 cm' },
  { eu: 42, cm: '26', note: 'Chân 25.5 - 26 cm' },
  { eu: 43, cm: '26.5', note: 'Chân 26 - 26.5 cm' },
  { eu: 44, cm: '27', note: 'Chân 26.5 - 27 cm' },
  { eu: 45, cm: '27.5', note: 'Chân 27 - 27.5 cm' },
];

type AccordionKey = 'description' | 'specs' | 'policy';

const accordionSections: { key: AccordionKey; label: string }[] = [
  { key: 'description', label: 'Mô tả sản phẩm' },
  { key: 'specs', label: 'Thông số kỹ thuật' },
  { key: 'policy', label: 'Giao hàng & đổi trả' },
];

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M3 3h2l2.4 11.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 7H6" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function RulerIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M3 8h18v8H3z" />
      <path d="M7 8v3M11 8v4M15 8v3M19 8v4" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.5" />
      <circle cx="17" cy="18" r="1.5" />
    </svg>
  );
}

function ReturnIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M3 7v5h5" />
      <path d="M3.5 12a8.5 8.5 0 1 0 2-8.5" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 3 4 6v5c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg className="product-detail-page__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="product-detail-page product-detail-page--loading" aria-busy="true">
      <p className="product-detail-page__loading-text">Đang tải thông tin sản phẩm...</p>
      <div className="product-detail-page__skeleton-breadcrumb" />

      <div className="product-detail-page__layout">
        <div>
          <div className="product-detail-page__skeleton-media" />
          <div className="product-detail-page__skeleton-thumbs">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="product-detail-page__skeleton-thumb" />
            ))}
          </div>
        </div>

        <div className="product-detail-page__skeleton-info">
          <span className="product-detail-page__skeleton-line product-detail-page__skeleton-line--xs" />
          <span className="product-detail-page__skeleton-line product-detail-page__skeleton-line--title" />
          <span className="product-detail-page__skeleton-line product-detail-page__skeleton-line--sm" />
          <span className="product-detail-page__skeleton-block product-detail-page__skeleton-block--price" />
          <span className="product-detail-page__skeleton-line product-detail-page__skeleton-line--sm" />
          <div className="product-detail-page__skeleton-sizes">
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <span key={item} className="product-detail-page__skeleton-size" />
            ))}
          </div>
          <span className="product-detail-page__skeleton-block product-detail-page__skeleton-block--actions" />
          <span className="product-detail-page__skeleton-line" />
          <span className="product-detail-page__skeleton-line" />
        </div>
      </div>
    </div>
  );
}

function ProductDetailError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="product-detail-page product-detail-page--state">
      <div className="product-detail-page__state-card" role="alert">
        <span className="product-detail-page__state-icon" aria-hidden="true">!</span>
        <h1>Không tải được sản phẩm</h1>
        <p>{message}</p>
        <div className="product-detail-page__state-actions">
          <button
            type="button"
            className="product-detail-page__btn product-detail-page__btn--primary"
            onClick={onRetry}
          >
            Thử lại
          </button>
          <Link to="/products" className="product-detail-page__btn product-detail-page__btn--secondary">
            Về danh sách sản phẩm
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProductNotFound() {
  return (
    <div className="product-detail-page product-detail-page--state">
      <div className="product-detail-page__state-card">
        <span className="product-detail-page__state-icon" aria-hidden="true">?</span>
        <h1>Không tìm thấy sản phẩm</h1>
        <p>Sản phẩm bạn đang tìm có thể đã bị xoá hoặc không còn bán.</p>
        <div className="product-detail-page__state-actions">
          <Link to="/products" className="product-detail-page__btn product-detail-page__btn--primary">
            Xem tất cả sản phẩm
          </Link>
          <Link to="/" className="product-detail-page__btn product-detail-page__btn--secondary">
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { addToCart } = useCart();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [activeView, setActiveView] = useState(0);
  const [openSection, setOpenSection] = useState<AccordionKey | ''>('description');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    if (products.length === 0 && !loading && !error) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length, loading, error]);

  useEffect(() => {
    setSelectedSize(null);
    setActiveView(0);
    setOpenSection('description');
    setIsSizeGuideOpen(false);
    setActionMessage('');
  }, [id]);

  useEffect(() => {
    if (!isSizeGuideOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSizeGuideOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSizeGuideOpen]);

  const product = products.find((item) => String(item.id) === String(id));

  if (!product) {
    if (loading || (products.length === 0 && !error)) {
      return <ProductDetailSkeleton />;
    }

    if (error) {
      return (
        <ProductDetailError
          message={error}
          onRetry={() => dispatch(fetchProducts())}
        />
      );
    }

    return <ProductNotFound />;
  }

  const activeSize = selectedSize ?? product.sizes?.[0] ?? null;
  const activeViewData = galleryViews[activeView] ?? galleryViews[0];
  const imageStyle = {
    objectPosition: activeViewData.position,
    '--pdp-image-zoom': activeViewData.zoom,
    '--pdp-image-origin': activeViewData.origin,
  } as CSSProperties;
  const hasDiscount = product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;
  const savings = hasDiscount ? product.originalPrice - product.price : 0;
  const isAvailable = product.stock > 0;
  const sku = `SP-${String(product.id).padStart(4, '0')}`;
  const sizeRange =
    product.sizes.length > 0
      ? `${product.sizes[0]} - ${product.sizes[product.sizes.length - 1]}`
      : 'Đang cập nhật';

  const handleAddToCart = () => {
    if (!isAvailable || activeSize === null) {
      return;
    }

    addToCart(product, activeSize);
    setActionMessage(
      `Đã thêm "${product.name}" (Size ${activeSize}) vào giỏ hàng.`
    );
  };

  const handleBuyNow = () => {
    if (!isAvailable || activeSize === null) {
      return;
    }

    addToCart(product, activeSize);
    navigate('/cart');
  };

  const toggleSection = (key: AccordionKey) => {
    setOpenSection((current) => (current === key ? '' : key));
  };

  return (
    <div className="product-detail-page">
      <nav className="product-detail-page__breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Trang chủ</Link>
        <span aria-hidden="true">/</span>
        <Link to="/products">Sản phẩm</Link>
        <span aria-hidden="true">/</span>
        <span className="product-detail-page__breadcrumb-current" aria-current="page">
          {product.name}
        </span>
      </nav>

      <div className="product-detail-page__layout">
        <section className="product-detail-page__gallery" aria-label="Hình ảnh sản phẩm">
          <div className="product-detail-page__media">
            <div className="product-detail-page__badges">
              {product.featured && (
                <span className="product-detail-page__badge product-detail-page__badge--featured">
                  Nổi bật
                </span>
              )}
              {hasDiscount && (
                <span className="product-detail-page__badge product-detail-page__badge--sale">
                  -{discountPercent}%
                </span>
              )}
            </div>

            <div className={`product-detail-page__zoom${isAvailable ? '' : ' is-sold-out'}`}>
              <img
                src={product.image}
                alt={`${product.name} - ${activeViewData.label}`}
                className="product-detail-page__image"
                style={imageStyle}
              />
              <span className="product-detail-page__zoom-hint">Di chuột để xem chi tiết</span>
            </div>

            <div className="product-detail-page__caption">
              <span>{activeViewData.label}</span>
              <span>
                {activeView + 1} / {galleryViews.length}
              </span>
            </div>
          </div>

          <div className="product-detail-page__thumbs">
            {galleryViews.map((view, index) => (
              <button
                key={view.label}
                type="button"
                className={`product-detail-page__thumb${
                  activeView === index ? ' product-detail-page__thumb--active' : ''
                }`}
                onClick={() => setActiveView(index)}
                aria-label={`Xem ${view.label}`}
                aria-pressed={activeView === index}
              >
                <span className="product-detail-page__thumb-media">
                  <img
                    src={product.image}
                    alt=""
                    loading="lazy"
                    style={{
                      objectPosition: view.position,
                      transform: `scale(${view.zoom})`,
                      transformOrigin: view.origin,
                    }}
                  />
                </span>
                <span>{view.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="product-detail-page__summary" aria-label="Thông tin sản phẩm">
          <div className="product-detail-page__heading">
            <div>
              <p className="product-detail-page__brandline">
                <span>{product.brand}</span>
                <span className="product-detail-page__sku">Mã: {sku}</span>
              </p>
              <h1 className="product-detail-page__title">{product.name}</h1>
            </div>
            <span
              className={`product-detail-page__stock ${
                isAvailable
                  ? 'product-detail-page__stock--in'
                  : 'product-detail-page__stock--out'
              }`}
            >
              {isAvailable ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
            </span>
          </div>

          <div className="product-detail-page__rating">
            <span className="product-detail-page__stars" aria-hidden="true">
              ★★★★★
            </span>
            <strong>{product.rating}</strong>
            <span>/5</span>
            <span className="product-detail-page__divider" aria-hidden="true" />
            <span>Đã bán {product.sold}</span>
            <span className="product-detail-page__divider" aria-hidden="true" />
            <span>
              {product.category} · {product.gender}
            </span>
          </div>

          <div className="product-detail-page__price-box">
            <div className="product-detail-page__price-row">
              <strong className="product-detail-page__current-price">
                {formatPrice(product.price)}
              </strong>
              {hasDiscount && (
                <span className="product-detail-page__old-price">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {hasDiscount && (
                <span className="product-detail-page__discount">-{discountPercent}%</span>
              )}
            </div>
            {hasDiscount && (
              <p className="product-detail-page__save">
                Tiết kiệm {formatPrice(savings)} so với giá gốc
              </p>
            )}
          </div>

          <div className="product-detail-page__section">
            <div className="product-detail-page__section-head">
              <h2 className="product-detail-page__section-title">Chọn kích thước</h2>
              <button
                type="button"
                className="product-detail-page__size-guide-btn"
                onClick={() => setIsSizeGuideOpen(true)}
              >
                <RulerIcon />
                Hướng dẫn chọn size
              </button>
            </div>

            <div className="product-detail-page__size-grid">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`product-detail-page__size-btn${
                    activeSize === size ? ' product-detail-page__size-btn--active' : ''
                  }`}
                  onClick={() => setSelectedSize(size)}
                  aria-pressed={activeSize === size}
                  disabled={!isAvailable}
                >
                  {size}
                </button>
              ))}
            </div>

            <p className="product-detail-page__selected">
              Đang chọn: <strong>Size {activeSize ?? '—'}</strong>
            </p>
          </div>

          <div className="product-detail-page__section">
            <div className="product-detail-page__section-head">
              <h2 className="product-detail-page__section-title">Màu sắc có sẵn</h2>
              <span className="product-detail-page__selected">
                {product.colors.length} lựa chọn
              </span>
            </div>

            <div className="product-detail-page__color-list">
              {product.colors.map((color) => (
                <span key={color} className="product-detail-page__color-tag">
                  <span
                    className="product-detail-page__color-dot"
                    style={getColorStyle(color)}
                    aria-hidden="true"
                  />
                  {color}
                </span>
              ))}
            </div>
          </div>

          <div className="product-detail-page__actions">
            <button
              type="button"
              className="product-detail-page__btn product-detail-page__btn--primary"
              onClick={handleAddToCart}
              disabled={!isAvailable}
            >
              <CartIcon />
              Thêm vào giỏ hàng
            </button>
            <button
              type="button"
              className="product-detail-page__btn product-detail-page__btn--secondary"
              onClick={handleBuyNow}
              disabled={!isAvailable}
            >
              Mua ngay
              <ArrowIcon />
            </button>
          </div>

          {actionMessage && (
            <p className="product-detail-page__notice" role="status">
              {actionMessage}
            </p>
          )}

          <ul className="product-detail-page__assurance">
            <li>
              <TruckIcon />
              <span>Miễn phí giao hàng từ 1.000.000đ</span>
            </li>
            <li>
              <ReturnIcon />
              <span>Đổi trả trong 30 ngày</span>
            </li>
            <li>
              <ShieldIcon />
              <span>Cam kết chính hãng 100%</span>
            </li>
          </ul>

          <div className="product-detail-page__accordion">
            {accordionSections.map((section) => {
              const isOpen = openSection === section.key;

              return (
                <div
                  key={section.key}
                  className={`product-detail-page__accordion-item${
                    isOpen ? ' product-detail-page__accordion-item--open' : ''
                  }`}
                >
                  <h2>
                    <button
                      type="button"
                      id={`accordion-${section.key}`}
                      className="product-detail-page__accordion-trigger"
                      aria-expanded={isOpen}
                      aria-controls={`panel-${section.key}`}
                      onClick={() => toggleSection(section.key)}
                    >
                      <span>{section.label}</span>
                      <ChevronIcon />
                    </button>
                  </h2>

                  <div
                    id={`panel-${section.key}`}
                    role="region"
                    aria-labelledby={`accordion-${section.key}`}
                    className="product-detail-page__accordion-panel"
                    hidden={!isOpen}
                  >
                    {section.key === 'description' && (
                      <>
                        <p>{product.description}</p>
                        <p>
                          Chất liệu và phom dáng được chọn lọc để mang lại cảm giác thoải mái
                          khi sử dụng hằng ngày. Sản phẩm dễ phối với nhiều phong cách từ năng
                          động đến tối giản.
                        </p>
                        <ul className="product-detail-page__bullets">
                          <li>Phom dáng chuẩn, dễ phối đồ.</li>
                          <li>Đệm êm, hỗ trợ di chuyển thoải mái.</li>
                          <li>Phù hợp sử dụng hằng ngày và các hoạt động nhẹ.</li>
                        </ul>
                      </>
                    )}

                    {section.key === 'specs' && (
                      <div className="product-detail-page__specs">
                        <div>
                          <span>Thương hiệu</span>
                          <strong>{product.brand}</strong>
                        </div>
                        <div>
                          <span>Danh mục</span>
                          <strong>{product.category}</strong>
                        </div>
                        <div>
                          <span>Giới tính</span>
                          <strong>{product.gender}</strong>
                        </div>
                        <div>
                          <span>Kích thước</span>
                          <strong>{sizeRange}</strong>
                        </div>
                        <div>
                          <span>Màu sắc</span>
                          <strong>{product.colors.join(', ')}</strong>
                        </div>
                        <div>
                          <span>Tình trạng</span>
                          <strong>{isAvailable ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}</strong>
                        </div>
                      </div>
                    )}

                    {section.key === 'policy' && (
                      <div className="product-detail-page__policy-list">
                        <div>
                          <strong>Giao hàng toàn quốc</strong>
                          <p>
                            Miễn phí giao hàng cho đơn từ 1.000.000đ. Thời gian giao dự kiến
                            2–5 ngày làm việc.
                          </p>
                        </div>
                        <div>
                          <strong>Đổi trả trong 30 ngày</strong>
                          <p>
                            Hỗ trợ đổi size hoặc đổi mẫu trong 30 ngày nếu sản phẩm còn
                            nguyên tem mác.
                          </p>
                        </div>
                        <div>
                          <strong>Bảo hành chính hãng</strong>
                          <p>
                            Cam kết sản phẩm chính hãng, hỗ trợ bảo hành theo chính sách của
                            thương hiệu.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {isSizeGuideOpen && (
        <div
          className="product-detail-page__modal-overlay"
          onClick={() => setIsSizeGuideOpen(false)}
        >
          <div
            className="product-detail-page__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="size-guide-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="product-detail-page__modal-head">
              <div>
                <p className="product-detail-page__eyebrow">Trợ giúp chọn size</p>
                <h2 id="size-guide-title">Hướng dẫn chọn size</h2>
              </div>
              <button
                type="button"
                className="product-detail-page__modal-close"
                onClick={() => setIsSizeGuideOpen(false)}
                aria-label="Đóng hướng dẫn chọn size"
              >
                ×
              </button>
            </div>

            <p className="product-detail-page__modal-text">
              Nên chọn size dựa trên chiều dài bàn chân. Nếu chân nằm giữa hai size, hãy chọn
              size lớn hơn để có cảm giác thoải mái.
            </p>

            <div className="product-detail-page__table-wrap">
              <table className="product-detail-page__size-table">
                <thead>
                  <tr>
                    <th>Size EU</th>
                    <th>Chiều dài chân</th>
                    <th>Gợi ý</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeGuideRows.map((row) => (
                    <tr
                      key={row.eu}
                      className={
                        product.sizes.includes(row.eu)
                          ? 'is-available'
                          : undefined
                      }
                    >
                      <td>{row.eu}</td>
                      <td>{row.cm} cm</td>
                      <td>
                        {product.sizes.includes(row.eu) ? row.note : 'Sản phẩm không có size này'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ol className="product-detail-page__guide-steps">
              <li>Đặt bàn chân lên tờ giấy và giữ thân người thẳng.</li>
              <li>Đánh dấu điểm dài nhất của gót chân và đầu ngón chân.</li>
              <li>Đo khoảng cách giữa hai điểm rồi đối chiếu với bảng size.</li>
              <li>Nên cộng thêm 0.5 cm nếu bạn thích mang tất dày.</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
