import { Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { removeWishlist, clearWishlist } from '../store/slice/WishlistSlice';
import { useCart } from '../context/CartContext';
import '../styles/wishlist.css';

// Đổi số tiền sang dạng 2.390.000 đ
function formatPrice(price: number) {
    return price.toLocaleString('vi-VN') + ' đ';
}

export default function Wishlist() {
    const dispatch = useDispatch<AppDispatch>();
    const { addToCart } = useCart();
    const items = useSelector((state: RootState) => state.wishlist.items);

    // Chưa lưu sản phẩm nào
    if (items.length === 0) {
        return (
            <section className="wishlist-page">
                <h1>Sản phẩm yêu thích</h1>
                <p>Chưa có sản phẩm nào trong danh sách yêu thích.</p>
                <Link to="/products" className="wishlist-button">Xem sản phẩm</Link>
            </section>
        );
    }

    return (
        <section className="wishlist-page">
            <div className="wishlist-heading">
                <h1>Sản phẩm yêu thích</h1>
                <button
                    type="button"
                    className="wishlist-clear"
                    onClick={() => dispatch(clearWishlist())}
                >
                    Xóa tất cả
                </button>
            </div>

            <p className="wishlist-note">
                Đã lưu {items.length} sản phẩm. Danh sách vẫn giữ lại sau khi tải lại trang.
            </p>

            <div className="wishlist-list">
                {items.map((product) => (
                    <article key={product.id} className="wishlist-item">
                        <img src={product.image} alt={product.name} className="wishlist-image" />

                        <div className="wishlist-info">
                            <Link to={`/products/${product.id}`} className="wishlist-name">
                                {product.name}
                            </Link>
                            <p className="wishlist-price">{formatPrice(Number(product.price))}</p>
                        </div>

                        <div className="wishlist-item-actions">
                            <button
                                type="button"
                                className="wishlist-add"
                                onClick={() => addToCart(product, 1)}
                            >
                                Thêm vào giỏ
                            </button>
                            <button
                                type="button"
                                className="wishlist-remove"
                                onClick={() => dispatch(removeWishlist(product.id))}
                            >
                                Bỏ yêu thích
                            </button>
                        </div>
                    </article>
                ))}
            </div>

            <Link to="/products" className="wishlist-back">← Tiếp tục mua sắm</Link>
        </section>
    );
}
