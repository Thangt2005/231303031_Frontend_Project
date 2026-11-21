import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router';
import { useCart } from '../context/CartContext';
import type { Product } from '../store/slice/ProductListSlice';
import '../styles/product-detail.css';

function formatPrice(value: number) {
    return Number(value).toLocaleString('vi-VN') + ' đ';
}

const galleryViews = [
    { label: 'Toàn cảnh', zoom: 1, origin: 'center center' },
    { label: 'Góc nghiêng', zoom: 1.25, origin: 'left center' },
    { label: 'Đế giày', zoom: 1.25, origin: 'right center' },
    { label: 'Cận cảnh', zoom: 1.6, origin: 'center top' },
];

const colorSwatches = [
    { match: 'trắng', value: '#f5f5f2' },
    { match: 'đen', value: '#1d1d1f' },
    { match: 'bạc', value: 'linear-gradient(135deg, #f2f3f5 0%, #b9bec6 50%, #e6e8eb 100%)' },
    { match: 'vàng', value: 'linear-gradient(135deg, #f6e27a 0%, #c9a227 55%, #e9d27b 100%)' },
    { match: 'hồng', value: 'linear-gradient(135deg, #f6d0d8 0%, #c98a99 100%)' },
    { match: 'nâu', value: '#7b4b2a' },
    { match: 'xanh', value: '#2f4b7c' },
    { match: 'đỏ', value: '#c62828' },
    { match: 'xám', value: '#9ca3af' },
    { match: 'kem', value: '#fdfbf7' },
    { match: 'be', value: '#e3d0b9' },
];

function getColorStyle(color: string): CSSProperties {
    const normalized = color.toLowerCase();
    const swatch = colorSwatches.find((item) => normalized.includes(item.match));
    return { background: swatch ? swatch.value : '#d1d5db' };
}

type AccordionKey = 'description' | 'specs' | 'policy';

const accordionSections: { key: AccordionKey; label: string }[] = [
    { key: 'description', label: 'Mô tả sản phẩm' },
    { key: 'specs', label: 'Thông số & Size' },
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
                    <button type="button" className="product-detail-page__btn product-detail-page__btn--primary" onClick={onRetry}>
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
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const products = useSelector(
        (state: { products: Product[] }) => state.products || []
    );
    const loading = false;
    const error = '';

    const [quantity, setQuantity] = useState(1);
    const [activeView, setActiveView] = useState(0);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState<number | null>(null);
    const [openSection, setOpenSection] = useState<AccordionKey | ''>('description');
    const [actionMessage, setActionMessage] = useState('');

    const product = products.find((item) => String(item.id) === String(id));

    useEffect(() => {
        setQuantity(1);
        setActiveView(0);
        setSelectedColor('');
        if (product && product.sizes && product.sizes.length > 0) {
            setSelectedSize(product.sizes[0]);
        } else {
            setSelectedSize(null);
        }
        setOpenSection('description');
        setActionMessage('');
    }, [id, product]);

    if (!product) {
        if (loading || (products.length === 0 && !error)) {
            return <ProductDetailSkeleton />;
        }

        if (error) {
            return (
                <ProductDetailError
                    message={error}
                    onRetry={() => window.location.reload()}
                />
            );
        }

        return <ProductNotFound />;
    }

    const activeViewData = galleryViews[activeView] ?? galleryViews[0];
    const imageStyle = {
        '--pdp-image-zoom': activeViewData.zoom,
        '--pdp-image-origin': activeViewData.origin,
    } as CSSProperties;

    const hasDiscount = product.originalPrice > product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;
    const savings = hasDiscount ? product.originalPrice - product.price : 0;
    const isAvailable = product.stock > 0;
    const sku = `SP-${String(product.id).padStart(4, '0')}`;
    const color = selectedColor || product.colors[0] || '—';
    const sizeText = selectedSize !== null ? String(selectedSize) : '—';

    const changeQuantity = (delta: number) => {
        setQuantity((current) => {
            const next = current + delta;
            return Math.min(Math.max(next, 1), Math.max(product.stock, 1));
        });
    };

    const handleAddToCart = () => {
        if (!isAvailable) {
            return;
        }

        addToCart(product, quantity);
        setActionMessage(
            `Đã thêm ${quantity} × "${product.name}" (Màu: ${color}, Size: ${sizeText}) vào giỏ hàng.`
        );
    };

    const handleBuyNow = () => {
        if (!isAvailable) {
            return;
        }

        addToCart(product, quantity);
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

                    {/* Chọn Size */}
                    {product.sizes && product.sizes.length > 0 && (
                        <div className="product-detail-page__section">
                            <div className="product-detail-page__section-head">
                                <h2 className="product-detail-page__section-title">Kích thước (Size)</h2>
                                <span className="product-detail-page__selected">
                                    Đang chọn: <strong>{sizeText}</strong>
                                </span>
                            </div>

                            <div className="product-detail-page__color-list">
                                {product.sizes.map((sz) => (
                                    <button
                                        key={sz}
                                        type="button"
                                        className={`product-detail-page__color-tag${
                                            selectedSize === sz ? ' product-detail-page__color-tag--active' : ''
                                        }`}
                                        onClick={() => setSelectedSize(sz)}
                                        aria-pressed={selectedSize === sz}
                                        disabled={!isAvailable}
                                    >
                                        {sz}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="product-detail-page__section">
                        <div className="product-detail-page__section-head">
                            <h2 className="product-detail-page__section-title">Màu sắc</h2>
                            <span className="product-detail-page__selected">
                                Đang chọn: <strong>{color}</strong>
                            </span>
                        </div>

                        <div className="product-detail-page__color-list">
                            {product.colors.map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    className={`product-detail-page__color-tag${
                                        color === item ? ' product-detail-page__color-tag--active' : ''
                                    }`}
                                    onClick={() => setSelectedColor(item)}
                                    aria-pressed={color === item}
                                    disabled={!isAvailable}
                                >
                                    <span
                                        className="product-detail-page__color-dot"
                                        style={getColorStyle(item)}
                                        aria-hidden="true"
                                    />
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="product-detail-page__section">
                        <div className="product-detail-page__section-head">
                            <h2 className="product-detail-page__section-title">Số lượng</h2>
                            <span className="product-detail-page__selected">
                                Tối đa {Math.max(product.stock, 0)}
                            </span>
                        </div>

                        <div className="product-detail-page__quantity">
                            <button
                                type="button"
                                className="product-detail-page__quantity-btn"
                                onClick={() => changeQuantity(-1)}
                                disabled={!isAvailable || quantity <= 1}
                                aria-label="Giảm số lượng"
                            >
                                −
                            </button>
                            <input
                                type="number"
                                className="product-detail-page__quantity-input"
                                value={quantity}
                                min={1}
                                max={Math.max(product.stock, 1)}
                                onChange={(event) => setQuantity(changeQuantityTo(event.target.value, product.stock))}
                                disabled={!isAvailable}
                                aria-label="Số lượng sản phẩm"
                            />
                            <button
                                type="button"
                                className="product-detail-page__quantity-btn"
                                onClick={() => changeQuantity(1)}
                                disabled={!isAvailable || quantity >= product.stock}
                                aria-label="Tăng số lượng"
                            >
                                +
                            </button>
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
                            <span>Đổi trả size trong 30 ngày</span>
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
                                                    {product.name} đến từ thương hiệu {product.brand}, thuộc dòng sản phẩm{' '}
                                                    {product.category.toLowerCase()}. Thiết kế hiện đại, ôm chân và dễ dàng phối hợp với nhiều phong cách thời trang khác nhau.
                                                </p>
                                                <ul className="product-detail-page__bullets">
                                                    <li>Phù hợp cho đối tượng: {product.gender}.</li>
                                                    <li>Chất liệu cao cấp, bền bỉ theo thời gian.</li>
                                                    <li>Đế chống trơn trượt, mang lại cảm giác thoải mái khi di chuyển cả ngày.</li>
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
                                                    <span>Các size hỗ trợ</span>
                                                    <strong>{product.sizes ? product.sizes.join(', ') : '—'}</strong>
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
                                                    <strong>Đổi trả / Đổi size trong 30 ngày</strong>
                                                    <p>
                                                        Hỗ trợ đổi size hoặc đổi mẫu trong 30 ngày nếu sản phẩm còn nguyên tem mác và hộp.
                                                    </p>
                                                </div>
                                                <div>
                                                    <strong>Bảo hành chính hãng</strong>
                                                    <p>
                                                        Cam kết sản phẩm chính hãng 100%, hỗ trợ kiểm tra hàng trước khi thanh toán.
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
        </div>
    );
}

function changeQuantityTo(rawValue: string, stock: number): number {
    const parsed = Number(rawValue);
    const max = Math.max(stock, 1);

    if (!Number.isFinite(parsed)) {
        return 1;
    }

    return Math.min(Math.max(Math.trunc(parsed), 1), max);
}

export default ProductDetail;